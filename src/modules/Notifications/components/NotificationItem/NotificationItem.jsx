import { List } from 'antd';
import { useDispatch } from 'react-redux';
// import { markAsRead } from '../store/notifications.slice';

const NotificationItem = ({ notification }) => {
//   const dispatch = useDispatch();

//   const handleClick = () => {
//     dispatch(markAsRead(notification.id));
//   };

  return (
    <List.Item style={{ cursor: 'pointer', background: notification.read ? '#fff' : '#f6f6f6' }}>
      <List.Item.Meta
        title={notification.title}
        description={notification.time}
      />
    </List.Item>
  );
};

export default NotificationItem;
