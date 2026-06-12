import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages của Admin
import Dashboard from "../pages/admin/Dashboard";
import Rooms from "../pages/admin/Rooms";
import Students from "../pages/admin/Students";
import Invoices from "../pages/admin/Invoices";
import RoomDetail from "../pages/admin/RoomDetail";
import MaintenanceRequests from "../pages/admin/MaintenanceRequests";
import NotFound from "../pages/admin/NotFound";

// File này chứa các nested Route bên trong Admin Layout
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="rooms" element={<Rooms />} />
      <Route path="rooms/:id" element={<RoomDetail />} />
      <Route path="students" element={<Students />} />
      <Route path="invoices" element={<Invoices />} />
      <Route path="maintenance" element={<MaintenanceRequests />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
