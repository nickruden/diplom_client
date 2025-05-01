import { Dropdown } from 'antd';
import './MyDropdown.scss';

const MyDropdown = ({ items, children, ...props }) => {
  return (
    <Dropdown
      menu={{ items }}
      overlayClassName={`${items?.special ? 'special-first' : ''} custom-dropdown`}
      {...props}
    >
      {children}
    </Dropdown>
  );
};

export default MyDropdown;