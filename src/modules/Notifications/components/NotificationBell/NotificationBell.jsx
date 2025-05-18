import { Badge, Dropdown, Tabs, Spin } from 'antd';
import { IoCloseOutline, IoNotificationsOutline } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import styles from './NotificationBell.module.scss';
import NotificationList from '../NotificationList/NotificationList';
import { useAuth } from '../../../../common/hooks/useAuth'
import { useMarkAsRead, useGetUserNotifications } from '../../../../common/API/services/notifications/hooks.api'

const NotificationBell = ({...props}) => {
const dropdownRef = useRef(null);
const { user } = useAuth();
const [isOpen, setIsOpen] = useState(false);

const { data: notifications, isLoading } = useGetUserNotifications(user.id);
const { mutateAsync: markAsReadMutation } = useMarkAsRead();

const events = notifications?.filter(n => n.type === 'event') || [];
const others = notifications?.filter(n => n.type !== 'event') || [];

const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

const notificationMenu = (
  <div className={styles.notificationDropdown} ref={dropdownRef}>
    <div className={styles.inner}>
    <div className={styles.notificationHeader}>
      <span className={styles.notificationTitle}>Уведомления</span>
      <IoCloseOutline
        onClick={() => setIsOpen(false)}
        className={styles.closeIcon}
      />
    </div>

    {isLoading ? (
      <Spin />
    ) : (
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: 'Мероприятия',
            key: '1',
            children: <div className={styles.list}> <NotificationList notifications={events} /> </div>,
          },
          {
            label: 'Другое',
            key: '2',
            children: <div className={styles.list}> <NotificationList notifications={others} /> </div>,
          },
        ]}
      />
    )}
    </div>
  </div>
);


  return (
    <Dropdown overlay={notificationMenu}
  trigger={['click']}
  placement="bottomRight"
  open={isOpen}
  onOpenChange={(open) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      markAsReadMutation(user.id);
    }
  }}
  {...props} >
      <Badge count={unreadCount} overflowCount={9}>
        <IoNotificationsOutline size={25} style={{ cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
