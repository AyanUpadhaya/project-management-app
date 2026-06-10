// src/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider.tsx";
import Loading from "@/components/Loading";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
