import Cookies from 'js-cookie';

export const getAuthTokens = () => {
  const accessToken = Cookies.get('accessToken');
  const refreshToken = Cookies.get('refreshToken');

  return { accessToken, refreshToken };
};
