import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { getOrganizationName } from '../../reduxStore/reducer/organisationReducer';
import { AiOutlineClose } from 'react-icons/ai';
import {
  addCoursePrefixData,
  getCoursePrefixName,
} from '../../reduxStore/reducer/coursePrefixReducer';
import { CoursePrefix } from '../coursePrefix/CoursePrefix';
import { getCoursePrefix } from '../../reduxStore/route/coursePrefixRoute';
import { addAssessmentDiscipline } from '../../reduxStore/reducer/assessmentReducer';

export function AssessmentDiscipline({ open, setOpenForm }: any) {
  const dispatch = useDispatch<AppDispatch>();

  const handleClickClose = () => {
    setOpenForm({ ...open, isOpen: false });
  };

  const validation = Yup.object({
    name: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
  });

  return (
    <Dialog open={open.isOpen}>
      <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
        <div className="flex justify-between items-center">
          <div>Add Discipline</div>
          <div>
            <AiOutlineClose onClick={handleClickClose} />
          </div>
        </div>
      </DialogTitle>

      <Formik
        initialValues={{ name: '' }}
        validationSchema={validation}
        onSubmit={(values) => {
          dispatch(addAssessmentDiscipline(values, open, setOpenForm));
        }}
      >
        {({
          values,
          isValid,
          handleChange,
          errors,
          touched,
          setFieldValue,
        }) => (
          <DialogContent
            sx={{
              width: '600px',
              height: 'fitContent',
              overflowX: 'hidden',
            }}
          >
            <Form>
              <Field
                as={TextField}
                id="name"
                label="Discipline Name"
                variant="standard"
                name="name"
                value={values.name}
                error={errors.name && touched.name}
                helperText={errors.name && touched.name ? errors.name : ''}
                className="capitalize"
                fullWidth
                sx={{ marginBottom: '20px', marginTop: '20px' }}
              />

              <div className="flex gap-3 justify-end">
                <Button
                  variant="contained"
                  style={{ textTransform: 'capitalize' }}
                  // fullWidth
                  onClick={handleClickClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ textTransform: 'capitalize' }}
                  type="submit"
                >
                  Add
                </Button>
              </div>
            </Form>
          </DialogContent>
        )}
      </Formik>
    </Dialog>
  );
}
