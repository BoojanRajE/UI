import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as courseRoute from '../route/courseRoute';
import Alert from '../../utils/Alert/Alert';
import Swal from 'sweetalert2';
import { Navigate, NavigateFunction } from 'react-router-dom';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import { correctBeforeEditValues } from '../../pages/course/AddEditCourse';
import { GridApi } from 'ag-grid-community';
import { handleDeleteTransaction } from '../../utils/gridMethod/GridTransaction';

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
  loading: false,
};

// const getSearchData =
//   (data: string, params: any, setFlag?: any) => async () => {
//     return organisationRoute
//       .getSearchData(data)
//       .then((res: AxiosResponse) => {
//         if (res?.data) {
//           const { records, totCount } = res?.data;
//           if (!records?.length) {
//             params.api.showNoRowsOverlay();
//             setFlag(false);
//           } else {
//             params.api.hideOverlay();
//             setFlag(true);
//           }

//           params.success({
//             rowData: records,
//             rowCount: totCount || 0,
//           });
//         }
//       })
//       .catch((err: AxiosError) => {
//         params.fail();
//       });
//   };

// const getOrganizationName = () => async (dispatch: AppDispatch) => {
//   return organisationRoute
//     .getOrganizationName()
//     .then((res: AxiosResponse) => {
//       dispatch(handleGetOrganisationName(res.data.records));
//     })
//     .catch((err: AxiosError) =>
// };

const getCourseData = (data: PaginationProp, params: any) => async () => {
  return courseRoute
    .getCourses(data)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        const { records, totCount } = res?.data;
        params.success({
          rowData: records,
          rowCount: totCount || 0,
        });
        if (!records?.length) {
          params.api.showNoRowsOverlay();
        } else params.api.hideOverlay();
      }
    })
    .catch((err: AxiosError) => {
      params.params.success({
        rowData: [],
        rowCount: 0,
      });
      params.api.showNoRowsOverlay();
    });
};

//get single record
const getCourseDetail = (
  data: any,
  navigate?: NavigateFunction,
  route?: string
) => {
  return courseRoute
    .getCourse(data)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        res.data.record[0] = correctBeforeEditValues(res.data.record[0]);
        if (navigate && route) navigate(route, { state: res.data.record[0] });
        else {
          return res.data.record[0];
        }
      }
    })
    .catch((err: AxiosError) => {});
};

const addCourseData = (
  data: any,
  navigate?: NavigateFunction,
  route?: string,
  setFlag?: any
) => {
  return courseRoute
    .addCourse(data)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        if (res.data.message === 'Course already exists in Organization') {
          setFlag(false);
          Alert.info({ title: `Course already exists in this Organization` });
        } else {
          Swal.fire('New course added', '', 'success').then((ok) => {
            if (navigate && route) navigate(route);
            else if (navigate) navigate(-1);
          });
        }
      }
    })
    .catch((err: AxiosError) => {
      setFlag(false);
      Alert.addError({ title: 'Course', text: '' });
    });
};

const editCourseData = (data: any, navigate: any, setFlag?: any) => {
  return courseRoute
    .editCourse(data)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        if (res.data.message === 'Course already exists in Organization') {
          setFlag(false);
          Alert.info({ title: `Course already exists in this Organization` });
        } else {
          Swal.fire('Course updated', '', 'success').then((ok) =>
            navigate(-1, { state: res.data.record })
          );
        }
      }
    })
    .catch((err: AxiosError) => {
      setFlag(false);
      if (err.response?.data?.errorMessage === 'Course already present') {
        Alert.already({ title: 'Course', text: '' });
      } else {
        Alert.updateError({ title: 'Course', text: '' });
      }
    });
};

const deleteCourseData = (data: any, gridApi: GridApi | undefined) => {
  courseRoute
    .checkToDelete(data)
    .then((res: any) => {
      if (res.data.isCourseDeletable) {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          backdrop: true,
          showCloseButton: true,
          confirmButtonText: 'Yes, delete it!',
          allowOutsideClick: false,
          allowEscapeKey: true,
          width: 300,
          heightAuto: false,
          customClass: {
            popup: 'swal-title-color',
            icon: 'swal-title-icon',
            confirmButton: 'swal-confirm',
          },
        }).then(async (result) => {
          if (result.isConfirmed)
            return courseRoute
              .deleteCourse(data)
              .then((res: AxiosResponse) => {
                if (res?.data && gridApi) {
                  handleDeleteTransaction(gridApi, res.data.data);
                  if (gridApi && !gridApi.getDisplayedRowCount())
                    gridApi.showNoRowsOverlay();
                  Swal.fire('Course deleted', '', 'success');
                }
              })
              .catch((err: AxiosError) => {
                Swal.fire('Unable to delete course', '', 'error');
              });
        });
      } else {
        Alert.info({
          title: 'This course is already started',
          text: '',
        });
      }
    })
    .catch((err: any) => {});
};

