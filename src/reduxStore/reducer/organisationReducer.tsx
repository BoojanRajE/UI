import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as organisationRoute from '../route/organisationRoute';
import { Organization } from '../../pages/organisation/OrganizationForm';
import { NavigateFunction } from 'react-router-dom';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import { GridApi } from 'ag-grid-community';
import api from '../route';
import Organisation from '../../pages/organisation/Organisation';
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
  organizationData: [],
  organizationName: [],
  loading: false,
};
const getSearchData =
  (data: string, params: any, setFlag?: any) => async () => {
    return organisationRoute
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
          params.success({
            rowData: records,
            rowCount: totCount || 0,
          });
        }
      })
      .catch((err: AxiosError) => {
        params.fail();
      });
  };

const getOrganizationName = () => async (dispatch: AppDispatch) => {
  return organisationRoute
    .getOrganizationName()
    .then((res: AxiosResponse) => {
      dispatch(handleGetOrganisationName(res.data.records));
    })
    .catch((err: AxiosError) => err);
};

const getOrganisationData = (data: PaginationProp, params: any) => async () => {
  return organisationRoute
    .getOrganisations(data)
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
      params.api.showNoRowsOverlay();
    });
};
const getOrganisationDetail = (
  id: string,
  setOpenOrg: any,
  setInitialValue: any,
  setIsEdit: any
) => {
  return organisationRoute
    .getOrganisation(id)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        setOpenOrg(true);
        setInitialValue(...res.data.record);
        setIsEdit(true);
      }
    })
    .catch((err: AxiosError) => err);
};

const addOrganisationData =
  (
    data: Organization,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    gridApi: GridApi | undefined,
    handleAddTransaction: (gridApi: GridApi, newData: any) => void
  ) =>
  async (dispatch: AppDispatch) => {
    return organisationRoute
      .addOrganisation(data)
      .then((res: AxiosResponse) => {
        setOpen(false);
        if (res?.data && gridApi) {
          if (res.data.message === 'Organization already exists') {
            Alert.already({ title: 'organization', text: '' });
          } else {
            handleAddTransaction(gridApi, res.data.addedOrganization);
            if (gridApi && gridApi.getDisplayedRowCount())
              gridApi.hideOverlay();
            dispatch(getOrganizationName());
            Alert.add({ title: 'organization', text: '' });
          }
        }
      })
      .catch((err: AxiosError) => {
        setOpen(false);
        Alert.addError({ title: 'organization', text: '' });
      });
  };
const addOrganisationDataSignup =
  (
    data: Organization,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    gridApi: GridApi | undefined,
    handleAddTransaction: (gridApi: GridApi, newData: any) => void,
    setOrganizationState?: any,
    organization?: any,
    organizationLabel?: any
  ) =>
  async (dispatch: AppDispatch) => {
    return organisationRoute
      .addOrganisationSignUp(data)
      .then((res: AxiosResponse) => {
        setOpen(false);
        if (res?.data) {
          if (res.data.message === 'Organization already exists') {
            Alert.already({ title: 'organization', text: '' });
          } else {
            dispatch(getOrganizationName());
            if (organization && organizationLabel && setOrganizationState) {
              organization.value = res.data.addedOrganization.id;
              organizationLabel.value = res.data.addedOrganization.name;

              setOrganizationState((prev: any) => {
                return {
                  ...prev,
                  ...{
                    value: res.data.addedOrganization.id,
                    label: res.data.addedOrganization.name || '',
                  },
                };
              });
            }
            // Swal.fire("New organization added", "", "success");
            Alert.add({ title: 'organization', text: '' });
          }
        }
      })
      .catch((err: AxiosError) => {
        setOpen(false);
        Alert.addError({ title: 'organization', text: '' });
      });
  };

const editOrganisationData = (
  data: Organization,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  gridApi: GridApi | undefined,
  handleUpdateTransaction: (gridApi: GridApi, newData: any) => void
) => {
  return organisationRoute
    .editOrganisation(data)
    .then((res: AxiosResponse) => {
      setOpen(false);
      if (res?.data && gridApi) {
        handleUpdateTransaction(gridApi, res.data.updatedOrganization);
        Alert.update({ title: 'organization', text: '' });
      }
    })
    .catch((err: AxiosError) => {
      setOpen(false);
      if (err.response?.data?.errorMessage === 'Organization already present') {
        Alert.already({ title: 'organization', text: '' });
      } else {
        Alert.updateError({ title: 'organization', text: '' });
      }
    });
};
const deleteOrganizationData = (
  id: string,
  gridApi: GridApi | undefined,
  handleDeleteTransaction: (gridApi: GridApi, newData: any) => void
) => {
  Alert.confirm(async () => {
    return organisationRoute
      .deleteOrganisation(id)
      .then((res: AxiosResponse) => {
        if (res?.data && gridApi) {
          handleDeleteTransaction(gridApi, res.data.deletedOrganization);
          if (gridApi && !gridApi.getDisplayedRowCount())
            gridApi.showNoRowsOverlay();
          Alert.delete({ title: 'organization', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.deleteError({ title: 'organization', text: '' });
      });
  });
};

const OrganisationSlice = createSlice({
  name: 'OrganisationSlice',
  initialState,
  reducers: {
    handleGetOrganisation: (state, action) => {
      state.organizationData = action.payload;
    },
    handleGetOrganisationName: (state, action) => {
      state.organizationName = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
//reducers export to pass action state to reducer type
export const {
  handleLoading,
  handleGetOrganisation,
  handleGetOrganisationName,
} = OrganisationSlice.actions;
//action to calls in ui with dispatch methods
export {
  addOrganisationDataSignup,
  addOrganisationData,
  getOrganisationDetail,
  editOrganisationData,
  deleteOrganizationData,
  getOrganizationName,
  getSearchData,
  getOrganisationData,
};
export default OrganisationSlice.reducer;
