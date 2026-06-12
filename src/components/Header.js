import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Redux/Actions/authActions';
import { LogOut, User, Shield } from 'lucide-react';

// Component Header cho phần giao diện Admin
const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Map đường dẫn sang tên trang hiển thị
  const pageTitles = {
    '/admin':             'Tổng quan',
    '/admin/rooms':       'Quản lý phòng',
    '/admin/students':    'Quản lý sinh viên',
    '/admin/invoices':    'Điện nước & Hóa đơn',
    '/admin/maintenance': 'Yêu cầu sửa chữa',
  };

  // Xử lý các route động như /admin/rooms/:id
  let currentPageTitle = pageTitles[location.pathname];
  if (!currentPageTitle) {
    if (location.pathname.startsWith('/admin/rooms/')) currentPageTitle = 'Chi tiết phòng';
    else currentPageTitle = 'Hệ thống Quản lý Ký Túc Xá';
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'A';
  const displayName = user?.username || 'Admin';

  return (
    <header className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center mb-4 position-relative">
      <h5 className="mb-0 text-muted fw-semibold">{currentPageTitle}</h5>
      
      {/* Avatar Container with Dropdown */}
      <div className="position-relative" ref={dropdownRef}>
        <div 
          className="d-flex align-items-center gap-3" 
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="text-end d-none d-sm-block">
            <p className="mb-0 fw-semibold text-dark">{displayName}</p>
            <small className="text-muted">{user?.role === 'ADMIN' ? 'Quản trị viên' : 'Sinh viên'}</small>
          </div>
          <div 
            className="bg-primary-custom text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
            style={{ 
              width: '40px', 
              height: '40px', 
              fontSize: '18px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              border: isOpen ? '2px solid var(--primary-color)' : '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {displayLetter}
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div 
            className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-2"
            style={{ 
              width: '220px', 
              zIndex: 1050,
              animation: 'slideDown 0.2s ease-out',
            }}
          >
            {/* User Info Header in Dropdown */}
            <div className="p-2 border-bottom mb-1">
              <p className="mb-0 fw-bold text-dark text-truncate">{displayName}</p>
              <small className="text-muted d-flex align-items-center gap-1">
                <Shield size={12} className="text-primary-custom" />
                {user?.role === 'ADMIN' ? 'Quyền Quản trị viên' : 'Quyền Sinh viên'}
              </small>
            </div>

            {/* Profile Action */}
            <div 
              className="d-flex align-items-center gap-2 p-2 rounded-2 dropdown-item-custom"
              style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
              onClick={() => setIsOpen(false)}
            >
              <User size={16} className="text-muted" />
              <span className="text-dark fs-6">Thông tin cá nhân</span>
            </div>

            {/* Logout Action */}
            <div 
              className="d-flex align-items-center gap-2 p-2 rounded-2 dropdown-item-custom-logout mt-1 border-top pt-2"
              style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
              onClick={handleLogout}
            >
              <LogOut size={16} className="text-danger" />
              <span className="text-danger fw-semibold fs-6">Đăng xuất</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

