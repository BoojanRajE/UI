// import { Organization } from "../../pages/organisation/OrganizationForm";
import axios from 'axios';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import api from './index';

const getCourses = (data: PaginationProp) => api.post('/course/getRows', data);
const addCourse = (data: any) => api.post('/course', data);

const getCourseNames = () => api.get('course_details/name');

const getCourse = (data: any) => api.get(`/course/${data.id}`);

const editCourse = (data: any) => api.put(`/course/${data.id}`, data);

const deleteCourse = (data: any) => api.delete(`/course/${data.id}`, data);

const searchFromOtherOrg = (data: any) => api.post('/users/search', data);
const getAssessmentByCourse = (id: any) =>
  api.post(`/course/getAssessmentByCourse/${id}`);

// const fileUpload = (formData: any) => {
//   const customApi : any = api
//
//   //  = { "Content-Type": "multipart/form-data" }
//   return customApi.post(`/course_details/fileupload`, formData);
// }

const fileUpload = (formData: any) => {
  const config: any = {
    headers: {
      authorization: `Bearer ${JSON.parse(
        localStorage.getItem('token') || '{}'
      )}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  return axios.post(
    `${process.env.REACT_APP_BASE_URL}/api/course_details/file`,
    formData,
    config
  );
};
const deleteStudent = (id: any) => api.delete(`/course_details/student/${id}`);
const addStudent = (values: any) => api.delete('/course_details/add/', values);
const checkToDelete = (data: any) =>
  api.get(`/course/check_to_delete/${data.id}`);
export {
  getCourses,
  addCourse,
  getCourse,
  editCourse,
  deleteCourse,
  getCourseNames,
  searchFromOtherOrg,
  getAssessmentByCourse,
  fileUpload,
  deleteStudent,
  addStudent,
  checkToDelete,
};
