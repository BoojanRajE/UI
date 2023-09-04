import { Input, Button, IconButton, Skeleton } from '@mui/material';
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { ErrorMessage, Field, Form, Formik, useField } from 'formik';
import { initialValues } from '../register/activatedStepper/InitialValues';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import {
  update,
  getUserDetailsById,
  updateUserDetails,
} from '../../reduxStore/reducer/registerReducer';

function Profile({ userData }: any) {
  const dispatch = useDispatch<AppDispatch>();

  // const [initialValues, setInitialValues] = useState<any>(
  //   userData?.id != null ? { ...userData } : {}
  // );
  const validation = Yup.object({
    first_name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed.')
      .matches(/^[^ ]/, 'The starting letter should not be a space.')
      .matches(/[^\s]$/, 'Ending letter should not be a space.')
      .required('Required Field'),
    last_name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed.')
      .matches(/^[^ ]/, 'The starting letter should not be a space.')
      .matches(/[^\s]$/, 'Ending letter should not be a space.')
      .required('Required Field'),
    middle_name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed.')
      .matches(/^[^ ]/, 'The starting letter should not be a space.')
      .matches(/[^\s]$/, 'Ending letter should not be a space.'),
    other_name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed.')
      .matches(/^[^ ]/, 'The starting letter should not be a space.')
      .matches(/[^\s]$/, 'Ending letter should not be a space.'),
    email: Yup.string().email().required('Required Field'),
  });
  // const handleCancel = () => {
  //
  //   setInitialValue(userData.data);
  //   return;
  // };

  //

  return (
    <div>
      <h1 className="text-3xl font-large p-2">Profile</h1>
      {userData?.id != null ? (
        <Formik
          enableReinitialize
          initialValues={userData?.id != null ? { ...userData } : {}} //initialValues
          validationSchema={validation}
          onSubmit={(values) => {
            dispatch(updateUserDetails(values));
          }}
        >
          {({ values, errors, touched, isValid }) => (
            <Form>
              <div className="grid gap-y-2 max-w-lg sm:max-w-3xl mt-4 ml-2 sm:grid-cols-2">
                <label htmlFor="institution" className="">
                  Email
                </label>
                <div>
                  <Field
                    id="email"
                    name="email"
                    disabled={true}
                    className="input-field h-9"
                  />
                  <ErrorMessage
                    name="email"
                    component="span"
                    className="text-red-600 ml-2 text-sm"
                  />
                </div>
                <label htmlFor="institution" className="">
                  First Name
                  <span className="text-red-500 text-lg"> *</span>
                </label>
                <div>
                  <Field
                    id="first_name"
                    name="first_name"
                    className="input-field h-9"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="span"
                    className="text-red-600 ml-2 text-sm"
                  />
                </div>

                <label htmlFor="city" className="mt-2">
                  Last Name<span className="text-red-500 text-lg"> *</span>
                </label>
                <div>
                  <Field
                    id="last_name"
                    name="last_name"
                    className="input-field h-9"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="span"
                    className="text-red-600 ml-2 text-sm"
                  />
                </div>
                <label htmlFor="city" className="mt-2">
                  Middle Name/Initial
                </label>
                <div>
                  <Field
                    id="middle_name"
                    name="middle_name"
                    className="input-field h-9"
                  />
                  <ErrorMessage
                    name="middle_name"
                    component="span"
                    className="text-red-600 ml-2 text-sm"
                  />
                </div>
                <label htmlFor="city" className="mt-2">
                  Preferred First Name
                </label>
                <div>
                  <Field
                    id="other_name"
                    name="other_name"
                    className="input-field h-9"
                  />
                  <ErrorMessage
                    name="other_name"
                    component="span"
                    className="text-red-600 ml-2 text-sm"
                  />
                </div>
                <label
                  htmlFor="city"
                  className="mt-2"
                  style={{ visibility: 'hidden' }}
                ></label>
                <div className="mt-2">
                  <Button type="submit" variant="contained" disabled={!isValid}>
                    Save
                  </Button>
                </div>
              </div>
              <div className="flex justify-center gap-10 mt-7 mb-5">
                {/* <Button
                  variant="contained"
                  type="reset"
                  color="error"
                  onClick={(e) => formik.resetForm()}
                  // style={{
                  //   visibility: 'hidden',
                  // }}
                >
                  Cancel
                </Button> */}
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        ''
      )}
    </div>
  );
}
export default Profile;
