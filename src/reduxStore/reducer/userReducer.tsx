import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as userRoute from '../route/userRoute';
import { Organization } from '../../pages/organisation/OrganizationForm';
import { NavigateFunction } from 'react-router-dom';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import {
  handleAddTransaction,
  handleDeleteTransaction,
  handleUpdateTransaction,
} from '../../utils/gridMethod/GridTransaction';
import { GridApi } from 'ag-grid-community';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetailsByIdAffiliate } from './registerReducer';
import Alert from '../../utils/Alert/Alert';
import Organisation from '../../pages/organisation/Organisation';

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
  usersData: [],
  instructorsData: [],
  usersByOrganization: [],
  pendingUsersData: [],
  badgeData: [],
  user: {},
  loading: false,
};

const getSearchApprovalData = (data: string, params: any) => async () => {
  return userRoute
    .getSearchUserData(data)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        const { records, totCount } = res?.data;

        if (!records?.length) {
          params.api.showNoRowsOverlay();
        } else params.api.hideOverlay();

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

const getSearchUserData = (data: string, params: any) => async () => {
  return userRoute
    .getSearchApprovalData(data)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        const { records, totCount } = res?.data;
        if (!records?.length) {
          params.api.showNoRowsOverlay();
        } else params.api.hideOverlay();

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

const getUsersData =
  (data?: PaginationProp, params?: any) => async (dispatch: AppDispatch) => {
    return userRoute
      .getUsers(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          const { records, totCount } = res?.data;
          if (!records?.length) {
            params && params.api.showNoRowsOverlay();
          } else params && params.api.hideOverlay();

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

const getUsersType = (type: string) => async (dispatch: AppDispatch) => {
  return userRoute
    .getUsersByType(type)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        dispatch(handleGetUsers(res.data.data));
      }
    })
    .catch((err: AxiosError) => {});
};

const getUsersByOrganization =
  (data: PaginationProp, params: any) => async (dispatch: AppDispatch) => {
    return userRoute
      .getUsersByOrganization(data)
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

const getUsersByOrganizationPopup = () => async (dispatch: AppDispatch) => {
  return userRoute
    .getUsersByOrganizationPopup()
    .then((res: AxiosResponse) => {
      if (res?.data) {
        dispatch(handleGetUsersPending(res.data.data));
      }
    })
    .catch((err: AxiosError) => {});
};

const getUsersBadge = () => async (dispatch: AppDispatch) => {
  return userRoute
    .getUsersByOrganizationPopup()
    .then((res: AxiosResponse) => {
      if (res?.data) {
        dispatch(handleGetUsersBadge(res.data.data));
      }
    })
    .catch((err: AxiosError) => {});
};

const getInstructors =
  (org_id = undefined) =>
  async (dispatch: AppDispatch) => {
    const queryParams = {
      org_id: org_id,
    };
    return userRoute
      .getInstructors(queryParams)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          dispatch(handleGetInstructors(res.data.instructors));
        }
      })
      .catch((err: AxiosError) => err);
  };

const activatePassword =
  (data: any, navigate: any) => async (dispatch: AppDispatch) => {
    return await userRoute
      .activatePassword(data)
      .then((res: any) => {
        if (res?.data?.message === 'Password Activation Link Expired') {
          Alert.info({ title: 'Password Activation Link Expired', text: '' });
        } else if (res.data.message === 'Invalid Token.') {
          Alert.info({ title: 'Invalid Token.', text: '' });
        } else {
          Alert.success({ title: 'Account activated Successfully', text: '' });
          navigate('/login');
        }
      })
      .catch((err: any) => {
        Alert.error({ title: 'Password Activation Failed!', text: '' });
      });
  };

const addUserAdmin = (
  data: any,
  gridApi: GridApi | undefined,
  setOpen: any
) => {
  return userRoute
    .createAdminUser(data)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        if (res?.data?.message == 'user email already exists') {
          Alert.info({
            title: 'User with same Email already exists',
            text: '',
          });
          setOpen(false);
        } else {
          setOpen(false);
          Alert.add({ title: 'Admin user', text: '' });
        }
      }
    })
    .catch((err: AxiosError) => {
      Alert.addError({ title: 'Admin User', text: '' });
      setOpen(false);
    });
};

