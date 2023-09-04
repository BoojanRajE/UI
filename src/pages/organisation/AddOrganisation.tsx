import React, { useState, useCallback, useContext, useEffect } from 'react';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import {
  addOrganisationData,
  addOrganisationDataSignup,
  editOrganisationData,
} from '../../reduxStore/reducer/organisationReducer';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import { Organization } from './OrganizationForm';
import MenuItem from '@mui/material/MenuItem';
import * as Yup from 'yup';
import Select, { components, IndicatorsContainerProps } from 'react-select';
import { getAllMetaDataByType } from '../../reduxStore/reducer/metaDataReducer';
import { AiOutlineClose } from 'react-icons/ai';
import {
  handleAddTransaction,
  handleUpdateTransaction,
} from '../../utils/gridMethod/GridTransaction';
import { ColumnApi, Grid, GridApi } from 'ag-grid-community';
import { OrganizeImportsMode } from 'typescript';
function AddOrganisation({
  open = true,
  setOpen,
  gridApi,
  columnApi,
  isEdit,
  editFormValues = null,
  editFormSetValues,
  state,
  setOrganizationState,
  organization,
  organizationLabel,
  scroll,
}: {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  gridApi?: GridApi;
  columnApi?: ColumnApi;
  isEdit?: boolean;
  editFormValues?: any;
  editFormSetValues?: any;
  state?: any;
  setOrganizationState?: any;
  organization?: any;
  organizationLabel?: any;
  scroll?: any;
}) {
  //griApi & columnApi is optional due to secondStep file
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const formikRef = React.useRef(null);
  // let [open, setOpenOrg] = useState(true);
  // if (!setOpen) {
  //   setOpen = setOpenOrg;
  // }

  useEffect(() => {
    dispatch(getAllMetaDataByType('states'));
    dispatch(getAllMetaDataByType('countries'));
  }, []);
  const countriesMetaData: { value: string }[] = useSelector(
    (state: RootState) => state.metaData.countries
  );
  const statesMetaData: { value: string }[] = useSelector(
    (state: RootState) => state.metaData.states
  );

  let initialValues: any;

  if (editFormValues) {
    if (typeof editFormValues.state === 'string') {
      editFormValues['state'] = { value: editFormValues?.state };
      editFormValues['country'] = { value: editFormValues?.country };
    }
    // editFormValues.state = {value: editFormValues.state}
    // editFormValues.country = {value: editFormValues.country}
    initialValues = editFormValues;
  } else {
    initialValues = {
      id: '',
      name: '',
      city: '',
      state: null,
      country: null,
      sector: '1',
      type: '1',
      other_type_desc: '',
      ihe_classification: [],
      ug_full_time_enrollment: false,
      ug_part_time_enrollment: false,
      graduate_enrollment: false,
      is_active: true,
      created_by: '',
    };
  }
  // const { state }: { state: Organization } = useLocation();
  // let initialValues: Organization;
  // if (state) {
  //on update state & country data is string so convert it to object
  // initialValues = {
  //   ...state,
  //   state: { value: state.state },
  //   country: { value: state.country },
  // };
  // } else {
  // }
  const validation = Yup.object({
    name: Yup.string()
      .min(3, 'Please enter a minimum of 3 letters.')
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed.')
      .matches(/^[^\s].*$/, 'The starting letter should not be a space.')
      .matches(/[^\s]$/, 'Ending letter should not be a space.')
      .required('Required Field'),
    city: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed.')
      .matches(/^[^\s].*$/, 'The starting letter should not be a space.')
      .matches(/[^\s]$/, 'Ending letter should not be a space.')
      .min(3, 'Please enter a minimum of 3 letters.')
      .required('Required Field'),
    state: Yup.object({
      value: Yup.string(),
    })
      .nullable()
      .required('Required Field'),
    country: Yup.object({
      value: Yup.string(),
    })
      .nullable()
      .required('Required Field'),
    sector: Yup.string().required('Required Field'),
    type: Yup.string().required('Required Field'),
  });
  const handleClickClose = () => {
    if (editFormSetValues)
      editFormSetValues({
        id: '',
        name: '',
        city: '',
        state: null,
        country: null,
        sector: '1',
        type: '1',
        other_type_desc: '',
        ihe_classification: [],
        ug_full_time_enrollment: false,
        ug_part_time_enrollment: false,
        graduate_enrollment: false,
        is_active: true,
        created_by: '',
      });
    // if (state) {
    //   navigate("/organization");
    // }
    setOpen(false);
  };

  const handleSubmit = () => {
    if (formikRef.current) {
      //@ts-ignore
      formikRef.current.submitForm();
    }
  };

  return (
    <main className="min-w-fit p-3 box-border mt-5 mr-4 shadow-2xl">
      <Dialog open={open} scroll={scroll}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>{isEdit ? 'Update Organization' : 'Add Organization'}</div>
            <div>
              <AiOutlineClose onClick={handleClickClose} />
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <div>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={validation}
              onSubmit={(values) => {
                //on submit state & country's are object convert it to string
                const formState = { ...values };
                formState.state = values.state.value;
                formState.country = values.country.value;
                if (isEdit) {
                  editOrganisationData(
                    formState,
                    setOpen,
                    gridApi,
                    handleUpdateTransaction
                  );
                } else if (state === 'signup') {
                  dispatch(
                    addOrganisationDataSignup(
                      formState,
                      setOpen,
                      gridApi,
                      handleAddTransaction,
                      setOrganizationState,
                      organization,
                      organizationLabel
                    )
                  );
                } else {
                  dispatch(
                    addOrganisationData(
                      formState,
                      setOpen,
                      gridApi,
                      handleAddTransaction
                    )
                  );
                }
              }}
            >
              {({
                isValid,
                values,
                handleSubmit,
                setFieldTouched,
                setFieldValue,
                errors,
                touched,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <h3 className="text-xl font-medium mt-1">
                    {' '}
                    New Institution Name and Location
                  </h3>{' '}
                  <div className="grid gap-y-5 mt-8 ml-2 sm:grid-cols-1">
                    {' '}
                    <Field
                      name="name"
                      as={TextField}
                      size="small"
                      label="Institution Name"
                      fullwidth
                      disabled={isEdit}
                      error={errors.name && touched.name ? true : false}
                      helperText={
                        errors.name && touched.name ? errors?.name : ''
                      }
                      required
                    />{' '}
                    <Field
                      name="city"
                      as={TextField}
                      size="small"
                      label="City"
                      fullwidth
                      error={errors.city && touched.city ? true : false}
                      helperText={
                        errors.city && touched.city ? errors?.city : ''
                      }
                      required
                    />{' '}
                    <div className="grid grid-cols-2 gap-x-5 max-sm:grid-cols-1 max-sm:gap-y-5">
                      {' '}
                      <Field
                        name="state"
                        component={Autocomplete}
                        value={values?.state}
                        size="small"
                        options={statesMetaData}
                        getOptionLabel={(option: { value: string }) =>
                          option.value === undefined ? '' : option.value
                        }
                        isOptionEqualToValue={(
                          option: { value: string },
                          current: { value: string }
                        ) => option.value === current.value}
                        onChange={(
                          event: React.SyntheticEvent,
                          state: { value: string }
                        ) => {
                          setFieldValue('state', state);
                        }}
                        onBlur={() => setFieldTouched('state', true)}
                        renderInput={(
                          params: AutocompleteRenderInputParams
                        ) => (
                          <TextField
                            {...params}
                            name="state"
                            variant="outlined"
                            label="State"
                            error={errors.state && touched.state ? true : false}
                            helperText={
                              errors.state && touched.state
                                ? 'Required Field'
                                : ''
                            }
                            required
                          />
                        )}
                      />{' '}
                      <Field
                        name="country"
                        component={Autocomplete}
                        value={values?.country}
                        size="small"
                        options={countriesMetaData}
                        getOptionLabel={(option: { value: string }) =>
                          option.value === undefined ? '' : option.value
                        }
                        isOptionEqualToValue={(
                          option: { value: string },
                          current: { value: string }
                        ) => option.value === current.value}
                        onChange={(
                          event: React.SyntheticEvent,
                          country: { value: string }
                        ) => {
                          setFieldValue('country', country);
                        }}
                        onBlur={() => setFieldTouched('country', true)}
                        renderInput={(
                          params: AutocompleteRenderInputParams
                        ) => (
                          <TextField
                            {...params}
                            name="country"
                            variant="outlined"
                            label="Country"
                            error={
                              errors.country && touched.country ? true : false
                            }
                            helperText={
                              errors.country && touched.country
                                ? 'Required Field'
                                : ''
                            }
                            required
                          />
                        )}
                      />{' '}
                    </div>{' '}
                  </div>{' '}
                  <h3 className="text-xl font-medium mt-8">
                    {' '}
                    Organization Sector
                    <span className="text-red-500 text-lg"> *</span>{' '}
                    <ErrorMessage
                      name="sector"
                      component="span"
                      className="text-red-600 ml-2 text-sm"
                    />{' '}
                  </h3>{' '}
                  <RadioGroup name="sector">
                    <div className="grid gap-y-2 mt-2 place-items-start sm:max-w-3xl sm:grid-cols-4 sm:indent-4">
                      <label htmlFor="public" className="sm:col-span-2">
                        <Field
                          as={Radio}
                          name="sector"
                          id="public"
                          sx={{ width: '12px', marginRight: '4px' }}
                          checked={values.sector == '1'}
                          value="1"
                        />
                        <span className="ml-4">Public</span>
                      </label>

                      <label htmlFor="private" className="sm:col-span-2">
                        <Field
                          as={Radio}
                          name="sector"
                          id="private"
                          sx={{ width: '12px', marginRight: '4px' }}
                          checked={values.sector == '2'}
                          value="2"
                        />
                        <span className="ml-4">Private</span>
                      </label>
                    </div>
                  </RadioGroup>
                  <h3 className="text-xl font-medium mt-8">
                    {' '}
                    Organization Type
                    <span className="text-red-500 text-lg"> *</span>{' '}
                    <ErrorMessage
                      name="sector"
                      component="span"
                      className="text-red-600 ml-2 text-sm"
                    />{' '}
                  </h3>{' '}
                  <RadioGroup name="type">
                    <div className="grid gap-y-2 mt-2 place-items-start sm:max-w-3xl sm:grid-cols-4 sm:indent-4">
                      <label
                        htmlFor="institutionOfHigherEducation"
                        className="sm:col-span-2"
                      >
                        {' '}
                        <Field
                          as={Radio}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="institutionOfHigherEducation"
                          name="type"
                          checked={values.type == '1'}
                          value="1"
                        />
                        <span className="ml-4  w-36">
                          Institution of Higher &nbsp; &nbsp; &nbsp; &nbsp;
                          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                          &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;Education
                        </span>
                      </label>
                      <label
                        htmlFor="governmentAgency"
                        className="sm:col-span-2"
                      >
                        {' '}
                        <Field
                          as={Radio}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="governmentAgency"
                          name="type"
                          checked={values.type == '2'}
                          value="2"
                        />
                        <span className="ml-4">Government agency</span>
                      </label>
                      <label htmlFor="k12School" className="sm:col-span-2">
                        {' '}
                        <Field
                          as={Radio}
                          id="k12School"
                          sx={{ width: '12px', marginRight: '4px' }}
                          name="type"
                          checked={values.type == '3'}
                          value="3"
                        />
                        <span className="ml-4">K-12 School</span>
                      </label>
                      <label
                        htmlFor="otherNonProfitOrganisation"
                        className="sm:col-span-2"
                      >
                        {' '}
                        <Field
                          as={Radio}
                          id="otherNonProfitOrganisation"
                          sx={{ width: '12px', marginRight: '4px' }}
                          name="type"
                          checked={values.type == '4'}
                          value="4"
                        />
                        <span className="ml-4">
                          Other non-profit organization
                        </span>
                      </label>
                      <label
                        htmlFor="professionalSociety"
                        className="sm:col-span-2"
                      >
                        {' '}
                        <Field
                          as={Radio}
                          id="professionalSociety"
                          sx={{ width: '12px', marginRight: '4px' }}
                          name="type"
                          checked={values.type == '5'}
                          value="5"
                        />
                        <span className="ml-4">Professional society</span>
                      </label>
                      <label
                        htmlFor="forProfitEnterprise"
                        className="sm:col-span-2"
                      >
                        {' '}
                        <Field
                          as={Radio}
                          id="forProfitEnterprise"
                          sx={{ width: '12px', marginRight: '4px' }}
                          name="type"
                          checked={values.type == '6'}
                          value="6"
                        />
                        <span className="ml-4">For-profit enterprise</span>
                      </label>
                      <div className="mt-2 flex gap-x-8 items-center sm:col-span-4">
                        {' '}
                        <label htmlFor="otherTextDesc" className="min-w-fit">
                          {' '}
                          <Field
                            as={Radio}
                            id="otherTextDesc"
                            sx={{ width: '12px', marginRight: '4px' }}
                            name="type"
                            checked={values.type == '7'}
                            value="7"
                          />
                          <span className="ml-4">Other</span>
                        </label>
                        <Field
                          id="other_type_desc"
                          {...(values.type === '7'
                            ? { className: 'input-field h-9 col-span-3' }
                            : { className: 'hidden' })}
                          name="other_type_desc"
                          type="text"
                        />{' '}
                      </div>{' '}
                    </div>{' '}
                  </RadioGroup>{' '}
                  <div
                    {...(values.type !== '1'
                      ? { className: 'h-0 opacity-0 hidden' }
                      : { className: 'transition-all delay-75 block' })}
                  >
                    {' '}
                    <h3 className="text-xl font-medium mt-8">
                      {' '}
                      IHE Classifications
                    </h3>{' '}
                    <div className="grid gap-y-2 mt-4 sm:max-w-3xl sm:grid-cols-2 sm:indent-4">
                      {' '}
                      <label htmlFor="researchIntensiveUniversity">
                        {' '}
                        <Field
                          as={Checkbox}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="researchIntensiveUniversity"
                          name="ihe_classification"
                          checked={values.ihe_classification?.includes('1')}
                          value="1"
                        />
                        <span className="ml-4">
                          Research Intensive University
                        </span>
                      </label>
                      <label htmlFor="hispanicServingInstitution">
                        {' '}
                        <Field
                          as={Checkbox}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="hispanicServingInstitution"
                          name="ihe_classification"
                          checked={values.ihe_classification?.includes('2')}
                          value="2"
                        />
                        <span className="ml-4">
                          Hispanic Serving Institution
                        </span>
                      </label>
                      <label htmlFor="teachingIntensiveUniversity">
                        {' '}
                        <Field
                          as={Checkbox}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="teachingIntensiveUniversity"
                          name="ihe_classification"
                          checked={values.ihe_classification?.includes('3')}
                          value="3"
                        />
                        <span className="ml-4">
                          Teaching intensive university
                        </span>
                      </label>
                      <label htmlFor="minorityServingInstitution">
                        {' '}
                        <Field
                          as={Checkbox}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="minorityServingInstitution"
                          name="ihe_classification"
                          checked={values.ihe_classification?.includes('4')}
                          value="4"
                        />
                        <span className="ml-4">
                          Minority-Serving Institution
                        </span>
                      </label>
                      <label htmlFor="historicallyBlackCollegeOrUniversity">
                        {' '}
                        <Field
                          as={Checkbox}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="historicallyBlackCollegeOrUniversity"
                          name="ihe_classification"
                          checked={values.ihe_classification?.includes('5')}
                          value="5"
                        />
                        <span className="ml-4  w-36">
                          Historically Black College or &nbsp; &nbsp; &nbsp;
                          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;University
                        </span>
                      </label>
                      <label htmlFor="twoYearCollege">
                        {' '}
                        <Field
                          as={Checkbox}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="twoYearCollege"
                          name="ihe_classification"
                          checked={values.ihe_classification?.includes('6')}
                          value="6"
                        />
                        <span className="ml-4">Two-year college</span>
                      </label>
                      <label htmlFor="tribalCollege">
                        {' '}
                        <Field
                          as={Checkbox}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="tribalCollege"
                          name="ihe_classification"
                          checked={values.ihe_classification?.includes('7')}
                          value="7"
                        />
                        <span className="ml-4">Tribal College</span>
                      </label>
                    </div>
                    <h3 className="text-xl font-medium mt-3">Enrollment</h3>
                    <div className="grid gap-y-2 mt-4 sm:max-w-3xl sm:grid-cols-2 sm:indent-4">
                      <label htmlFor="ugFullTime">
                        <Field
                          as={Checkbox}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="ugFullTime"
                          name="ug_full_time_enrollment"
                          checked={values.ug_full_time_enrollment}
                          className="check-field h-5"
                        />
                        <span className="ml-4">Undergraduate Full-time</span>
                      </label>
                      <label htmlFor="ugPartTime">
                        <Field
                          as={Checkbox}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="ugPartTime"
                          name="ug_part_time_enrollment"
                          checked={values.ug_part_time_enrollment}
                          className="check-field h-5"
                        />
                        <span className="ml-4">Undergraduate Part-time</span>
                      </label>
                      <label htmlFor="graduate">
                        <Field
                          as={Checkbox}
                          sx={{ width: '12px', marginRight: '4px' }}
                          id="graduate"
                          name="graduate_enrollment"
                          checked={values.graduate_enrollment}
                          className="check-field h-5"
                        />
                        <span className="ml-4">Graduate</span>
                      </label>
                    </div>
                  </div>
                  {/* <div className="flex gap-3 justify-end mt-5">
                    {' '}
                    <Button
                      variant="contained"
                      style={{ textTransform: 'capitalize' }}
                      // fullWidth
                      onClick={handleClickClose}
                    >
                      {' '}
                      Cancel
                    </Button>{' '}
                    <Button
                      variant="contained"
                      style={{ textTransform: 'capitalize' }}
                      type="submit"
                      // fullWidth
                      disabled={!isValid}
                    >
                      {' '}
                      {isEdit ? 'Update' : 'Save'}
                    </Button>{' '}
                  </div>{' '} */}
                </Form>
              )}
            </Formik>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-3 justify-end mt-5">
            {' '}
            <Button
              variant="contained"
              style={{ textTransform: 'capitalize' }}
              // fullWidth
              onClick={handleClickClose}
            >
              {' '}
              Cancel
            </Button>{' '}
            <Button
              variant="contained"
              style={{ textTransform: 'capitalize' }}
              onClick={handleSubmit}
              // fullWidth
              //@ts-ignore
              // disabled={!formikRef?.current?.isValid}
            >
              {' '}
              {isEdit ? 'Update' : 'Save'}
            </Button>{' '}
          </div>{' '}
        </DialogActions>
      </Dialog>
    </main>
  );
}
export default AddOrganisation;
