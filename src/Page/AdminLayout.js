import React from 'react';

// Components layout
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Router
import AdminRoutes from '../routes/AdminRoutes';

// Layout chính cho giao diện Admin
// Sidebar cố định bên trái, Header cố định trên cùng, nội dung cuộn độc lập
const AdminLayout = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-light)',
      }}
    >
      {/* Sidebar – cố định chiều cao, không cuộn theo trang */}
      <div
        style={{
          width: '250px',
          flexShrink: 0,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'sticky',
          top: 0,
          left: 0,
        }}
      >
        <Sidebar />
      </div>

      {/* Khu vực phải: Header cố định + Nội dung cuộn */}
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {/* Header – luôn hiển thị ở trên cùng */}
        <div style={{ flexShrink: 0 }}>
          <Header />
        </div>

        {/* Vùng nội dung – cuộn độc lập */}
        <div
          className="main-content"
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {/* Nested Routes: các trang con của Admin */}
          <AdminRoutes />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
