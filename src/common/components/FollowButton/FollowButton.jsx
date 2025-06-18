import { useDispatch, useSelector } from 'react-redux';
import MyButton from '../UI/Button/MyButton';
import { useFollowOrganizer, useUnfollowOrganizer } from '../../API/services/user/hooks.api';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


const FollowButton = ({ organizerId, ...props }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const following = useSelector((state) => state.userFollowing?.followingOrganizers || []);
  const isFollowing = following.includes(organizerId);

  const { mutate: follow } = useFollowOrganizer();
  const { mutate: unfollow } = useUnfollowOrganizer();

  const handleClick = () => {
    if (user) {
      if (isFollowing) {
        unfollow(organizerId);
      } else {
        follow(organizerId);
      }
    } else {
      navigate(`/auth`)
    }

  };

  if (user?.id === organizerId) {
    return (
      <MyButton
        type="default" 
        style={{color: "black", background: "#FFF"}}
        onClick={() => navigate(`/creator/${user.id}`)}
        {...props}
      >
        Мой профиль
      </MyButton>
    );
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
