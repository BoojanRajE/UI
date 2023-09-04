import { Unitroles } from '../../pages/unitroles/Unitroles';
import api from './index';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';

const getSearchData = (data: string) =>
  api.post('/unitroles/find', { query: data });

const getUnitrolesName = () => api.get('/unitroles/name');

const getUnitroles = (data: PaginationProp) =>
  api.post('/unitroles/getRows', data);

const addUnitroles = (data: Unitroles) => api.post('/unitroles', data);

const editUnitroles = (data: Unitroles, id: string) =>
  api.put(`/unitroles/${id}`, data);

const deleteUnitroles = (data: Unitroles, id: string) =>
  //@ts-ignore
  api.delete(`/unitroles/${id}`, data);

export {
  getUnitroles,
  addUnitroles,
  editUnitroles,
  deleteUnitroles,
  getSearchData,
  getUnitrolesName,
};
