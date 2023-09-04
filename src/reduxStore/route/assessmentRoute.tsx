import api from './index';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';

// const getSearchData = (data: string) =>
//   api.post('/assessment/find', { query: data });

const getAssessment = (data: PaginationProp) =>
  api.post('/assessment/getRows', data);

const searchAssessment = (data: any) =>
  api.post('/assessment/search', { query: data });

const takeassessment = (data: any) => api.post(`/assessment/take`, data);

const checkAssessmentStatus = (data: any) =>
  api.post(`/assessment/status`, data);

const getAssessmentStudent = (data: any) =>
  api.get(`/assessment/student/${data.id}`);

const addAssessment = (data: any) => api.post(`/assessment`, data);

const updatePublishStatus = (data: any) =>
  api.post(`/assessment/publish`, data);

const addAssessmentVersion = (data: any) =>
  api.post(`/assessment/version`, data);

const editAssessment = (data: any, id: string) =>
  api.put(`/assessment/${id}`, data);

const deleteAssessment = (data: any) => api.delete(`/assessment/${data}`);

const deleteAdministrative = (data: any, id: string) =>
  //@ts-ignore
  api.delete(`/assessment/${id}`, data);

const getAssessmentDetails = () => api.get(`/assessment/details`);
const getAssessmentById = (data: any) => api.get(`/assessment/id/${data}`);
const addCourseAssessment = (data: any) => api.post('/course/assessment', data);

const addAssessmentDiscipline = (data: any) =>
  api.post(`/assessment/discipline`, data);

const getAssessmentDiscipline = () => api.get('/assessment/discipline');

const getAssessmentQuestion = (id: any) =>
  api.get(`/assessment/question/${id}`);

export {
  searchAssessment,
  getAssessmentDiscipline,
  addAssessmentDiscipline,
  checkAssessmentStatus,
  takeassessment,
  getAssessmentById,
  getAssessment,
  getAssessmentDetails,
  addCourseAssessment,
  addAssessment,
  editAssessment,
  deleteAdministrative,
  addAssessmentVersion,
  updatePublishStatus,
  getAssessmentStudent,
  deleteAssessment,
  getAssessmentQuestion,
};
