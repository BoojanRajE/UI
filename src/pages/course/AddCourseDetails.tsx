import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import { getOrganisationData } from '../../reduxStore/reducer/organisationReducer';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';
import Autocomplete, {
  AutocompleteRenderInputParams,
  createFilterOptions,
} from '@mui/material/Autocomplete';

import { getDiscipline } from '../../reduxStore/reducer/disciplineReducer';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AgGridReact } from 'ag-grid-react';
import {
  addCourseDetailsData,
  deleteCourseDetailsData,
  editCourseDetailsData,
  getCourseDetailsData,
  getCourseDetailsDetail,
  getCourseDetailsName,
  getSearchData,
} from '../../reduxStore/reducer/courseDetailsReducer';
import { GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import Organisation from '../organisation/Organisation';
import { Organization } from '../organisation/OrganizationForm';

import moment from 'moment';
import { createServerSideDatasource } from '../../utils/gridMethod/createServerSideDatasource';
import { getOrganizationName } from '../../reduxStore/reducer/organisationReducer';
import { getCoursePrefixName } from '../../reduxStore/reducer/coursePrefixReducer';
import MasterGrid from '../../utils/MasterGrid/MasterGrid';
import GridHeader1 from '../../utils/gridHeader/GridHeader1';
import { AiOutlineClose } from 'react-icons/ai';
import { CourseDetails } from '../courseDetails/CourseDetails';
import { getUserById } from '../../reduxStore/reducer/registerReducer';
// import FileImport from "./FileImport";

function AddCourseDetails({
  openDialog,
  setOpenFormDetails,
  initialValuesDetails,
  setInitialValueDetails,
  gridApi,
  organization,
  coursePrefix,
  mCoursePrefixName,
}: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEdit, setIsEdit] = useState(false);
  var mCoursePrefixName: any;

  const filter = createFilterOptions();
  //for delete call
  // const [dataSource, setDataSource] = useState();
  //for delete call
  // const [params, setParams] = useState();
  // const getUserDataAndType = useSelector(
  //   (state: any) => state.register.getUserById
  // );

  // const data = {
  //   // define your properties here
  // };

  // const getUserDataAndType = useSelector(
  //   (state: any) => state.register.getUserById
  // );

  // useEffect(() => {
  //   // dispatch(
  //   //   getUserById({
  //   //     id: `${JSON.parse(localStorage.getItem("token") || "{}")}`,
  //   //   })
  //   // );

  //   //get all instructors if admin else from particular orgnization
  //   if (organization) {
  //     dispatch(getCoursePrefixName(organization));
  //   } else {
  //     dispatch(getCoursePrefixName());
  //   }
  // }, [organization]);

  // useEffect(() => {
  //   dispatch(getCoursePrefixName());
  //   dispatch(getOrganizationName());
  // }, []);
  // const organizationName: { id: string; name: string }[] = useSelector(
  //   (state: RootState) => state.organization.organizationName
  // );

  // const coursePrefixName = useSelector(
  //   (state: RootState) => state.courseprefix.coursePrefixName
  // );

  //
  // useEffect(() => {
  //   dispatch(getCoursePrefixName(organization));
  // }, [organization]);

  //

  const [initialValues, setInitialValue] = useState<any>({
    id: '',
    organization_name: '',
    name: '',
    number: '',
    course_prefix_name: null,
    is_active: true,
    created_by: '',
  });

  const validation = Yup.object({
    name: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
    course_prefix_name: Yup.object({
      id: Yup.string(),
      name: Yup.string().matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      ),
    })
      .nullable()
      .required('Required Field'),

    number: Yup.string()
      .matches(
        /^[a-zA-z0-9]/,
        'starting letter should not be a space or special characters'
      )
      .required('Required Field'),
  });

  // useEffect(() => {
  //   if (coursePrefixName) {
  //     mCoursePrefixName = [...coursePrefixName];
  //     mCoursePrefixName = mCoursePrefixName.map((course: any, index: any) => {
  //       return Object.assign({}, course, { key: index + 1 });
  //     });

  //     mCoursePrefixName.unshift({
  //       id: "",
  //       name: "ADD NEW PREFIX",
  //     });
  //   }
  // }, [organization]);

  const handleClickClose = () => {
    setOpenFormDetails({ ...openDialog, open: false });
  };

  return (
    <Dialog open={openDialog.open}>
      <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
        <div className="flex justify-between items-center">
          <div>{isEdit ? 'Update Course Details ' : 'Add Course Details'}</div>
          <div>
            <AiOutlineClose onClick={handleClickClose} />
          </div>
        </div>
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validation}
        onSubmit={(values, actions) => {
          //
          //
          values.organization = organization;
          // values.course_prefix = coursePrefix;
          if (!isEdit) {
            dispatch(
              addCourseDetailsData(
                values,
                setOpenFormDetails,
                '',
                (data: any) => {
                  openDialog.callback('course_details_id', {
                    id: data.id,
                    name: data.name,
                    number: data.number,
                    prefix: data.prefix,
                  });
                  dispatch(getCourseDetailsName(organization?.id));
                  dispatch(getCoursePrefixName(organization?.id));
                },
                gridApi
              )
            );
          } else dispatch(editCourseDetailsData(values, setOpenFormDetails));
        }}
      >
        {({
          values,
          errors,
          touched,
          setFieldTouched,
          setFieldValue,
          isValid,
          isSubmitting,
        }) => (
          <DialogContent
            sx={{ width: '600px', height: 'fitContent', overflowX: 'hidden' }}
          >
            <Form>
              <Field
                as={TextField}
                label="Course Name"
                variant="standard"
                required
                name="name"
                // value={values.name}
                // disabled={isEdit}
                helperText={errors?.name && touched?.name ? errors?.name : ''}
                error={errors?.name && touched?.name}
                fullWidth
                sx={{ marginBottom: '15px' }}
              />
              <Field
                name="course_prefix_name"
                as={Autocomplete}
                // disabled={values.organization_name ? false : true}
                // className="max-w-xs"
                value={values?.course_prefix_name}
                size="small"
                // freeSolo
                options={mCoursePrefixName?.length ? mCoursePrefixName : []}
                getOptionLabel={(option: any) => {
                  if (typeof option?.name === 'string') {
                    return option?.name;
                  }

                  if (option?.inputValue) {
                    return option.inputValue;
                  }
                  return option?.name;
                }}
                onChange={(event: React.SyntheticEvent, course_prefix: any) => {
                  //{inputValue: 'as', name: 'Add "as"'}
                  //{id: 'aa936b87-d45f-4c52-83f3-9779b7247184', name: 'ATM', key: 3}

                  //  if (course_prefix?.name == "ADD NEW PREFIX") {
                  // setOpenForm({
                  //   ...openForm,
                  //   ...{ open: true, callback: setFieldValue },
                  // });
                  //} else {
                  if (Object.hasOwn(course_prefix, 'inputValue')) {
                    setFieldValue('course_prefix_name', {
                      id: '',
                      name: course_prefix.inputValue,
                    });
                  } else {
                    setFieldValue('course_prefix_name', course_prefix);
                  }
                  //}
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                filterOptions={(options: any, params: any) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option: any) => inputValue === option.name
                  );
                  if (inputValue !== '' && !isExisting) {
                    filtered.unshift({
                      inputValue,
                      name: `Add "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                onBlur={() => setFieldTouched('course_prefix_name', true)}
                renderInput={(params: AutocompleteRenderInputParams) => (
                  <TextField
                    {...params}
                    variant="standard"
                    // placeholder="Select"
                    // error={
                    //   errors.course_prefix_name && touched.course_prefix_name
                    //     ? true
                    //     : false
                    // }
                    label="Course Prefix"
                    required
                    //@ts-ignore
                    helperText={(() => {
                      if (typeof errors?.course_prefix_name === 'object')
                        if (
                          //@ts-ignore
                          errors?.course_prefix_name?.name &&
                          touched?.course_prefix_name
                        )
                          //@ts-ignore
                          return errors?.course_prefix_name?.name;

                      if (
                        errors?.course_prefix_name &&
                        touched?.course_prefix_name
                      )
                        return errors?.course_prefix_name;
                      else return '';
                    })()}
                    //@ts-ignore
                    error={
                      errors?.course_prefix_name && touched?.course_prefix_name
                    }
                    sx={{ marginBottom: '15px' }}
                  />
                )}
              />
              <Field
                as={TextField}
                label="Course Number"
                variant="standard"
                name="number"
                required
                // type="number"
                fullWidth
                helperText={
                  errors?.number && touched?.number ? errors?.number : ''
                }
                error={errors?.number && touched?.number}
                sx={{ marginBottom: '15px' }}
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
                  type="submit"
                  disabled={isSubmitting}
                  // fullWidth
                  // disabled={!isValid}
                  style={{ textTransform: 'capitalize' }}
                >
                  {isEdit ? 'Update' : 'Save'}
                </Button>
              </div>
              {/* <br></br>
              <br></br>
              values
              <pre>{JSON.stringify(values, null, 2)}</pre>
              errors
              <pre>{JSON.stringify(errors, null, 2)}</pre>
              touched
              <pre>{JSON.stringify(touched, null, 2)}</pre> */}
            </Form>
          </DialogContent>
        )}
      </Formik>
    </Dialog>
  );
}

export default AddCourseDetails;
{
  /* {getUserDataAndType?.data?.type === "admin" &&(
              <Field
                name="organization_name"
                component={Autocomplete}
                required
                value={values?.organization_name} //organization object not name
                options={organizationName?.length > 0 ? organizationName : []}
                ListboxProps={{ style: { maxHeight: 250 } }}
                readOnly={isEdit}
                fullWidth
                getOptionLabel={(option: { id: string; name: string }) =>
                  option?.name === undefined ? "" : option?.name
                }
                isOptionEqualToValue={(
                  option: { id: string; name: string },
                  current: { id: string; name: string }
                ) => option.id === current.id}
                onChange={(
                  event: React.SyntheticEvent,
                  organization_name: { id: string; name: string }
                ) => {
                  
                  setFieldValue("organization_name", organization_name);
                }}
                onBlur={() => setFieldTouched("organization_name", true)}
                renderInput={(params: AutocompleteRenderInputParams) => (
                  <TextField
                    {...params}
                    // name="organization_name"
                    variant="standard"
                    label="Organization"
                    error={
                      errors.organization_name && touched.organization_name
                        ? true
                        : false
                    }
                    helperText={
                      errors.organization_name && touched.organization_name
                        ? "Required Field"
                        : ""
                    }
                    required
                  />
                )}
                sx={{ marginBottom: "15px" }}
              />
              )} */
}
