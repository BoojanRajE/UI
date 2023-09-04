import { Administrative } from '../../pages/administrative/Administrative';
import api from './index';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import axios from 'axios';

const getSearchData = (data: string) =>
  api.post('/administrative/find', { query: data });

const getAdministrativeName = () => api.get('/administrative/name');

const getAdministratives = (data: PaginationProp) =>
  api.post('/administrative/getRows', data);

const addAdministrative = (data: Administrative, token: any) => {
  if (token) {
    const config: any = {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    return axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/administrative`,
      data,
      config
    );
  } else {
    return api.post('/administrative', data);
  }
};

const editAdministrative = (data: Administrative, id: string) =>
  api.put(`/administrative/${id}`, data);

const deleteAdministrative = (data: Administrative, id: string) =>
  //@ts-ignore
  api.delete(`/administrative/${id}`, data);

const getAdministrativesDetails = (id: any) =>
  api.get(`/administrative/read/${id}`);

export {
  getAdministratives,
  addAdministrative,
  editAdministrative,
  deleteAdministrative,
  getAdministrativesDetails,
  getAdministrativeName,
  getSearchData,
};