const searchFromOtherOrg = (
  data: any,
  setSearchResults: any,
  setSelectedItems: any,
  searchResults: any,
  setOpenAddInstructorForm: any,
  setOpenLookupForm: any,
  openAddInstructorForm: any
) => {
  courseRoute
    .searchFromOtherOrg(data)
    .then((result: AxiosResponse) => {
      const searchRes = [
        {
          id: result.data.users.id,
          name: `${result.data.users.first_name} ${result.data.users.last_name}`,
          organization_name: `abc`,
        },
      ];
      setSearchResults(
        Array.from(
          new Set(
            [...searchResults, ...searchRes].map((x) => JSON.stringify(x))
          )
        ).map((x) => JSON.parse(x))
      );

      const data = [...searchResults];
      data.push(searchRes[0]);

      const newArray = Array.from(
        new Set(data.map((x) => JSON.stringify(x)))
      ).map((x) => JSON.parse(x));
      setSelectedItems(newArray);
    })
    .catch((error: AxiosError) => {
      if (error?.response?.status == 500)
        Swal.fire({
          title: `No user found`,
          icon: 'info',
          showCancelButton: true,
          // cancelButtonText: 'Return to Assessment',
          confirmButtonText: 'Add User',
          showCloseButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            setOpenLookupForm(false);
            setOpenAddInstructorForm((e: any) => ({
              ...e,
              isOpen: true,
              addnew: data.email,
            }));
          }
        });
    });
};

const getAssessmentByCourseId = (params: any) => {
  courseRoute
    .getAssessmentByCourse(params.data.id)
    .then((result: AxiosResponse) => {
      const output = result.data.records.map((e: any) => ({
        ...e,
        courseId: params.data.id,
      }));
      params.successCallback(output);
    })
    .catch((error: AxiosError) => {});
};

const studentFileupload = (formData: any, callback: any) => {
  courseRoute
    .fileUpload(formData)
    .then((result: AxiosResponse) => {
      if (result?.data?.message === 'No unique data found in imported file') {
        Alert.info({
          title: 'No unique data found',
          text: '',
        });
      } else {
        callback();
      }
    })
    .catch((error: AxiosError) => {});
};

const deleteStudent = (id: any) => {
  courseRoute
    .deleteStudent(id)
    .then((result: AxiosResponse) => {
      Swal.fire({
        icon: 'success',
        title: 'Student entry deleted',
        showConfirmButton: true,
        confirmButtonText: 'Ok',

        customClass: {
          container: 'swal-container',
        },
      });
    })
    .catch((error: AxiosError) => {
      Swal.fire('Delete Group', 'Unable to delete', 'error');
    });
};

const addStudent = (values: any, callback: any) => {
  courseRoute
    .addStudent(values)
    .then((result: AxiosResponse) => {
      callback(result);
    })
    .catch((err: AxiosError) => {});
};

//   Alert.confirm(() => {
//     return courseRoute
//       .deleteCourse(data)
//       .then((res: AxiosResponse) => {
//         if (res?.data && gridApi) {
//           handleDeleteTransaction(gridApi, res.data.data);
//           if (gridApi && !gridApi.getDisplayedRowCount())
//             gridApi.showNoRowsOverlay();
//           Alert.delete({ title: 'Course', text: '' });
//         }
//       })
//       .catch((err: AxiosError) => {
//         Alert.deleteError({ title: 'Course', text: '' });
//       });
//   });
// };

//@ts-check
const CourseSlice = createSlice({
  name: 'CourseSlice',
  initialState,
  reducers: {
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

//reducers export to pass action state to reducer type
export const { handleLoading } = CourseSlice.actions;

//action to calls in ui with dispatch methods
export {
  getCourseData,
  addCourseData,
  getCourseDetail,
  editCourseData,
  deleteCourseData,
  searchFromOtherOrg,
  getAssessmentByCourseId,
  studentFileupload,
  deleteStudent,
  addStudent,
};

export default CourseSlice.reducer;
