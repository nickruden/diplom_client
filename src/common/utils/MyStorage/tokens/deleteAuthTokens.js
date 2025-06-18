import Cookies from 'js-cookie';

export const deleteAuthTokens = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};
