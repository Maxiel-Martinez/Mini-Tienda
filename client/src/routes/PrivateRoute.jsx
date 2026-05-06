import { Navigate } from "react-router";
import { useUserSession } from "../providers/userContext/useUserSession";

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUserSession();

  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
