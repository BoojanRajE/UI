import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import {
  addCenter,
  deleteCenter,
  editCenter,
  //getCenter,e
  getCenterIdandName,
  getCenters,
  getSearchDataCenter,
} from '../route/centerRoute';
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
  request?: any;
  data: any;
  response?: AxiosResponse<T>;
  isAxiosError: boolean;
  toJSON: () => object;
}

const getSearchData =
  (data: string, params: any, setFlag: any) =>
  async (dispatch: AppDispatch) => {
    return getSearchDataCenter(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          try {
            const { records, totCount } = res?.data;

            params.success({
              rowData: records,
              // rowCount: totCount || 0,
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

// const addCenterAction =
//   (
//     data: any,
//     token?: string | undefined,
//     setAdd?: any | undefined,
//     gridApi?: GridApi | undefined | null,
//     setVal?: any
//   ) =>
//   async (dispatch: AppDispatch) => {
//     return addCenter(data, token)
//       .then((res: any) => {
//         let response_data = res?.data?.data;
//         if (response_data) {
//           if (token) {
//             dispatch(getCenterIdAndNameAction());
//             setAdd({
//               Department: false,
//               'College Or School': false,
//               'Administrative Office': false,
//               Center: false,
//               Program: false,
//             });
//             setVal((prev: any) => {
//
//               return {
//                 ...prev,
//                 ...{
//                   value: response_data.id,
//                   unitLabel: response_data.name || '',
//                 },
//               };
//             });
//           } else {
//             response_data = {
//               ...response_data,
//               sub_discipline_name: data.sub_discipline_name,
//               discipline_name: data.discipline_name,
//               organization_name: data.organization_name,
//             };

//             if (gridApi) handleAddTransaction(gridApi, response_data);
//             if (gridApi && gridApi.getDisplayedRowCount())
//               gridApi.hideOverlay();
//           }
//           Alert.add({ title: 'center', text: '' });
//         }
//         if (res?.data?.message === 'Center already exists') {
//           Alert.already({ title: 'center', text: '' });
//         }
//       })
//       .catch((err: AxiosError) => {
//         Alert.addError({ title: 'center', text: '' });
//       });
//   };
const addCenterAction =
  (
    data: any,
    token?: string | undefined,
    setAdd?: any | undefined,
    gridApi?: GridApi | undefined | null,
    setVal?: any
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await addCenter(data, token);
      const response_data = res?.data?.data;

      if (response_data) {
        if (token) {
          dispatch(getCenterIdAndNameAction());
          setAdd?.({
            Department: false,
            'College Or School': false,
            'Administrative Office': false,
            Center: false,
            Program: false,
          });
          setVal?.((prev: any) => ({
            ...prev,
            value: response_data.id,
            unitLabel: response_data.name || '',
          }));
        } else {
          const { sub_discipline_name, discipline_name, organization_name } =
            data;
          const updatedResponseData = {
            ...response_data,
            sub_discipline_name,
            discipline_name,
            organization_name,
          };

          setVal?.((prev: any) => ({
            ...prev,
            value: response_data.id,
            unitLabel: response_data.name || '',
          }));

          if (gridApi) handleAddTransaction(gridApi, updatedResponseData);
          if (gridApi?.getDisplayedRowCount()) gridApi.hideOverlay();
        }

        Alert.add({ title: 'center', text: '' });
      } else if (res?.data?.message === 'Center already exists') {
        Alert.already({ title: 'center', text: '' });
      }
    } catch (err) {
      Alert.addError({ title: 'center', text: '' });
    }
  };

const getCenterData = (data: PaginationProp, params: any) => async () => {
  return getCenters(data)
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

const getCenterIdAndNameAction = () => async (dispatch: AppDispatch) => {
  return getCenterIdandName()
    .then((res: any) => {
      if (res?.data) {
        const data = res.data.data;
        dispatch(handleIdAndName(data));
      }
    })
    .catch((err: AxiosError) => {
      throw err;
    });
};

const deleteCenterAction = (data: any, gridApi: GridApi | undefined) => {
  Alert.confirm(() => {
    return deleteCenter(data.id)
      .then((res: any) => {
        if (res?.data && gridApi) {
          handleDeleteTransaction(gridApi, res.data.data);
          if (gridApi && !gridApi.getDisplayedRowCount())
            gridApi.showNoRowsOverlay();
          Alert.delete({ title: 'center', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.deleteError({ title: 'center', text: '' });
      });
  });
};

const updateCenterAction = (
  data: any,
  setOpen: any,
  gridApi: GridApi | undefined
) => {
  return editCenter(data)
    .then((res: any) => {
      if (res?.data && gridApi) {
        if (res?.data?.message === 'Center already exists') {
          Alert.already({ title: 'center', text: '' });
        } else {
          res.data.data = {
            ...res.data.data,
            sub_discipline_name: data.sub_discipline_name,
            discipline_name: data.discipline_name,
            organization_name: data.organization_name,
          };

          handleUpdateTransaction(gridApi, res.data.data);
          setOpen(false);
          Alert.update({ title: 'center', text: '' });
        }
      }
    })
    .catch((err: AxiosError) => {
      Alert.updateError({ title: 'center', text: '' });
    });
};

const initialState = {
  getAllCenter: [],
  getAllIdAndName: [],
  // getAllSystemJobs: [],
  // loading: false,
};

const ManageCenterSlice = createSlice({
  name: 'ManageDisciplineSlice',
  initialState,
  reducers: {
    handleLoading: (state: any, action: any) => {
      state.loading = action.payload;
    },
    handleAllCenter: (state, action) => {
      state.getAllCenter = action.payload;
    },
    handleIdAndName: (state, action) => {
      state.getAllIdAndName = action.payload;
    },
  },
});

export const { handleAllCenter, handleIdAndName } = ManageCenterSlice.actions;

export {
  addCenterAction,
  getCenterData,
  deleteCenterAction,
  updateCenterAction,
  getCenterIdAndNameAction,
  getSearchData,
};
export default ManageCenterSlice.reducer;
