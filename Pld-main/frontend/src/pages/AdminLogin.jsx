import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.is_admin) navigate("/admin", { replace: true });
  }, [user, loading, navigate]);

  const login = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/admin";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
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

          <button
            data-testid="google-login-btn"
            onClick={login}
            className="mt-8 w-full rounded-full bg-white text-neutral-900 font-bold py-3.5 flex items-center justify-center gap-3 hover:bg-neutral-100 transition-colors duration-300"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
              <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75z" />
            </svg>
            Continue with Google
          </button>

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
