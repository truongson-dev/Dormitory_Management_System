import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  const { user } = useSelector(state => state.auth);

  let homePath = '/login';
  if (user) {
    if (user.role === 'ADMIN') {
      homePath = '/admin';
    } else if (user.role === 'STUDENT') {
      homePath = '/student';
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div className="text-center p-5 bg-white rounded-3 shadow-lg" style={{ maxWidth: '500px', border: '1px solid #e2e8f0' }}>
        <div className="mb-4 text-warning">
          <AlertTriangle size={80} strokeWidth={1.5} />
        </div>
        <h1 className="display-1 fw-bold text-dark mb-2" style={{ letterSpacing: '-2px' }}>404</h1>
        <h3 className="fw-bold text-secondary mb-3">Không tìm thấy trang</h3>
        <p className="text-muted mb-4">
          Đường dẫn bạn đang truy cập không tồn tại hoặc đã bị di chuyển. Vui lòng quay lại trang chủ.
        </p>
        <Link to={homePath} className="btn btn-primary-custom d-inline-flex align-items-center gap-2 px-4 py-2">
          <Home size={18} /> Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
