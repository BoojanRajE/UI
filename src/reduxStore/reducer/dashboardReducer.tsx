import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as dashboardRoute from '../route/dashboardRoute';
import { GridApi } from 'ag-grid-community';
import Alert from '../../utils/Alert/Alert';
import moment from 'moment';

export interface AxiosError<T = any> extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: object;
  data: object;
  response?: AxiosResponse<T>;
  isAxiosError: boolean;
  toJSON: () => object;
}

const initialState = {
  dashboardData: [],
  loading: false,
};

// const getDashboardData = (setOrg: any) => async () => {
//   return dashboardRoute
//     .getDashboards()
//     .then((res: AxiosResponse) => {
//       if (res?.data) {
//         setOrg(res.data.records.org);
//       }
//     })
//     .catch((err: AxiosError) =>
// };

const getDashboardData =
  (
    setOrg: any,
    setCourse: any,
    setStudent: any,
    setAssessment: any,
    setUsers: any
  ) =>
  async (dispatch: AppDispatch) => {
    return dashboardRoute
      .getDashboards()
      .then((res: AxiosResponse) => {
        if (res?.data?.records) {
          const { org, course, student, assessment, users } = res.data.records;
          setOrg(org);
          setCourse(course);
          setStudent(student);
          setAssessment(assessment);
          setUsers(users);
        }
      })
      .catch((err: AxiosError) => {});
  };

const getUsersCountBasedOnYear =
  (option: any, setOptions: any) => async (dispatch: AppDispatch) => {
    return dashboardRoute
      .getUsersCountBasedOnYear()
      .then((res: AxiosResponse) => {
        if (res?.data?.records) {
          const data = res.data.records.map((d: any) => ({
            count: Number(d.count),
            month: moment(d.month).format('MMMM'),
          }));

          setOptions({ ...option, data: data });
        }
      })
      .catch((err: AxiosError) => {});
  };

const getUsersStudentCountBasedOnYear =
  (setOptions: any) => async (dispatch: AppDispatch) => {
    return dashboardRoute
      .getUsersStudentCountBasedOnYear()
      .then((res: AxiosResponse) => {
        if (res?.data?.records) {
          const data = res.data.records.map((d: any) => ({
            admin_count: Number(d.admin_count),
            student_count: Number(d.student_count),
            faculty_count: Number(d.faculty_count),
            month: moment(d.month).format('MMMM'),
          }));

          setOptions(data);
        }
      })
      .catch((err: AxiosError) => {});
  };

const getAssessmentCountBasedOnStatus =
  (option: any, setOptions: any) => async (dispatch: AppDispatch) => {
    return dashboardRoute
      .getAssessmentCountBasedOnStatus()
      .then((res: AxiosResponse) => {
        if (res?.data?.records) {
          const { true_count, false_count } = res?.data?.records;
          setOptions({
            ...option,
            data: [
              {
                count: Number(true_count),
                type: 'Assessment Taken',
              },
              { count: Number(false_count), type: 'Remaining Assessment' },
            ],
          });
        }
      })
      .catch((err: AxiosError) => {});
  };

const getOrganizationCountBasedOnStatus =
  (setCardsData: any) => async (dispatch: AppDispatch) => {
    return dashboardRoute
      .getOrganizationCountBasedOnStatus()
      .then((res: AxiosResponse) => {
        if (res?.data?.records) {
          const data = res.data.records.map((d: any) => ({
            id: d.id,
            name: d.name,
            userOrganizationCount: d.user_organization_count,
            courseCount: d.course_count,
          }));

          setCardsData(data);
        }
      })
      .catch((err: AxiosError) => {});
  };
const getAdministrationCountBasedOnStatus =
  (chartData: any, setChartData: any) => async (dispatch: AppDispatch) => {
    return dashboardRoute
      .getAdministrationCountBasedOnStatus()
      .then((res: AxiosResponse) => {
        if (res?.data?.records) {
          const data = res.data.records.map((d: any) => ({
            course_administration_count: Number(d.course_administration_count),
            course_assessment_count: Number(d.course_assessment_count),

            course_count: Number(d.course_count),
            course_students_count: Number(d.course_students_count),
            month: d.month,
          }));

          setChartData(data);
        }
      })
      .catch((err: AxiosError) => {});
  };

