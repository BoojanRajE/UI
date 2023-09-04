import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as DepartmentRoute from '../route/departmentRoute';
import { Department } from '../../pages/department/Department';
import { NavigateFunction } from 'react-router-dom';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import {
  handleAddTransaction,
  handleDeleteTransaction,
  handleUpdateTransaction,
} from '../../utils/gridMethod/GridTransaction';
import { GridApi } from 'ag-grid-community';
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
  departmentData: [],
  departmentName: [],
  loading: false,
};

const getSearchData =
  (data: string, params: any, setFlag?: any) =>
  async (dispatch: AppDispatch) => {
    return DepartmentRoute.getSearchData(data)
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

const getDepartmentDetail = (
  id: string,
  setOpen: any,
  setInitialValue: any,
  setIsEdit: any
) => {
  return DepartmentRoute.getDepartment(id)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        if (!res.data.record.sub_discipline_name?.id)
          res.data.record.sub_discipline_name = null;
        setInitialValue(res.data.record);
        setIsEdit(true);
        setOpen(true);
      }
    })
    .catch((err: AxiosError) => err);
};

const getDepartmentName = () => async (dispatch: AppDispatch) => {
  return DepartmentRoute.getDepartmentName()
    .then((res: AxiosResponse) => {
      dispatch(handleGetDepartmentName(res.data.records));
    })
    .catch((err: AxiosError) => err);
};

const getDepartmentData = (data: PaginationProp, params: any) => async () => {
  return DepartmentRoute.getDepartments(data)
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

const addDepartmentData =
  (
    data: any,
    // dataSource: any,
    // params: any,
    setOpen: any,
    token: string | undefined,
    gridApi?: GridApi | undefined | null,
    setVal?: any
  ) =>
  async (dispatch: AppDispatch) => {
    const formState = { ...data };
    formState['organization_name'] = data.organization_name.id;
    formState['discipline_name'] = data.discipline_name.id;
    formState['sub_discipline_name'] = data.sub_discipline_name?.id;
    return DepartmentRoute.addDepartment(formState, token)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res.data.message === 'Department already exists') {
            Alert.already({ title: 'department', text: '' });
          } else {
            if (!token && gridApi) {
              res.data.department = {
                ...res.data.department,
                organization_name: data.organization_name.name,
                discipline_name: data.discipline_name.name,
                sub_discipline_name: data.sub_discipline_name.name,
              };
              // dispatch(getDepartmentData(dataSource, params));
              if (gridApi) handleAddTransaction(gridApi, res.data.department);

              if (gridApi && gridApi.getDisplayedRowCount())
                gridApi.hideOverlay();

              setOpen(false);
            } else {
              dispatch(getDepartmentName());
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
                    value: res.data.department.id,
                    unitLabel: res.data.department.name || '',
                  },
                };
              });
            }
            Alert.add({ title: 'department', text: '' });
          }
        }
      })
      .catch((err: AxiosError) => {
        setOpen(false);
        Alert.error({ title: 'department', text: '' });
      });
  };

const editDepartmentData = (
  data: any,
  setOpen: any,
  gridApi: GridApi | undefined
) => {
  const formState = { ...data };
  formState['organization_name'] = data.organization_name.id;
  formState['discipline_name'] = data.discipline_name.id;
  formState['sub_discipline_name'] = data?.sub_discipline_name?.id;
  return DepartmentRoute.editDepartment(formState, data.id)
    .then((res: AxiosResponse) => {
      if (res?.data && gridApi) {
        if (res.data.message === 'Department already exists') {
          Alert.already({ title: 'department', text: '' });
        } else {
          res.data.updatedDepartment = {
            ...res.data.updatedDepartment,
            organization_name: data.organization_name.name,
            discipline_name: data.discipline_name.name,
            sub_discipline_name: data?.sub_discipline_name?.name,
          };
          setOpen(false);
          handleUpdateTransaction(gridApi, res.data.updatedDepartment);
          Alert.update({ title: 'department', text: '' });
        }
      }
    })
    .catch((err: AxiosError) => {
      setOpen(false);
      Alert.updateError({ title: 'department', text: '' });
    });
};

const deleteDepartmentData = (
  data: Department,
  gridApi: GridApi | undefined
) => {
  Alert.confirm(() => {
    return DepartmentRoute.deleteDepartment(data, data.id)
      .then((res: AxiosResponse) => {
        if (res?.data && gridApi) {
          handleDeleteTransaction(gridApi, res.data.data);

          if (gridApi && !gridApi.getDisplayedRowCount())
            gridApi.showNoRowsOverlay();

          Alert.delete({ title: 'department', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.deleteError({ title: 'department', text: '' });
      });
  });
};

const DepartmentSlice = createSlice({
  name: 'DepartmentSlice',
  initialState,
  reducers: {
    handleGetDepartment: (state, action) => {
      state.departmentData = action.payload;
    },
    handleGetDepartmentName: (state, action) => {
      state.departmentName = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

//reducers export  to pass action state to reducer type
export const { handleGetDepartment, handleGetDepartmentName, handleLoading } =
  DepartmentSlice.actions;

//action to calls in ui with dispatch methods
export {
  getDepartmentData,
  addDepartmentData,
  editDepartmentData,
  deleteDepartmentData,
  getDepartmentName,
  getSearchData,
  getDepartmentDetail,
};

export default DepartmentSlice.reducer;
