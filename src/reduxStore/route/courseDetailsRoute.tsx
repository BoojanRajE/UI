import axios from 'axios';
import { CourseDetails } from '../../pages/courseDetails/CourseDetails';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import api from './index';

const getSearchData = (data: string) =>
  api.post('/course_details/find', { query: data });

const getCourseDetailsName = (queryParams: any) =>
  api.get('/course_details/name', { params: queryParams });

const getCourseDetail = (id: string) => api.get(`/course_details/${id}`);

const getCourseDetails = (data: PaginationProp) =>
  api.post('/course_details/getRows', data);

const addCourseDetails = (data: CourseDetails, token: any) => {
  if (token) {
    const config: any = {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    return axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/course_details`,
      data,
      config
    );
  } else {
    return api.post('/course_details', data);
  }
};

const editCourseDetails = (data: CourseDetails, id: string) =>
  api.put(`/course_details/${id}`, data);

const deleteCourseDetails = (data: CourseDetails, id: string) =>
  //@ts-ignore
  api.delete(`/course_details/${id}`, data);

export {
  getCourseDetails,
  addCourseDetails,
  editCourseDetails,
  deleteCourseDetails,
  getCourseDetailsName,
  getSearchData,
  getCourseDetail,
};
