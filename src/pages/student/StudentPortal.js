import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Redux/Actions/authActions';
import { LogOut, Home, User, Wrench } from 'lucide-react';

import RoomList from './RoomList';
import MyRoom from './MyRoom';
import RoomDetail from '../admin/RoomDetail';
import MaintenanceRequestForm from './MaintenanceRequestForm';
import NotFound from '../admin/NotFound';

// Layout chính cho giao diện Sinh viên
const StudentPortal = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch  = useDispatch();
    const navigate  = useNavigate();

    // Xử lý đăng xuất
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Style link active
    const navLinkClass = ({ isActive }) =>
        `text-white text-decoration-none d-flex align-items-center gap-1 px-3 py-1 rounded-3 ${
            isActive ? 'fw-bold' : 'fw-normal opacity-90'
        }`;

    const navLinkStyle = ({ isActive }) => ({
        background: isActive ? 'rgba(255,255,255,0.25)' : 'transparent',
        transition: 'background 0.2s',
        fontSize: 14,
    });

    return (
        <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh' }}>

            {/* ── NAVBAR CHÍNH ── */}
            <header
                className="text-white shadow-sm"
                style={{
                    background: 'linear-gradient(90deg, var(--primary-color) 0%, #0f766e 100%)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <div className="d-flex justify-content-between align-items-center px-4 py-2">

                    {/* Logo + Nav links */}
                    <div className="d-flex align-items-center gap-4">
                        <h5 className="mb-0 fw-bold" style={{ letterSpacing: '-0.5px' }}>
                            🏠 KTX Sinh Viên
                        </h5>
                        <nav className="d-flex gap-1">
                            <NavLink
                                to="/student"
                                end
                                className={navLinkClass}
                                style={navLinkStyle}
                            >
                                <Home size={16} /> Đăng ký phòng
                            </NavLink>
                            <NavLink
                                to="/student/my-room"
                                className={navLinkClass}
                                style={navLinkStyle}
                            >
                                <User size={16} /> Phòng của tôi
                            </NavLink>
                            <NavLink
                                to="/student/maintenance"
                                className={navLinkClass}
                                style={navLinkStyle}
                            >
                                <Wrench size={16} /> Báo hỏng &amp; Sửa chữa
                            </NavLink>
                        </nav>
                    </div>

                    {/* Thông tin người dùng + Đăng xuất */}
                    <div className="d-flex align-items-center gap-3">
                        <span className="small opacity-90">Xin chào,</span>
                        <span className="fw-bold">{user?.username}</span>
                        <button
                            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                            onClick={handleLogout}
                            style={{ fontSize: 13 }}
                        >
                            <LogOut size={15} /> Thoát
                        </button>
                    </div>
                </div>

            </header>

            {/* Nội dung chính */}
            <div className="container py-4">
                <Routes>
                    {/* Đường dẫn mặc định của sinh viên là Xem danh sách phòng để đăng ký */}
                    <Route path="/"            element={<RoomList />} />
                    {/* Đường dẫn xem trạng thái phòng đã đăng ký */}
                    <Route path="/my-room"     element={<MyRoom />} />
                    {/* Xem chi tiết phòng */}
                    <Route path="/rooms/:id"   element={<RoomDetail />} />
                    {/* Gửi yêu cầu sửa chữa cơ sở vật chất */}
                    <Route path="/maintenance" element={<MaintenanceRequestForm />} />
                    <Route path="*"            element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
};

export default StudentPortal;
