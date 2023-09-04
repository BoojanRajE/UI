import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
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
  addCollegeData,
  deleteCollegeData,
  editCollegeData,
  getCollegeDetail,
} from '../../reduxStore/reducer/collegeReducer';
import { getOrganizationName } from '../../reduxStore/reducer/organisationReducer';
import { GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import moment from 'moment';
import { Actions } from './Actions';
import { CollegeType } from './CollegeType';
import { AiOutlineClose } from 'react-icons/ai';
import GridHeader2 from '../../utils/gridHeader/GridHeader2';
import { ServerSideGrid } from '../../utils/MasterGrid/ServerSideGrid';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from 'ag-grid-community';
import debounce from 'lodash/debounce';

export default function College() {
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [flag, setFlag] = useState(true);

  //for changing the value on text field immediately
  const [searchQuery, setSearchQuery] = useState('');
  //Delays capturing, changing text on text field
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();

  const validation = Yup.object({
    organization_name: Yup.object({
      id: Yup.string(),
      value: Yup.string(),
    })
      .nullable()
      .required('Required Field'),
    name: Yup.string()
      // .matches(
      //   /^[a-zA-z]/,
      //   'starting letter should not be a space, numbers or special characters'
      // )
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed.')
      .matches(/^[^ ]/, 'The starting letter should not be a space.')
      .matches(/[^\s]$/, 'Ending letter should not be a space.')

      .required('Required Field'),
  });

  useEffect(() => {
    dispatch(getOrganizationName());
  }, []);

  const organizationName: { id: string; name: string }[] = useSelector(
    (state: RootState) => state.organization.organizationName
  );

  const [initialValues, setInitialValue] = useState<CollegeType>({
    id: '',
    organization_name: null,
    name: '',
    short_name: '',
    is_active: true,
    created_by: '',
  });

  const handleDelete = (data: CollegeType) => {
    dispatch(deleteCollegeData(data, gridApi));
  };

  const collegeDefs: any = [
    { headerName: 'Name', field: 'name', minWidth: 300 },
    {
      headerName: 'Organization',
      field: 'organization_name',
      minWidth: 300,
    },
    {
      headerName: 'Short Name',
      field: 'short_name',
      minWidth: 130,
    },
    {
      headerName: 'Created By',
      field: 'created_by',
      minWidth: 180,
    },
    {
      headerName: 'Created At',
      field: 'created_at',
      filter: 'agDateColumnFilter',
      minWidth: 200,
      cellRenderer: (row: ICellRendererParams) => {
        return moment(row.data.created_at).format('MM/DD/YYYY h:mm:ss A');
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

  const handleClickClose = () => {
    setOpen(false);
  };

  const handleUpdate = (data: CollegeType) => {
    getCollegeDetail(data.id, setOpen, setInitialValue, setIsEdit);
  };

  const handleOpenForm = () => {
    setIsEdit(false);
    setOpen(true);
    setInitialValue({
      id: '',
      organization_name: null,
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
    children: 'Add College',
    onClick: handleOpenForm,
    sm: 'Add',
  };

  return (
    <main>
      <header className="header">College</header>
      <GridHeader2 textFieldProps={textFieldProps} buttonProps={buttonProps} />

      <ServerSideGrid
        rowDataUrl="/college/"
        debouncedSearchQuery={searchQuery}
        columnDefs={collegeDefs}
        gridApi={gridApi}
        columnApi={columnApi}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
      />

      <Dialog open={open}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>{isEdit ? 'Update College' : 'Add College'}</div>
            <div>
              <AiOutlineClose onClick={handleClickClose} />
            </div>
          </div>
        </DialogTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={(values) => {
            if (!isEdit) dispatch(addCollegeData(values, setOpen, '', gridApi));
            else editCollegeData(values, setOpen, gridApi);
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
            <DialogContent
              sx={{ width: '600px', height: 'fitContent', overflowX: 'hidden' }}
            >
              <Form>
                <Field
                  name="organization_name"
                  component={Autocomplete}
                  value={values.organization_name}
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
                      name="organization_name"
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
                      sx={{ marginBottom: '15px', marginTop: '15px' }}
                      required
                    />
                  )}
                />

                <Field
                  as={TextField}
                  label="College Name"
                  required
                  variant="standard"
                  name="name"
                  value={values.name}
                  helperText={errors.name && touched.name ? errors.name : ''}
                  fullWidth
                  error={errors.name && touched.name ? true : false}
                  sx={{ marginBottom: '15px', marginTop: '15px' }}
                />

                <Field
                  as={TextField}
                  id="shortName"
                  label="Short Name"
                  variant="standard"
                  name="short_name"
                  value={values.short_name}
                  fullWidth
                  sx={{ marginBottom: '50px', marginTop: '15px' }}
                />

                <div className="flex gap-3 justify-end">
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
