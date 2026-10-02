"""Backend API tests for projects (public + admin CRUD), auth gating,
enquiry phone-validation, brochure upload/download and admin enquiries.

Uses two Bearer session tokens pre-provisioned via mongosh:
  - ADMIN_TOKEN: is_admin=true
  - NONADMIN_TOKEN: is_admin=false
"""
import io
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://hero-deploy-51.preview.emergentagent.com",
).rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN")
NONADMIN_TOKEN = os.environ.get("NONADMIN_TOKEN")


# ---------- Fixtures ----------
@pytest.fixture(scope="module")
def anon_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_client():
    if not ADMIN_TOKEN:
        pytest.skip("ADMIN_TOKEN env not provided")
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {ADMIN_TOKEN}"})
    return s


@pytest.fixture(scope="module")
def nonadmin_client():
    if not NONADMIN_TOKEN:
        pytest.skip("NONADMIN_TOKEN env not provided")
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {NONADMIN_TOKEN}"})
    return s


# ---------- Auth ----------
class TestAuthMe:
    def test_me_unauth_returns_401(self, anon_client):
        r = anon_client.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_admin_token(self, admin_client):
        r = admin_client.get(f"{API}/auth/me")
        assert r.status_code == 200
        d = r.json()
        assert d.get("is_admin") is True
        assert d.get("email")
        assert "_id" not in d

    def test_me_with_nonadmin_token(self, nonadmin_client):
        r = nonadmin_client.get(f"{API}/auth/me")
        assert r.status_code == 200
        d = r.json()
        assert d.get("is_admin") is False


# ---------- Public Projects ----------
class TestPublicProjects:
    def test_list_projects_at_least_10_sorted_by_order(self, anon_client):
        r = anon_client.get(f"{API}/projects")
        assert r.status_code == 200
        projects = r.json()
        assert isinstance(projects, list)
        assert len(projects) >= 10, f"expected >=10 seeded projects, got {len(projects)}"
        orders = [p.get("order", 0) for p in projects]
        assert orders == sorted(orders), "projects must be sorted by 'order' asc"
        for p in projects:
            assert "_id" not in p
            assert p.get("slug")
            assert p.get("name")

    def test_get_project_by_slug(self, anon_client):
        r = anon_client.get(f"{API}/projects/lakshminarayan-park")
        assert r.status_code == 200
        d = r.json()
        assert d["slug"] == "lakshminarayan-park"
        assert d["nameEn"] == "Laxminarayan Park"

    def test_get_project_by_bad_slug_404(self, anon_client):
        r = anon_client.get(f"{API}/projects/does-not-exist-xyz")
        assert r.status_code == 404

    def test_brochure_404_when_missing(self, anon_client):
        # Seeded projects have no brochure by default
        r = anon_client.get(f"{API}/projects/lakshminarayan-park/brochure")
        assert r.status_code == 404


# ---------- Auth Gating on Admin Endpoints ----------
class TestAuthGating:
    def test_admin_enquiries_401_no_token(self, anon_client):
        r = anon_client.get(f"{API}/admin/enquiries")
        assert r.status_code == 401

    def test_admin_enquiries_403_nonadmin(self, nonadmin_client):
        r = nonadmin_client.get(f"{API}/admin/enquiries")
        assert r.status_code == 403

    def test_admin_projects_post_401_no_token(self, anon_client):
        r = anon_client.post(f"{API}/admin/projects", json={"name": "TEST_UNAUTH", "nameEn": "TEST"})
        assert r.status_code == 401

    def test_admin_projects_post_403_nonadmin(self, nonadmin_client):
        r = nonadmin_client.post(f"{API}/admin/projects", json={"name": "TEST_NONADMIN", "nameEn": "TEST"})
        assert r.status_code == 403


# ---------- Enquiry phone validation ----------
class TestEnquiryPhoneValidation:
    def test_invalid_phone_returns_422(self, anon_client):
        r = anon_client.post(f"{API}/enquiries", json={"name": "TEST_BadPhone", "phone": "abc"})
        assert r.status_code == 422

    def test_valid_10_digit_phone_accepted(self, anon_client):
        r = anon_client.post(f"{API}/enquiries", json={"name": "TEST_ValidPhone", "phone": "9123456789"})
        assert r.status_code == 200
        d = r.json()
        assert d["phone"] == "9123456789"

    def test_missing_phone_422(self, anon_client):
        r = anon_client.post(f"{API}/enquiries", json={"name": "TEST_NoPhone", "phone": "   "})
        assert r.status_code == 422


# ---------- Admin Projects CRUD + Brochure ----------
_created_project_ids = []


