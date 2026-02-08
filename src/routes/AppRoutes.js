import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import ViewProduct from "../pages/ViewProduct";
import VideoList from "../pages/VideoList";
import VideoPlayer from "../pages/VideoPlayer";
import Upload from "../pages/Upload";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

       <Route path="/product/:id" element={<ViewProduct />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />

      <Route path="/videos" element={<VideoList />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/videos/:id" element={<VideoPlayer />} />
    </Routes>
  );
}

export default AppRoutes;
