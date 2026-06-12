import React from 'react';
import { LayoutDashboard, BedDouble, Users, FileText, Wrench } from 'lucide-react';

// File này chứa cấu hình danh sách menu của Sidebar Admin
// Tách riêng để dễ thêm/sửa/xóa menu mà không cần chỉnh Sidebar.js
export const adminMenuItems = [
  {
    path: '/admin',
    name: 'Thống kê',
    icon: <LayoutDashboard size={20} />,
    end: true,   // Chỉ active khi URL chính xác là /admin
  },
  {
    path: '/admin/rooms',
    name: 'Quản lý phòng',
    icon: <BedDouble size={20} />,
  },
  {
    path: '/admin/students',
    name: 'Sinh viên',
    icon: <Users size={20} />,
  },
  {
    path: '/admin/invoices',
    name: 'Điện nước & Hóa đơn',
    icon: <FileText size={20} />,
  },
  {
    path: '/admin/maintenance',
    name: 'Yêu cầu sửa chữa',
    icon: <Wrench size={20} />,
  },
];
