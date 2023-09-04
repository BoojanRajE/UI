import { Organization } from '../../pages/organisation/OrganizationForm';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import api from './index';

const getSearchUserData = (data: string) =>
  api.post('/users/user/findUser', { query: data });
const getSearchApprovalData = (data: string) =>
  api.post('/users/user/findApproval', { query: data });

const getUsers = (data: any) =>
  api.post('/users/user/getAllUserInformation', data);

const getUsersByType = (type: any) => api.get(`/users/type/${type}`);

const activatePassword = (data: any) =>
  api.post('/users/activate-password', data);

const createAdminUser = (data: any) => api.post('/users/admin', data);

const updateAdminUser = (data: any) => api.put('/users', data);

// const getUsersByOrganization = (data: any) =>
//   api.post("/users/organization", data);

const updateUserStatus = (status: any, data: any) =>
  api.post('/users/user-status', {
    status: status,
    id: data.id,
    user_id: data.user_id,
  });

const updateUserLockedStatus = (status: any, id: any) =>
  api.put('/users/user-locked-status', { status, id });

const getUsersByOrganization = (data: PaginationProp) =>
  api.post('/users/organization/getRows', data);

const getUsersByOrganizationPopup = () => api.get('/users/organization/popup');

const getInstructors = (queryParams: any) =>
  api.get('/users/instructor', { params: queryParams });

const inviteUser = (data: any) => api.post('/users/invite-user', data);

const updateDefaultOrganization = (status: any, id: any) =>
  api.post('/users/update-default-organization', { status, id });

const deleteUserOrganization = (id: any) =>
  api.delete(`/users/organization/${id}`);

const deleteUserUnit = (id: any) => api.delete(`/users/unit/${id}`);

const updateUnitRoles = (data: any, id: any) =>
  api.post('/users/update-unit-roles', { data, id });

export {
  updateUnitRoles,
  updateDefaultOrganization,
  getUsers,
  updateUserStatus,
  getUsersByOrganization,
  createAdminUser,
  activatePassword,
  getSearchUserData,
  getSearchApprovalData,
  updateAdminUser,
  updateUserLockedStatus,
  getInstructors,
  inviteUser,
  getUsersByType,
  getUsersByOrganizationPopup,
  deleteUserOrganization,
  deleteUserUnit,
};
