import React from 'react';
import { useNavigate } from 'react-router-dom';

import { List } from 'antd';

import styles from './NotificationItem.module.scss';


const NotificationItem = ({ notification }) => {
  console.log(notification)
  const navigate = useNavigate();

  return (
    <List.Item
      onClick={() => navigate(`/event/${notification.eventId}`)}
      className={`${styles.notificationItem} ${notification.isRead ? styles.read : ''}`}
    >
      <List.Item.Meta
        title={<span className={styles.title}>{notification.title}</span>}
        description={
          <>
            <div className={styles.message}>{notification.message}</div>
            <div className={styles.time}>
              {new Date(notification.createdAt).toLocaleString()}
            </div>
          </>
        }
      />
    </List.Item>
  );
};

export default NotificationItem;
