import axios from 'axios';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import api from './index';

const getCenters = (data: PaginationProp) => api.post('/center/getRows', data);

const getSearchDataCenter = (data: string) =>
  api.post('/center/find', { query: data });

const getCenterIdandName = () => api.get('/center/nameid');

const addCenter = (data: any, token: any) => {
  if (token) {
    const config: any = {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    return axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/center`,
      { data },
      config
    );
  } else {
    return api.post('/center', { data });
  }
};

const editCenter = (data: any) => api.put('/center', { data });
const deleteCenter = (id: any) => api.delete(`/center/${id}`);

export {
  getCenters,
  getCenterIdandName,
  addCenter,
  editCenter,
  deleteCenter,
  getSearchDataCenter,
};
