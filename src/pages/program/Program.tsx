import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
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
import React, { useState, useEffect, useRef } from 'react';
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
  getProgramData,
  addProgramData,
  editProgramData,
  deleteProgramData,
} from '../../reduxStore/reducer/programReducer';
import {
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import Organisation from '../organisation/Organisation';
import { Organization } from '../organisation/OrganizationForm';
import { createServerSideDatasource } from '../../utils/gridMethod/createServerSideDatasource';
import { AiOutlineClose } from 'react-icons/ai';
import GridHeader2 from '../../utils/gridHeader/GridHeader2';
import { ColumnApi } from 'ag-grid-community';
import debounce from 'lodash/debounce';
import { ServerSideGrid } from '../../utils/MasterGrid/ServerSideGrid';
export interface Program {
  id: string;
  organization_name: any;
  name: string;
  short_name: string;
  is_active: boolean;
  created_by: string;
}

export interface ExtendedICellRendererParams extends ICellRendererParams {
  setIsEdit: any;
  handleUpdate(data: Program): void;
  handleDelete(id: string): void;
}

export function Actions(row: ExtendedICellRendererParams) {
  return (
    <div className="w-24 flex justify-between">
      <IconButton
        onClick={() => {
          row.setIsEdit(true);
          row.handleUpdate(row.data);
        }}
      >
        <MdModeEdit className="float-right text-blue-600" />
      </IconButton>

      <IconButton onClick={() => row.handleDelete(row.data)}>
        <MdDelete className="float-right text-red-600" />
      </IconButton>
    </div>
  );
}

function Program() {
  const dispatch = useDispatch<AppDispatch>();
  const gridRef = useRef<AgGridReact<Program>>(null);
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    dispatch(getOrganizationName());
  }, [dispatch]);

  //for delete call
  const [dataSource, setDataSource] = useState();
  //for delete call
  const [params, setParams] = useState();

  //for changing the value on text field immediately
  const [searchQuery, setSearchQuery] = useState('');

  //Delays capturing, changing text on text field
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();

  const [open, setOpen] = useState(false);
  const handleClickClose = () => {
    setOpen(false);
    setInitialValue({
      id: '',
      organization_name: '',
      name: '',
      short_name: '',
      is_active: true,
      created_by: '',
    });
  };

  const [initialValues, setInitialValue] = useState<Program>({
    id: '',
    organization_name: '',
    name: '',
    short_name: '',
    is_active: true,
    created_by: '',
  });

  const [isEdit, setIsEdit] = useState(false);

  const organizationData = useSelector(
    (state: RootState) => state.organization.organizationName
  );

  const validation = Yup.object({
    organization_name: Yup.object({
      id: Yup.string(),
      value: Yup.string(),
    })
      .nullable()
      .required('Required Field'),
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed.')
      .matches(/^[^ ]/, 'The starting letter should not be a space.')
      .matches(/[^\s]$/, 'Ending letter should not be a space.')

      .required('Required Field'),
  });

  const handleUpdate = (data: Program) => {
    setInitialValue(() => {
      let organization_name = '';
      organizationData.map((item: any) => {
        if (item.name === data.organization_name) {
          organization_name = item;
        }
      });
      return {
        ...data,
        organization_name,
      };
    });
    setOpen(true);
  };

  const programDefs = [
    { headerName: 'Name', field: 'name', filter: 'agTextColumnFilter' },
    {
      headerName: 'Organization',
      field: 'organization_name',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Short Name',
      field: 'short_name',
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

  const getData = (data: any, params: any) => {
    dispatch(getProgramData(data, params));
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

  const handleDelete = (data: Program) => {
    dispatch(deleteProgramData(data, gridApi));
  };

  const handleOpenForm = () => {
    setIsEdit(false);
    setOpen(true);
    setInitialValue({
      id: '',
      organization_name: '',
      name: '',
      short_name: '',
      is_active: true,
      created_by: '',
    });
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
    children: 'Add Program',
    onClick: handleOpenForm,
    sm: 'Add',
  };

  return (
    <main>
      <header className="header">Program</header>
      <GridHeader2 textFieldProps={textFieldProps} buttonProps={buttonProps} />

      <ServerSideGrid
        rowDataUrl="/program/"
        debouncedSearchQuery={searchQuery}
        columnDefs={programDefs}
        gridApi={gridApi}
        columnApi={columnApi}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
      />

      <Dialog open={open}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>{isEdit ? 'Update Program' : 'Add Program'}</div>
            <div>
              <AiOutlineClose onClick={handleClickClose} />
            </div>
          </div>
        </DialogTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={(values) => {
            if (!isEdit) dispatch(addProgramData(values, setOpen, '', gridApi));
            else {
              dispatch(
                editProgramData(values, setOpen, gridApi, handleClickClose)
              );
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
                      required
                      value={values.organization_name}
                      sx={{ marginBottom: '15px', marginTop: '15px' }}
                    />
                  )}
                />

                <Field
                  as={TextField}
                  id="programName"
                  label="Program Name"
                  variant="standard"
                  name="name"
                  value={values.name}
                  error={errors.name && touched.name}
                  helperText={errors.name && touched.name ? errors.name : ''}
                  className="capitalize"
                  fullWidth
                  sx={{ marginBottom: '15px', marginTop: '15px' }}
                />

                <Field
                  as={TextField}
                  id="shortName"
                  label="Short Name"
                  variant="standard"
                  name="short_name"
                  value={values.short_name}
                  className="capitalize"
                  fullWidth
                  sx={{ marginBottom: '50px', marginTop: '15px' }}
                />
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="contained"
                    onClick={handleClickClose}
                    style={{ textTransform: 'capitalize' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
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

export default Program;
