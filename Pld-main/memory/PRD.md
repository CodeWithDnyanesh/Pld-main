# Pandurang Land Developers — PRD

## Original Problem Statement
Build a professional multi-page landing website for **Pandurang Land Developers** (पांडुरंग लॅन्ड डेव्हलपर्स), a land-plot developer in Sangli–Miraj, Maharashtra. User choices: all pages (Home, Projects, project detail pages, About us, Contact us); show all 10 township projects; contact form must SAVE enquiries to backend; Marathi+English mix; professional/award-worthy design.

## Architecture
- **Frontend**: React 19 + react-router-dom, Tailwind, framer-motion (reveals/parallax), Lenis (smooth scroll), shadcn/ui (Select, Input, Textarea, Label), sonner toasts. Fonts: Tiro Devanagari Marathi (display) + Outfit (body).
- **Backend**: FastAPI + MongoDB (motor). Enquiry capture.
- **Design system**: Organic & earthy — gold (#EAB308) accent, forest green, clay, sand; grain overlay, editorial marquee, numbered manifesto chapters.

## Core Requirements (static)
- 10 projects: लक्ष्मीनारायण/व्यंकटेश/संत बाळूमामा/सिद्धेश्वर/मंगलमूर्ती/ब्राह्मनाथ/रामचंद्र/श्री हरी/श्री राम/मोरया पार्क.
- Project detail: price badge, N.A PLOT badge, loan badge, features, Google map embed, brochure download.
- Contact form saves enquiries; floating WhatsApp button; office info + map.

## Implemented (2026-07-17)
- Full multi-page site (Home, Projects, ProjectDetail, About, Contact) with routing.
- Kinetic hero (parallax + masked line reveal), marquee, manifesto chapters, stats, featured grid, CTA.
- 10 project cards + detail pages (badges, features, map iframe, brochure download).
- Backend: POST/GET `/api/enquiries` (422 validation on name/phone). Contact form persists to MongoDB.
- Floating WhatsApp help button on all pages.

## Implemented — Iteration 2 (2026-07-17)
- **Projects moved to MongoDB** (seeded with 10 from seed_projects.py); public site fetches via `/api/projects`.
- **Admin panel** at `/admin` behind **Emergent Google Auth** (first login = admin bootstrap; ProtectedRoute).
  - Projects CRUD: add / edit / delete (dialog form, image via URL paste).
  - Per-project **PDF brochure upload** via Emergent object storage; public download at `/api/projects/{slug}/brochure`.
  - **Enquiries dashboard**: view (newest-first) + delete.
- **Phone validation** on enquiry (regex, 422 on invalid).
- Auth: `/api/auth/session|me|logout`, httpOnly cookie + Bearer fallback, admin-gated `/api/admin/*` (401/403).
- Testing: backend 28/28 pytest pass; all critical frontend flows (public + admin auth-gating + CRUD + brochures) pass (iteration_2.json). Fixed Dialog a11y.

## Backlog / Next
- P2: shadcn AlertDialog for delete confirms (replace window.confirm); drag-reorder projects.
- P2: Real site photos/galleries; enquiries CSV export; email/WhatsApp notification on new enquiry (Resend).
- P3: SEO meta/sitemap, pagination, 201 status codes.
