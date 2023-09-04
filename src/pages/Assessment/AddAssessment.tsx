import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef, ColumnApi, GridApi } from 'ag-grid-community';
import GridHeader1 from '../../utils/gridHeader/GridHeader1';
import MasterGrid from '../../utils/MasterGrid/MasterGrid';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Typography,
  Grid,
  Button,
  Checkbox,
  InputAdornment,
  Menu,
  Switch,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  DialogProps,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import {
  addAssessment,
  deleteAssessment,
  getAssessmentData,
  getAssessmentDiscipline,
  getAssessmentQuestion,
  searchAssessment,
  viewAssessment,
} from '../../reduxStore/reducer/assessmentReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import Editor from '../../utils/Editor/Editor';
import { createServerSideDatasource } from '../../utils/gridMethod/createServerSideDatasource';
import { GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router';
import ViewAssessment from './ViewAssessment';
import { getDisciplineDetails } from '../../reduxStore/reducer/disciplineReducer';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { MdEdit } from 'react-icons/md';
import { AssessmentDiscipline } from './AssessmentDiscipline';
import GridHeader2 from '../../utils/gridHeader/GridHeader2';
import debounce from 'lodash/debounce';
import { ServerSideGrid } from '../../utils/MasterGrid/ServerSideGrid';
import { updatePublishStatus } from '../../reduxStore/reducer/assessmentReducer';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '../../utils/Alert/Alert';

const AddAssessment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  //for changing the value on text field immediately
  const [searchQuery, setSearchQuery] = useState('');
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  //Delays capturing, changing text on text field
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();
  const formikRef = React.useRef(null);

  const [dataSource, setDataSource] = useState();
  const [params, setParams] = useState();

  const [isEdit, setIsEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState();

  function PublishedVersionActions(row: any) {
    const pulishedData = row.data.test_statuses.find(
      (d: any) => d.publish == true
    );

    if (pulishedData?.publish) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <b>{pulishedData.version}</b>
          <Button
            size="small"
            variant="contained"
            sx={{
              fontSize: '12px',
              height: '29px',
              alignSelf: 'center',
              marginLeft: '13px',
            }}
            onClick={() => {
              dispatch(updatePublishStatus(pulishedData, gridApi, row.data));
            }}
          >
            Unpublish
          </Button>
          <IconButton
            // size="small"
            onClick={() => {
              // dispatch(viewAssessment() )
              const data: any = { ...row.data, question_id: pulishedData.id };
              dispatch(viewAssessment(data, setViewData, setOpenView));
              // setViewData(pulishedData);
              // setOpenView(true);
            }}
          >
            <RemoveRedEyeIcon className="text-edit-icon" />
          </IconButton>
        </div>
      );
    } else {
      return <div>None</div>;
    }
  }

  function LatestVersionActions(row: any) {
    const unPublishedData = row.data.test_statuses.findIndex(
      (d: any) => d.publish == true
    );

    if (unPublishedData + 1 < row.data.test_statuses.length) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <b style={{ marginRight: '5px', marginLeft: '5px' }}>
            {
              row?.data?.test_statuses[row.data.test_statuses.length - 1]
                ?.version
            }
          </b>
          <IconButton
            onClick={() => {
              const data = row.data;

              row.setIsEdit(true);

              const assessmentData = {
                state: {
                  state: {
                    value: {
                      id: data.id,
                      discipline: {
                        id: data.discipline,
                        name: data.discipline_name,
                      },
                      officialAssessmentName: data.official_name,
                      publicAssessmentName: data.public_name,
                      assessmentCode: data.code,
                      minimum_duration: data.minimum_duration,
                      questionType: data.question_label_type,
                      optionType: data.option_label_type,
                      key: data.use_key,
                      filter: data?.filter_question,
                      likert: data.is_likert,
                      question:
                        row.data.test_statuses[
                          row.data.test_statuses.length - 1
                        ].questions || [],
                      question_id:
                        data?.test_statuses[row.data.test_statuses.length - 1]
                          ?.id,
                    },
                    action: 'Update',
                  },
                },
                url: '/question',
              };

              dispatch(getAssessmentQuestion(assessmentData, navigate));

              // navigate('/question', {
              //   state: {
              //     value: {
              //       id: data.id,
              //       discipline: {
              //         id: data.discipline,
              //         name: data.discipline_name,
              //       },
              //       officialAssessmentName: data.official_name,
              //       publicAssessmentName: data.public_name,
              //       assessmentCode: data.code,
              //       minimum_duration: data.minimum_duration,
              //       questionType: data.question_label_type,
              //       optionType: data.option_label_type,
              //       key: data.use_key,
              //       filter: data?.filter_question,
              //       likert: data.is_likert,
              //       question:
              //         row.data.test_statuses[row.data.test_statuses.length - 1]
              //           .questions || [],
              //       question_id:
              //         data?.test_statuses[row.data.test_statuses.length - 1]
              //           ?.id,
              //     },
              //     action: 'Update',
              //   },
              // });
            }}
          >
            <MdEdit className="text-edit-icon" />
          </IconButton>
          <IconButton
            // size="small"
            onClick={() => {
              // setOpenView(true);
              //
              // setViewData(
              //   row.data.test_statuses[row.data.test_statuses.length - 1]
              // );
              // const data = row.data;

              const data: any = {
                ...row.data,
                question_id:
                  row?.data?.test_statuses[row.data.test_statuses.length - 1]
                    ?.id,
              };
              dispatch(viewAssessment(data, setViewData, setOpenView));
            }}
          >
            <RemoveRedEyeIcon className="text-edit-icon" />
          </IconButton>
          {row.data?.is_likert ? (
            <Button
              size="small"
              variant="contained"
              sx={{
                fontSize: '12px',
                height: '29px',
                alignSelf: 'center',
                marginLeft: '13px',
              }}
              onClick={() => {
                // setOpenView(true);

                // setViewData(
                //   row.data.test_statuses[row.data.test_statuses.length - 1]
                // );

                const data: any = row.data;
                // navigate('/likert', {
                //   state: {
                //     id: data.id,
                //     category: data.category,
                //     is_published:
                //       row.data.test_statuses[row.data.test_statuses.length - 1]
                //         .publish,
                //     discipline: {
                //       id: data.discipline,
                //       name: data.discipline_name,
                //     },
                //     officialAssessmentName: data.official_name,
                //     publicAssessmentName: data.public_name,
                //     assessmentCode: data.code,
                //     minimum_duration: data.minimum_duration,
                //     questionType: data.question_label_type,
                //     optionType: data.option_label_type,
                //     key: data.use_key,
                //     filter: data?.filter_question,
                //     likert: data.is_likert,
                //     question:
                //       row.data.test_statuses[row.data.test_statuses.length - 1]
                //         .questions || [],
                //     question_id:
                //       data?.test_statuses[row.data.test_statuses.length - 1]
                //         ?.id,
                //   },
                // });

                const assessmentData = {
                  state: {
                    state: {
                      value: {
                        id: data.id,
                        category: data.category,
                        is_published:
                          row.data.test_statuses[
                            row.data.test_statuses.length - 1
                          ].publish,
                        discipline: {
                          id: data.discipline,
                          name: data.discipline_name,
                        },
                        officialAssessmentName: data.official_name,
                        publicAssessmentName: data.public_name,
                        assessmentCode: data.code,
                        minimum_duration: data.minimum_duration,
                        questionType: data.question_label_type,
                        optionType: data.option_label_type,
                        key: data.use_key,
                        filter: data?.filter_question,
                        likert: data.is_likert,
                        question_id:
                          data?.test_statuses[row.data.test_statuses.length - 1]
                            ?.id,
                      },
                    },
                  },
                  url: '/likert',
                };

                dispatch(getAssessmentQuestion(assessmentData, navigate));
              }}
            >
              Key
            </Button>
          ) : (
            ''
          )}
        </div>
      );
    }
    if (unPublishedData + 1 == row.data.test_statuses.length) {
      const data = row.data;
      return (
        <div>
          <Button
            size="small"
            variant="contained"
            sx={{
              marginBottom: '6px',
              alignSelf: 'center',
              fontSize: '12px',
              height: '29px',
            }}
            onClick={() => {
              const assessmentData = {
                state: {
                  state: {
                    value: {
                      id: data.id,
                      discipline: {
                        id: data.discipline,
                        name: data.discipline_name,
                      },
                      officialAssessmentName: data.official_name,
                      publicAssessmentName: data.public_name,
                      assessmentCode: data.code,
                      minimum_duration: data.minimum_duration,
                      questionType: data.question_label_type,
                      optionType: data.option_label_type,
                      filter: data?.filter_question,
                      key: data.use_key,
                      likert: data.is_likert,
                      question:
                        data?.test_statuses[unPublishedData]?.questions || [],
                      question_id: data?.test_statuses[unPublishedData]?.id,
                    },
                    action: 'Version',
                  },
                },
                url: '/question',
              };

              dispatch(getAssessmentQuestion(assessmentData, navigate));
              // navigate('/question', {
              //   state: {
              //     value: {
              //       id: data.id,
              //       discipline: {
              //         id: data.discipline,
              //         name: data.discipline_name,
              //       },
              //       officialAssessmentName: data.official_name,
              //       publicAssessmentName: data.public_name,
              //       assessmentCode: data.code,
              //       minimum_duration: data.minimum_duration,
              //       questionType: data.question_label_type,
              //       optionType: data.option_label_type,
              //       filter: data?.filter_question,
              //       key: data.use_key,
              //       likert: data.is_likert,
              //       question:
              //         data?.test_statuses[unPublishedData]?.questions || [],
              //       question_id: data?.test_statuses[unPublishedData]?.id,
              //     },
              //     action: 'Version',
              //   },
              // });
            }}
          >
            Create New Version
          </Button>
        </div>
      );
    }
  }

  const transactionDefs = [
    {
      headerName: 'Discipline',
      field: 'discipline_name',
      // resizable: false,
    },
    {
      headerName: 'Official Name',
      field: 'official_name',
      // resizable: false,
    },
    {
      headerName: 'Public Name',
      field: 'public_name',
      // resizable: false,
    },
    {
      headerName: 'Code',
      field: 'code',
      // resizable: false,
    },
    {
      headerName: 'Minimum Duration',
      field: 'minimum_duration',
      // resizable: false,
    },
    {
      headerName: 'Published Version',
      field: 'version',
      // resizable: false,

      sortable: false,
      filter: false,
      minWidth: 200,
      maxWidth: 250,
      cellRenderer: PublishedVersionActions,
      cellRendererParams: (params: ICellRendererParams) => ({
        ...params,
        setIsEdit,
      }),
    },
    {
      headerName: 'Latest Version',
      field: 'version',
      sortable: false,
      // resizable: false,

      filter: false,
      minWidth: 200,
      maxWidth: 250,
      cellRenderer: LatestVersionActions,
      cellRendererParams: (params: ICellRendererParams) => ({
        ...params,
        setIsEdit,
      }),
    },
    {
      headerName: 'Action',
      sortable: false,
      // resizable: false,

      filter: false,
      minWidth: 200,
      maxWidth: 250,
      cellRenderer: (params: any) => (
        <div>
          <IconButton
            onClick={() => {
              Alert.confirm(() => {
                dispatch(deleteAssessment(params.data, gridApi));
              });
            }}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </div>
      ),
      cellRendererParams: (params: ICellRendererParams) => <div>Test</div>,
    },
    {
      headerName: 'Created By',
      field: 'created_by',
      // resizable: false,
    },
    {
      headerName: 'Created At',
      field: 'created_at',
      // resizable: false,

      filter: 'agDateColumnFilter',
      cellRenderer: (row: ICellRendererParams) => {
        return moment(moment(row.data.created_at).utc())
          .local()
          .format('MM-DD-YYYY hh:mm a');
      },
    },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      resizable: true,
      flex: 1,
      minWidth: 100,
      filterParams: {
        suppressAndOrCondition: true,
        trimInput: true,
        buttons: ['reset', 'clear'],
      },
    };
  }, []);

  const onFilterTextBoxChanged1 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(searchAssessment(e?.target?.value, params));
  };

  const [initialValues, setInitialValue] = useState<any>({
    discipline: null,
    officialAssessmentName: '',
    publicAssessmentName: '',
    assessmentCode: '',
    questionType: '',
    optionType: '',
    key: '',
    likert: '',
    minimum_duration: '',
    filter: '',
  });

  const openDialog = (scrollType: DialogProps['scroll']) => {
    setOpen(true);
    setInitialValue({
      discipline: null,
      officialAssessmentName: '',
      publicAssessmentName: '',
      assessmentCode: '',
      questionType: '',
      optionType: '',
      key: '',
      likert: '',
      minimum_duration: '',
    });
    setScroll(scrollType);
  };

  const buttonProps = {
    name: 'Add Assessment',
    onClick: openDialog,
  };

  const [open, setOpen] = useState(false);
  const handleClickClose = () => {
    setOpen(false);
  };

  const textFieldProps1 = {
    onChange: onFilterTextBoxChanged1,
  };

  const validation = Yup.object({
    discipline: Yup.object({
      id: Yup.string().required('Required Field'),
      name: Yup.string().required('Required Field'),
    }).required('Required Field'),
    officialAssessmentName: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
    publicAssessmentName: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
    assessmentCode: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
    questionType: Yup.string().required('Required Field'),
    optionType: Yup.string().required('Required Field'),
    key: Yup.string().required('Required Field'),
    likert: Yup.string().required('Required Field'),
    minimum_duration: Yup.number().required('Required Field'),
    filter: Yup.string().required('Required Field'),
  });

  useEffect(() => {
    dispatch(getDisciplineDetails());
    dispatch(getAssessmentDiscipline());
  }, [dispatch]);

  const disciplineData: { id: string; name: string }[] = useSelector(
    (state: RootState) => {
      const data = state.assessment.assessmentDiscipline;

      const alterData: any = [...data];
      alterData.unshift({
        id: '',
        name: 'ADD NEW DISCIPLINE',
      });
      return alterData;
    }
  );

  const names = [
    'Oliver ',
    'Van ',
    'April ',
    'Ralph ',
    'Omar ',
    'Carlos ',
    'Miriam ',
    'Bradley ',
    'Virginia ',
    'Kelly ',
  ];

  const [openForm, setOpenForm] = useState<any>({
    isOpen: false,
    callback: null,
  });

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

  const textFieldProps2 = {
    value: searchQuery,
    onChange: onFilterTextBoxChanged,
  };
  const buttonProps2 = {
    children: 'Add Assessment',
    onClick: () => openDialog('paper'),
    sm: 'Add',
  };
  const handleSubmit = () => {
    if (formikRef.current) {
      //@ts-ignore
      formikRef.current.submitForm();
    }
  };

  return (
    <div>
      {/* <TabPanel value={value} index={0}> */}
      <header className="header">Assessment</header>
      {/* <GridHeader textFieldProps={textFieldProps1} buttonProps={buttonProps} /> */}
      <GridHeader2
        textFieldProps={textFieldProps2}
        buttonProps={buttonProps2}
      />

      <ServerSideGrid
        rowDataUrl="/assessment/"
        debouncedSearchQuery={searchQuery}
        columnDefs={transactionDefs}
        gridApi={gridApi}
        columnApi={columnApi}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
      />

      {/* <MasterGrid
        // ref={gridRef}
        columnDefs={transactionDefs}
        defaultColDef={defaultColDef}
        rowModelType={"serverSide"}
        suppressServerSideInfiniteScroll={false}
        onGridReady={onGridReady}
        pagination={true}
        paginationPageSize={25}
        animateRows={true}
      /> */}
      <Dialog
        open={open}
        style={{
          zIndex: +1,
          // display: 'flex',
          // alignItems: 'flex-start',
          // justifyContent: 'center',
          // marginTop: '10vh',
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>Creates New Assessment</div>
            <div>
              <CloseIcon onClick={handleClickClose} />
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
                navigate('/question', {
                  state: {
                    value: values,
                    action: 'Create',
                  },
                });

                setInitialValue(values);
                //   dispatch(addUserAdmin(values, dataSource, params, setOpen));
              }}
            >
              {({ values, errors, touched, isValid, setFieldValue }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      {/* <FormControl fullWidth variant="standard" sx={{ my: 1 }}>
                      <InputLabel id="demo-simple-select-standard-label">
                        Discipline
                      </InputLabel>
                      <Field
                        defaultValue=""
                        name="discipline"
                        as={Select}
                        open={true}
                        native
                        // defaultValue=""
                        id="demo-simple-select-standard"
                        // label="Grouping"
                        helperText={
                          errors.discipline && touched.discipline
                            ? errors.discipline
                            : ''
                        }
                        error={errors.discipline && touched.discipline}
                      >
                        <option value="" selected></option>
                        {disciplineData.map((val: any) => (
                          <option value={val.value}>{val.label}</option>
                        ))}
                        {errors.discipline}
                      </Field>
                    </FormControl> */}
                      <Field
                        name="discipline"
                        as={Autocomplete}
                        value={values?.discipline}
                        size="small"
                        options={disciplineData}
                        getOptionLabel={(option: any) => option?.name || ''}
                        isOptionEqualToValue={(option: any, current: any) =>
                          option.id === current.id
                        }
                        fullWidth
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        onChange={(
                          event: React.SyntheticEvent,
                          discipline: any
                        ) => {
                          if (discipline?.name == 'ADD NEW DISCIPLINE') {
                            setOpenForm({
                              ...openForm,
                              ...{ isOpen: true, callback: setFieldValue },
                            });
                            setFieldValue('discipline', {
                              name: '',
                              id: '',
                            });
                          } else {
                            setFieldValue('discipline', {
                              name: discipline?.name,
                              id: discipline?.id,
                            });
                          }
                        }}
                        renderInput={(params: any) => (
                          <TextField
                            {...params}
                            label="Discipline"
                            variant="standard"
                            placeholder="Select"
                            error={
                              errors.discipline && touched.discipline
                                ? true
                                : false
                            }
                            helperText={
                              errors.discipline && touched.discipline
                                ? 'Required Field'
                                : ''
                            }
                            required
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Field
                        as={TextField}
                        label="Official Assessment Name:"
                        variant="standard"
                        required
                        name="officialAssessmentName"
                        value={values.officialAssessmentName}
                        helperText={
                          errors.officialAssessmentName &&
                          touched.officialAssessmentName
                            ? errors.officialAssessmentName
                            : ''
                        }
                        fullWidth
                        error={
                          errors.officialAssessmentName &&
                          touched.officialAssessmentName
                        }
                        sx={{ marginBottom: '15px' }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <Field
                        variant="standard"
                        as={TextField}
                        label="Public View Assessment Name:"
                        required
                        name="publicAssessmentName"
                        value={values.publicAssessmentName}
                        helperText={
                          errors.publicAssessmentName &&
                          touched.publicAssessmentName
                            ? errors.publicAssessmentName
                            : ''
                        }
                        fullWidth
                        error={
                          errors.publicAssessmentName &&
                          touched.publicAssessmentName
                        }
                        sx={{ marginBottom: '15px' }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <Field
                        variant="standard"
                        as={TextField}
                        label="Assessment Code:"
                        required
                        name="assessmentCode"
                        value={values.assessmentCode}
                        helperText={
                          errors.assessmentCode && touched.assessmentCode
                            ? errors.assessmentCode
                            : ''
                        }
                        fullWidth
                        error={errors.assessmentCode && touched.assessmentCode}
                        sx={{ marginBottom: '15px' }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <Field
                        variant="standard"
                        as={TextField}
                        label="Minimum Duration(In Minutes)"
                        required
                        name="minimum_duration"
                        value={values.minimum_duration}
                        helperText={
                          errors.minimum_duration && touched.minimum_duration
                            ? errors.minimum_duration
                            : ''
                        }
                        fullWidth
                        error={
                          errors.minimum_duration && touched.minimum_duration
                        }
                        sx={{ marginBottom: '15px' }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="standard" sx={{ my: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Question Label Type:
                        </InputLabel>
                        <Field
                          id="demo-simple-select-standard"
                          as={Select}
                          name="questionType"
                          labelId="demo-simple-select-standard-label"
                        >
                          <MenuItem value="Custom">Custom</MenuItem>
                          <MenuItem value="1,2,3">1,2,3</MenuItem>
                        </Field>
                        <ErrorMessage
                          name="questionType"
                          component="span"
                          className="text-red-600 ml-2 text-sm"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="standard" sx={{ my: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Option Label Type:
                        </InputLabel>
                        <Field
                          id="demo-simple-select-standard"
                          as={Select}
                          name="optionType"
                          labelId="demo-simple-select-standard-label"
                        >
                          <MenuItem value="Custom">Custom</MenuItem>
                          <MenuItem value="a,b,c">a,b,c</MenuItem>
                          <MenuItem value="1,2,3">1,2,3</MenuItem>
                        </Field>
                        <ErrorMessage
                          name="optionType"
                          component="span"
                          className="text-red-600 ml-2 text-sm"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="standard" sx={{ my: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Assessment uses key?:
                        </InputLabel>
                        <Field
                          id="demo-simple-select-standard"
                          as={Select}
                          name="key"
                          labelId="demo-simple-select-standard-label"
                        >
                          <MenuItem value="true">Yes</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </Field>
                        <ErrorMessage
                          name="key"
                          component="span"
                          className="text-red-600 ml-2 text-sm"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="standard" sx={{ my: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Is Likert?:
                        </InputLabel>
                        <Field
                          id="demo-simple-select-standard"
                          as={Select}
                          name="likert"
                          labelId="demo-simple-select-standard-label"
                        >
                          <MenuItem value="true">Yes</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </Field>
                        <ErrorMessage
                          name="likert"
                          component="span"
                          className="text-red-600 ml-2 text-sm"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="standard" sx={{ my: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Uses filter question ?:
                        </InputLabel>
                        <Field
                          id="demo-simple-select-standard"
                          as={Select}
                          name="filter"
                          labelId="demo-simple-select-standard-label"
                        >
                          <MenuItem value="true">Yes</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </Field>
                        <ErrorMessage
                          name="likert"
                          component="span"
                          className="text-red-600 ml-2 text-sm"
                        />
                      </FormControl>
                    </Grid>

                    {/* <Grid item xs={12} sm={12}>
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
                          disabled={!isValid}
                          style={{ textTransform: 'capitalize' }}
                        >
                          Save
                        </Button>
                      </div>
                    </Grid> */}
                  </Grid>
                  {/* {JSON.stringify(values)} */}
                </Form>
              )}
            </Formik>
          </div>
        </DialogContent>
        <DialogActions>
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
              onClick={handleSubmit}
              style={{ textTransform: 'capitalize' }}
            >
              Save
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <ViewAssessment open={openView} setOpen={setOpenView} data={viewData} />
      <AssessmentDiscipline open={openForm} setOpenForm={setOpenForm} />
    </div>
  );
};

export default AddAssessment;
