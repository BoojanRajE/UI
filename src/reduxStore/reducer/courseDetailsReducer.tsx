import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as courseDetailsRoute from '../route/courseDetailsRoute';
import { CourseDetails } from '../../pages/courseDetails/CourseDetails';
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
  CourseDetailsData: [],
  CourseDetailsName: [],
  loading: false,
};

const getSearchData =
  (data: string, params: any, setFlag?: any) =>
  async (dispatch: AppDispatch) => {
    return courseDetailsRoute
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

const getCourseDetailsDetail =
  (id: string, setInitialValue: any) => async (dispatch: AppDispatch) => {
    return courseDetailsRoute
      .getCourseDetail(id)
      .then((res: AxiosResponse) => {
        if (res?.data) {
        }
      })
      .catch((err: AxiosError) => err);
  };

const getCourseDetailsName =
  (organization_id = undefined, setCourseField?: any) =>
  async (dispatch: AppDispatch) => {
    const queryParams = {
      // coursePrefix_id: coursePrefix_id,
      organization_id: organization_id,
    };
    return courseDetailsRoute
      .getCourseDetailsName(queryParams)
      .then((res: AxiosResponse) => {
        dispatch(handleGetCourseDetailsName(res.data.records));
      })
      .catch((err: AxiosError) => err)
      .finally(() => {
        if (setCourseField) setCourseField(true);
      });
  };

const getCourseDetailsData =
  (data: PaginationProp, params: any) => async () => {
    return courseDetailsRoute
      .getCourseDetails(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          const { records, totCount } = res?.data;
          if (!records?.length) {
            params.api.showNoRowsOverlay();
          } else params.api.hideOverlay();

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

const addCourseDetailsData =
  (
    data: CourseDetails,
    setOpen: any,
    token: string | undefined,
    callback?: any,
    gridApi?: GridApi | undefined
  ) =>
  async (dispatch: AppDispatch) => {
    const formState = { ...data };
    return courseDetailsRoute
      .addCourseDetails(formState, token)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          setOpen(false);
          dispatch(
            getCourseDetailsName(
              // res.data.courseDetails.course_prefix_id,
              res.data.courseDetails.organization_id
            )
          );
          Alert.add({ title: 'course details', text: '' });
          if (callback) {
            callback(res.data.courseDetails);
          }
        }
      })
      .catch((err: AxiosError) => {
        setOpen(false);
        if (
          err.response?.data?.errorMessage === 'Course Details already present'
        ) {
          Alert.already({ title: 'course details', text: '' });
        } else {
          Alert.addError({ title: 'course details', text: '' });
        }
      });
  };

const editCourseDetailsData = (
  data: CourseDetails,
  setOpen: any,
  gridApi?: GridApi | undefined
) => {
  const formState = { ...data };
  formState['organization_name'] = data.organization_name.id;
  formState['course_prefix_name'] = data.course_prefix_name.id;
  // formState["sub_course_prefix_name"] = data.sub_course_prefix_name.id;
  return courseDetailsRoute
    .editCourseDetails(formState, data.id)
    .then((res: AxiosResponse) => {
      if (res?.data && gridApi) {
        res.data.updatedCourseDetails = {
          ...res.data.updatedCourseDetails,
          organization_name: data.organization_name.name,
          course_prefix_name: data.course_prefix_name.name,
        };
        handleUpdateTransaction(gridApi, res.data.updatedCourseDetails);

        setOpen(false);
        Alert.update({ title: 'course details', text: '' });
      }
    })
    .catch((err: AxiosError) => {
      setOpen(false);
      if (
        err.response?.data?.errorMessage === 'Course Details already present'
      ) {
        Alert.already({ title: 'course details', text: '' });
      } else {
        Alert.updateError({ title: 'course details', text: '' });
      }
    });
};

const deleteCourseDetailsData = (
  data: CourseDetails,
  gridApi: GridApi | undefined
) => {
  Alert.confirm(() => {
    return courseDetailsRoute
      .deleteCourseDetails(data, data.id)
      .then((res: AxiosResponse) => {
        if (res?.data && gridApi) {
          handleDeleteTransaction(gridApi, res.data.data);
          if (gridApi && !gridApi.getDisplayedRowCount())
            gridApi.showNoRowsOverlay();
          Alert.delete({ title: 'course details', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.deleteError({ title: 'course details', text: '' });
      });
  });
};

const CourseDetailsSlice = createSlice({
  name: 'CourseDetailsSlice',
  initialState,
  reducers: {
    handleGetCourseDetails: (state, action) => {
      state.CourseDetailsData = action.payload;
    },
    handleGetCourseDetailsName: (state, action) => {
      state.CourseDetailsName = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

//reducers export  to pass action state to reducer type
export const {
  handleGetCourseDetails,
  handleGetCourseDetailsName,
  handleLoading,
} = CourseDetailsSlice.actions;

//action to calls in ui with dispatch methods
export {
  getCourseDetailsData,
  addCourseDetailsData,
  editCourseDetailsData,
  deleteCourseDetailsData,
  getCourseDetailsName,
  getSearchData,
  getCourseDetailsDetail,
};

export default CourseDetailsSlice.reducer;
