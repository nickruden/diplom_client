import Cookies from 'js-cookie';

export const setAuthTokens = (accessToken, refreshToken) => {
  Cookies.set('accessToken', accessToken);
  Cookies.set('refreshToken', refreshToken);
};
