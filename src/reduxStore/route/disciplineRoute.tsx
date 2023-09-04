import api from './index';

const getSearchDisciplineData = (data: string) =>
  api.post('/discipline/find', { query: data });
const getAllDiscipline = (data: any) => api.post('/discipline/getRows', data);
const getDisciplineDetails = () => api.get('/discipline/details');
const addDiscipline = (data: any) => api.post('/discipline', { data });
const editDiscipline = (data: any) => api.put('/discipline', { data });
// const deleteAllDiscipline = (data:any) => api.delete("/discipline/delete",{data});
const deleteAllDiscipline = (id: any) => api.delete(`/discipline/${id}`);

export {
  addDiscipline,
  getAllDiscipline,
  deleteAllDiscipline,
  editDiscipline,
  getDisciplineDetails,
  getSearchDisciplineData as getSearchData,
};
