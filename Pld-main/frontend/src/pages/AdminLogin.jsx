import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin } from "../lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, loading, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user?.is_admin) navigate("/admin", { replace: true });
  }, [user, loading, navigate]);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const u = await apiLogin(email, password);
      setUser(u);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.status === 401 ? "चुकीचा ईमेल किंवा पासवर्ड" : "लॉगिन अयशस्वी, पुन्हा प्रयत्न करा");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--forest-deep)]">
      <div className="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1776149421497-7f8be85cb885?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)] to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-12">
          <p className="font-display text-4xl text-white leading-tight">
            पांडुरंग लॅन्ड डेव्हलपर्स
          </p>
          <p className="text-[var(--gold)] tracking-[0.2em] uppercase text-xs font-bold mt-2">
            Admin Console
          </p>
        </div>
      </div>

      <div className="grid place-items-center p-8">
        <div className="w-full max-w-sm text-center">
          <span className="grid place-items-center h-16 w-16 rounded-2xl bg-[var(--gold)] text-black mx-auto">
            <ShieldCheck size={30} />
          </span>
          <h1 className="font-display text-3xl text-white mt-6">Admin Login</h1>
          <p className="text-white/60 mt-2 font-body text-sm">
            प्रकल्प व्यवस्थापित करण्यासाठी व चौकशी पाहण्यासाठी लॉगिन करा.
          </p>

          <form onSubmit={login} className="mt-8 space-y-3 text-left">
            <input
              type="email"
              required
              autoComplete="username"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="admin-email-input"
              className="w-full rounded-full bg-white/10 text-white placeholder-white/40 px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--gold)]"
            />
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="admin-password-input"
              className="w-full rounded-full bg-white/10 text-white placeholder-white/40 px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--gold)]"
            />
            {error && <p className="text-red-300 text-sm text-center" data-testid="admin-login-error">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              data-testid="admin-login-btn"
              className="w-full rounded-full bg-[var(--gold)] text-black font-bold py-3.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-300 disabled:opacity-60"
            >
              {submitting && <Loader2 className="animate-spin" size={18} />}
              Login
            </button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="mt-6 text-white/50 hover:text-white text-sm inline-flex items-center gap-2 transition-colors duration-300"
            data-testid="back-to-site-btn"
          >
            <ArrowLeft size={15} /> वेबसाईटवर परत जा
          </button>
        </div>
      </div>
    </div>
  );
}
