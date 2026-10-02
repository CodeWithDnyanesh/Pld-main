import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Upload,
  FileText,
  Loader2,
  Phone,
  Mail,
  MessageSquare,
  Inbox,
  LayoutGrid,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import {
  getProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminUploadBrochure,
  adminGetEnquiries,
  adminDeleteEnquiry,
} from "../lib/api";
import { IMAGES } from "../data/projects";

const emptyForm = {
  name: "",
  nameEn: "",
  price: "",
  tagline: "",
  location: "",
  address: "",
  mapQuery: "",
  image: IMAGES.heroAerial,
  galleryText: "",
  featuresText: "",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const [p, e] = await Promise.all([getProjects(), adminGetEnquiries()]);
      setProjects(p);
      setEnquiries(e);
    } catch {
      toast.error("डेटा लोड करता आला नाही.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || "",
      nameEn: p.nameEn || "",
      price: p.price || "",
      tagline: p.tagline || "",
      location: p.location || "",
      address: p.address || "",
      mapQuery: p.mapQuery || "",
      image: p.image || "",
      galleryText: (p.gallery || []).join("\n"),
      featuresText: (p.features || []).join("\n"),
    });
    setDialogOpen(true);
  };

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) {
      toast.error("प्रकल्पाचे नाव आवश्यक आहे.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      nameEn: form.nameEn,
      price: form.price,
      tagline: form.tagline,
      location: form.location,
      address: form.address,
      mapQuery: form.mapQuery,
      image: form.image,
      gallery: form.galleryText.split("\n").map((s) => s.trim()).filter(Boolean),
      features: form.featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await adminUpdateProject(editing.id, payload);
        toast.success("प्रकल्प अपडेट झाला.");
      } else {
        await adminCreateProject(payload);
        toast.success("नवीन प्रकल्प जोडला गेला.");
      }
      setDialogOpen(false);
      await load();
    } catch {
      toast.error("जतन करता आले नाही.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`"${p.name}" हा प्रकल्प डिलीट करायचा?`)) return;
    try {
      await adminDeleteProject(p.id);
      toast.success("प्रकल्प डिलीट झाला.");
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
    } catch {
      toast.error("डिलीट करता आले नाही.");
    }
  };

  const uploadPdf = async (p, file) => {
    if (!file) return;
    setUploadingId(p.id);
    try {
      await adminUploadBrochure(p.id, file);
      toast.success("Brochure अपलोड झाले.");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "अपलोड अयशस्वी.");
    } finally {
      setUploadingId(null);
    }
  };

  const removeEnquiry = async (e) => {
    if (!window.confirm(`${e.name} ची चौकशी डिलीट करायची?`)) return;
    try {
      await adminDeleteEnquiry(e.id);
      setEnquiries((prev) => prev.filter((x) => x.id !== e.id));
      toast.success("चौकशी डिलीट झाली.");
    } catch {
      toast.error("डिलीट करता आले नाही.");
    }
  };

  const doLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[var(--muted)]" data-testid="admin-dashboard">
      {/* top bar */}
      <header className="bg-[var(--forest-deep)] text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center h-9 w-9 rounded-lg bg-[var(--gold)] text-black font-display text-lg">
              प
            </span>
            <span className="font-bold tracking-tight">Admin Console</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors duration-300"
            >
              <ExternalLink size={15} /> View site
            </button>
            {user?.picture ? (
              <img src={user.picture} alt="" className="h-8 w-8 rounded-full" />
            ) : null}
            <span className="hidden sm:block text-sm text-white/80">{user?.name || user?.email}</span>
            <button
              data-testid="logout-btn"
              onClick={doLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-sm font-semibold transition-colors duration-300"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid place-items-center py-40">
            <Loader2 className="animate-spin text-[var(--forest)]" size={36} />
          </div>
        ) : (
          <Tabs defaultValue="projects">
            <TabsList className="mb-8">
              <TabsTrigger value="projects" data-testid="tab-projects">
                <LayoutGrid size={16} className="mr-2" /> Projects ({projects.length})
              </TabsTrigger>
              <TabsTrigger value="enquiries" data-testid="tab-enquiries">
                <Inbox size={16} className="mr-2" /> Enquiries ({enquiries.length})
              </TabsTrigger>
            </TabsList>

            {/* PROJECTS */}
            <TabsContent value="projects">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl sm:text-3xl text-neutral-900">प्रकल्प व्यवस्थापन</h2>
                <button
                  data-testid="add-project-btn"
                  onClick={openCreate}
                  className="btn-gold rounded-full px-5 py-2.5 text-sm font-bold inline-flex items-center gap-2"
                >
                  <Plus size={17} /> नवीन प्रकल्प
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm"
                    data-testid={`admin-project-${p.slug}`}
                  >
                    <div className="relative h-36">
                      <img src={p.image} alt={p.nameEn} className="h-full w-full object-cover" />
                      <span className="absolute top-2 left-2 rounded-full bg-[var(--gold)] text-black text-[11px] font-bold px-2.5 py-0.5">
                        ₹{p.price}/-
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-xl text-neutral-900">{p.name}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5 truncate">{p.location}</p>

                      <div className="flex items-center gap-2 mt-2 text-xs">
                        {p.brochure_path ? (
                          <span className="inline-flex items-center gap-1 text-green-700">
                            <FileText size={13} /> PDF जोडलेले
                          </span>
                        ) : (
                          <span className="text-neutral-400">PDF नाही</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <button
                          data-testid={`edit-project-${p.slug}`}
                          onClick={() => openEdit(p)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 text-white text-sm font-semibold py-2 hover:bg-black transition-colors duration-300"
                        >
                          <Pencil size={14} /> Edit
                        </button>

                        <label
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--forest)] text-white text-sm font-semibold py-2 px-3 cursor-pointer hover:opacity-90 transition-opacity duration-300"
                          data-testid={`upload-brochure-${p.slug}`}
                        >
                          {uploadingId === p.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => uploadPdf(p, e.target.files?.[0])}
                          />
                        </label>

                        <button
                          data-testid={`delete-project-${p.slug}`}
                          onClick={() => remove(p)}
                          className="inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 py-2 px-3 hover:bg-red-100 transition-colors duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* ENQUIRIES */}
            <TabsContent value="enquiries">
              <h2 className="font-display text-2xl sm:text-3xl text-neutral-900 mb-6">चौकशी (Enquiries)</h2>
              {enquiries.length === 0 ? (
                <div className="bg-white rounded-2xl border border-black/5 p-14 text-center text-neutral-500">
                  <Inbox size={36} className="mx-auto text-neutral-300" />
                  <p className="mt-3 font-body">अजून कोणतीही चौकशी नाही.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {enquiries.map((e) => (
                    <div
                      key={e.id}
                      className="bg-white rounded-2xl border border-black/5 p-5"
                      data-testid={`enquiry-row-${e.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-xl text-neutral-900">{e.name}</p>
                          {e.project ? (
                            <span className="inline-block mt-1 text-[11px] font-bold text-[var(--clay)] bg-[var(--sand)] rounded-full px-2.5 py-0.5">
                              {e.project}
                            </span>
                          ) : null}
                        </div>
                        <button
                          onClick={() => removeEnquiry(e)}
                          data-testid={`delete-enquiry-${e.id}`}
                          className="text-neutral-300 hover:text-red-500 transition-colors duration-300"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                      <div className="mt-3 space-y-1.5 text-sm text-neutral-600">
                        <a href={`tel:${e.phone}`} className="flex items-center gap-2 hover:text-[var(--forest)]">
                          <Phone size={14} className="text-[var(--gold)]" /> {e.phone}
                        </a>
                        {e.email ? (
                          <a href={`mailto:${e.email}`} className="flex items-center gap-2 hover:text-[var(--forest)]">
                            <Mail size={14} className="text-[var(--gold)]" /> {e.email}
                          </a>
                        ) : null}
                        {e.message ? (
                          <p className="flex items-start gap-2">
                            <MessageSquare size={14} className="text-[var(--gold)] mt-0.5" /> {e.message}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-xs text-neutral-400 mt-3">
                        {new Date(e.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* PROJECT FORM DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="project-dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editing ? "प्रकल्प संपादित करा" : "नवीन प्रकल्प जोडा"}
            </DialogTitle>
            <DialogDescription>
              फोटोसाठी image URL paste करा. वैशिष्ट्ये व gallery प्रत्येक ओळीवर एक लिहा.
            </DialogDescription>
          </DialogHeader>

          <div className="grid sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>नाव (Marathi) *</Label>
              <Input data-testid="pf-name" value={form.name} onChange={(e) => upd("name", e.target.value)} placeholder="उदा. गणेश पार्क" />
            </div>
            <div className="space-y-1.5">
              <Label>Name (English)</Label>
              <Input data-testid="pf-nameEn" value={form.nameEn} onChange={(e) => upd("nameEn", e.target.value)} placeholder="Ganesh Park" />
            </div>
            <div className="space-y-1.5">
              <Label>किंमत / sq.ft (फक्त आकडा)</Label>
              <Input data-testid="pf-price" value={form.price} onChange={(e) => upd("price", e.target.value)} placeholder="499" />
            </div>
            <div className="space-y-1.5">
              <Label>Location (छोटा पत्ता)</Label>
              <Input data-testid="pf-location" value={form.location} onChange={(e) => upd("location", e.target.value)} placeholder="ता. मिरज, जि. सांगली" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Tagline</Label>
              <Input data-testid="pf-tagline" value={form.tagline} onChange={(e) => upd("tagline", e.target.value)} placeholder="किफायतशीर दरात..." />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>संपूर्ण साईट पत्ता</Label>
              <Textarea data-testid="pf-address" value={form.address} onChange={(e) => upd("address", e.target.value)} rows={2} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Google Maps शोध मजकूर (map query)</Label>
              <Input data-testid="pf-mapQuery" value={form.mapQuery} onChange={(e) => upd("mapQuery", e.target.value)} placeholder="Ganesh Park Sangli" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>मुख्य फोटो URL</Label>
              <Input data-testid="pf-image" value={form.image} onChange={(e) => upd("image", e.target.value)} placeholder="https://..." />
              {form.image ? (
                <img src={form.image} alt="preview" className="mt-2 h-28 w-full object-cover rounded-lg" />
              ) : null}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Gallery फोटो URLs (प्रत्येक ओळीवर एक)</Label>
              <Textarea data-testid="pf-gallery" value={form.galleryText} onChange={(e) => upd("galleryText", e.target.value)} rows={3} placeholder={"https://...\nhttps://..."} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>वैशिष्ट्ये / Features (प्रत्येक ओळीवर एक)</Label>
              <Textarea data-testid="pf-features" value={form.featuresText} onChange={(e) => upd("featuresText", e.target.value)} rows={5} placeholder={"प्रशस्त डांबरी रस्ते.\nपाणी व लाईटची सोय."} />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setDialogOpen(false)}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors duration-300"
            >
              रद्द करा
            </button>
            <button
              data-testid="save-project-btn"
              onClick={save}
              disabled={saving}
              className="btn-gold rounded-full px-6 py-2.5 text-sm font-bold inline-flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              {editing ? "अपडेट करा" : "जतन करा"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
