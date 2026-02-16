import { Navigate,Outlet  } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

function PrivateRoute({ children }) {
  const { token } = useAuth();
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
