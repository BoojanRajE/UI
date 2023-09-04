import api from './index';
export interface LoginAppType {
  email: string;
  password: string;
}
export interface ForgotpasswordType {
  email: string;
}
type PasswordType = {
  password: string;
  token: string;
};

const register = (data: LoginAppType) => api.post('/register', data);
const inviteRegister = (data: LoginAppType) =>
  api.post('/register/invite', data);
const registerAffiliate = (data: any) => api.post('/register/affiliate', data);
const activate = (data: any) => api.post('/register/activate', data);
const activateAffiliate = (data: any) =>
  api.post('/register/affiliate/activate', data);
const update = (data: any) => api.post('/register/update', data);
const updateAffiliate = (data: any) => api.put('/register/affiliate', data);
const updateUnit = (data: any) => api.put('/register/unit', data);
const getUser = (data: any) => api.get(`/users/user/${data.id}`);
const getUserAndOrganization = (data: any) =>
  api.get(`/users/user/organization/${data.id}`);
const getUserDetails = (data: any) => api.get(`/users/userDetails/${data.id}`);
const getUserDetailsAffiliate = (data: any) =>
  api.get(`/users/user-details/affiliate/${data.id}`);
const updateUserDetails = (data: any, id: string) =>
  api.put(`users/update-user-detail/${id}`, data);
// const refreshToken = (data: LoginAppType) =>
//   api.post('/auth/refreshtoken', data);
// const forgotPassword = (data: ForgotpasswordType) =>
//   api.post('/users/forgot', data);
// const resetPassword = (data: PasswordType) => api.post('/users/reset', data);

export {
  getUserDetailsAffiliate,
  getUserAndOrganization,
  register,
  registerAffiliate,
  activate,
  activateAffiliate,
  update,
  updateAffiliate,
  updateUnit,
  getUser,
  getUserDetails,
  updateUserDetails,
  inviteRegister,
};
