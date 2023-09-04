import { CoursePrefix } from '../../pages/coursePrefix/CoursePrefix';
import api from './index';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import axios from 'axios';

const getSearchData = (data: string) =>
  api.post('/course_prefix/find', { query: data });

const getCoursePrefixName = (queryParams: any) =>
  api.get('/course_prefix/name/', { params: queryParams });

const getCoursePrefix = (data: PaginationProp) =>
  api.post('/course_prefix/getRows', data);

const addCoursePrefix = (data: CoursePrefix, token: any) => {
  if (token) {
    const config: any = {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    return axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/course_prefix`,
      data,
      config
    );
  } else {
    return api.post('/course_prefix', data);
  }
};

const editCoursePrefix = (data: CoursePrefix, id: string) =>
  api.put(`/course_prefix/update/${id}`, data);

const deleteCoursePrefix = (data: CoursePrefix, id: string) =>
  //@ts-ignore
  api.delete(`/course_prefix/delete/${id}`, data);

const getCoursePrefixDetails = (id: any) =>
  api.get(`/course_prefix/read/${id}`);

export {
  getCoursePrefix,
  addCoursePrefix,
  editCoursePrefix,
  deleteCoursePrefix,
  getCoursePrefixDetails,
  getCoursePrefixName,
  getSearchData,
};
