import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as unitrolesRoute from '../route/unitrolesRoute';
import { NavigateFunction } from 'react-router-dom';
import { Unitroles } from '../../pages/unitroles/Unitroles';
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
  unitrolesData: [],
  unitrolesName: [],
  loading: false,
};

const getSearchData =
  (data: string, params: any, setFlag?: any) =>
  async (dispatch: AppDispatch) => {
    return unitrolesRoute
      .getSearchData(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          try {
            const { records, totCount } = res?.data;
            if (!records?.length) {
              params.api.showNoRowsOverlay();
              setFlag(false);
            } else {
              params.api.hideOverlay();
              setFlag(true);
            }

            params.success({
              rowData: records,
            });
            if (!records?.length) {
              params.api.showNoRowsOverlay();
            } else {
              params.api.hideOverlay();
            }
          } catch (err) {}
        }
      })
      .catch((err: AxiosError) => {
        params.fail();
      });
  };

const getUnitrolesData = (data: PaginationProp, params: any) => async () => {
  return unitrolesRoute
    .getUnitroles(data)
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

const getUnitrolesName = (setState?: any) => async (dispatch: AppDispatch) => {
  return unitrolesRoute
    .getUnitrolesName()
    .then((res: AxiosResponse) => {
      if (res?.data) {
        dispatch(handleGetUnitrolesName(res.data.name));
      } else dispatch(handleGetUnitrolesName([]));
      setTimeout(() => setState(false), 300);
    })
    .catch((err: AxiosError) => err);
};

const addUnitrolesData = (
  data: Unitroles,
  setOpen: any,
  gridApi: GridApi | undefined
) => {
  return unitrolesRoute
    .addUnitroles(data)
    .then((res: AxiosResponse) => {
      if (res?.data && gridApi) {
        if (res.data.message === 'Role already exists') {
          Alert.already({ title: 'unit role', text: '' });
        } else {
          handleAddTransaction(gridApi, res.data.unitroles);
          if (gridApi && gridApi.getDisplayedRowCount()) gridApi.hideOverlay();
          setOpen(false);
          Alert.add({ title: 'unit role', text: '' });
        }
      }
    })
    .catch((err: AxiosError) => {
      setOpen(false);
      Alert.addError({ title: 'unit role', text: '' });
    });
};

const editUnitrolesData = (
  data: Unitroles,
  setOpen: any,
  gridApi: GridApi | undefined
) => {
  return unitrolesRoute
    .editUnitroles(data, data?.id)
    .then((res: AxiosResponse) => {
      if (res?.data && gridApi) {
        if (res.data.message === 'Role already exists') {
          Alert.already({ title: 'unit role', text: '' });
        } else {
          handleUpdateTransaction(gridApi, res.data.updatedUnitroles);
          setOpen(false);
          Alert.update({ title: 'unit role', text: '' });
        }
      }
    })
    .catch((err: AxiosError) => {
      setOpen(false);
      Alert.updateError({ title: 'unit role', text: '' });
    });
};

const deleteUnitrolesData = (data: Unitroles, gridApi: GridApi | undefined) => {
  Alert.confirm(() => {
    return unitrolesRoute
      .deleteUnitroles(data, data.id)
      .then((res: AxiosResponse) => {
        if (res?.data && gridApi) {
          handleDeleteTransaction(gridApi, res.data.data);
          if (gridApi && !gridApi.getDisplayedRowCount())
            gridApi.showNoRowsOverlay();
          Alert.delete({ title: 'unit role', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.deleteError({ title: 'unit role', text: '' });
      });
  });
};

const UnitrolesSlice = createSlice({
  name: 'UnitrolesSlice',
  initialState,
  reducers: {
    handleGetUnitroles: (state, action) => {
      state.unitrolesData = action.payload;
    },
    handleGetUnitrolesName: (state, action) => {
      state.unitrolesName = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

//reducers export  to pass action state to reducer type
export const { handleGetUnitroles, handleLoading, handleGetUnitrolesName } =
  UnitrolesSlice.actions;

//action to calls in ui with dispatch methods
export {
  getUnitrolesData,
  addUnitrolesData,
  editUnitrolesData,
  deleteUnitrolesData,
  getSearchData,
  getUnitrolesName,
};

export default UnitrolesSlice.reducer;
