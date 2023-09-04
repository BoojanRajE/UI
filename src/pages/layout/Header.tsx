import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, MenuItem, Menu, Typography } from '@mui/material';
import { GiOpenBook } from 'react-icons/gi';
import { useNavigate, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../../images/Logos/lasso.png';
import Session from '../../utils/logout';
import TokenService from '../../api/token.service';
import { getUserById } from '../../reduxStore/reducer/registerReducer';
import { AppDispatch } from '../../reduxStore/Store';

const Header = () => {
  const session = Session();
  const user = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const url = location.pathname;

  const loginCondition = url.includes('login');

  function Logout() {
    TokenService.RemoveAccessToken();
    TokenService.RemoveRefreshToken();
    localStorage.removeItem('role');
    localStorage.removeItem('hasRenderedBefore');
    localStorage.removeItem('hasRenderedBeforeInvite');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  }

  const getUserDataAndType = useSelector(
    (state: any) => state.register.getUserById
  );

  const data = {
    // define your properties here
  };

  useEffect(() => {
    if (
      Object.keys(JSON.parse(localStorage.getItem('token') || '{}')).length !==
      0
    )
      dispatch(
        getUserById({
          id: JSON.parse(localStorage.getItem('token') || '{}'),
        })
      );
  }, [dispatch]);

  const dummyMenuItems = [
    {
      title: 'My Account',
      link: '/myaccount',
    },
    {
      title: 'Help Center',
      link: '/helpcenter',
    },
    {
      title: 'Sign Out',
      link: '',
    },
  ];
  // if (getUserDataAndType?.data?.type === 'faculty') {
  //   dummyMenuItems.push({

  //   });
  // }

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const nativeOnChange = (event: any) => {
    const detail = {
      selectedIndex: event.target.selectedIndex,
    };
    event.target.selectedIndex = 0;
    event.target.dispatchEvent(new CustomEvent('itemClick', { detail }));
  };

  const itemClick = (event: any) => {};

  return (
    <div>
      <header className="text-gray-600 body-font">
        <div className="p-2 mx-auto flex flex-wrap justify-between items-center bg-header h-16">
          <div className="flex items-center gap-3 text-xs md:text-5xl font-bold">
            <img src={logo} className="w-12 h-auto" alt="..." />
            <h1 className="text-white">LASSO</h1>
          </div>

          {!user && !loginCondition ? (
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              className="inline-flex items-center text-white bg-sign-in border-0 py-1 px-3 focus:outline-none hover:bg-blue-800 rounded text-base mt-4 md:mt-0"
            >
              Sign In
            </Button>
          ) : loginCondition ? (
            <div></div>
          ) : (
            <>
              <IconButton size="large" onClick={handleClick}>
                <AccountCircleIcon
                  style={{ color: 'white' }}
                  fontSize="large"
                />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {dummyMenuItems.map((item) => (
                  <MenuItem
                    onClick={() => {
                      if (item.title === 'Sign Out') {
                        session.logoutAllTabs();
                      } else {
                        navigate(item.link);
                      }
                      setAnchorEl(null);
                    }}
                    key={item.title}
                    value={item.title}
                  >
                    {item.title}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
