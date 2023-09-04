import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import * as disciplineRoute from '../route/disciplineRoute';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
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
  request?: any;
  data: any;
  response?: AxiosResponse<T>;
  isAxiosError: boolean;
  toJSON: () => object;
}
const addDisciplineAction = (data: any, gridApi: GridApi | undefined) => {
  return disciplineRoute
    .addDiscipline(data)
    .then((res: any) => {
      const response_data = res?.data?.data;
      if (res && gridApi) {
        if (res.data.message == 'Discipline already exists') {
          Alert.already({ title: 'discipline', text: '' });
        } else {
          Alert.add({ title: 'discipline', text: '' });
          handleAddTransaction(gridApi, res.data.data);
          if (gridApi && gridApi.getDisplayedRowCount()) gridApi.hideOverlay();
        }
      }
    })
    .catch((err: AxiosError) => {
      Alert.addError({ title: 'discipline', text: '' });
    });
};
const getDiscipline = (data: PaginationProp, params: any) => {
  // if(gridRef)  isGridLoading(true, gridRef)
  return disciplineRoute
    .getAllDiscipline(data)
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
          } else {
            params.api.hideOverlay();
          }
        } catch (err) {
          // params.api.hideOverlay();
        }
      }
    })
    .catch((err: AxiosError) => {
      params.api.showNoRowsOverlay();
      params.fail();
    });
};

const getSearchData =
  (data: string, params: any, setFlag?: any) =>
  async (dispatch: AppDispatch) => {
    return disciplineRoute
      .getSearchData(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          const { records, totCount } = res?.data;

          return (
            params &&
            params.success({
              rowData: [
                {
                  name: 'Support',
                  created_by: '55aa1e5e-c131-4b10-8c8b-5ba55eb5973f',
                  created_at: '2023-01-31T03:35:39.004Z',
                },
              ],
              rowCount: totCount || 0,
            })
          );
        }
      })
      .catch((err: AxiosError) => {
        params.fail();
      });
  };

// const getDiscipline = ( gridRef?:any) => async (dispatch: any) => {
//   if(gridRef)  isGridLoading(true, gridRef)
//   return disciplineRoute
//     .getAllDiscipline()
//     .then((res: AxiosResponse) => {
//       if (res?.data?.data && res?.data?.data?.length) {
//         if(gridRef)  isGridLoading(true, gridRef)
//         dispatch(handleAllDiscipline(res?.data?.data));
//       } else {
//       }
//     })
//     .catch((err: AxiosError) => {
//
//       isGridLoading(false ,gridRef)
//     })
//     .finally(() => {
//       isGridLoading(false ,gridRef)
//     });
// };
const getDisciplineDetails = () => async (dispatch: any) => {
  return disciplineRoute
    .getDisciplineDetails()
    .then((res: AxiosResponse) => {
      if (res?.data?.data && res?.data?.data?.length) {
        dispatch(handleDisciplineDetails(res?.data?.data));
      } else {
      }
    })
    .catch((err: AxiosError) => {})
    .finally(() => {});
};

const ediDisciplineData = (
  data: any,
  gridApi: GridApi | undefined,
  callback?: any
) => {
  return disciplineRoute
    .editDiscipline(data)
    .then((res: AxiosResponse) => {
      const response_data = res?.data?.data;
      if (res && gridApi) {
        if (res.data.message == 'Discipline already exists') {
          Alert.already({ title: 'discipline', text: '' });
        } else {
          Alert.update({ title: 'discipline', text: '' });
          handleUpdateTransaction(gridApi, response_data);
          if (callback) {
            callback('update', response_data);
          }
        }
      }
    })
    .catch((err: AxiosError) => {
      Alert.updateError({ title: 'discipline', text: '' });
    });
};

const deleteDisciplineData = (data: any, gridApi: GridApi | undefined) => {
  Alert.confirm(async () => {
    return disciplineRoute
      .deleteAllDiscipline(data)
      .then((res: any) => {
        if (res?.data && gridApi) {
          handleDeleteTransaction(gridApi, res.data.data);
          if (gridApi && !gridApi.getDisplayedRowCount())
            gridApi.showNoRowsOverlay();
          Alert.delete({ title: 'discipline', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.deleteError({ title: 'discipline', text: '' });
      });
  });
};

const initialState = {
  getAllDiscipline: [],
  getDisciplineDetails: [],
  // getAllSystemJobs: [],
  // loading: false,
};
const ManageDisciplineSlice = createSlice({
  name: 'ManageDisciplineSlice',
  initialState,
  reducers: {
    handleLoading: (state: any, action: any) => {
      state.loading = action.payload;
    },
    handleAllDiscipline: (state, action) => {
      state.getAllDiscipline = action.payload;
    },
    handleDisciplineDetails: (state, action) => {
      state.getDisciplineDetails = action.payload;
    },
    handleEditDiscipline: (state: any, action: any) => {
      state.getAllDiscipline = [...state.getAllDiscipline, action.payload];
    },
  },
});
export const {
  handleAllDiscipline,
  handleEditDiscipline,
  handleDisciplineDetails,
} = ManageDisciplineSlice.actions;
export {
  addDisciplineAction,
  getDiscipline,
  deleteDisciplineData,
  ediDisciplineData,
  getDisciplineDetails,
  getSearchData,
};
export default ManageDisciplineSlice.reducer;
