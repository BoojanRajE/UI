import api from './index';
export interface LoginAppType {
  email: string;
  password: string;
}

type PasswordType = {
  password: string;
  token: string;
};

const login = (data: LoginAppType) => api.post('/auth', data);
const refreshToken = (data: LoginAppType) =>
  api.post('/auth/refreshtoken', data);
const forgotPassword = (data: any) => api.post('/users/forgot', data);
const resetPassword = (data: any) => api.post('/users/reset', data);

export { login, refreshToken, forgotPassword, resetPassword };
