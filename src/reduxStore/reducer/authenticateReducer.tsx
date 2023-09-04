import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import * as authenticateRoute from '../route/authenticateRoute';
import TokenService from '../../api/TokenService';
import Alert from '../../utils/Alert/Alert';
import Button from '@mui/material/Button';
export interface LoginAppType {
  email: string;
  password: string;
}

type PasswordType = {
  token: string | undefined;
  password: string;
};

const login =
  (data: LoginAppType, navigate: any, set: any) =>
  async (dispatch: AppDispatch) => {
    return await authenticateRoute
      .login(data)
      .then((res: any) => {
        if (!res.data?.access_token) {
          set(false);
        }

        if (res?.data?.message == 'Your Account Approval is Pending') {
          Alert.info({ title: 'Your Account Approval is Pending', text: '' });
        } else if (res?.data?.message === 'Your Account is Locked') {
          Alert.info({ title: 'Your Account is Locked', text: '' });
        }

        if (res.data?.access_token) {
          TokenService.SetAccessToken(res.data['access_token']);
          TokenService.RefreshAccessToken(res.data['refresh_token']);
          navigate('/', {
            state: {
              action: 'popup',
            },
          });
        } else if (res.data.message === 'Invalid Email or Password') {
          Alert.error({ title: 'Login', text: res.data.message });
        } else if (res.data.message === 'User Not Found') {
          Alert.error({ title: 'Login', text: 'Invalid Email or Password' });
        } else {
        }
      })
      .catch((err: any) => {
        Alert.error({ title: 'Login Failed!', text: '' });
        set(false);
      });
  };

const refreshToken = async (data: any) => {
  return await authenticateRoute
    .refreshToken(data)
    .then((res: any) => {
      TokenService.SetAccessToken(res.data.data['access_token']);
      TokenService.RefreshAccessToken(res.data.data['refresh_token']);
    })
    .catch((err: any) => {});
};

const forgotAction = (data: any) => async (dispatch: AppDispatch) => {
  return await authenticateRoute
    .forgotPassword(data)
    .then((res: any) => {
      dispatch(handleForgot(res.data));
      if (res?.data) {
        if (res.data.message === 'Invalid Email') {
          Alert.info({ title: 'Invalid Email', text: '' });
        } else {
          Alert.success({
            title: 'Email sent to your email address!',
            text: '',
          });
        }
      }
    })
    .catch((err: any) => {
      Alert.error({ title: 'Password reset failed!', text: '' });
    });
};

const resetAction =
  (data: any, navigate: any) => async (dispatch: AppDispatch) => {
    return await authenticateRoute
      .resetPassword(data)
      .then((res: any) => {
        if (res.data.message === 'Invalid Token.') {
          Alert.info({ title: 'Invalid Token', text: '' });
        } else if (res.data.message === 'Password Reset Link Expired') {
          Alert.info({ title: 'Password Reset Link Expired', text: '' }).then(
            () => navigate('/login')
          );
        } else if (res.data.message === 'Invalid User..') {
          Alert.info({ title: 'Invalid User..', text: '' });
        } else {
          Alert.success({
            title: 'Your password has been reset successfully',
            text: '',
          }).then(() => navigate('/login'));
        }
      })
      .catch((err: any) => {
        Alert.error({ title: 'Password reset failed!', text: '' });
      });
  };

const initialState = {
  userInfo: null,
  logged: false,
  data: '',
};

const authenticateSlice = createSlice({
  name: 'authenticate',
  initialState,
  reducers: {
    handleForgot: (state, action) => {
      state.data = action.payload;
    },
    handleReset: (state, action) => {
      state.data = action.payload;
    },
  },
});

export default authenticateSlice.reducer;

export const { handleForgot, handleReset } = authenticateSlice.actions;

export { login, refreshToken, forgotAction, resetAction };