class TestAdminProjectsCRUD:
    def test_create_project(self, admin_client):
        marker = uuid.uuid4().hex[:6]
        payload = {
            "name": f"TEST_चाचणी_{marker}",
            "nameEn": f"TEST Park {marker}",
            "price": "499",
            "tagline": "Test tagline",
            "location": "Test location",
            "features": ["Feature 1", "Feature 2"],
            "gallery": [],
        }
        r = admin_client.post(f"{API}/admin/projects", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["name"] == payload["name"]
        assert d["nameEn"] == payload["nameEn"]
        assert d["price"] == "499"
        assert "id" in d and "slug" in d
        assert d["slug"].startswith("test-park-")
        _created_project_ids.append(d["id"])

        # GET verify
        r2 = admin_client.get(f"{API}/projects/{d['slug']}")
        assert r2.status_code == 200
        assert r2.json()["id"] == d["id"]

    def test_update_project_changes_slug_when_name_changes(self, admin_client):
        assert _created_project_ids, "create test must run first"
        pid = _created_project_ids[0]
        # get current
        proj_list = admin_client.get(f"{API}/projects").json()
        proj = next(p for p in proj_list if p["id"] == pid)
        old_slug = proj["slug"]
        new_marker = uuid.uuid4().hex[:6]
        payload = {
            "name": f"TEST_Renamed_{new_marker}",
            "nameEn": f"TEST Renamed {new_marker}",
            "price": "599",
            "tagline": proj.get("tagline", ""),
            "location": proj.get("location", ""),
            "features": proj.get("features", []),
            "gallery": proj.get("gallery", []),
        }
        r = admin_client.put(f"{API}/admin/projects/{pid}", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["price"] == "599"
        assert d["slug"] != old_slug
        assert d["slug"].startswith("test-renamed-")

        # verify persistence: get by new slug
        r2 = admin_client.get(f"{API}/projects/{d['slug']}")
        assert r2.status_code == 200

    def test_brochure_upload_and_download(self, admin_client, anon_client):
        assert _created_project_ids
        pid = _created_project_ids[0]
        # Minimal valid PDF bytes
        pdf_bytes = (
            b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
            b"2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n"
            b"3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 100 100]>>endobj\n"
            b"xref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n"
            b"0000000098 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n160\n%%EOF"
        )
        files = {"file": ("test_brochure.pdf", pdf_bytes, "application/pdf")}
        # Remove Content-Type header for multipart
        headers = {k: v for k, v in admin_client.headers.items() if k.lower() != "content-type"}
        r = requests.post(f"{API}/admin/projects/{pid}/brochure", files=files, headers=headers, timeout=60)
        assert r.status_code == 200, r.text
        assert r.json()["ok"] is True

        # Fetch current slug
        proj = next(p for p in admin_client.get(f"{API}/projects").json() if p["id"] == pid)
        slug = proj["slug"]

        r2 = anon_client.get(f"{API}/projects/{slug}/brochure")
        assert r2.status_code == 200
        assert r2.headers.get("Content-Type", "").startswith("application/pdf")
        assert r2.content.startswith(b"%PDF")

    def test_brochure_upload_rejects_non_pdf(self, admin_client):
        assert _created_project_ids
        pid = _created_project_ids[0]
        files = {"file": ("not_pdf.txt", b"hello world", "text/plain")}
        headers = {k: v for k, v in admin_client.headers.items() if k.lower() != "content-type"}
        r = requests.post(f"{API}/admin/projects/{pid}/brochure", files=files, headers=headers, timeout=60)
        assert r.status_code == 422

    def test_delete_project(self, admin_client):
        # Create a second project just to delete
        marker = uuid.uuid4().hex[:6]
        r = admin_client.post(f"{API}/admin/projects", json={
            "name": f"TEST_ToDelete_{marker}", "nameEn": f"TEST ToDelete {marker}", "price": "100",
        })
        assert r.status_code == 200
        pid = r.json()["id"]
        slug = r.json()["slug"]

        d = admin_client.delete(f"{API}/admin/projects/{pid}")
        assert d.status_code == 200
        assert d.json()["ok"] is True

        # verify 404
        r2 = admin_client.get(f"{API}/projects/{slug}")
        assert r2.status_code == 404


# ---------- Admin Enquiries ----------
class TestAdminEnquiries:
    def test_list_and_delete_enquiry(self, admin_client, anon_client):
        # Seed an enquiry
        r = anon_client.post(f"{API}/enquiries", json={
            "name": "TEST_AdminEnquiryDelete", "phone": "9000000099",
            "message": "delete me",
        })
        assert r.status_code == 200
        eid = r.json()["id"]

        lst = admin_client.get(f"{API}/admin/enquiries")
        assert lst.status_code == 200
        arr = lst.json()
        assert isinstance(arr, list)
        assert any(e["id"] == eid for e in arr)

        d = admin_client.delete(f"{API}/admin/enquiries/{eid}")
        assert d.status_code == 200

        # verify removed
        arr2 = admin_client.get(f"{API}/admin/enquiries").json()
        assert not any(e["id"] == eid for e in arr2)


# ---------- Cleanup ----------
def teardown_module(module):
    """Clean up any remaining TEST_ projects and enquiries."""
    if not ADMIN_TOKEN:
        return
    h = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
    try:
        projects = requests.get(f"{API}/projects", timeout=30).json()
        for p in projects:
            if p.get("name", "").startswith("TEST_") or p.get("nameEn", "").startswith("TEST"):
                requests.delete(f"{API}/admin/projects/{p['id']}", headers=h, timeout=30)
        enq = requests.get(f"{API}/admin/enquiries", headers=h, timeout=30).json()
        for e in enq:
            if e.get("name", "").startswith("TEST_"):
                requests.delete(f"{API}/admin/enquiries/{e['id']}", headers=h, timeout=30)
    except Exception:
        pass
