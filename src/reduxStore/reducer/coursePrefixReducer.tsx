import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as coursePrefixRoute from '../route/coursePrefixRoute';
import { CoursePrefix } from '../../pages/coursePrefix/CoursePrefix';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import { GridApi } from 'ag-grid-community';
import {
  handleAddTransaction,
  handleDeleteTransaction,
  handleUpdateTransaction,
} from '../../utils/gridMethod/GridTransaction';
import Alert from '../../utils/Alert/Alert';

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
  coursrPrefixData: [],
  coursePrefixName: [],
  loading: false,
};

const getSearchData =
  (data: string, params: any, setFlag?: any) =>
  async (dispatch: AppDispatch) => {
    return coursePrefixRoute
      .getSearchData(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          const { records, totCount } = res?.data;
          if (!records?.length) {
            params.api.showNoRowsOverlay();
            setFlag(false);
          } else {
            params.api.hideOverlay();
            setFlag(true);
          }
          return params.success({
            rowData: records,
            rowCount: totCount || 0,
          });
        }
      })
      .catch((err: AxiosError) => {
        params.fail();
      });
  };

const getCoursePrefixName =
  (org_id = undefined) =>
  async (dispatch: AppDispatch) => {
    const queryParams = {
      org_id: org_id,
    };
    return coursePrefixRoute
      .getCoursePrefixName(queryParams)
      .then((res: AxiosResponse) => {
        dispatch(handleGetCoursePrefixName(res.data.name));
      })
      .catch((err: AxiosError) => {});
  };

const getCoursePrefixData = (data: PaginationProp, params: any) => async () => {
  return coursePrefixRoute
    .getCoursePrefix(data)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        const { rows, totCount } = res?.data;
        if (!rows?.length) {
          params.api.showNoRowsOverlay();
        } else params.api.hideOverlay();

        return params.success({
          rowData: rows,
          rowCount: totCount || 0,
        });
      }
    })
    .catch((err: AxiosError) => params.fail());
};

const getCoursePrefixDetailData =
  (id: any) => async (dispatch: AppDispatch) => {
    return coursePrefixRoute
      .getCoursePrefixDetails(id)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          dispatch(handleGetCoursePrefix(res.data.courseprefix));
        } else dispatch(handleGetCoursePrefix([]));
      })
      .catch((err: AxiosError) => err);
  };

const addCoursePrefixData =
  (
    data: CoursePrefix,
    setOpen: any,
    token: any,
    callback?: any,
    setInitialValue?: any,
    initialValues?: any,
    gridApi?: GridApi | undefined,
    handleUpdate?: any
  ) =>
  async (dispatch: AppDispatch) => {
    return coursePrefixRoute
      .addCoursePrefix(data, token)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (setInitialValue) {
            setInitialValue({
              ...initialValues,
              course_prefix_id: res.data.coursePrefix,
            });
          }
          if (handleUpdate) {
            const updateData = {
              ...data,
              organization_name:
                res.data.coursePrefix.organization_name ||
                data?.organization_name?.name,
            };
            handleUpdate(updateData);
          }
          res.data.coursePrefix = {
            ...res.data.coursePrefix,
            organization_name:
              res.data.coursePrefix.organization_name ||
              data?.organization_name?.name,
          };
          if (gridApi) handleAddTransaction(gridApi, res.data.coursePrefix);
          if (gridApi && gridApi.getDisplayedRowCount()) gridApi.hideOverlay();
          setOpen({ open: false });

          // dispatch(getCoursePrefixName());
        }
        Alert.add({ title: 'Course Prefix', text: '' });
        if (callback) {
          callback(res.data.coursePrefix);
        }
      })
      .catch((err: AxiosError) => {
        setOpen(false);
        if (
          err.response?.data?.errorMessage ===
          'Course Prefix already present for the chosen organization'
        ) {
          Alert.already({ title: 'Course Prefix', text: '' });
        } else {
          Alert.addError({ title: 'Course Prefix', text: '' });
        }
      });
  };

const editCoursePrefixData = (
  data: CoursePrefix,
  setOpen: any,
  gridApi?: GridApi | undefined
) => {
  return coursePrefixRoute
    .editCoursePrefix(data, data?.id)
    .then((res: AxiosResponse) => {
      if (res?.data && gridApi) {
        res.data.updateCoursePrefix = {
          ...res?.data.updateCoursePrefix,
          organization_name: data.organization_name.name,
        };
        handleUpdateTransaction(gridApi, res.data.updateCoursePrefix);
        setOpen(false);
        Alert.update({ title: 'Course Prefix', text: '' });
      }
    })
    .catch((err: AxiosError) => {
      setOpen(false);
      if (
        err.response?.data?.errorMessage === 'Course Prefix  already present'
      ) {
        Alert.already({ title: 'Course Prefix', text: '' });
      } else {
        Alert.updateError({ title: 'Course Prefix', text: '' });
      }
    });
};

const deleteCoursePrefixData = (
  data: CoursePrefix,
  gridApi: GridApi | undefined
) => {
  Alert.confirm(() => {
    return coursePrefixRoute
      .deleteCoursePrefix(data, data.id)
      .then((res: AxiosResponse) => {
        if (res?.data && gridApi) {
          handleDeleteTransaction(gridApi, res.data.data);
          if (gridApi && !gridApi.getDisplayedRowCount())
            gridApi.showNoRowsOverlay();
          Alert.delete({ title: 'Course Prefix', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.deleteError({ title: 'Course Prefix', text: '' });
      });
  });
};

const CoursePrefixSlice = createSlice({
  name: 'CoursePrefixSlice',
  initialState,
  reducers: {
    handleGetCoursePrefix: (state, action) => {
      state.coursrPrefixData = action.payload;
    },
    handleGetCoursePrefixName: (state, action) => {
      state.coursePrefixName = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

//reducers export  to pass action state to reducer type
export const {
  handleGetCoursePrefix,
  handleGetCoursePrefixName,
  handleLoading,
} = CoursePrefixSlice.actions;

//action to calls in ui with dispatch methods
export {
  getCoursePrefixData,
  addCoursePrefixData,
  editCoursePrefixData,
  deleteCoursePrefixData,
  getCoursePrefixDetailData,
  getCoursePrefixName,
  getSearchData,
};

export default CoursePrefixSlice.reducer;
