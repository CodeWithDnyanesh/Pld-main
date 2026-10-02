import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--background)]">
        <Loader2 className="animate-spin text-[var(--forest)]" size={36} />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!user.is_admin) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--background)] px-6 text-center">
        <div>
          <p className="font-display text-3xl text-neutral-900">प्रवेश नाही</p>
          <p className="text-neutral-600 mt-3 font-body">
            हे खाते admin नाही. कृपया admin खात्याने लॉगिन करा.
          </p>
        </div>
      </div>
    );
  }
  return children;
};
