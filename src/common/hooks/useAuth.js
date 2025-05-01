import { useSelector } from 'react-redux';
import { getAuthTokens } from '../utils/MyStorage/tokens/getAuthTokens';

export const useAuth = () => {
  const { user, isAuthorized } = useSelector(state => state.user);
  const { accessToken } = getAuthTokens();

  return {
    user,
    isAuthorized: isAuthorized && !!accessToken,
  }
}