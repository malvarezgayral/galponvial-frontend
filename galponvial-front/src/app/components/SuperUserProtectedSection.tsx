import { Navigate } from "react-router-dom";
import { useAppStore } from "@/app/stores/appStore";

const SuperUserProtectedSection = () => {
  const { user } = useAppStore();

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User doesn't have admin role - redirect to home

  return (
    user.rol !== "admin" &&
    user.rol !== "super-admin" &&
    user.rol !== "superadmin" &&
    user.rol !== "superuser"
  );
};

export default SuperUserProtectedSection;
