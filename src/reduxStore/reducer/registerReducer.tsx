import { AnyAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import * as registerRoute from '../route/registerRoute';
import TokenService from '../../api/TokenService';
import Alert from '../../utils/Alert/Alert';

export interface ForgotpasswordType {
  email: string;
}
type PasswordType = {
  token: string | undefined;
  password: string;
};

const register =
  (data: any, navigate: any, next: any) => async (dispatch: AppDispatch) => {
    return await registerRoute
      .register(data)
      .then((res: any) => {
        if (res.data.message == 'Email already exists') {
          Alert.info({
            title: 'Email already exists!',
            text: '',
          });
        } else if (res.data.message == 'Organization Email already exists') {
          Alert.info({
            title: 'Organization Email already exists!',
            text: '',
          });
        } else {
          next();
        }
      })
      .catch((err: any) => {
        Alert.error({ title: 'Registration Failed!', text: '' });
      });
  };

const inviteRegister =
  (data: any, navigate: any, next: any) => async (dispatch: AppDispatch) => {
    return await registerRoute
      .inviteRegister(data)
      .then((res: any) => {
        if (res.data.message == 'Email already exists') {
          Alert.info({
            title: 'Email already exists!',
            text: '',
          });
        } else if (res.data.message == 'Organization Email already exists') {
          Alert.info({
            title: 'Organization Email already exists!',
            text: '',
          });
        } else {
          next();
        }
      })
      .catch((err: any) => {
        Alert.error({ title: 'Registration Failed!', text: '' });
      });
  };

const registerAffiliate =
  (data: any, navigate: any, next: any) => async (dispatch: AppDispatch) => {
    return await registerRoute
      .registerAffiliate(data)
      .then((res: any) => {
        if (res.data.message == 'Organization already exists') {
          Alert.info({
            title: 'Organization already linked with user!',
            text: '',
          });
        } else {
          next();
        }
      })
      .catch((err: any) => {
        if (err?.response?.data?.errorMessage.includes('users_email_key')) {
          Alert.info({
            title: 'A account with same Address Already Exist!',
            text: '',
          });
        } else {
          Alert.error({ title: 'Registration Failed!', text: '' });
        }
      });
  };

const activateAffiliate =
  (data: any, navigate: any) => async (dispatch: AppDispatch) => {
    return await registerRoute
      .activateAffiliate(data)
      .then((res: any) => {
        if (
          res?.data?.message ===
          'Activation Link is not associated with this user'
        ) {
          Alert.info({
            title: 'Activation Link is not associated with this user!',
            text: '',
          });
          navigate('/login');
        } else {
          navigate(`/activated/userOrganization/${data.id}`);
        }
      })
      .catch((err: any) => {
        Alert.error({ title: 'Activation Failed!', text: '' });
        navigate('/login');
      });
  };
const activate =
  (data: any, navigate: any, url: string) => async (dispatch: AppDispatch) => {
    return await registerRoute
      .activate(data)
      .then((res: any) => {
        if (res?.data?.message === 'User Already Activated') {
          Alert.info({ title: 'User Already Activated!', text: '' });
          navigate('/login');
        } else if (
          res?.data?.message ===
          'Activation Link is not associated with this user'
        ) {
          Alert.info({
            title: 'Activation Link is not associated with this user',
            text: '',
          });
        } else {
          navigate(`${url}${data.id}`);
        }
      })
      .catch((err: any) => {
        Alert.error({ title: 'Activation Failed!', text: '' });
        navigate('/login');
      });
  };

const update = (data: any, next: any) => async (dispatch: AppDispatch) => {
  return await registerRoute
    .update(data)
    .then((res: any) => {
      next();
    })
    .catch((err: any) => {
      Alert.error({ title: 'Account Creation Failed!', text: '' });
    });
};

const updateAffiliate =
  (data: any, next: any) => async (dispatch: AppDispatch) => {
    return await registerRoute
      .updateAffiliate(data)
      .then((res: any) => {
        next();
      })
      .catch((err: any) => {
        Alert.error({ title: 'Account Creation Failed!', text: '' });
      });
  };

const updateUnit =
  (data: any, next: any, setOpen: any) => async (dispatch: AppDispatch) => {
    return await registerRoute
      .updateUnit(data)
      .then((res: any) => {
        const user = JSON.parse(localStorage.getItem('token') || '{}');
        dispatch(getUserDetailsByIdAffiliate({ id: user }));
        setOpen(false);
        Alert.update({ title: 'Unit', text: '' });
        next();
      })
      .catch((err: any) => {
        Alert.updateError({ title: 'Unit', text: '' });
      });
  };

const updateUserDetails = (data: any) => async (dispatch: AppDispatch) => {
  return await registerRoute
    .updateUserDetails(data, data?.id)
    .then((res: any) => {
      dispatch(
        getUserById({
          id: `${JSON.parse(localStorage.getItem('token') || '{}')}`,
        })
      );
      const user = JSON.parse(localStorage.getItem('token') || '{}');
      dispatch(getUserDetailsById({ id: user }));
      Alert.update({ title: 'User Details', text: '' });
    })
    .catch((err: any) => {
      Alert.updateError({ title: 'User Details', text: '' });
    });
};

const getUserById = (data: any) => async (dispatch: AppDispatch) => {
  return await registerRoute
    .getUser(data)
    .then((res: any) => {
      dispatch(handleGetUserById(res.data));
      dispatch(handleUserByIdInMail(res.data.data));
    })
    .catch((err: any) => {});
};

const getUserAndOrganizationById =
  (data: any) => async (dispatch: AppDispatch) => {
    return await registerRoute
      .getUserAndOrganization(data)
      .then((res: any) => {
        dispatch(handleGetUserById(res.data));
      })
      .catch((err: any) => {});
  };

const getUserDetailsById =
  (data: any, setLoading?: any) => async (dispatch: AppDispatch) => {
    return await registerRoute
      .getUserDetails(data)
      .then((res: any) => {
        dispatch(getUserByIdData(res.data));
        if (setLoading) setTimeout(() => setLoading(false));
      })
      .catch((err: any) => {});
  };

const getUserDetailsByIdAffiliate =
  (data: any) => async (dispatch: AppDispatch) => {
    return await registerRoute
      .getUserDetailsAffiliate(data)
      .then((res: any) => {
        dispatch(getUserByIdDataAffiliate(res.data.data));
      })
      .catch((err: any) => {});
  };

const initialState = {
  getUserByIdDataAffiliate: [],
  getUserById: [],
  userMailData: [],
  userInfo: null,
  logged: false,
  data: '',
  userDetail: '',
};

const authenticateSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    handleForgot: (state, action) => {
      state.data = action.payload;
    },
    handleReset: (state, action) => {
      state.data = action.payload;
    },
    getUserByIdData: (state, action) => {
      state.userDetail = action.payload;
    },
    getUserByIdDataAffiliate: (state, action) => {
      state.getUserByIdDataAffiliate = action.payload;
    },
    handleGetUserById: (state, action) => {
      state.getUserById = action.payload;
    },
    handleUserByIdInMail: (state, action) => {
      state.userMailData = action.payload;
    },
  },
});

export default authenticateSlice.reducer;

export const {
  handleForgot,
  handleReset,
  getUserByIdData,
  handleGetUserById,
  handleUserByIdInMail,
  getUserByIdDataAffiliate,
} = authenticateSlice.actions;

export {
  inviteRegister,
  register,
  registerAffiliate,
  activate,
  activateAffiliate,
  update,
  updateAffiliate,
  updateUnit,
  getUserById,
  getUserAndOrganizationById,
  getUserDetailsById,
  updateUserDetails,
  getUserDetailsByIdAffiliate,
};
