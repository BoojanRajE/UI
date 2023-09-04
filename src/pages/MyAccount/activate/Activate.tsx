import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxStore/Store';
// ../../reduxStore/Store';
import { activateAffiliate } from '../../../reduxStore/reducer/registerReducer';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSearchParams } from 'react-router-dom';

const Activate = () => {
  // const data = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate: any = useNavigate();
  //
  useEffect(() => {
    dispatch(activateAffiliate({ id: searchParams.get('data') }, navigate));
  }, []);
  return <div></div>;
};

export default Activate;
