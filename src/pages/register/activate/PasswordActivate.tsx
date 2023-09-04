import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxStore/Store';
// ../../reduxStore/Store';
import { activate } from '../../../reduxStore/reducer/registerReducer';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const PasswordActivate = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate: any = useNavigate();

  useEffect(() => {
    dispatch(activate({ id: id }, navigate, '/admin/password/'));
  }, []);
  return <div></div>;
};

export default PasswordActivate;
