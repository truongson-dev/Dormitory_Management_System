import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Component để bảo vệ các route yêu cầu đăng nhập
const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useSelector(state => state.auth);

    // Chờ load thông tin user từ localStorage
    if (loading) {
        return <div>Đang tải...</div>;
    }

    // Nếu chưa đăng nhập, chuyển về trang Login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Nếu có yêu cầu role cụ thể mà user không có role đó, chuyển về trang không có quyền (hoặc trang chủ của họ)
    if (requiredRole && user.role !== requiredRole) {
        if(user.role === 'ADMIN') return <Navigate to="/admin" />;
        return <Navigate to="/student" />;
    }

    // Nếu thỏa mãn, cho phép truy cập component bên trong
    return children;
};

export default ProtectedRoute;
