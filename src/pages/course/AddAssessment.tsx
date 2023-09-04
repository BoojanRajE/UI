import {
  Typography,
  Box,
  Grid,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
  TextField,
  AutocompleteRenderInputParams,
  makeStyles,
} from '@mui/material';
import { FILE } from 'dns';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import {
  addAssessmentData,
  getAssessmentDetail,
} from '../../reduxStore/reducer/assessmentReducer';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import { correctBeforeEditValues } from './AddEditCourse';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// import api from "./index";
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';
import { useState, useMemo, useCallback, useRef } from 'react';
import * as Yup from 'yup';
import ViewAssessment from '../Assessment/ViewAssessment';

function AddAssessment({
  openAssessment,
  setOpenAssessment,
  assessmentInitialValues,
  params,
  getAssessmentByCourse,
  scroll,
}: any) {
  const dispatch = useDispatch<AppDispatch>();

  const handleClickClose = () => {
    setOpenAssessment(false);
  };

  const [initialValues, setInitialValue] = React.useState<any>({
    id: '',
    assessment_id: null,
    label: '',
    no_of_administrations: 2,
    created_by: '',
  });

  useEffect(() => {
    dispatch(getAssessmentDetail());
  }, []);

  //@ts-ignore
  const assessmentDetails: any = useSelector(
    (state: RootState) => state.assessment.assessmentDetails
  );

  const validation = Yup.object({
    no_of_administrations: Yup.number().required('Required Field'),
    label: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed.')
      .matches(/^[^\s].*$/, 'The starting letter should not be a space.')
      .matches(/[^\s]$/, 'Ending letter should not be a space.')
      .min(3, 'Please enter a minimum of 3 letters.')
      .required('Required Field'),
  });

  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState();

  const handleClickView = async (data: any) => {
    const config = {
      method: 'get',
      url: `${process.env.REACT_APP_BASE_URL}/api/assessment/${data.assessment_id}`,
      headers: {
        authorization: localStorage.getItem('token')
          ? `Bearer ${JSON.parse(localStorage.getItem('token') || '{}')}`
          : '',
        'Content-Type': 'application/json',
      },
    };
    const response = await axios(config);
    response.data.data.questions = response.data.data.question_data;

    setViewData(response.data.data);
    setOpenView(true);
  };
  const listboxRef = useRef<HTMLDivElement | null>(null); // Specify the correct type
  const labelHeight = 16; // Assuming the height of the "Select an assessment" label is 30px
  useEffect(() => {
    if (listboxRef.current) {
      // Calculate available space between label and bottom of the screen
      const windowHeight = window.innerHeight;
      const labelPosition = listboxRef.current.getBoundingClientRect().top;
      const availableSpace = windowHeight - labelPosition - labelHeight;

      // Set the maxHeight of the ListboxProps to the available space or 227px (whichever is smaller)
      listboxRef.current.style.maxHeight = `${Math.min(availableSpace, 227)}px`;
    }
  }, []);

  return (
    <Dialog
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            // width: "100%",
            maxWidth: '1000px',
            height: '100%', // Set your width here
          },
        },
      }}
      open={openAssessment}
    >
      <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
        <div className="flex justify-between items-center">
          <div>Add Assessment</div>
          <div>
            <AiOutlineClose onClick={handleClickClose} />
          </div>
        </div>
      </DialogTitle>

      <DialogContent sx={{ width: '800px' }}>
        <Box className="border border-[#CBD5E1] rounded-md mt-5 p-3 pl-2">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label className="text-blue-900 font-medium">Term</label>
            </Grid>
            <Grid item xs={6}>
              <p>
                {assessmentInitialValues?.term.label}{' '}
                {assessmentInitialValues?.year}
              </p>
            </Grid>
            <Grid item xs={6}>
              <label className="text-blue-900 font-medium">Course</label>
            </Grid>
            <Grid item xs={6}>
              <p>{assessmentInitialValues?.course_details_id.name}</p>
            </Grid>

            <Grid item xs={6}>
              <label className="text-blue-900 font-medium">Course Prefix</label>
            </Grid>
            <Grid item xs={6}>
              <p>{assessmentInitialValues?.course_prefix_id.name}</p>
            </Grid>
          </Grid>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={(values) => {
            values.course_id = assessmentInitialValues?.id;
            dispatch(
              addAssessmentData(
                values,
                setOpenAssessment,
                getAssessmentByCourse,
                params
              )
            );
          }}
        >
          {({
            values,
            isValid,
            handleChange,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form className="min-h-max">
              <Box className="border border-[#CBD5E1] rounded-md mt-5 p-3  h-auto">
                <Grid container rowGap={2} className="items-center">
                  <Grid item xs={6}>
                    <label className="text-blue-900 font-medium">
                      Enter a label
                    </label>
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      variant="standard"
                      size="small"
                      name="label"
                      fullWidth
                      value={values.label}
                      helperText={
                        errors.label && touched.label ? errors.label : ''
                      }
                      error={errors.label && touched.label ? true : false}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <label className="text-blue-900 font-medium">
                      No of Administrations
                    </label>
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      name="no_of_administrations"
                      variant="standard"
                      size="small"
                      type="number"
                      fullWidth
                      inputProps={{ min: 1, max: 16 }}
                      value={values.no_of_administrations}
                      helperText={
                        errors.noOfAdministrations &&
                        touched.noOfAdministrations
                          ? errors.noOfAdministrations
                          : ''
                      }
                      error={
                        errors.noOfAdministrations &&
                        touched.noOfAdministrations
                          ? true
                          : false
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <label className="text-blue-900 font-medium">
                      Select an assessment
                    </label>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="assessment_id"
                      component={Autocomplete}
                      open
                      value={values.assessment_id}
                      options={assessmentDetails?.record || []}
                      groupBy={(option: any) => option?.discipline}
                      ListboxProps={{ style: { maxHeight: 340 } }}
                      // Add PopperComponent to position the dropdown below the label
                      PopperComponent={(props: any) => (
                        <div
                          {...props}
                          ref={listboxRef}
                          style={{ marginTop: labelHeight }}
                        />
                      )}
                      getOptionLabel={(option: {
                        code: string;
                        discipline: string;
                        official_name: string;
                      }) =>
                        option.official_name === undefined
                          ? ''
                          : option.official_name
                      }
                      isOptionEqualToValue={(
                        option: {
                          code: string;
                          discipline: string;
                          official_name: string;
                        },
                        current: {
                          code: string;
                          discipline: string;
                          official_name: string;
                        }
                      ) => option === current}
                      onChange={(
                        event: React.SyntheticEvent,
                        assessment_id: {
                          code: string;
                          discipline: string;
                          official_name: string;
                        }
                      ) => {
                        setFieldValue('assessment_id', assessment_id);
                      }}
                      onBlur={() => setFieldTouched('assessment_id', true)}
                      filterOptions={(
                        options: any[],
                        { inputValue }: { inputValue: string }
                      ) =>
                        options.filter((option) => {
                          const officialNameMatches = option.official_name
                            .toLowerCase()
                            .includes(inputValue.toLowerCase());
                          const disciplineMatches = option.discipline
                            .toLowerCase()
                            .includes(inputValue.toLowerCase());
                          return officialNameMatches || disciplineMatches;
                        })
                      }
                      renderInput={(params: AutocompleteRenderInputParams) => (
                        <TextField
                          sx={{
                            '& .MuiAutocomplete-listbox': {
                              maxHeight: '227px',
                            },
                          }}
                          {...params}
                          variant="standard"
                          error={
                            !!errors.assessment_id && !!touched.assessment_id
                          }
                          helperText={
                            !!errors.assessment_id && !!touched.assessment_id
                              ? 'Required Field'
                              : ''
                          }
                          required
                          fullWidth
                          inputProps={{
                            ...params.inputProps,
                            placeholder: 'Search...',
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                {/* <div
                  className="flex gap-3 justify-start"
                  style={{ marginTop: '10px' }}
                >
                  <Button
                    variant="contained"
                    disabled={!values?.assessment_id}
                    style={{ textTransform: 'capitalize' }}
                    onClick={() => handleClickView(values.assessment_id)}
                  >
                    View
                  </Button>
                </div>
                <div
                  className="flex gap-3 justify-end"
                  style={{ marginTop: '-34px' }}
                >
                  <Button
                    variant="contained"
                    // fullWidth
                    onClick={handleClickClose}
                    style={{ textTransform: 'capitalize' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    // fullWidth
                    style={{ textTransform: 'capitalize' }}
                    disabled={!isValid}
                  >
                    Save
                  </Button>
                </div> */}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                    padding: '2px',
                  }}
                >
                  <div>
                    {' '}
                    <Button
                      variant="contained"
                      disabled={!values?.assessment_id}
                      style={{ textTransform: 'capitalize' }}
                      onClick={() => handleClickView(values.assessment_id)}
                    >
                      View
                    </Button>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      variant="contained"
                      // fullWidth
                      onClick={handleClickClose}
                      style={{ textTransform: 'capitalize' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      // fullWidth
                      style={{ textTransform: 'capitalize' }}
                      disabled={!isValid}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </Box>

              <ViewAssessment
                open={openView}
                setOpen={setOpenView}
                data={viewData}
              />

              {/* <br></br>
              <br></br>
              values
              <pre>{JSON.stringify(values, null, 2)}</pre>
              errors
              <pre>{JSON.stringify(errors, null, 2)}</pre>
              touched
              <pre>{JSON.stringify(touched, null, 2)}</pre> */}
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default AddAssessment;
