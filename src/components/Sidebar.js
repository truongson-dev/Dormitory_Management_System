import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { adminMenuItems as menuItems } from '../config/menuConfig';

// Component Sidebar chứa các menu điều hướng cho Admin
const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="px-3 mb-4 text-center">
        <h4 className="text-primary-custom fw-bold">Ký Túc Xá</h4>
      </div>
      <nav className="nav flex-column px-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path || (!item.end && location.pathname.startsWith(item.path));
          return (
            <NavLink 
              key={index} 
              to={item.path}
              end={item.end}
              className={`nav-link text-decoration-none ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
