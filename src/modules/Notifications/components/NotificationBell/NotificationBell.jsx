import { Badge, Dropdown, Tabs, Spin } from 'antd';
import { IoCloseOutline, IoNotificationsOutline } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import styles from './NotificationBell.module.scss';
import NotificationList from '../NotificationList/NotificationList';

const NotificationBell = ({...props}) => {
//   const dispatch = useDispatch();
//   const { list, unreadCount, loading } = useSelector(state => state.notifications);

//   useEffect(() => {
//     dispatch(fetchNotifications());
//   }, [dispatch]);

//   const events = list.filter(n => n.type === 'event');
//   const others = list.filter(n => n.type !== 'event');

const dropdownRef = useRef(null);

const notifications = {
    events: [
      { id: 1, title: 'Новое событие: Концерт Imagine Dragons', time: '2 часа назад' },
      { id: 2, title: 'Изменение цены на билет: Выставка картин', time: '5 часов назад' },
    ],
    other: [
      { id: 3, title: 'Новая подписка на ваш аккаунт', time: '1 день назад' },
    ]
  };

  const notificationMenu = (
    <div className={styles.notificationDropdown} ref={dropdownRef}>
      <div className={styles.notificationHeader}>
        <span className={styles.notificationTitle}>Уведомления</span>
        <IoCloseOutline
          onClick={() => {
            document.body.click(); // Симулируем клик вне дропдауна для его закрытия
          }}
          className={styles.closeIcon}
        />
      </div>
      {/* {loading ? (
        <Spin />
      ) : ( */}
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: 'Мероприятия',
              key: '1',
              children: <NotificationList notifications={notifications.events} />,
            },
            {
              label: 'Другое',
              key: '2',
              children: <NotificationList notifications={notifications.other} />,
            },
          ]}
        />
      {/* )} */}
    </div>
  );

  return (
    <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight" {...props}>
      <Badge count={10} overflowCount={9}>
        <IoNotificationsOutline size={25} style={{ cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
