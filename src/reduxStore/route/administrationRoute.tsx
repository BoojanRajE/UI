import axios from 'axios';

import api from './index';

const getStudentsByCourse = (id: string) =>
  api.get(`/administrations/getStudentByCourse/${id}`); //NU

const getCourseAdministraionByCourse = (id: string) =>
  api.get(`/administrations/getAdministraionByCourse/${id}`); //NU

const getStudentAndAdministrationByAssessment = (id: any, cancelToken: any) =>
  api.get(
    `/administrations/get-student-and-administration-by-assessment/${id}`,
    { cancelToken }
  );

const changeStartTime = (data: any) =>
  api.post(`/administrations/change-start-time`, data);

const changeEndTime = (data: any) =>
  api.post(`/administrations/change-end-time`, data);

const getReports = (
  id: string //courseAssessmentId
) => api.get(`/administrations/report/${id}`);

const getResultAnalysis = (
  courseAssessmentId: string //courseAssessmentId
) => api.get(`/administrations/result-analysis/${courseAssessmentId}`);

const getResultAnalysisAdm = (
  courseAssessmentId: string,
  administration_id: string
) =>
  api.get(
    `/administrations/result-analysis/${courseAssessmentId}/${administration_id}`
  );

export {
  getStudentsByCourse,
  getCourseAdministraionByCourse,
  getStudentAndAdministrationByAssessment,
  changeStartTime,
  changeEndTime,
  getReports,
  getResultAnalysis,
  getResultAnalysisAdm,
};
