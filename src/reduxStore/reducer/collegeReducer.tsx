import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as collegeRoute from '../route/collegeRoutes';
import { CollegeType } from '../../pages/college/CollegeType';
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
  collegeData: [],
  collegeName: [],
  loading: false,
};

const getSearchData =
  (data: string, params: any, setFlag?: any) => async () => {
    return collegeRoute
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

const getCollegeName = () => async (dispatch: AppDispatch) => {
  return collegeRoute
    .getCollegeName()
    .then((res: AxiosResponse) => {
      dispatch(handleGetCollegeName(res.data.records));
    })
    .catch((err: AxiosError) => err);
};

const getCollegeDetail = (
  id: string,
  setOpen: any,
  setInitialValue: any,
  setIsEdit: any
) => {
  return collegeRoute
    .getCollege(id)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        setInitialValue(res.data.record);
        setIsEdit(true);
        setOpen(true);
      }
    })
    .catch((err: AxiosError) => err);
};

const getCollegeData = (data: PaginationProp, params: any) => async () => {
  return collegeRoute
    .getColleges(data)
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

const addCollegeData =
  (
    data: CollegeType,
    setOpen: any,
    token: any,
    gridApi?: any | undefined | null,
    setVal?: any
  ) =>
  async (dispatch: AppDispatch) => {
    return collegeRoute
      .addCollege(data, token)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res.data.message === 'College already exists') {
            Alert.already({ title: 'college', text: '' });
          } else {
            if (!token && gridApi) {
              res.data.college = {
                ...res.data.college,
                organization_name: data.organization_name.name,
              };
              handleAddTransaction(gridApi, res.data.college);
              if (gridApi && gridApi.getDisplayedRowCount())
                gridApi.hideOverlay();
              setOpen(false);
            } else {
              dispatch(getCollegeName());
              setOpen({
                Department: false,
                'College Or School': false,
                'Administrative Office': false,
                Center: false,
                Program: false,
              });
              setVal((prev: any) => {
                return {
                  ...prev,
                  ...{
                    value: res.data.college.id,
                    unitLabel: res.data.college.name || '',
                  },
                };
              });
            }
            Alert.add({ title: 'college', text: '' });
          }
        }
      })
      .catch((err: AxiosError) => {
        setOpen(false);
        Alert.error({ title: 'college', text: '' });
      });
  };

const editCollegeData = (
  data: CollegeType,
  setOpen: any,
  gridApi: GridApi | undefined
) => {
  return collegeRoute
    .editCollege(data, data?.id)
    .then((res: AxiosResponse) => {
      if (res?.data && gridApi) {
        if (res.data.message === 'College already exists') {
          Alert.already({ title: 'college', text: '' });
        } else {
          res.data.updatedCollege = {
            ...res.data.updatedCollege,
            organization_name: data.organization_name.name,
          };
          handleUpdateTransaction(gridApi, res.data.updatedCollege);
          setOpen(false);
          Alert.update({ title: 'college', text: '' });
        }
      }
    })
    .catch((err: AxiosError) => {
      setOpen(false);
      Alert.updateError({ title: 'college', text: '' });
    });
};

const deleteCollegeData = (data: CollegeType, gridApi: GridApi | undefined) => {
  Alert.confirm(() => {
    return collegeRoute
      .deleteCollege(data, data.id)
      .then((res: AxiosResponse) => {
        if (res?.data && gridApi) {
          handleDeleteTransaction(gridApi, res.data.data);
          if (gridApi && !gridApi.getDisplayedRowCount())
            gridApi.showNoRowsOverlay();
          Alert.delete({ title: 'college', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.deleteError({ title: 'college', text: '' });
      });
  });
};

const CollegeSlice = createSlice({
  name: 'CollegeSlice',
  initialState,
  reducers: {
    handleGetCollege: (state, action) => {
      state.collegeData = action.payload;
    },
    handleGetCollegeName: (state, action) => {
      state.collegeName = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

//reducers export  to pass action state to reducer type
export const { handleGetCollege, handleLoading, handleGetCollegeName } =
  CollegeSlice.actions;

//action to calls in ui with dispatch methods
export {
  getCollegeData,
  addCollegeData,
  editCollegeData,
  deleteCollegeData,
  getSearchData,
  getCollegeName,
  getCollegeDetail,
};

export default CollegeSlice.reducer;
