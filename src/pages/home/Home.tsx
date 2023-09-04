import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import Button from '@mui/material/Button';
import {
  getUsersByOrganization,
  updateUserStatus,
} from '../../reduxStore/reducer/userReducer';
import { getUsersByOrganizationPopup } from '../../reduxStore/reducer/userReducer';
import { IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserDetailsById } from '../../reduxStore/reducer/registerReducer';
import Dashboard from '../Dashboard/Dashboard';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const getUserData = useSelector((state: any) => state.users.pendingUsersData);
  const currentUserData: any = useSelector(
    (state: RootState) => state.register.userDetail
  );

  useEffect(() => {
    dispatch(getUsersByOrganizationPopup());
    const user = JSON.parse(localStorage.getItem('token') || '{}');
    dispatch(getUserDetailsById({ id: user }));
  }, [dispatch]);

  useEffect(() => {
    if (currentUserData) {
      if (currentUserData?.data?.[0]?.type == 'faculty') {
        return;
      }
      if (!getUserData?.length) {
        return;
      }

      const hasRenderedBefore: any = localStorage.getItem('hasRenderedBefore');

      if (
        !hasRenderedBefore ||
        hasRenderedBefore == 'false' ||
        hasRenderedBefore == null
      ) {
        if (getUserData?.length > 0) {
          for (let i = 0; i < getUserData?.length; i++) {
            toast.dark(<MyToast value={getUserData[i]} />, {
              position: toast.POSITION.BOTTOM_RIGHT,
              icon: false,
              className: 'custom-toastify',
              closeOnClick: false,
              //@ts-ignore
              autoClose: process.env.REACT_APP_TOAST_TIME || 5000,
              toastId: getUserData[i].id,
            });
          }
          localStorage.setItem('hasRenderedBefore', 'true');
        }
      }
    }
  }, [getUserData, currentUserData]);

  const MyToast = (data: any) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 'auto' }}>
            <p style={{ font: '3px' }}>
              {data.value.first_name} {data.value.last_name}
            </p>
            <p style={{ font: '5px' }}>{data.value.name}</p>
            <p style={{ font: '5px' }}>{data.value.email}</p>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            // justifyContent: 'end',
            alignItems: 'end',
            width: '184px',
          }}
        >
          <Tooltip
            title="Copy Email"
            style={{ zIndex: 2 }}
            className="tooltiptest"
            placement="top"
          >
            <IconButton
              style={{
                alignSelf: 'center',
              }}
              onClick={() => navigator.clipboard.writeText(data.value.email)}
            >
              <ContentCopyIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          <Button
            size="small"
            style={{
              fontSize: '12px',
              height: '20px',
              alignSelf: 'center',
              // width: '60px',
            }}
            onClick={() => {
              dispatch(updateUserStatus(true, data.value, '', ''));
              toast.dismiss(data.value.id);
            }}
          >
            Approve
          </Button>
          <Button
            size="small"
            style={{
              fontSize: '12px',
              height: '29px',
              alignSelf: 'center',
            }}
            color="error"
            onClick={() => {
              dispatch(updateUserStatus(false, data.value, '', ''));
              toast.dismiss(data.value.id);
            }}
          >
            Reject
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <ToastContainer
        limit={3}
        style={{ width: '450px', fontSize: '13px', zIndex: 1 }}
      />
      <Dashboard />
    </div>
  );
};

export default Home;
