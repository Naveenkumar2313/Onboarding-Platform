import { Navigate, useLocation } from "react-router-dom";
// FIX: Remove curly braces to use default import
import useAuth from "../../hooks/useAuth"; 

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/session/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;