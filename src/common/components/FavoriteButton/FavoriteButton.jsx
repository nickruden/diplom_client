import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';

import { HeartFilled, HeartOutlined } from '@ant-design/icons';

import MyButton from '../UI/Button/MyButton';
import { useNavigate } from 'react-router-dom';

import './FavoriteButton.scss'
import { useSetFavoriteEvent, useUnsetFavoriteEvent } from '../../API/services/events/hooks.api';


const FavoriteButton = ({ eventId, size = 24, style = {}, ...props }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const favoriteEvents = useSelector((state) => state.userFavoriteEvents?.favoriteEvents || []);
  const isFavorite = favoriteEvents.includes(eventId);

  const { mutate: addFavorite } = useSetFavoriteEvent();
  const { mutate: removeFavorite } = useUnsetFavoriteEvent();

  const handleClick = (e) => {
    e.stopPropagation();
    if (!user) navigate('/auth');

    isFavorite ? removeFavorite(eventId) : addFavorite(eventId);
  };

  return (
      <MyButton onClick={handleClick} style={{ fontSize: size, ...style }} {...props} className='favoriteButton'>
        {isFavorite ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined style={{ color: '#FFF' }} />}
      </MyButton>
  );
};

export default FavoriteButton;