const updateUserAdmin =
  (data: any, gridApi: any, setOpen: any) => async (dispatch: AppDispatch) => {
    const payload = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name,
      id: data.id,
    };
    return userRoute
      .updateAdminUser(payload)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          const user = res?.data?.user;
          const response = {
            ...data,
            first_name: user?.first_name,
            last_name: user?.last_name,
            middle_name: user?.middle_name,
            email: user?.email,
          };
          handleUpdateTransaction(gridApi, response);
          setOpen(false);
          Alert.update({ title: 'user', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        if (err?.response?.data?.errorMessage.includes('duplicate key')) {
          Alert.already({ title: 'User with same Email', text: '' });
        } else {
          Alert.updateError({ title: 'User', text: '' });
          setOpen(false);
        }
      });
  };

const updateUserStatus =
  (status: any, data: any, gridApi: any, gridApi1: any) =>
  async (dispatch: AppDispatch) => {
    return userRoute
      .updateUserStatus(status, {
        id: data.id,
        user_id: data.user_id,
      })
      .then((res: AxiosResponse) => {
        if (res) {
          if (status) {
            if (gridApi1) {
              const response = { ...data };
              response.status = res.data.user.status;
              handleDeleteTransaction(gridApi1, response);
              dispatch(getUsersBadge());
            }
          } else {
            if (gridApi1) {
              const response = { ...data };
              response.status = res.data.user.status;
              handleUpdateTransaction(gridApi1, response);
              dispatch(getUsersBadge());
            }
          }
          // dispatch(getUsersByOrganizationPopup())
          Alert.update({ title: 'User Status', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.updateError({ title: 'User Status', text: '' });
      });
  };

const updateUserLockedStatus =
  (status: any, data: any, gridApi: any) => async (dispatch: AppDispatch) => {
    return userRoute
      .updateUserLockedStatus(status, data.id)
      .then((res: AxiosResponse) => {
        if (res) {
          Alert.update({ title: 'User Locked Status', text: '' });
          const response = { ...data };
          const is_locked = res?.data?.user?.is_locked;
          response.is_locked = is_locked;
          handleUpdateTransaction(gridApi, response);
        }
      })
      .catch((err: AxiosError) => {
        Alert.updateError({ title: 'User Locked Status', text: '' });
      });
  };

const inviteUser =
  (data: any, open: any, setOpen: any, instructorData?: any) =>
  async (dispatch: AppDispatch) => {
    return userRoute
      .inviteUser(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res.data.message === 'Organization Email is already registered') {
            Alert.already({
              title: 'Organization Email is already registered',
              text: '',
            });
          } else {
            if (open.callback) {
              if (open.name === 'assessment_coordinators') {
                let assesmentdata = open?.data?.length
                  ? open.data.slice(0, -1)
                  : [];
                open.callback('assessment_coordinators', [
                  ...assesmentdata,
                  ...[
                    {
                      id: res.data.user.id,
                      name:
                        res.data.user.first_name +
                        ' ' +
                        res.data.user.last_name,
                      organization_name:
                        data?.organization?.name ||
                        res?.data.user.organization_name,
                    },
                  ],
                ]);
                dispatch(
                  handleGetInstructors([
                    ...instructorData.coordinator.filter(
                      (d: any) => d.id !== ''
                    ),
                    {
                      id: res.data.user.id,
                      name:
                        res.data.user.first_name +
                        ' ' +
                        res.data.user.last_name,
                      organization_name:
                        data?.organization?.name ||
                        res?.data.user.organization_name,
                    },
                  ])
                );
              }
              if (open.name === 'instructor') {
                let assesmentdata = open?.data?.length
                  ? open.data.slice(0, -1)
                  : [];

                let x = {
                  id: res.data.user.id,
                  name:
                    res.data.user.first_name + ' ' + res.data.user.last_name,
                  organization_name:
                    data?.organization?.name ||
                    res?.data.user.organization_name,
                };
                open.callback('instructors', [
                  ...assesmentdata,
                  ...[
                    {
                      id: res.data.user.id,
                      name:
                        res.data.user.first_name +
                        ' ' +
                        res.data.user.last_name,
                      organization_name:
                        data?.organization?.name ||
                        res?.data.user.organization_name,
                    },
                  ],
                ]);
                const f = instructorData.instructor.filter(
                  (d: any) => d.id !== ''
                );

                dispatch(
                  handleGetInstructors([
                    ...instructorData.instructor.filter(
                      (d: any) => d.id !== ''
                    ),
                    {
                      id: res.data.user.id,
                      name:
                        res.data.user.first_name +
                        ' ' +
                        res.data.user.last_name,
                      organization_name:
                        data?.organization?.name ||
                        res?.data.user.organization_name,
                    },
                  ])
                );
              }
            }

            setOpen({ ...open, isOpen: false });

            // dispatch(getInstructors());
            Alert.success({ title: 'Invited user to course', text: '' });
          }
        }
      })
      .catch((err: AxiosError) => {
        setOpen(false);
        Alert.addError({ title: 'Users', text: '' });
      });
  };

