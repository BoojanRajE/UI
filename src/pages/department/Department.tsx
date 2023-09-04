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
  addDepartmentData,
  deleteDepartmentData,
  editDepartmentData,
  getDepartmentData,
  getDepartmentDetail,
  getSearchData,
} from '../../reduxStore/reducer/departmentReducer';
import {
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import Organisation from '../organisation/Organisation';
import { Organization } from '../organisation/OrganizationForm';
import {
  getSubDisciplineData,
  getSubDisciplineDetailAction,
} from '../../reduxStore/reducer/subDisciplineReducer';
import moment from 'moment';
import { createServerSideDatasource } from '../../utils/gridMethod/createServerSideDatasource';
import { getOrganizationName } from '../../reduxStore/reducer/organisationReducer';
import { getDisciplineDetails } from '../../reduxStore/reducer/disciplineReducer';
import MasterGrid from '../../utils/MasterGrid/MasterGrid';
import GridHeader1 from '../../utils/gridHeader/GridHeader1';
import { AiOutlineClose } from 'react-icons/ai';
import GridHeader2 from '../../utils/gridHeader/GridHeader2';
import { ColumnApi } from 'ag-grid-community';
import debounce from 'lodash/debounce';
import { ServerSideGrid } from '../../utils/MasterGrid/ServerSideGrid';
export interface Department {
  id: string;
  organization_name: any; //object when submit over form, string when fetched from db
  name: string;
  short_name: string;
  discipline_name: any; //object when submit over form, string when fetched from db
  sub_discipline_name: any; //object when submit over form, string when fetched from db
  is_active: boolean;
  created_by: string;
}

export interface ExtendedICellRendererParams extends ICellRendererParams {
  setIsEdit: any;
  handleUpdate(data: Department): void;
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

function Department() {
  const dispatch = useDispatch<AppDispatch>();
  const gridRef = useRef<AgGridReact<Department>>(null);
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
    dispatch(getDisciplineDetails());
    dispatch(getSubDisciplineDetailAction());
    dispatch(getOrganizationName());
  }, []);

  const [open, setOpen] = useState(false);

  const [initialValues, setInitialValue] = useState<Department>({
    id: '',
    organization_name: null,
    name: '',
    short_name: '',
    discipline_name: null,
    sub_discipline_name: null,
    is_active: true,
    created_by: '',
  });

  const handleClickClose = () => {
    setOpen(false);
  };

  const [isEdit, setIsEdit] = useState(false);

  const validation = Yup.object({
    organization_name: Yup.object({
      id: Yup.string(),
      value: Yup.string(),
    })
      .nullable()
      .required('Required Field'),
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed.')
      .matches(/^[^\s].*$/, 'The starting letter should not be a space.')
      .matches(/[^\s]$/, 'Ending letter should not be a space.')
      .min(3, 'Please enter a minimum of 3 letters.')
      .required('Required Field'),
    discipline_name: Yup.object({
      id: Yup.string(),
      value: Yup.string(),
    })
      .nullable()
      .required('Required Field'),
  });

  const organizationName: { id: string; name: string }[] = useSelector(
    (state: RootState) => state.organization.organizationName
  );

  const disciplineName = useSelector(
    (state: RootState) => state.discipline.getDisciplineDetails
  );

  let SubDisciplineName: any = useSelector(
    (state: RootState) => state.subdiscipline.getAllSubDisciplineDetail
  );

  const handleUpdate = (data: Department) => {
    getDepartmentDetail(data.id, setOpen, setInitialValue, setIsEdit);
    // dispatch(getDepartmentDetail(data.id, setInitialValue));

    // setInitialValue(() => {
    //   const organization_name = organizationName.find(
    //     (x) => x.name === data.organization_name
    //   );
    //   const discipline_name: any = disciplineName.find(
    //     (x: any) => x.name === data.discipline_name
    //   );
    //   const sub_discipline_name = SubDisciplineName.find(
    //     (x: any) => x.name === data.sub_discipline_name
    //   );

    //   setSubDisciplineNames(
    //     SubDisciplineName.filter((x: any) => {
    //       return x.discipline_id == discipline_name?.id;
    //     })
    //   );

    //   return {
    //     ...data,
    //     organization_name,
    //     discipline_name,
    //     sub_discipline_name,
    //   };
    // });
    // setOpen(true);
  };

  const handleDelete = (data: Department) => {
    dispatch(deleteDepartmentData(data, gridApi));
  };

  const DepartmentDefs = [
    { headerName: 'Name', field: 'name', minWidth: 300 },
    {
      headerName: 'Organization',
      field: 'organization_name',
      minWidth: 300,
    },
    {
      headerName: 'Discipline',
      field: 'discipline_name',
      minWidth: 300,
    },
    {
      headerName: 'Sub Discipline',
      field: 'sub_discipline_name',
      minWidth: 300,
    },
    { headerName: 'Short Name', field: 'short_name' },
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

  const onFilterTextBoxChanged2 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let str = e?.target?.value;

    const regex = /[*()[\];,'.$:%]/g;

    const matcher = str.match(regex);
    let found = matcher?.filter((c, index) => {
      return matcher?.indexOf(c) === index;
    });

    found?.forEach((sym) => {
      if (sym == "'") str = str.replace(/'/g, "'" + sym);
      if (sym == '%') str = str.replace(/%/g, '\\' + sym);
      //if (sym == '\\') str = str.replace(sym, '\\' + sym);
    });

    dispatch(getSearchData(str, params, setFlag));
  };

  // const onGridReady = (params: GridReadyEvent) => {
  //   const datasource = createServerSideDatasource(
  //     dispatch,
  //     getDepartmentData,
  //     setDataSource,
  //     setParams
  //   );
  //   params.api.setServerSideDatasource(datasource);
  // };

  let [SubDisciplineNames, setSubDisciplineNames] = useState([
    { id: '', name: '', discipline_id: '' },
  ]);
  const columnchange = async (e: any) => {
    const { id } = e;
    setSubDisciplineNames(
      SubDisciplineName.filter((x: any) => {
        return x.discipline_id == id;
      })
    );
  };

  const handleOpenForm = () => {
    setOpen(true);
    setIsEdit(false);

    setInitialValue({
      id: '',
      organization_name: null,
      name: '',
      short_name: '',
      discipline_name: null,
      sub_discipline_name: null,
      is_active: true,
      created_by: '',
    });
    setSubDisciplineNames([{ id: '', name: '', discipline_id: '' }]);
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
    children: 'Add Department',
    onClick: handleOpenForm,
    sm: 'Add',
  };
  return (
    <main>
      <header className="header">Department</header>
      <GridHeader2 textFieldProps={textFieldProps} buttonProps={buttonProps} />

      <ServerSideGrid
        rowDataUrl="/department/"
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
            <div>{isEdit ? 'Update Department' : 'Add Department'}</div>
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
              dispatch(addDepartmentData(values, setOpen, '', gridApi));
            else dispatch(editDepartmentData(values, setOpen, gridApi));
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
                      sx={{ marginBottom: '15px', marginTop: '15px' }}
                    />
                  )}
                />
                <Field
                  as={TextField}
                  label="Department Name"
                  variant="standard"
                  required
                  name="name"
                  value={values.name}
                  disabled={isEdit}
                  helperText={errors.name && touched.name ? errors.name : ''}
                  fullWidth
                  error={errors.name && touched.name}
                  sx={{ marginBottom: '15px' }}
                />
                <Field
                  as={TextField}
                  label="Short Name"
                  variant="standard"
                  name="short_name"
                  fullWidth
                  sx={{ marginBottom: '15px' }}
                />
                <Field
                  name="discipline_name"
                  component={Autocomplete}
                  required
                  value={values.discipline_name} //discipline object not name
                  options={disciplineName}
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
                    discipline_name: { id: string; name: string }
                  ) => {
                    columnchange(discipline_name);
                    setFieldValue('discipline_name', discipline_name);
                    setFieldValue('sub_discipline_name', '');
                  }}
                  onBlur={() => setFieldTouched('discipline_name', true)}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      name="discipline_name"
                      variant="standard"
                      label="Discipline"
                      error={
                        errors.discipline_name && touched.discipline_name
                          ? true
                          : false
                      }
                      helperText={
                        errors.discipline_name && touched.discipline_name
                          ? 'Required Field'
                          : ''
                      }
                      required
                    />
                  )}
                  sx={{ marginBottom: '15px' }}
                />
                <Field
                  name="sub_discipline_name"
                  component={Autocomplete}
                  value={values.sub_discipline_name} //sub discipline object not name
                  options={SubDisciplineNames}
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
                    sub_discipline_name: { id: string; name: string }
                  ) => {
                    setFieldValue('sub_discipline_name', sub_discipline_name);
                  }}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Sub Discipline"
                    />
                  )}
                  sx={{ marginBottom: '50px' }}
                />
                {/* values
                <pre>{JSON.stringify(values, null, 2)}</pre>
                errors
                <pre>{JSON.stringify(errors)}</pre>
                touched
                <pre>{JSON.stringify(touched)}</pre> */}
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
                    disabled={!isValid}
                    style={{ textTransform: 'capitalize' }}
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

export default Department;
