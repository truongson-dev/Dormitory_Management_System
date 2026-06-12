import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Trang public
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/admin/NotFound";

// Layouts theo role
import AdminLayout from "../Page/AdminLayout";
import StudentPortal from "../pages/student/StudentPortal";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== ROUTE MẶC ĐỊNH ===== */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* ===== CÁC ROUTE PUBLIC (không cần đăng nhập) ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===== ROUTE ADMIN (yêu cầu role ADMIN) ===== */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      {/* ===== ROUTE SINH VIÊN (yêu cầu role STUDENT) ===== */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <StudentPortal />
          </ProtectedRoute>
        }
      />

      {/* ===== ROUTE 404 NOT FOUND ===== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
