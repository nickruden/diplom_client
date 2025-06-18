import { List } from 'antd';
import NotificationItem from '../NotificationItem/NotificationItem';

const NotificationList = ({ notifications }) => {
  return (
    <List
      dataSource={notifications}
      renderItem={(item) => <NotificationItem key={item.id} notification={item} />}
    />
  );
};

export default NotificationList;
