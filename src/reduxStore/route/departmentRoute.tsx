import axios from 'axios';
import { Department } from '../../pages/department/Department';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import api from './index';

const getSearchData = (data: string) =>
  api.post('/department/find', { query: data });

const getDepartmentName = () => api.get('/department/name');

const getDepartment = (id: string) => api.get(`/department/${id}`);

const getDepartments = (data: PaginationProp) =>
  api.post('/department/getRows', data);

const addDepartment = (data: Department, token: any) => {
  if (token) {
    const config: any = {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    return axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/department`,
      data,
      config
    );
  } else {
    return api.post('/department', data);
  }
};

const editDepartment = (data: Department, id: string) =>
  api.put(`/department/${id}`, data);

const deleteDepartment = (data: Department, id: string) =>
  //@ts-ignore
  api.delete(`/department/${id}`, data);

export {
  getDepartments,
  addDepartment,
  editDepartment,
  deleteDepartment,
  getDepartmentName,
  getSearchData,
  getDepartment,
};
