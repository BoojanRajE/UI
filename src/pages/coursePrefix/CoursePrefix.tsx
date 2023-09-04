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
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import { getOrganizationName } from '../../reduxStore/reducer/organisationReducer';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';
import Autocomplete, {
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AgGridReact } from 'ag-grid-react';
import {
  addCoursePrefixData,
  deleteCoursePrefixData,
  editCoursePrefixData,
  getCoursePrefixData,
  getCoursePrefixDetailData,
  getSearchData,
} from '../../reduxStore/reducer/coursePrefixReducer';
import { AiOutlineClose } from 'react-icons/ai';
import {
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import Organisation from '../organisation/Organisation';
import { Organization } from '../organisation/OrganizationForm';
import { createServerSideDatasource } from '../../utils/gridMethod/createServerSideDatasource';
import { GridLoading } from '../../utils/MasterGrid/GridLoading';
import { getUserById } from '../../reduxStore/reducer/registerReducer';
import debounce from 'lodash/debounce';
import { ColumnApi } from 'ag-grid-community';
import GridHeader2 from '../../utils/gridHeader/GridHeader2';
import { ServerSideGrid } from '../../utils/MasterGrid/ServerSideGrid';
export interface CoursePrefix {
  id: string;
  organization_name: any;
  name: string;

  is_active: boolean;
  created_by: string;
}

export interface ExtendedICellRendererParams extends ICellRendererParams {
  setIsEdit: any;
  handleUpdate(data: CoursePrefix): void;
  handleDelete(id: string): void;
}

export function Actions(row: ExtendedICellRendererParams) {
  //const {suppliers} = useRoleAuth(); need to uncomment (NTU)
  return (
    <div className="w-24 flex justify-between">
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

function CoursePrefix() {
  const dispatch = useDispatch<AppDispatch>();
  const gridRef = useRef<AgGridReact<CoursePrefix>>(null);
  //for changing the value on text field immediately
  const [searchQuery, setSearchQuery] = useState('');

  //Delays capturing, changing text on text field
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();

  useEffect(() => {
    dispatch(getOrganizationName());
    //dispatch(getAdministrative());
  }, [dispatch]);

  //for delete call
  const [dataSource, setDataSource] = useState();
  //for delete call
  const [params, setParams] = useState();
  const [flag, setFlag] = useState(true);
  const [open, setOpen] = useState(false);
  const handleClickClose = () => {
    setOpen(false);
    setInitialValue({
      id: '',
      organization_name: '',
      name: '',
      is_active: true,
      created_by: '',
    });
  };

  const [initialValues, setInitialValue] = useState<CoursePrefix>({
    id: '',
    organization_name: '',
    name: '',

    is_active: true,
    created_by: '',
  });

  const [isEdit, setIsEdit] = useState(false);

  const organizationData = useSelector(
    (state: RootState) => state.organization.organizationName
  );

  const newOrganizationData = [...organizationData].sort((a: any, b: any) =>
    a.name > b.name ? -1 : 1
  );
  //   const sortedOrgData = sortMaker(organizationData).sort(
  //     (a: any, b: any) => -b.firstLetter.localeCompare(a.firstLetter)
  //   );

  const handleUpdate = (data: CoursePrefix) => {
    setOpen(true);
    setInitialValue(() => {
      //
      let organization_name = '';
      organizationData.map((item: any) => {
        //
        if (item.name === data.organization_name) {
          organization_name = item;
        }
      });
      //   const organization_name = organizationData.find(
      //     (x: any) => x.organization_name === data.organization_name
      //   );
      //
      //   //   const organization_name = organizationData.find(
      //   //     (x) => (x.id === data.organization_id)?.name;
      //   //   );
      //   const organization_name = organizationData.find(
      //     (org: any) => org.id === data.id
      //   )?.name;

      return {
        ...data,
        organization_name,
      };
    });
  };

  const validation = Yup.object({
    organization_name: Yup.object({
      id: Yup.string(),
      value: Yup.string(),
    })
      .nullable()
      .required('Required Field'),
    name: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .matches(
        /^[a-zA-z].+[^\s]$/,
        '      A Minimum Of Three Characters Is Required'
      )
      .required('Required Field'),
  });

  const CoursePrefixDefs = [
    { headerName: 'Name', field: 'name', filter: 'agTextColumnFilter' },
    {
      headerName: 'Organization',
      field: 'organization_name',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Created By',
      field: 'created_by',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Created At',
      field: 'created_at',
      filter: 'agDateColumnFilter',
      cellRenderer: (row: any) => {
        return moment(moment(row.data.created_at).utc())
          .local()
          .format('MM-DD-YYYY hh:mm a');
      },
    },
    {
      headerName: 'Action',
      field: 'action',
      sortable: false,
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

  //For styling mui select elememt
  const selectMenuSty = {
    style: {
      //maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      maxHeight: 48 * 4.5 + 3,
      width: 250,
    },
  };

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: flag,
      filter: true,
      pagination: true,
      flex: 1,
      minWidth: 150,
    }),
    [flag]
  );

  const debounceSearch = debounce((value: string) => {
    setDebouncedSearchQuery(value);
  }, 500);

  const onFilterTextBoxChanged = (e: any) => {
    dispatch(getSearchData(e?.target?.value, params, setFlag));
  };

  const getData = (data: any, params: any) => {
    dispatch(getCoursePrefixData(data, params));
  };

  const onGridReady = (params: GridReadyEvent) => {
    const datasource = createServerSideDatasource(
      dispatch,
      getData,
      setDataSource,
      setParams
    );
    params.api.setServerSideDatasource(datasource);
  };

  const handleDelete = (data: CoursePrefix) => {
    dispatch(deleteCoursePrefixData(data, gridApi));
  };

  const onFilterTextBoxChanged1 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(e.target.value);
    const value = e.target.value;
    debounceSearch(value);
  };

  const handleOpenForm = () => {
    setInitialValue({
      id: '',
      organization_name: '',
      name: '',

      is_active: true,
      created_by: '',
    });
    setIsEdit(false);
    setOpen(true);
  };

  const textFieldProps = {
    value: searchQuery,
    onChange: onFilterTextBoxChanged1,
  };
  const buttonProps = {
    children: 'Add Course Prefix',
    onClick: handleOpenForm,
    sm: 'Add',
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

  return (
    <main>
      <header className="header">Course Prefix</header>
      <GridHeader2 textFieldProps={textFieldProps} buttonProps={buttonProps} />

      <ServerSideGrid
        rowDataUrl="/course_prefix/"
        debouncedSearchQuery={searchQuery}
        columnDefs={CoursePrefixDefs}
        gridApi={gridApi}
        columnApi={columnApi}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
      />

      <Dialog open={open}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>{isEdit ? 'Update Course Prefix ' : 'Add Course Prefix '}</div>
            <div>
              <AiOutlineClose onClick={handleClickClose} />
            </div>
          </div>
        </DialogTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={(values) => {
            if (!isEdit)
              dispatch(
                addCoursePrefixData(
                  values,
                  setOpen,
                  '',
                  '',
                  '',
                  '',
                  gridApi,
                  handleUpdate
                )
              );
            else {
              dispatch(editCoursePrefixData(values, setOpen, gridApi));
              handleClickClose();
            }
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
                {/* <h2>
                  <Typography variant="subtitle1" gutterBottom component="p">
                    Please add your Administrative name
                  </Typography>
                </h2> */}
                {getUserDataAndType?.data?.type === 'admin' && (
                  <Field
                    name="organization_name"
                    component={Autocomplete}
                    value={values.organization_name}
                    options={organizationData}
                    fullWidth
                    isOptionEqualToValue={(option: any, value: any) =>
                      option.id === value
                    }
                    getOptionLabel={(org: any) =>
                      org.name === undefined ? '' : org.name
                    }
                    onChange={(_: any, name: any) => {
                      setFieldValue('organization_name', name);
                    }}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <TextField
                        {...params}
                        name="organization_name"
                        label="Select Organization"
                        variant="standard"
                        value={values.organization_name}
                      />
                    )}
                  />
                )}

                <Field
                  as={TextField}
                  id="coursePrefixName"
                  label="Course Prefix Name"
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
                    // fullWidth
                    // disabled={!isValid}
                  >
                    {isEdit ? 'Update' : 'Save'}
                  </Button>
                </div>
              </Form>
            </DialogContent>
          )}
        </Formik>
      </Dialog>
    </main>
  );
}

export default CoursePrefix;
