import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as programRoute from '../route/programRoute';
import { Program } from '../../pages/program/Program';
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
  programData: [],
  programName: [],
  loading: false,
};

const getSearchData =
  (data: string, params: any, setFlag?: any) =>
  async (dispatch: AppDispatch) => {
    return programRoute
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

const getProgramData = (data: PaginationProp, params: any) => async () => {
  return programRoute
    .getPrograms(data)
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

const getProgramName = () => async (dispatch: AppDispatch) => {
  return programRoute
    .getProgramsName()
    .then((res: AxiosResponse) => {
      if (res?.data) {
        dispatch(handleGetProgramName(res.data.data));
      } else dispatch(handleGetProgramName([]));
    })
    .catch((err: AxiosError) => err);
};

const addProgramData =
  (
    data: Program,
    setOpen: any,
    token: any,
    gridApi?: GridApi | undefined | null,
    setVal?: any
  ) =>
  async (dispatch: AppDispatch) => {
    return programRoute
      .addProgram(data, token)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res.data.message === 'Program already exists') {
            Alert.already({ title: 'program', text: '' });
          } else {
            if (!token && gridApi) {
              res.data.program = {
                ...res.data.program,
                organization_name: data.organization_name.name,
              };
              handleAddTransaction(gridApi, res.data.program);
              if (gridApi && gridApi.getDisplayedRowCount())
                gridApi.hideOverlay();
              setOpen(false);
            } else {
              dispatch(getProgramName());
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
                    value: res.data.program.id,
                    unitLabel: res.data.program.name || '',
                  },
                };
              });
            }
            Alert.add({ title: 'program', text: '' });
          }
        }
      })
      .catch((err: AxiosError) => {
        setOpen(false);
        Alert.addError({ title: 'program', text: '' });
      });
  };

const editProgramData = (
  data: Program,
  setOpen: any,
  gridApi: GridApi | undefined,
  close: any
) => {
  return programRoute
    .editProgram(data, data?.id)
    .then((res: AxiosResponse) => {
      if (res?.data && gridApi) {
        if (res.data.message === 'Program already exists') {
          Alert.already({ title: 'program', text: '' });
        } else {
          res.data.updatedProgram = {
            ...res.data.updatedProgram,
            organization_name: data.organization_name.name,
          };
          handleUpdateTransaction(gridApi, res.data.updatedProgram);
          setOpen(false);
          close();
          Alert.update({ title: 'program', text: '' });
        }
      }
    })
    .catch((err: AxiosError) => {
      setOpen(false);
      Alert.updateError({ title: 'program', text: '' });
    });
};
const deleteProgramData = (data: Program, gridApi: GridApi | undefined) => {
  Alert.confirm(async () => {
    return programRoute
      .deleteProgram(data, data.id)
      .then((res: AxiosResponse) => {
        if (res?.data && gridApi) {
          handleDeleteTransaction(gridApi, res.data.data);
          if (gridApi && !gridApi.getDisplayedRowCount())
            gridApi.showNoRowsOverlay();
          Alert.delete({ title: 'program', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.deleteError({ title: 'department', text: '' });
      });
  });
};

const ProgramSlice = createSlice({
  name: 'ProgramSlice',
  initialState,
  reducers: {
    handleGetProgram: (state, action) => {
      state.programData = action.payload;
    },
    handleGetProgramName: (state, action) => {
      state.programName = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

//reducers export  to pass action state to reducer type
export const { handleGetProgram, handleLoading, handleGetProgramName } =
  ProgramSlice.actions;

//action to calls in ui with dispatch methods
export {
  getProgramData,
  addProgramData,
  editProgramData,
  deleteProgramData,
  getProgramName,
  getSearchData,
};

export default ProgramSlice.reducer;
