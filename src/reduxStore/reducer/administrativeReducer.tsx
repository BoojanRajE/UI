import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as administrativeRoute from '../route/administrativeRoute';
import { Administrative } from '../../pages/administrative/Administrative';
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
  administrativeData: [],
  administrativeName: [],
  loading: false,
};

const getSearchData =
  (data: string, params: any, setFlag?: any) =>
  async (dispatch: AppDispatch) => {
    return administrativeRoute
      .getSearchData(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          try {
            const { records, totCount } = res?.data;

            params.success({
              rowData: records,
            });
            if (!records?.length) {
              params.api.showNoRowsOverlay();
              setFlag(false);
            } else {
              params.api.hideOverlay();
              setFlag(true);
            }
          } catch (err) {}
        }
      })
      .catch((err: AxiosError) => {
        params.api.showNoRowsOverlay();
        params.fail();
      });
  };

const getAdministrativeData =
  (data: PaginationProp, params: any) => async () => {
    return administrativeRoute
      .getAdministratives(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          const { rows, totCount } = res?.data;

          return params.success({
            rowData: rows,
            rowCount: totCount || 0,
          });
        }
      })
      .catch((err: AxiosError) => params.fail());
  };

const getAdministrativeName = () => async (dispatch: AppDispatch) => {
  return administrativeRoute
    .getAdministrativeName()
    .then((res: AxiosResponse) => {
      dispatch(handleGetAdministrativeName(res.data.name));
    })
    .catch((err: AxiosError) => err);
};

const addAdministrativeData =
  (
    data: Administrative,
    setOpen: any,
    token: any,
    gridApi?: GridApi | undefined | null,
    setVal?: any
  ) =>
  async (dispatch: AppDispatch) => {
    return administrativeRoute
      .addAdministrative(data, token)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res.data.message === 'Administrative already exists') {
            Alert.already({ title: 'Administrative office', text: '' });
          } else {
            if (!token && gridApi) {
              res.data.administrative = {
                ...res.data.administrative,
                organization_name: data.organization_name.name,
              };
              if (gridApi)
                handleAddTransaction(gridApi, res.data.administrative);
              if (gridApi && gridApi.getDisplayedRowCount())
                gridApi.hideOverlay();
              setOpen(false);
            } else {
              dispatch(getAdministrativeName());
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
                    value: res.data.administrative.id,
                    unitLabel: res.data.administrative.name || '',
                  },
                };
              });
            }
            Alert.add({ title: 'Administrative office', text: '' });
          }
        }
      })
      .catch((err: AxiosError) => {
        setOpen(false);
        Alert.addError({ title: 'Administrative office', text: '' });
      });
  };

const editAdministrativeData = (
  data: Administrative,
  setOpen: any,
  gridApi: GridApi | undefined
) => {
  return administrativeRoute
    .editAdministrative(data, data?.id)
    .then((res: AxiosResponse) => {
      if (res?.data && gridApi) {
        if (res.data.message === 'Administrative already exists') {
          Alert.already({ title: 'Administrative office', text: '' });
        } else {
          res.data.updatedAdministrative = {
            ...res.data.updatedAdministrative,
            organization_name: data.organization_name.name,
          };
          handleUpdateTransaction(gridApi, res.data.updatedAdministrative);
          setOpen(false);
          Alert.update({ title: 'Administrative office', text: '' });
        }
      }
    })
    .catch((err: AxiosError) => {
      setOpen(false);
      Alert.updateError({ title: 'Administrative office', text: '' });
    });
};

const deleteAdministrativeData = (
  data: Administrative,
  gridApi: GridApi | undefined
) => {
  Alert.confirm(() => {
    return administrativeRoute
      .deleteAdministrative(data, data.id)
      .then((res: AxiosResponse) => {
        if (res?.data && gridApi) {
          handleDeleteTransaction(gridApi, res.data.data);
          if (gridApi && !gridApi.getDisplayedRowCount())
            gridApi.showNoRowsOverlay();
          Alert.delete({ title: 'Administrative office', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.deleteError({ title: 'Administrative office', text: '' });
      });
  });
};

const AdministrativeSlice = createSlice({
  name: 'AdministrativeSlice',
  initialState,
  reducers: {
    handleGetAdministrative: (state, action) => {
      state.administrativeData = action.payload;
    },
    handleGetAdministrativeName: (state, action) => {
      state.administrativeName = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

//reducers export  to pass action state to reducer type
export const {
  handleGetAdministrative,
  handleGetAdministrativeName,
  handleLoading,
} = AdministrativeSlice.actions;

//action to calls in ui with dispatch methods
export {
  getAdministrativeData,
  addAdministrativeData,
  editAdministrativeData,
  deleteAdministrativeData,
  getAdministrativeName,
  getSearchData,
};

export default AdministrativeSlice.reducer;
