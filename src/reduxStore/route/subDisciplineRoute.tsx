import api from './index';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';

const getSubdiscipline = (data: PaginationProp) =>
  api.post('/sub_discipline/getRows', data);

const getSearchDataSubDiscipline = (data: string) =>
  api.post('/sub_discipline/find', { query: data });

const getSubDisciplineDetail = () => api.get('/sub_discipline/detail');
const addSubDiscipline = (data: any) => api.post('/sub_discipline', { data });
const editSubDiscipline = (data: any) => api.put('/sub_discipline', { data });
const deleteSubDiscipline = (id: any) => api.delete(`/sub_discipline/${id}`);

export {
  getSubdiscipline,
  getSubDisciplineDetail,
  addSubDiscipline,
  editSubDiscipline,
  deleteSubDiscipline,
  getSearchDataSubDiscipline,
};
