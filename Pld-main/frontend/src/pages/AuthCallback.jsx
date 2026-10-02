import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { processSession } from "../lib/api";
import { useAuth } from "../context/AuthContext";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash || "";
    const match = hash.match(/session_id=([^&]+)/);
    const sessionId = match ? decodeURIComponent(match[1]) : null;

    if (!sessionId) {
      navigate("/admin/login");
      return;
    }

    (async () => {
      try {
        const u = await processSession(sessionId);
        setUser(u);
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/admin", { replace: true, state: { user: u } });
      } catch {
        setError(true);
      }
    })();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen grid place-items-center bg-[var(--forest)] text-white">
      <div className="text-center">
        {error ? (
          <>
            <p className="font-display text-2xl">लॉगिन अयशस्वी</p>
            <button
              onClick={() => navigate("/admin/login")}
              className="btn-gold rounded-full px-6 py-3 mt-5 font-bold"
              data-testid="auth-retry-btn"
            >
              पुन्हा प्रयत्न करा
            </button>
          </>
        ) : (
          <>
            <Loader2 className="animate-spin mx-auto text-[var(--gold)]" size={40} />
            <p className="mt-4 font-body text-white/80">Signing you in...</p>
          </>
        )}
      </div>
    </div>
  );
}
