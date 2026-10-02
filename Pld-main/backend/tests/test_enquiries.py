"""Backend API tests for Pandurang Land Developers - Enquiries endpoints."""
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


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_client():
    if not ADMIN_TOKEN:
        pytest.skip("ADMIN_TOKEN env not set - skipping admin-gated list checks")
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json",
                      "Authorization": f"Bearer {ADMIN_TOKEN}"})
    return s


# ---------------- Health ----------------
class TestHealth:
    def test_api_root(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert "Pandurang" in data["message"]


# ---------------- Enquiries: create + persist ----------------
class TestEnquiries:
    def test_create_enquiry_valid_and_persist(self, api_client, admin_client):
        marker = f"TEST_{uuid.uuid4().hex[:8]}"
        payload = {
            "name": f"TEST_User_{marker}",
            "phone": "9764548777",
            "email": "test@example.com",
            "project": "लक्ष्मीनारायण पार्क",  # Marathi text
            "message": "Marathi text test - मला माहिती हवी.",
        }
        r = api_client.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 200, f"Unexpected: {r.status_code} {r.text}"
        data = r.json()
        # Data assertions
        assert data["name"] == payload["name"]
        assert data["phone"] == payload["phone"]
        assert data["email"] == payload["email"]
        assert data["project"] == payload["project"]  # Marathi preserved
        assert data["message"] == payload["message"]
        assert "id" in data and isinstance(data["id"], str)
        assert "created_at" in data
        # No mongo _id leaking
        assert "_id" not in data

        # GET admin list and verify persistence
        r2 = admin_client.get(f"{API}/admin/enquiries")
        assert r2.status_code == 200
        lst = r2.json()
        assert isinstance(lst, list)
        matches = [e for e in lst if e.get("id") == data["id"]]
        assert len(matches) == 1
        m = matches[0]
        assert m["name"] == payload["name"]
        assert m["project"] == payload["project"]  # Marathi persisted

    def test_list_enquiries_newest_first(self, api_client, admin_client):
        # create two enquiries in sequence, ensure second appears earlier in list
        first_marker = f"TEST_{uuid.uuid4().hex[:6]}"
        p1 = {"name": f"TEST_A_{first_marker}", "phone": "9000000001"}
        r1 = api_client.post(f"{API}/enquiries", json=p1)
        assert r1.status_code == 200
        id1 = r1.json()["id"]

        second_marker = f"TEST_{uuid.uuid4().hex[:6]}"
        p2 = {"name": f"TEST_B_{second_marker}", "phone": "9000000002"}
        r2 = api_client.post(f"{API}/enquiries", json=p2)
        assert r2.status_code == 200
        id2 = r2.json()["id"]

        lst = admin_client.get(f"{API}/admin/enquiries").json()
        ids = [e["id"] for e in lst]
        assert id2 in ids and id1 in ids
        # id2 should appear before id1 (newest first sort by created_at desc)
        assert ids.index(id2) < ids.index(id1)

    def test_create_missing_name_returns_422(self, api_client):
        r = api_client.post(f"{API}/enquiries", json={"name": "", "phone": "9999999999"})
        assert r.status_code == 422

    def test_create_missing_phone_returns_422(self, api_client):
        r = api_client.post(f"{API}/enquiries", json={"name": "Someone", "phone": ""})
        assert r.status_code == 422

    def test_create_whitespace_only_name_returns_422(self, api_client):
        r = api_client.post(f"{API}/enquiries", json={"name": "   ", "phone": "9999999999"})
        assert r.status_code == 422

    def test_create_missing_field_pydantic_422(self, api_client):
        # phone omitted entirely -> pydantic validation error 422
        r = api_client.post(f"{API}/enquiries", json={"name": "OnlyName"})
        assert r.status_code == 422

    def test_create_optional_fields_default_empty(self, api_client):
        r = api_client.post(
            f"{API}/enquiries",
            json={"name": "TEST_MinimalUser", "phone": "9111111111"},
        )
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ""
        assert data["project"] == ""
        assert data["message"] == ""
