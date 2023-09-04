import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as metaDataRoute from '../route/metaDataRoute';

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
  race: [],
  gender: [],
  ethnicity: [],
  parent: [],
  first_time_course: [],
  countries: [],
  states: [],
  role_in_class: [],
  status_in_school: [],
  loading: false,
};

const getAllMetaDataByType =
  (data: any, setState?: any) => async (dispatch: AppDispatch) => {
    return metaDataRoute
      .getAllMetaDataByType(data)
      .then((res: AxiosResponse) => {
        if (data === 'gender') dispatch(handleGetGenderMetaData(res.data.data));
        if (data === 'race') dispatch(handleGetRaceMetaData(res.data.data));
        if (data === 'ethnicity')
          dispatch(handleGetEthnicityMetaData(res.data.data));
        if (data === 'parent') dispatch(handleGetParentMetaData(res.data.data));
        if (data === 'first_time_course')
          dispatch(handleGetFirstTimeCourseMetaData(res.data.data));

        if (data === 'states') dispatch(handleGetStatesMetaData(res.data.data));
        if (data === 'countries')
          dispatch(handleGetCountriesMetaData(res.data.data));
        if (data === 'role_in_class')
          dispatch(handleGetRoleInClassMetaData(res.data.data));
        if (data === 'status_in_school')
          dispatch(handleGetStatusInSchoolMetaData(res.data.data));
        if (setState) {
          setTimeout(() => setState(false), 300);
        }
      })
      .catch((err: AxiosError) => {});
  };

const metaDataSlice = createSlice({
  name: 'MetaDataSlice',
  initialState,
  reducers: {
    handleGetRaceMetaData: (state, action) => {
      state.race = action.payload;
    },
    handleGetGenderMetaData: (state, action) => {
      state.gender = action.payload;
    },
    handleGetEthnicityMetaData: (state, action) => {
      state.ethnicity = action.payload;
    },
    handleGetParentMetaData: (state, action) => {
      state.parent = action.payload;
    },
    handleGetFirstTimeCourseMetaData: (state, action) => {
      state.first_time_course = action.payload;
    },
    handleGetStatesMetaData: (state, action) => {
      state.states = action.payload;
    },
    handleGetCountriesMetaData: (state, action) => {
      state.countries = action.payload;
    },
    handleGetRoleInClassMetaData: (state, action) => {
      state.role_in_class = action.payload;
    },
    handleGetStatusInSchoolMetaData: (state, action) => {
      state.status_in_school = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

//reducers export to pass action state to reducer type
export const {
  handleLoading,
  handleGetGenderMetaData,
  handleGetEthnicityMetaData,
  handleGetRaceMetaData,
  handleGetParentMetaData,
  handleGetFirstTimeCourseMetaData,
  handleGetStatesMetaData,
  handleGetCountriesMetaData,
  handleGetRoleInClassMetaData,
  handleGetStatusInSchoolMetaData,
} = metaDataSlice.actions;

//action to calls in ui with dispatch methods
export { getAllMetaDataByType };

export default metaDataSlice.reducer;