const DashboardSlice = createSlice({
  name: 'DashboardSlice',
  initialState,
  reducers: {
    handleGetProgram: (state, action) => {
      state.dashboardData = action.payload;
    },

    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const getCourseAdministrationCountBasedOnStatus =
  (setCardsData: any) => async (dispatch: AppDispatch) => {
    return dashboardRoute
      .getCourseAdministrationCountBasedOnStatus()
      .then((res: AxiosResponse) => {
        if (res?.data?.records) {
          const data = res.data.records.map((d: any) => ({
            official_name: d.official_name,
            start_date_time: d.start_date_time,
            end_date_time: d.end_date_time,
            c_id: d.c_id,
            cass_id: d.cass_id,
            ass_code: d.ass_code,
            course_name: d.course_name,
            adm_id: 'Administration ' + d.administration_id,
          }));

          setCardsData(data);
        }
      })
      .catch((err: AxiosError) => {});
  };
const getFacultyDashboardList =
  (setFacultyCount: any) => async (dispatch: AppDispatch) => {
    return dashboardRoute
      .getFacultyDashboardList()
      .then((res: AxiosResponse) => {
        if (res?.data?.records) {
          const data = res.data.records.map((d: any) => ({
            overall_course_count: d.overall_course_count,
            overall_assessment_count: d.overall_assessment_count,
            overall_course_administration_count:
              d.overall_course_administration_count,
            overall_course_students_count: d.overall_course_students_count,
          }));

          setFacultyCount(data);
        }
      })
      .catch((err: AxiosError) => {});
  };

// const getFacultyCourseCardCountList =
//   (setCourseCardsData: any) => async (dispatch: AppDispatch) => {
//     return dashboardRoute
//       .getFacultyCourseCardCountList()
//       .then((res: AxiosResponse) => {
//         if (res?.data?.records) {
//           const data = res.data.records.map((d: any) => ({
//             term: d.term,
//             assessment_id: d.assessment_id,
//             official_name: d.official_name,
//             count_assessments: d.count_assessments,
//             created_at: d.created_at,
//             name: d.name,
//             term_name: d.term_name,
//             course_id: d.course_id,
//             cass_id: d.cass_id,
//           }));
//
//           setCourseCardsData(data);
//         }
//       })
//       .catch((err: AxiosError) =>
//   };
const getFacultyCourseCardCountList =
  (setCourseCardsData: any) => async (dispatch: AppDispatch) => {
    return dashboardRoute
      .getFacultyCourseCardCountList()
      .then((res: AxiosResponse) => {
        // if (res?.data?.records) {
        //   const data = res.data.records.map((d: any) => ({
        //     term: d.term,
        //     assessment_id: d.term_name,
        //     official_name: d.course_names[0],
        //     count_assessments: d.count_assessments,
        //     created_at: d.created_at,
        //     name: d.course_names.join(', '),
        //     term_name: d.term_name,
        //     course_id: d.course_id,
        //     cass_id: d.course_id,
        //     course_name: d.course_names,
        //   }));
        //
        //   setCourseCardsData(data);
        // }
        if (res?.data?.records) {
          const data = res.data.records.map((d: any) => ({
            term: d.term,
            year: d.year,
            assessment_id: d.term_name,
            official_name: d.course_names[0],
            count_assessments: d.count_assessments,
            created_at: d.created_at,
            name: Array.isArray(d.course_names)
              ? d.course_names.join(', ')
              : d.course_names,
            term_name: d.term_name + '-' + d.year,
            course_id: d.course_id,
            cass_id: d.course_id,
            course_name: d.course_names,
          }));

          setCourseCardsData(data);
        }
      })

      .catch((err: AxiosError) => {});
  };
//reducers export  to pass action state to reducer type
export const { handleGetProgram, handleLoading } = DashboardSlice.actions;

//action to calls in ui with dispatch methods
export {
  getDashboardData,
  getUsersCountBasedOnYear,
  getUsersStudentCountBasedOnYear,
  getAssessmentCountBasedOnStatus,
  getOrganizationCountBasedOnStatus,
  getAdministrationCountBasedOnStatus,
  getCourseAdministrationCountBasedOnStatus,
  getFacultyDashboardList,
  getFacultyCourseCardCountList,
};

export default DashboardSlice.reducer;
