import { Input, Button, CircularProgress } from '@mui/material';
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import Profile from './Profile';
import Preference from './Preference';
import Demographics from './Demographics';
import Support from './Support';
import Affiliation from './Affiliation';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserById,
  getUserDetailsById,
} from '../../reduxStore/reducer/registerReducer';
import { AppDispatch, RootState } from '../../reduxStore/Store';

function MyAccount() {
  const [profileOpen, setProfileOpen] = useState(true);
  const [preferenceOpen, setPreferenceOpen] = useState(false);
  const [demographicsOpen, setDemographicsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [affiliationOpen, setAffiliationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const handleProfileOpen = () => {
    setProfileOpen(true);
    setPreferenceOpen(false);
    setDemographicsOpen(false);
    setSupportOpen(false);
    setAffiliationOpen(false);
  };
  const handlePreferenceOpen = () => {
    setPreferenceOpen(true);
    setProfileOpen(false);
    setDemographicsOpen(false);
    setSupportOpen(false);
    setAffiliationOpen(false);
  };
  const handleDemographicsOpen = () => {
    setPreferenceOpen(false);
    setProfileOpen(false);
    setDemographicsOpen(true);
    setSupportOpen(false);
    setAffiliationOpen(false);
  };
  const handleSupportOpen = () => {
    setSupportOpen(true);
    setProfileOpen(false);
    setPreferenceOpen(false);
    setDemographicsOpen(false);
    setAffiliationOpen(false);
  };
  const handleAffiliationOpen = () => {
    setSupportOpen(false);
    setProfileOpen(false);
    setPreferenceOpen(false);
    setDemographicsOpen(false);
    setAffiliationOpen(true);
  };
  const dispatch = useDispatch<AppDispatch>();
  // const getUserDataAndType = useSelector(
  //   (state: any) => state.register.getUserById
  // );
  //

  const data = {
    // define your properties here
  };
  useEffect(() => {
    // dispatch(
    //   getUserById({
    //     id: `${JSON.parse(localStorage.getItem('token') || '{}')}`,
    //   })
    // );
    const user = JSON.parse(localStorage.getItem('token') || '{}');
    // dispatch(getUserDetailsByIdAffiliate({ id: user }));
    dispatch(getUserDetailsById({ id: user }, setLoading));
  }, [dispatch]);

  const userData: any = useSelector(
    (state: RootState) => state.register.userDetail
  );

  return (
    <main className="min-w-fit p-2">
      {/* <div id="header" className="bg-slate-400 pb-32"></div> */}
      {/* //<div className="grid grid-cols-4 gap-x-1"> */}
      {/* <div id="col1" className="bg-slate-100 mt-1">
        sidebar
      </div> */}
      <div id="col2" className="col-span-3">
        <header
          id="myAccount"
          className="border-2 border-slate-300 rounded-xl mt-1"
        >
          <h1 className="text-4xl font-large p-2">My Account</h1>
          <hr className="bg-black h-0.5 mx-2 mt-3"></hr>
          <nav>
            <ul className="grid min-[375px]:grid-cols-5 gap-y-2 xs:flex xs:justify-around indent-2 mt-2 text-blue-600 ">
              {profileOpen == true ? (
                <>
                  {' '}
                  <Button
                    className="font-extrabold"
                    onClick={handleProfileOpen}
                  >
                    Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleProfileOpen}>Profile</Button>
                </>
              )}
              {userData?.data?.[0]?.type === 'faculty' && (
                <>
                  <Button onClick={handlePreferenceOpen}>Preferences</Button>
                  <Button onClick={handleDemographicsOpen}>Demographics</Button>
                  <Button onClick={handleAffiliationOpen}>Affiliations</Button>
                </>
              )}
              {userData?.data?.[0]?.type === 'admin' && (
                <Button onClick={handleSupportOpen}>Support</Button>
              )}
            </ul>
          </nav>
        </header>
        <section
          id="profile"
          className="border-2 border-slate-300 rounded-xl mt-2"
        >
          {loading ? (
            <div className="w-full h-screen flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : profileOpen == true ? (
            <Profile userData={userData?.data?.[0]} />
          ) : preferenceOpen == true ? (
            <Preference userData={userData?.data?.[0]} />
          ) : demographicsOpen == true ? (
            <Demographics userData={userData?.data?.[0]} />
          ) : supportOpen == true ? (
            <Support />
          ) : (
            <Affiliation />
          )}
        </section>
      </div>
      {/* <div id="footer" className="bg-slate-400 pt-32 mt-4"></div> */}
    </main>
  );
}

export default MyAccount;
