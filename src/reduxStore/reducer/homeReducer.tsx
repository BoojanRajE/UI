import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as homeRoute from '../route/homeRoute';

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
  data: [],
  loading: false,
};

const getBatchData = () => async (dispatch: AppDispatch) => {
  return homeRoute
    .getData()
    .then((res: AxiosResponse) => {
      if (res?.data) dispatch(handleGetData(res.data));
      else dispatch(handleGetData([]));
    })
    .catch((err: AxiosError) => {})
    .finally();
};

const HomeSlice = createSlice({
  name: 'HomeSlice',
  initialState,
  reducers: {
    handleGetData: (state, action) => {
      state.data = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
//reducers export  to pass action state to reducer type
export const { handleGetData, handleLoading } = HomeSlice.actions;

//action to calls in ui with dispatch methods
export { getBatchData };
export default HomeSlice.reducer;
