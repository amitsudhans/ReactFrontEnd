import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import ViewProduct from "../pages/ViewProduct";
import VideoList from "../pages/VideoList";
import VideoPlayer from "../pages/VideoPlayer";
import Upload from "../pages/Upload";
import Chat from "../pages/Chat";
import Import from "../pages/Import";
import { useAuth } from "../hook/useAuth";
import UploadCSV from "../pages/UploadCSV";
import UploadHD from "../pages/UploadHD";

function AppRoutes() {

    const { token } = useAuth();
  return (
      <Routes>
      {/* PUBLIC ROUTES */}
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/dashboard" /> : <Register />}
      />

      {/* PRIVATE ROUTES */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product/:id" element={<ViewProduct />} />
        <Route path="/videos" element={<VideoList />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/videos/:id" element={<VideoPlayer />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/import" element={<Import />} />
        <Route path="/importcsv" element={<UploadCSV />} />
         <Route path="/uploadhd" element={<UploadHD />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;