const updateDefaultOrganization =
  (status: any, data: any) => async (dispatch: AppDispatch) => {
    return userRoute
      .updateDefaultOrganization(status, data)
      .then((res: AxiosResponse) => {
        if (res) {
          const user = JSON.parse(localStorage.getItem('token') || '{}');
          dispatch(getUserDetailsByIdAffiliate({ id: user }));
          Alert.update({ title: 'Default Organization', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.updateError({ title: 'Default Organization', text: '' });
      });
  };

const deleteUserOrganization = (id: any) => async (dispatch: AppDispatch) => {
  return userRoute
    .deleteUserOrganization(id)
    .then((res: AxiosResponse) => {
      if (res) {
        const user = JSON.parse(localStorage.getItem('token') || '{}');
        dispatch(getUserDetailsByIdAffiliate({ id: user }));
        Alert.delete({ title: 'Organization', text: '' });
      }
    })
    .catch((err: AxiosError) => {
      Alert.deleteError({ title: 'Organization', text: '' });
    });
};

const deleteUserUnit = (id: any) => async (dispatch: AppDispatch) => {
  return userRoute
    .deleteUserUnit(id)
    .then((res: AxiosResponse) => {
      if (res) {
        const user = JSON.parse(localStorage.getItem('token') || '{}');
        dispatch(getUserDetailsByIdAffiliate({ id: user }));
        Alert.delete({ title: 'User Unit', text: '' });
      }
    })
    .catch((err: AxiosError) => {
      Alert.deleteError({ title: 'User Unit', text: '' });
    });
};

const updateUnitRoles =
  (data: any, id: any) => async (dispatch: AppDispatch) => {
    return userRoute
      .updateUnitRoles(data, id)
      .then((res: AxiosResponse) => {
        if (res) {
          const user = JSON.parse(localStorage.getItem('token') || '{}');
          dispatch(getUserDetailsByIdAffiliate({ id: user }));
          Alert.update({ title: 'Unit Roles', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.updateError({ title: 'Unit Roles', text: '' });
      });
  };

const usersSlice = createSlice({
  name: 'UsersSlice',
  initialState,
  reducers: {
    handleGetUsers: (state, action) => {
      state.usersData = action.payload;
    },
    handleGetInstructors: (state, action) => {
      state.instructorsData = action.payload;
    },
    handleGetUserByOrganization: (state, action) => {
      state.usersByOrganization = action.payload;
    },
    handleUpdateUser: (state, action) => {
      state.user = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
    handleGetUsersPending: (state, action) => {
      state.pendingUsersData = action.payload;
    },
    handleGetUsersBadge: (state, action) => {
      state.badgeData = action.payload;
    },
  },
});

//reducers export to pass action state to reducer type
export const {
  handleLoading,
  handleGetUsers,
  handleUpdateUser,
  handleGetInstructors,
  handleGetUserByOrganization,
  handleGetUsersPending,
  handleGetUsersBadge,
} = usersSlice.actions;

//action to calls in ui with dispatch methods
export {
  updateUnitRoles,
  updateDefaultOrganization,
  getUsersData,
  updateUserStatus,
  getUsersByOrganization,
  addUserAdmin,
  activatePassword,
  getSearchUserData,
  getInstructors,
  getSearchApprovalData,
  updateUserAdmin,
  updateUserLockedStatus,
  inviteUser,
  getUsersType,
  getUsersByOrganizationPopup,
  deleteUserOrganization,
  deleteUserUnit,
  getUsersBadge,
};

export default usersSlice.reducer;
