import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse } from 'axios';
import {
  addSubDiscipline,
  deleteSubDiscipline,
  editSubDiscipline,
  getSearchDataSubDiscipline,
  getSubdiscipline,
  getSubDisciplineDetail,
} from '../route/subDisciplineRoute';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import { GridApi } from 'ag-grid-community';
import {
  handleAddTransaction,
  handleDeleteTransaction,
  handleUpdateTransaction,
} from '../../utils/gridMethod/GridTransaction';
import Alert from '../../utils/Alert/Alert';

export interface AxiosError<T = any> extends Error {
  data: any;
  response: any;
  isAxiosError: boolean;
  toJSON: () => object;
}

const addSubDisciplineAction = (
  data: any,
  setOpen: any,
  gridApi: GridApi | undefined,
  setInputForm: any,
  setAutoComplete: any
) => {
  return addSubDiscipline(data)
    .then((res: any) => {
      let response_data = res?.data?.data;
      if (res && gridApi) {
        if (res.data.message == 'Sub Discipline already exists') {
          Alert.already({ title: 'sub discipline', text: '' });
        } else {
          response_data = {
            ...response_data,
            discipline_name: data.discipline_name,
            discipline_id: data.discipline_id,
          };
          handleAddTransaction(gridApi, response_data);
          if (gridApi && gridApi.getDisplayedRowCount()) gridApi.hideOverlay();
          setOpen(false);
          setInputForm({
            discipline_id: '',
            name: '',
          });
          setAutoComplete({
            value: {},
            input: '',
          });
          Alert.add({ title: 'sub discipline', text: '' });
        }
      }
    })
    .catch((err: AxiosError) => {
      Alert.addError({ title: 'sub discipline', text: '' });
    });
};

const getSubDisciplineData =
  (data: PaginationProp, params: any) => async () => {
    return getSubdiscipline(data)
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

const getSearchData =
  (data: string, params: any, setFlag?: any) =>
  async (dispatch: AppDispatch) => {
    return getSearchDataSubDiscipline(data)
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

const getSubDisciplineDetailAction = () => async (dispatch: AppDispatch) => {
  return getSubDisciplineDetail()
    .then((res: any) => {
      if (res?.data) {
        const data = res.data.data;
        dispatch(handleAllSubDisciplineDetail(data));
      }
    })
    .catch((err: AxiosError) => {
      throw err;
    });
};

const deleteSubDisciplineData = (data: any, gridApi: GridApi | undefined) => {
  Alert.confirm(async () => {
    return deleteSubDiscipline(data.id)
      .then((res: any) => {
        if (res?.data && gridApi) {
          Alert.delete({ title: 'sub discipline', text: '' });
          handleDeleteTransaction(gridApi, res.data.data);
          if (gridApi && !gridApi.getDisplayedRowCount())
            gridApi.showNoRowsOverlay();
        }
      })
      .catch((err: AxiosError) => {
        Alert.deleteError({ title: 'sub discipline', text: '' });
      });
  });
};

const updateSubDisciplineAction = (
  data: any,
  setOpen: any,
  gridApi: GridApi | undefined,
  setInputForm: any,
  setAutoComplete: any
) => {
  return editSubDiscipline(data)
    .then((res: any) => {
      if (res?.data && gridApi) {
        if (res.data.message == 'Sub Discipline already exists') {
          Alert.already({ title: 'sub discipline', text: '' });
        } else {
          setOpen(false);
          setInputForm({
            discipline_id: '',
            name: '',
          });
          setAutoComplete({
            value: {},
            input: '',
          });
          Alert.update({ title: 'sub discipline', text: '' });

          res.data.data = {
            ...res.data.data,
            discipline_name: data.discipline_name,
            discipline_id: data.discipline_id,
          };

          handleUpdateTransaction(gridApi, res.data.data);
        }
      }
    })
    .catch((err: AxiosError) => {
      Alert.updateError({ title: 'sub discipline', text: '' });
    });
};

const initialState = {
  getAllSubDiscipline: [],
  getAllSubDisciplineDetail: [],
};

const ManageSubDisciplineSlice = createSlice({
  name: 'ManageDisciplineSlice',
  initialState,
  reducers: {
    handleLoading: (state: any, action: any) => {
      state.loading = action.payload;
    },
    handleAllSubDiscipline: (state, action) => {
      state.getAllSubDiscipline = action.payload;
    },
    handleAllSubDisciplineDetail: (state, action) => {
      state.getAllSubDisciplineDetail = action.payload;
    },
  },
});

export const { handleAllSubDiscipline, handleAllSubDisciplineDetail } =
  ManageSubDisciplineSlice.actions;

export {
  addSubDisciplineAction,
  getSubDisciplineData,
  deleteSubDisciplineData,
  updateSubDisciplineAction,
  getSubDisciplineDetailAction,
  getSearchData,
};
export default ManageSubDisciplineSlice.reducer;
