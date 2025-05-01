import { useDispatch, useSelector } from 'react-redux';
import MyButton from '../UI/Button/MyButton';
import { useFollowOrganizer, useUnfollowOrganizer } from '../../API/services/user/hooks.api';
import { useAuth } from '../../hooks/useAuth';


const FollowButton = ({ organizerId, ...props }) => {
  const { user } = useAuth();

  const following = useSelector((state) => state.userFollowing?.followingOrganizers || []);
  const isFollowing = following.includes(organizerId);

  const { mutate: follow } = useFollowOrganizer();
  const { mutate: unfollow } = useUnfollowOrganizer();

  const handleClick = () => {
    if (isFollowing) {
      unfollow(organizerId);
    } else {
      follow(organizerId);
    }
  };

  if (user?.id === organizerId) {
    return null;
  }

  return (
    isFollowing ? (
      <MyButton type="default" danger onClick={handleClick} {...props}>
        Отписаться
      </MyButton>
    ) : (
      <MyButton type='primary' bgColor="#1d9e58" onClick={handleClick} {...props}>
        Подписаться
      </MyButton>
    )
  );
};

export default FollowButton;
