from fastapi import FastAPI, APIRouter, HTTPException, Header, Response, UploadFile, File, Depends, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
import uuid
import requests
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta

from seed_projects import SEED_PROJECTS


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Pandurang Land Developers API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ----------------------- Object Storage (PDF brochures) -----------------------
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "pandurang-land"
_storage_key = None


def init_storage():
    global _storage_key
    if _storage_key:
        return _storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    return _storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ----------------------- Models -----------------------
class EnquiryCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    project: Optional[str] = ""
    message: Optional[str] = ""


class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str = ""
    project: str = ""
    message: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ProjectIn(BaseModel):
    name: str
    nameEn: str = ""
    price: str = ""
    tagline: str = ""
    location: str = ""
    address: str = ""
    mapQuery: str = ""
    image: str = ""
    gallery: List[str] = []
    features: List[str] = []


class Project(ProjectIn):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    brochure_path: Optional[str] = None
    brochure_name: Optional[str] = None
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str = ""
    picture: str = ""
    is_admin: bool = False


# ----------------------- Helpers -----------------------
def slugify(name: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return base or f"project-{uuid.uuid4().hex[:6]}"


async def unique_slug(name: str, exclude_id: str = None) -> str:
    base = slugify(name)
    slug = base
    i = 2
    while True:
        existing = await db.projects.find_one({"slug": slug}, {"_id": 0, "id": 1})
        if not existing or (exclude_id and existing.get("id") == exclude_id):
            return slug
        slug = f"{base}-{i}"
        i += 1


async def get_current_user(request: Request, authorization: str = Header(None)) -> Optional[User]:
    token = request.cookies.get("session_token")
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
    if not token:
        return None
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        return None
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    user_doc = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user_doc:
        return None
    return User(**user_doc)


async def require_admin(user: Optional[User] = Depends(get_current_user)) -> User:
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ----------------------- Auth Routes -----------------------
@api_router.post("/auth/session")
async def process_session(response: Response, x_session_id: str = Header(None)):
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Missing session id")
    r = requests.get(
        "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
        headers={"X-Session-ID": x_session_id}, timeout=30,
    )
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session")
    data = r.json()
    email = data["email"]

    existing = await db.users.find_one({"email": email}, {"_id": 0})
    admin_count = await db.users.count_documents({"is_admin": True})
    if existing:
        user_id = existing["user_id"]
        is_admin = existing.get("is_admin", False) or admin_count == 0
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": data.get("name", ""), "picture": data.get("picture", ""), "is_admin": is_admin}},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        is_admin = admin_count == 0  # first user becomes admin
        await db.users.insert_one({
            "user_id": user_id, "email": email, "name": data.get("name", ""),
            "picture": data.get("picture", ""), "is_admin": is_admin,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    session_token = data["session_token"]
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        "user_id": user_id, "session_token": session_token,
        "expires_at": expires_at.isoformat(), "created_at": datetime.now(timezone.utc).isoformat(),
    })
    response.set_cookie(
        key="session_token", value=session_token, httponly=True, secure=True,
        samesite="none", path="/", max_age=7 * 24 * 60 * 60,
    )
    return {"user_id": user_id, "email": email, "name": data.get("name", ""),
            "picture": data.get("picture", ""), "is_admin": is_admin}


@api_router.get("/auth/me")
async def auth_me(user: Optional[User] = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


@api_router.post("/auth/logout")
async def logout(response: Response, request: Request, authorization: str = Header(None)):
    token = request.cookies.get("session_token") or (
        authorization.split(" ", 1)[1] if authorization and authorization.startswith("Bearer ") else None
    )
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}


# ----------------------- Public Project Routes -----------------------
@api_router.get("/projects", response_model=List[Project])
async def list_projects():
    docs = await db.projects.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    return [Project(**d) for d in docs]


@api_router.get("/projects/{slug}", response_model=Project)
async def get_project(slug: str):
    doc = await db.projects.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project(**doc)


@api_router.get("/projects/{slug}/brochure")
async def download_brochure(slug: str):
    doc = await db.projects.find_one({"slug": slug}, {"_id": 0})
    if not doc or not doc.get("brochure_path"):
        raise HTTPException(status_code=404, detail="Brochure not available")
    data, content_type = get_object(doc["brochure_path"])
    filename = doc.get("brochure_name") or f"{doc['nameEn'] or slug}.pdf"
    return Response(
        content=data, media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ----------------------- Admin Project Routes -----------------------
@api_router.post("/admin/projects", response_model=Project)
async def create_project(payload: ProjectIn, admin: User = Depends(require_admin)):
    if not payload.name.strip():
        raise HTTPException(status_code=422, detail="Name is required")
    slug = await unique_slug(payload.nameEn or payload.name)
    last = await db.projects.find_one({}, {"_id": 0, "order": 1}, sort=[("order", -1)])
    order = (last["order"] + 1) if last else 0
    project = Project(slug=slug, order=order, **payload.model_dump())
    await db.projects.insert_one(project.model_dump())
    return project


@api_router.put("/admin/projects/{id}", response_model=Project)
async def update_project(id: str, payload: ProjectIn, admin: User = Depends(require_admin)):
    doc = await db.projects.find_one({"id": id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    update = payload.model_dump()
    if payload.name.strip() and payload.name != doc.get("name"):
        update["slug"] = await unique_slug(payload.nameEn or payload.name, exclude_id=id)
    await db.projects.update_one({"id": id}, {"$set": update})
    doc = await db.projects.find_one({"id": id}, {"_id": 0})
    return Project(**doc)


@api_router.delete("/admin/projects/{id}")
async def delete_project(id: str, admin: User = Depends(require_admin)):
    res = await db.projects.delete_one({"id": id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"ok": True}


@api_router.post("/admin/projects/{id}/brochure")
async def upload_brochure(id: str, file: UploadFile = File(...), admin: User = Depends(require_admin)):
    doc = await db.projects.find_one({"id": id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    if (file.content_type or "") != "application/pdf" and not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=422, detail="Only PDF files are allowed")
    data = await file.read()
    if len(data) > 15 * 1024 * 1024:
        raise HTTPException(status_code=422, detail="File too large (max 15MB)")
    path = f"{APP_NAME}/brochures/{id}/{uuid.uuid4().hex}.pdf"
    put_object(path, data, "application/pdf")
    await db.projects.update_one(
        {"id": id}, {"$set": {"brochure_path": path, "brochure_name": file.filename}}
    )
    return {"ok": True, "brochure_name": file.filename}


# ----------------------- Enquiry Routes -----------------------
@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(payload: EnquiryCreate):
    if not payload.name.strip() or not payload.phone.strip():
        raise HTTPException(status_code=422, detail="Name and phone are required")
    if not re.fullmatch(r"[0-9+\-\s]{7,15}", payload.phone.strip()):
        raise HTTPException(status_code=422, detail="Invalid phone number")
    enquiry = Enquiry(**payload.model_dump())
    await db.enquiries.insert_one(enquiry.model_dump())
    logger.info(f"New enquiry from {enquiry.name} ({enquiry.phone})")
    return enquiry


@api_router.get("/admin/enquiries", response_model=List[Enquiry])
async def list_enquiries(admin: User = Depends(require_admin)):
    docs = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Enquiry(**e) for e in docs]


@api_router.delete("/admin/enquiries/{id}")
async def delete_enquiry(id: str, admin: User = Depends(require_admin)):
    res = await db.enquiries.delete_one({"id": id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"ok": True}


@api_router.get("/")
async def root():
    return {"message": "Pandurang Land Developers API is running"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def seed_data():
    count = await db.projects.count_documents({})
    if count == 0:
        for i, p in enumerate(SEED_PROJECTS):
            project = Project(slug=p["slug"], order=i, name=p["name"], nameEn=p["nameEn"],
                              price=p["price"], tagline=p["tagline"], location=p["location"],
                              address=p["address"], mapQuery=p["mapQuery"], image=p["image"],
                              gallery=p["gallery"], features=p["features"])
            await db.projects.insert_one(project.model_dump())
        logger.info(f"Seeded {len(SEED_PROJECTS)} projects")
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
