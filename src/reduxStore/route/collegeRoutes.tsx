import axios from 'axios';
import { CollegeType } from '../../pages/college/CollegeType';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import api from './index';

const getSearchData = (data: string) =>
  api.post('/college/find', { query: data });

const getCollegeName = () => api.get('/college/name');

const getCollege = (id: string) => api.get(`/college/${id}`);

const getColleges = (data: PaginationProp) =>
  api.post('/college/getRows', data);

const addCollege = (data: CollegeType, token: any) => {
  if (token) {
    const config: any = {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    return axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/college`,
      data,
      config
    );
  } else {
    return api.post('/college', data);
  }
};

const editCollege = (data: CollegeType, id: string) =>
  api.put(`/college/${id}`, data);

const deleteCollege = (data: CollegeType, id: string) =>
  //@ts-ignore
  api.delete(`/college/${id}`, data);

export {
  getColleges,
  addCollege,
  editCollege,
  deleteCollege,
  getCollegeName,
  getSearchData,
  getCollege,
};
