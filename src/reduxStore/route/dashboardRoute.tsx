import api from './index';

const getDashboards = () => api.get(`/dashboard/count`);

const getUsersCountBasedOnYear = () => api.get(`/dashboard/user/count`);

const getUsersStudentCountBasedOnYear = () =>
  api.get(`/dashboard/user-student/count`);
const getAssessmentCountBasedOnStatus = () =>
  api.get(`/dashboard/assessment/count`);
const getOrganizationCountBasedOnStatus = () =>
  api.get(`/dashboard/organization/count`);
//faculty

const getAdministrationCountBasedOnStatus = () =>
  api.get(`/dashboard/administration/count`);

const getCourseAdministrationCountBasedOnStatus = () =>
  api.get(`/dashboard/course-administration/count`);
const getFacultyDashboardList = () => api.get(`/dashboard/faculty-count/count`);

const getFacultyCourseCardCountList = () =>
  api.get(`/dashboard/faculty-course-card/count`);

export {
  getDashboards,
  getUsersCountBasedOnYear,
  getUsersStudentCountBasedOnYear,
  getAssessmentCountBasedOnStatus,
  getOrganizationCountBasedOnStatus,
  getAdministrationCountBasedOnStatus,
  getCourseAdministrationCountBasedOnStatus,
  getFacultyDashboardList,
  getFacultyCourseCardCountList,
};
