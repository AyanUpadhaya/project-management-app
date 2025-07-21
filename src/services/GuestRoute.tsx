// src/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider.tsx";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return children;

  return <Navigate to="/" replace />;
}
