import { Program } from '../../pages/program/Program';
import api from './index';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import axios from 'axios';

const getSearchData = (data: string) =>
  api.post('/program/find', { query: data });

const getPrograms = (data: PaginationProp) =>
  api.post('/program/getRows', data);

const getProgramsName = () => api.get('/program/name');

const addProgram = (data: Program, token: any) => {
  if (token) {
    const config: any = {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    return axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/program`,
      data,
      config
    );
  } else {
    return api.post('/program', data);
  }
};

// const addProgram = (data: Program) => api.post('/program/create', data);

const editProgram = (data: Program, id: string) =>
  api.put(`/program/${id}`, data);

const deleteProgram = (data: Program, id: string) =>
  //@ts-ignore
  api.delete(`/program/${id}`, data);

export {
  getPrograms,
  addProgram,
  editProgram,
  deleteProgram,
  getProgramsName,
  getSearchData,
};
