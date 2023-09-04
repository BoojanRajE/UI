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
  getSearchData,
} from '../../reduxStore/reducer/courseDetailsReducer';
import {
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
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
import { getUserById } from '../../reduxStore/reducer/registerReducer';

import GridHeader2 from '../../utils/gridHeader/GridHeader2';
import debounce from 'lodash/debounce';
import { ServerSideGrid } from '../../utils/MasterGrid/ServerSideGrid';
import { ColumnApi } from 'ag-grid-community';
// import FileImport from "./FileImport";

export interface CourseDetails {
  id: string;
  organization_name: any; //object when submit over form, string when fetched from db
  name: string;
  number: any;
  course_prefix_name: any; //object when submit over form, string when fetched from db
  is_active: boolean;
  created_by: string;
}

export interface ExtendedICellRendererParams extends ICellRendererParams {
  setIsEdit: any;
  handleUpdate(data: CourseDetails): void;
  handleDelete(id: string): void;
}

export function Actions(row: ExtendedICellRendererParams) {
  //const {suppliers} = useRoleAuth(); need to uncomment (NTU)
  return (
    <div className="">
      <IconButton
        onClick={() => {
          row.setIsEdit(true);
          row.handleUpdate(row.data);
        }}
        //disabled={!suppliers?.edit} need to uncomment
      >
        <MdModeEdit className="float-right text-blue-600" />
      </IconButton>

      <IconButton
        onClick={() => row.handleDelete(row.data)}
        //disabled={!suppliers?.delete} need to uncomment
      >
        <MdDelete className="float-right text-red-600" />
      </IconButton>
    </div>
  );
}

function CourseDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const gridRef = useRef<AgGridReact<CourseDetails>>(null);
  //for delete call
  const [dataSource, setDataSource] = useState();
  //for delete call
  const [params, setParams] = useState();
  const [flag, setFlag] = useState(true);
  //for changing the value on text field immediately
  const [searchQuery, setSearchQuery] = useState('');
  //Delays capturing, changing text on text field
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();

  useEffect(() => {
    dispatch(getCoursePrefixName());

    dispatch(getOrganizationName());
  }, []);

  const [open, setOpen] = useState(false);

  const [initialValues, setInitialValue] = useState<CourseDetails>({
    id: '',
    organization_name: '',
    name: '',
    number: '',
    course_prefix_name: '',
    is_active: true,
    created_by: '',
  });

  const handleClickClose = () => {
    setOpen(false);
  };

  const getUserDataAndType = useSelector(
    (state: any) => state.register.getUserById
  );

  const data = {
    // define your properties here
  };
  useEffect(() => {
    dispatch(
      getUserById({
        id: `${JSON.parse(localStorage.getItem('token') || '{}')}`,
      })
    );
    // pass the `data` object as an argument
    // dispatch(getSubDisciplineAction());
  }, [dispatch]);

  const [isEdit, setIsEdit] = useState(false);

  const validation = Yup.object({
    // organization_name: Yup.object({
    //   id: Yup.string(),
    //   value: Yup.string(),
    // })
    //   .nullable()
    //   .required("Required Field"),
    name: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
    course_prefix_name: Yup.object({
      id: Yup.string(),
      value: Yup.string(),
    })
      .nullable()
      .required('Required Field'),
  });

  const organizationName: { id: string; name: string }[] = useSelector(
    (state: RootState) => state.organization.organizationName
  );

  const coursePrefixName = useSelector(
    (state: RootState) => state.courseprefix.coursePrefixName
  );

  const handleUpdate = (data: CourseDetails) => {
    dispatch(getCourseDetailsDetail(data.id, setInitialValue));

    setInitialValue(() => {
      const organization_name = organizationName.find(
        (x) => x.name === data.organization_name
      );
      const course_prefix_name = coursePrefixName.find(
        (x: any) => x.name === data.course_prefix_name
      );

      return {
        ...data,
        organization_name,
        course_prefix_name,
      };
    });
    setOpen(true);
  };

  const handleDelete = (data: CourseDetails) => {
    dispatch(deleteCourseDetailsData(data, gridApi));
  };

  const DepartmentDefs = [
    {
      headerName: 'Name',
      field: 'name',
      minWidth: 180,
    },
    {
      headerName: 'Organization',
      field: 'organization_name',
      minWidth: 220,
    },
    {
      headerName: 'Course Prefix',
      field: 'course_prefix_name',
      minWidth: 200,
    },
    // {
    //   headerName: "Add Student",
    //   field: "total",
    //   minWidth: 135,
    //   cellRenderer: FileImport,
    // },

    {
      headerName: 'Number',
      field: 'number',
      minWidth: 120,
      filter: 'agNumberColumnFilter',
    },
    { headerName: 'Created By', field: 'created_by', minWidth: 180 },
    {
      headerName: 'Created At',
      field: 'created_at',
      minWidth: 200,
      filter: 'agDateColumnFilter',
      cellRenderer: (row: ICellRendererParams) => {
        return moment(moment(row.data.created_at).utc())
          .local()
          .format('MM-DD-YYYY hh:mm a');
      },
    },
    {
      headerName: 'Action',
      field: 'action',
      sortable: false,
      filter: false,
      minWidth: 130,
      maxWidth: 140,
      cellRenderer: Actions,
      cellRendererParams: (params: ICellRendererParams) => ({
        ...params,
        setIsEdit,
        handleUpdate,
        handleDelete,
      }),
    },
  ];

  const defaultColDef = {
    resizable: true,
    sortable: flag,
    filter: 'agTextColumnFilter',
    pagination: true,
    flex: 1,
    minWidth: 150,
    filterParams: {
      trimInput: true,
      suppressAndOrCondition: true,
      buttons: ['reset', 'clear'],
    },
  };

  // const onFilterTextBoxChanged = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   let str = e?.target?.value;

  //   const regex = /[*()[\];,'.$:%]/g;

  //   const matcher = str.match(regex);
  //   let found = matcher?.filter((c, index) => {
  //     return matcher?.indexOf(c) === index;
  //   });

  //   found?.forEach((sym) => {
  //     if (sym == "'") str = str.replace(/'/g, "'" + sym);
  //     if (sym == "%") str = str.replace(/%/g, "\\" + sym);
  //     //if (sym == '\\') str = str.replace(sym, '\\' + sym);
  //   });

  //   dispatch(getSearchData(str, params, setFlag));
  // };

  const onGridReady = (params: GridReadyEvent) => {
    const datasource = createServerSideDatasource(
      dispatch,
      getCourseDetailsData,
      setDataSource,
      setParams
    );
    params.api.setServerSideDatasource(datasource);
  };

  const columnchange = async (e: any) => {
    const { id } = e;
  };

  const handleOpenForm = () => {
    setInitialValue({
      id: '',
      organization_name: '',
      name: '',
      number: '',
      course_prefix_name: '',
      is_active: true,
      created_by: '',
    });
    setOpen(true);
    setIsEdit(false);
  };

  const debounceSearch = debounce((value: string) => {
    setDebouncedSearchQuery(value);
  }, 500);

  const onFilterTextBoxChanged = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(e.target.value);
    const value = e.target.value;
    debounceSearch(value);
  };

  const textFieldProps = {
    value: searchQuery,
    onChange: onFilterTextBoxChanged,
  };
  const buttonProps = {
    children: 'Add Course Details',
    onClick: handleOpenForm,
    sm: 'Add',
  };

  return (
    <main>
      <header className="header">Course Details</header>
      <GridHeader2 textFieldProps={textFieldProps} buttonProps={buttonProps} />

      <ServerSideGrid
        rowDataUrl="/course_details/"
        debouncedSearchQuery={searchQuery}
        columnDefs={DepartmentDefs}
        gridApi={gridApi}
        columnApi={columnApi}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
      />

      <Dialog open={open}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>
              {isEdit ? 'Update Course Details ' : 'Add Course Details'}
            </div>
            <div>
              <AiOutlineClose onClick={handleClickClose} />
            </div>
          </div>
        </DialogTitle>

        <Formik
          initialValues={initialValues}
          // validationSchema={validation}
          onSubmit={(values) => {
            if (!isEdit)
              dispatch(addCourseDetailsData(values, setOpen, '', '', gridApi));
            else dispatch(editCourseDetailsData(values, setOpen, gridApi));
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            isValid,
            isSubmitting,
          }) => (
            <DialogContent
              sx={{ width: '600px', height: 'fitContent', overflowX: 'hidden' }}
            >
              <Form>
                {getUserDataAndType?.data?.type === 'admin' && (
                  <Field
                    name="organization_name"
                    component={Autocomplete}
                    required
                    value={values.organization_name} //organization object not name
                    options={organizationName}
                    ListboxProps={{ style: { maxHeight: 250 } }}
                    readOnly={isEdit}
                    fullWidth
                    getOptionLabel={(option: { id: string; name: string }) =>
                      option.name === undefined ? '' : option.name
                    }
                    isOptionEqualToValue={(
                      option: { id: string; name: string },
                      current: { id: string; name: string }
                    ) => option.id === current.id}
                    onChange={(
                      event: React.SyntheticEvent,
                      organization_name: { id: string; name: string }
                    ) => {
                      setFieldValue('organization_name', organization_name);
                    }}
                    onBlur={() => setFieldTouched('organization_name', true)}
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
                            ? 'Required Field'
                            : ''
                        }
                        required
                      />
                    )}
                    sx={{ marginBottom: '15px' }}
                  />
                )}

                <Field
                  as={TextField}
                  label="Course Name"
                  variant="standard"
                  required
                  name="name"
                  value={values.name}
                  // disabled={isEdit}
                  helperText={errors.name && touched.name ? errors.name : ''}
                  fullWidth
                  error={errors.name && touched.name}
                  sx={{ marginBottom: '15px' }}
                />
                <Field
                  as={TextField}
                  label="Course Number"
                  variant="standard"
                  name="number"
                  fullWidth
                  sx={{ marginBottom: '15px' }}
                />
                <Field
                  name="course_prefix_name"
                  component={Autocomplete}
                  required
                  value={values.course_prefix_name} //discipline object not name
                  options={coursePrefixName}
                  // ListboxProps={{ style: { maxHeight: 250 } }}
                  fullWidth
                  getOptionLabel={(option: { id: string; name: string }) =>
                    option.name === undefined ? '' : option.name
                  }
                  isOptionEqualToValue={(
                    option: { id: string; name: string },
                    current: { id: string; name: string }
                  ) => option.id === current.id}
                  onChange={(
                    event: React.SyntheticEvent,
                    course_prefix_name: { id: string; name: string }
                  ) => {
                    columnchange(course_prefix_name);
                    setFieldValue('course_prefix_name', course_prefix_name);
                  }}
                  onBlur={() => setFieldTouched('course_prefix_name', true)}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      name="course_prefix_name"
                      variant="standard"
                      label="Course Prefix"
                      error={
                        errors.course_prefix_name && touched.course_prefix_name
                          ? true
                          : false
                      }
                      helperText={
                        errors.course_prefix_name && touched.course_prefix_name
                          ? 'Required Field'
                          : ''
                      }
                      required
                    />
                  )}
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
    </main>
  );
}

export default CourseDetails;
