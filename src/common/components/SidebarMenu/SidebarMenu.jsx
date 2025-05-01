import React from 'react';
import { Menu, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import './SidebarMenu.scss';

const SidebarMenu = ({ menuItems, collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      className="my-sidebar-menu"
      inlineIndent={collapsed ? 8 : 24}
    >
      {menuItems.map((item) => (
        <Menu.Item
          key={item.path}
          icon={
            collapsed ? (
              <Tooltip title={item.label} placement="right">
                {item.icon}
              </Tooltip>
            ) : item.icon
          }
        >
          {!collapsed && item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default SidebarMenu;
