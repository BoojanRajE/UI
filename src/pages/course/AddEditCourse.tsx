import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  RadioGroup,
  Select,
  Stack,
  StepConnector,
  Switch,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
// import SearchIcon from '@mui/icons-material/Search';
import {
  addOrganisationData,
  editOrganisationData,
  getOrganisationData,
} from '../../reduxStore/reducer/organisationReducer';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import MenuItem from '@mui/material/MenuItem';
import * as Yup from 'yup';
import { Organization } from '../organisation/OrganizationForm';
import { useEffect, useState } from 'react';
import { getDepartmentName } from '../../reduxStore/reducer/departmentReducer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { display } from '@mui/system';
import {
  addCourseData,
  editCourseData,
  searchFromOtherOrg,
} from '../../reduxStore/reducer/courseReducer';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { AddCoursePrefix } from './AddCoursePrefix';
import { CoursePrefix } from '../coursePrefix/CoursePrefix';
import {
  editCoursePrefixData,
  getCoursePrefixName,
} from '../../reduxStore/reducer/coursePrefixReducer';
import { getCourseDetailsName } from '../../reduxStore/reducer/courseDetailsReducer';
import AddCourseDetails from './AddCourseDetails';
import { getUserById } from '../../reduxStore/reducer/registerReducer';
import { getUsersByOrganization } from '../../reduxStore/route/userRoute';
import {
  addUserAdmin,
  getInstructors,
  handleGetInstructors,
  inviteUser,
} from '../../reduxStore/reducer/userReducer';
import { AiOutlineClose } from 'react-icons/ai';
import SearchTransferList from './SearchTransferList';
import { withFormik } from 'formik';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
// import { searchIcon } from "../../utils/icons";
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { getOrganisation } from '../../reduxStore/route/organisationRoute';
import { getOrganizationName } from '../../reduxStore/reducer/organisationReducer';
import jwt_decode from 'jwt-decode';
import { Scrollbar } from 'react-scrollbars-custom';
import { entries } from 'lodash';
import Alert from '../../utils/Alert/Alert';
type Options = {
  inputValue?: string;
  label: string;
  option: string;
};

type CourseOptions = {
  inputValue?: string;
  id: string;
  name: string;
};
interface CourseForm {
  id: string;
  term: Options | null;
  year: string;
  course_prefix_id: Options | null; // CoursePrefix table
  course_details_id: Options | null;

  times_taught: number;

  interactive_lecture: Options | null; //courseStrageries
  integrated_lab_lecture: Options | null; //..
  lecture: Options | null; //..
  discuss_idea: Options | null; //..
  design_experiments: Options | null; //..
  students_work_together: Options | null; //..
  instructor_quantitative_problems: Options | null; //..
  instructor_qualitative_problems: Options | null; //..
  student_quantitative_problems: Options | null; //..
  student_qualitative_problems: Options | null; //courseStrageries

  problem_solving: Options | null; //courseGoals
  conceptual_understanding: Options | null;
  attitude_expression: Options | null; //courseGoals

  is_collaborative_learning: boolean;
  is_usage: boolean;

  times_taught_la: number;
  times_used_la: number;
  usage_description1: string;
  usage_description2: string;
  week_plan: number;
  la_other_courses: string;
  usage_description3: string;

  pretest_credit: boolean;
  posttest_credit: boolean;
  email_reminder: boolean;
  class_reminder: boolean;

  description: string;
  requirements: string;
  misc_data: string;
  is_agree: boolean;
  is_test_course: boolean;
  is_active: true;
  created_by: string;
}

var mCoursePrefixName: any;
var mCourseNames: any;

export function correctBeforeAddValues(values: any) {
  const formState = { ...values };
  formState.term = values?.term.option;
  // formState.course_prefix_id = values.course_prefix_id.id;

  formState.course_details_id = values.course_details_id.id;
  formState.assessment_coordinators = values.assessment_coordinators.map(
    (e: any) => e.id
  );
  formState.instructors = values.instructors.map((e: any) => e.id);

  for (let key in formState.weekly_contact_hours)
    if (formState.weekly_contact_hours[key] == '')
      formState.weekly_contact_hours[key] = '0';
  return formState;
}

export function correctBeforeEditValues(values: any) {
  const chooseOpt = (opt: number | string) => {
    switch (opt) {
      case 1 || '1':
        return { label: 'Never', option: '1' };
      case 2 || '2':
        return { label: 'Once or twice per term', option: '2' };
      case 3 || '3':
        return { label: 'Several times per term', option: '3' };
      case 4 || '4':
        return { label: 'Weekly', option: '4' };
      case 5 || '5':
        return { label: 'Nearly every class', option: '5' };
      case 6 || '6':
        return { label: 'Multiple times per class', option: '6' };
      default:
        return opt;
    }
  };

  switch (values.term) {
    case '1':
      values.term = { label: 'Fall', option: '1' };
      break;
    case '2':
      values.term = { label: 'Spring', option: '2' };
      break;
    case '3':
      values.term = { label: 'Summer', option: '3' };
      break;
    case '4':
      values.term = { label: 'Winter', option: '4' };
      break;
    default:
      break;
  }

  return values;
}

function AddEditCourse() {
  const dispatch = useDispatch<AppDispatch>();
  const [button, setButton] = useState<any>(false);
  const [courseField, setCourseField] = useState(false);

  const [openForm, setOpenForm] = useState<any>({
    open: false,
    callback: null,
  });
  const [openFormDetails, setOpenFormDetails] = useState(false);
  const [openLookupForm, setOpenLookupForm] = useState(false);
  const [openNewUserForm, setOpenAddUserForm] = useState<any>({
    isOpen: false,
    callback: null,
    data: null,
  });
  const token: any = localStorage.getItem('token');

  const userData: {
    id: string;
    type: string;
    user: string;
  } = jwt_decode(token);

  const [openAddInstructorForm, setOpenAddInstructorForm] = useState<any>({
    isOpen: false,
    callback: null,
    data: null,
    addnew: null,
  });
  const navigate = useNavigate();
  let [initialValues, setInitialValues] = useState<any>();

  const courseNames: { id: string; name: string }[] = useSelector(
    (state: RootState) => state.coursedetails.CourseDetailsName
  );

  const coursePrefixName: { id: string; name: string }[] = useSelector(
    (state: RootState) => state.courseprefix.coursePrefixName
  );

  const organizationData = useSelector(
    (state: RootState) => state.organization.organizationName
  );

  //

  const getUserDataAndType: any = useSelector(
    (state: any) => state.register.getUserById
  );

  const instructorsData: any = useSelector((state: any) => {
    const instructor: any = [...state.users.instructorsData];
    instructor.unshift({
      id: '',
      name: 'INVITE NEW USER',
      organization_name: '',
    });
    instructor.unshift({
      id: '',
      name: 'ADD USER BY EMAIL',
      organization_name: '',
    });

    const coordinator: any = [...state.users.instructorsData];
    coordinator.unshift({
      id: '',
      name: 'INVITE NEW USER',
      organization_name: '',
    });

    return { instructor: instructor, coordinator: coordinator };
  });

  if (courseNames) {
    mCourseNames = [...courseNames];
    mCourseNames = mCourseNames.map((course: any, index: any) => {
      return Object.assign({}, course, { key: index + 1 });
    });
    mCourseNames.unshift({
      id: '',
      name: 'ADD NEW COURSE',
      prefix: '',
      number: '',
    });
  }

  if (coursePrefixName) {
    mCoursePrefixName = [...coursePrefixName];
    mCoursePrefixName = mCoursePrefixName.map((course: any, index: any) => {
      return Object.assign({}, course, { key: index + 1 });
    });

    // mCoursePrefixName.unshift({
    //   id: "",
    //   name: "ADD NEW PREFIX",
    // });
  }
  const { state, pathname }: any = useLocation();

  useEffect(() => {
    dispatch(
      getUserById({
        id: `${JSON.parse(localStorage.getItem('token') || '{}')}`,
      })
    );

    //get all instructors if admin else from particular orgnization
    if (getUserDataAndType.data?.type == 'faculty') {
      dispatch(getInstructors());
      dispatch(getCoursePrefixName());
      dispatch(getCourseDetailsName());
    }
    if (getUserDataAndType?.data?.type == 'admin') {
      dispatch(getOrganizationName());
      // dispatch(getInstructors(state?.organization_name?.id));
    }
  }, [getUserDataAndType.data?.type]);

  const [organization, setOrganization] = useState<any>(null);

  useEffect(() => {
    setOrganization(initialValues?.organization);
    dispatch(getInstructors(state?.organization_name?.id));
  }, [state?.organization]);

  if (state) {
    // const editFormValue = correctBeforeEditValues(state);
    //
    initialValues = state;

    if (!initialValues.instructors) initialValues.instructors = [];
    if (!initialValues.assessment_coordinators)
      initialValues.assessment_coordinators = [];

    //condition only statisifes @copy course
    if (pathname == '/addcourse') {
      const idLookup: any = {};
      initialValues.instructors = [
        {
          id: userData?.id,
          name: userData?.user,
          organization_name: '',
        },
        ...initialValues?.instructors,
      ].filter((obj: any) => {
        if (!idLookup[obj.id]) {
          idLookup[obj.id] = true;
          return true;
        }
        return false;
      });
    }
    if (pathname == '/editcourse') {
      initialValues.is_agree = true;
    }
  } else {
    initialValues = {
      id: '',
      term: null,
      year: moment().year().toString(),
      // course_prefix_id: null,
      course_details_id: null,
      pretest_credit: false,
      posttest_credit: false,
      email_reminder: false,
      class_reminder: false,

      instructors: [
        {
          id: userData?.id,
          name: userData.user,
          organization_name: '',
        },
      ],
      assessment_coordinators: [],
      learning_type: [], //Is the course
      learning_type_other: '',
      course_enrollment_major: 0,
      course_enrollment_other: 0,
      weekly_contact_hours: { '1': '', '2': '', '3': '', '4': '', '5': '' },
      use_near_peer: [],
      primary_use_of_near_peer: '',
      primary_use_of_near_peer_other: '',
      secondary_use_of_near_peer: '',
      secondary_use_of_near_peer_other: '',

      likert_questions: {
        '14': '',
        '15': '',
        '16': '',
        '17': '',
        '18': '',
        '19': '',
        '20': '',
        '21': '',
        '22': '',
        '23': '',
        '24': '',
        '25': '',
        '26': '',
        '27': '',
        '28': '',
        '29': '',
        '30': '',
        '31': '',
        '32': '',
        '33': '',
        '34': '',
        '35': '',
        '36': '',
        '37': '',
      },

      description: '',
      // requirements: "",
      is_agree: false,
      is_test_course: false,
      created_by: '',
    };
  }
  // },[getUserDataAndType])

  const [coursePrefix, setCoursePrefix] = useState<any>(null);

  const [initialValuesPrefix, setInitialValuePrefix] = useState<CoursePrefix>({
    id: '',
    organization_name: null,
    name: '',
    is_active: true,
    created_by: '',
  });

  const [initialValuesDetails, setInitialValueDetails] = useState<any>({
    id: '',
    organization_name: null,
    name: '',
    number: '',
    course_prefix_name: null,
    is_active: true,
    created_by: '',
  });

  const termData: Options[] = [
    { label: 'Fall', option: '1' },
    { label: 'Spring', option: '2' },
    { label: 'Summer', option: '3' },
    { label: 'Winter', option: '4' },
  ];

  const validation = Yup.object({
    // term: Yup.object({
    //   value: Yup.string(),
    // })
    //   .nullable()
    //   .required('Required Field'),
    // organization_name: Yup.object({
    //   id: Yup.string(),
    //   value: Yup.string(),
    // })
    //   .nullable()
    //   .required('Required Field'),
    learning_type: Yup.array().min(
      1,
      'Learning type must contain at least one value'
    ),
    use_near_peer: Yup.array().min(
      1,
      'use_near_peer must contain at least one value'
    ),
  });

  const userValidation = Yup.object({
    first_name: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
    middle_name: Yup.string().matches(
      /^[a-zA-z]/,
      'starting letter should not be a space, numbers or special characters'
    ),
    last_name: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
    email: Yup.string().email().required('entered text is not a valid email'),
  });

  // const filter = createFilterOptions<CourseOptions>();
  const handleCloseAddUserForm = () => {
    setOpenAddInstructorForm({
      ...openAddInstructorForm,
      addnew: null,
      isOpen: false,
    });
    // setOpenAddInstructorForm({ ...openNewUserForm,  });
  };

  const navigateToCourse = () => {
    navigate('/course');
  };

  const linkertScaleQuestions = [
    {
      question:
        'I guide students through major topics as they listen and take notes',
      no: 14,
    },
    {
      question:
        "I design activities that connect course content to my students' lives and future work",
      no: 15,
    },
    {
      question:
        'My syllabus contains the specific topics that will be covered in every class session',
      no: 16,
    },
    {
      question:
        'I provide students with immediate feedback on their work during class (e.g., student response systems, short quizzes)',
      no: 17,
    },
    {
      question:
        'I structure my course with the assumption that most of the students have little useful knowledge of the topics',
      no: 18,
    },
    {
      question:
        'I use student assessment results to guide the direction of my instruction during the semester',
      no: 19,
    },
    {
      question:
        'I frequently ask students to respond to questions during class time',
      no: 20,
    },
    {
      question:
        'I use student questions and comments to determine the focus and direction of classroom discussion',
      no: 21,
    },
    {
      question:
        'I have students use a variety of means (models, drawings, graphs, symbols, simulations, etc.) to represent phenomena',
      no: 22,
    },
    {
      question:
        'I structure class so that students explore or discuss their understanding of new concepts before formal instruction',
      no: 23,
    },
    {
      question:
        'My class sessions are structured to give students a good set of notes',
      no: 24,
    },
    {
      question:
        'I structure class so that students regularly talk with one another about course concepts',
      no: 25,
    },
    {
      question:
        "I structure class so that students constructively criticize one another's ideas",
      no: 26,
    },
    {
      question:
        'I structure class so that students discuss the difficulties they have with this subject with other students',
      no: 27,
    },
    {
      question: 'I require students to work together in small groups',
      no: 28,
    },
    {
      question:
        'I structure problems so that students consider multiple approaches to finding a solution',
      no: 29,
    },
    {
      question:
        'I provide time for students to reflect about the processes they use to solve problems',
      no: 30,
    },
    {
      question:
        'I give students frequent assignments worth a small portion of their grade',
      no: 31,
    },
    {
      question:
        'I require students to make connections between related ideas or concepts when completing assignments',
      no: 32,
    },
    {
      question:
        'I provide feedback on student assignments without assigning a formal grade',
      no: 33,
    },
    {
      question:
        'My test questions focus on important facts and definitions from the course',
      no: 34,
    },
    {
      question:
        'My test questions require students to apply course concepts to unfamiliar situations',
      no: 35,
    },
    {
      question:
        'My test questions contain well-defined problems with one correct solution',
      no: 36,
    },
    {
      question:
        'I adjust student scores (e.g. curve) when necessary to reflect a proper distribution of grades',
      no: 37,
    },
  ];
  const linkertScaleAnswers = [
    {
      label: 'Not at all',
      val: '1',
    },
    {
      label: 'Minimally',
      val: '2',
    },
    {
      label: 'Somewhat',
      val: '3',
    },
    {
      label: 'Mostly',
      val: '4',
    },
    {
      label: 'Very',
      val: '5',
    },
  ];

  const Item = styled(Box)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    // ...theme.typography.body2,
    padding: theme.spacing(1),
    // textAlign: "center",
    // color: theme.palette.text.secondary,
  }));

  const questionStyle = 'font-[450]';

  const manualValidation = (values: any) => {
    let error = false;
    if (values.learning_type.length == 0) {
      Alert.error({
        title: 'Validation failed',
        text: 'Is the course is required',
      });
      return true;
    }
    if (values.use_near_peer.length == 0) {
      Alert.error({
        title: 'Validation failed',
        text: 'use near peer is required',
      });
      return true;
    }

    return error;
  };
  return (
    <main>
      <header className="text-[#48616D] mt-5 border border-[#CBD5E1] rounded-md p-1 pl-2">
        <Typography component="h1" variant="h4">
          {pathname == '/addcourse' ? 'Add' : 'Edit'} Course: LASSO Course
          Questionnaire
        </Typography>
      </header>
      <Formik
        initialValues={initialValues}
        // validationSchema={validation}
        //@ts-ignore
        // onValidationError={(errorValues: any) => {
        //
        // }}
        onSubmit={(values) => {
          // values.instructor.push({
          //   id: getUserDataAndType.data.id,
          //   name:
          //     getUserDataAndType.data.first_name +
          //     " " +
          //     getUserDataAndType.data.last_name,
          //   organization_name: "",
          // });
          if (manualValidation(values)) return;
          const formState = correctBeforeAddValues(values);

          const data: any = { ...formState };

          // data?.instructors?.push(getUserDataAndType?.data?.id);

          if (pathname == '/addcourse') {
            setButton(true);
            addCourseData(data, navigate, '', setButton);
          } else {
            setButton(true);
            editCourseData(data, navigate, setButton);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
        }) => (
          <Form>
            <Box className="border border-[#CBD5E1] rounded-md mt-5 p-3 pl-2">
              <header className="text-[#485A63]">
                <Typography component="h2" variant="h6">
                  Course Info
                </Typography>
              </header>
              <Grid container rowGap={2} columnGap={10} className="p-3 pl-6">
                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>Term</label>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="term"
                    as={Autocomplete}
                    className="max-w-xs"
                    value={values?.term}
                    size="small"
                    options={termData?.length ? termData : []}
                    getOptionLabel={(option: Options) => option?.label}
                    isOptionEqualToValue={(option: Options, value: Options) =>
                      option?.label === value?.label
                    }
                    onChange={(event: React.SyntheticEvent, term: Options) => {
                      setFieldValue('term', term);
                    }}
                    onBlur={() => setFieldTouched('term', true)}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select"
                        error={errors?.term && touched?.term ? true : false}
                        required
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>Year</label>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="w-full max-w-xs"
                      views={['year']}
                      value={values?.year}
                      onChange={(newValue: any) => {
                        setFieldValue('year', newValue.year().toString());
                      }}
                      renderInput={(params: any) => (
                        <TextField {...params} required size="small" />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={3}>
                  {getUserDataAndType?.data?.type === 'admin' && (
                    <label className={questionStyle}>Organization</label>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {getUserDataAndType?.data?.type === 'admin' && (
                    <Field
                      name="organization_name"
                      as={Autocomplete}
                      className="max-w-xs"
                      value={values?.organization_name}
                      size="small"
                      options={organizationData?.length ? organizationData : []}
                      fullWidth
                      getOptionLabel={(org: any) =>
                        org?.name === undefined ? '' : org?.name
                      }
                      isOptionEqualToValue={(option: any, value: any) =>
                        option?.id === value
                      }
                      onChange={(_: any, name: any) => {
                        setOrganization(name);
                        setFieldValue('organization_name', name);

                        // if (values.course_prefix_id) {
                        //   setFieldValue("course_prefix_id", null);
                        //   setFieldValue("course_details_id", null);
                        // }
                        setFieldValue('course_details_id', null);
                        if (values?.instructors.length > 0)
                          setFieldValue('instructors', [
                            {
                              id: getUserDataAndType?.data?.id,
                              name:
                                getUserDataAndType?.data?.first_name +
                                ' ' +
                                getUserDataAndType?.data?.last_name,
                              organization_name: '',
                            },
                          ]);
                        setFieldValue('assessment_coordinators', []);
                        dispatch(getCoursePrefixName(name?.id));
                        dispatch(
                          getCourseDetailsName(
                            // course_prefix.id,
                            name?.id,
                            setCourseField
                          )
                        );
                        dispatch(getInstructors(name?.id));
                      }}
                      // onBlur={() => setFieldTouched("organization_name", true)}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          name="organization_name"
                          placeholder="Select"
                          value={values?.organization_name}
                          error={
                            errors?.organization_name &&
                            touched?.organization_name
                              ? true
                              : false
                          }
                          required
                        />
                      )}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>Course</label>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {getUserDataAndType?.data?.type === 'admin' && (
                    <Field
                      name="course_id"
                      as={Autocomplete}
                      open={courseField}
                      onOpen={() => {
                        dispatch(
                          getCourseDetailsName(
                            // course_prefix.id,
                            values?.organization_name?.id,
                            setCourseField
                          )
                        );
                      }}
                      onClose={() => {
                        setCourseField(false);
                      }}
                      className="max-w-xs"
                      disabled={values?.organization_name ? false : true}
                      value={values?.course_details_id}
                      size="small"
                      options={mCourseNames?.length ? mCourseNames : []}
                      getOptionLabel={(option: any) =>
                        option?.prefix +
                        ' ' +
                        option?.number +
                        ' - ' +
                        option.name
                      }
                      isOptionEqualToValue={(
                        option: CourseOptions,
                        value: CourseOptions
                      ) => option?.name === value?.name}
                      onChange={(
                        event: React.SyntheticEvent,
                        course_id: { id: string; name: string }
                      ) => {
                        if (course_id?.name == 'ADD NEW COURSE') {
                          setOrganization(values.organization_name);
                          // setCoursePrefix(values.course_prefix_id);
                          setOpenFormDetails({
                            ...openForm,
                            ...{ open: true, callback: setFieldValue },
                          });
                        } else {
                          setFieldValue('course_details_id', course_id);
                        }
                      }}
                      onBlur={() => setFieldTouched('course_details_id', true)}
                      renderInput={(params: AutocompleteRenderInputParams) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select"
                          error={
                            errors.course_details_id &&
                            touched.course_details_id
                              ? true
                              : false
                          }
                          // helperText={
                          //   errors.course_details_id && touched.course_details_id
                          //     ? errors.course_details_id
                          //     : ''
                          // }
                          required
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: <>{params.InputProps.endAdornment}</>,
                          }}
                        />
                      )}
                    />
                  )}

                  {getUserDataAndType?.data?.type === 'faculty' && (
                    <Field
                      name="course_id"
                      as={Autocomplete}
                      className="max-w-xs"
                      open={courseField}
                      onOpen={() => {
                        setCourseField(true);
                      }}
                      onClose={() => {
                        setCourseField(false);
                      }}
                      value={values?.course_details_id}
                      size="small"
                      options={mCourseNames?.length ? mCourseNames : []}
                      getOptionLabel={(option: any) =>
                        option?.prefix +
                        ' ' +
                        option?.number +
                        ' - ' +
                        option.name
                      }
                      isOptionEqualToValue={(
                        option: CourseOptions,
                        value: CourseOptions
                      ) => option?.name === value?.name}
                      onChange={(
                        event: React.SyntheticEvent,
                        course_id: { id: string; name: string }
                      ) => {
                        if (course_id?.name == 'ADD NEW COURSE') {
                          // setOrganization(values.organization_name)
                          // setCoursePrefix(values.course_prefix_id);
                          setOpenFormDetails({
                            ...openForm,
                            ...{ open: true, callback: setFieldValue },
                          });
                        } else {
                          setFieldValue('course_details_id', course_id);
                        }
                      }}
                      onBlur={() => setFieldTouched('course_details_id', true)}
                      renderInput={(params: AutocompleteRenderInputParams) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select"
                          error={
                            errors.course_details_id &&
                            touched.course_details_id
                              ? true
                              : false
                          }
                          // helperText={
                          //   errors.course_details_id && touched.course_details_id
                          //     ? errors.course_details_id
                          //     : ''
                          // }
                          required
                        />
                      )}
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
            <Box className="border border-[#CBD5E1] rounded-md mt-5 p-3 pl-2">
              <Grid container rowGap={2} columnGap={10} className="p-3 pl-6">
                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>Instructors</label>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {getUserDataAndType?.data?.type === 'admin' && (
                    <Field
                      name="instructors"
                      multiple
                      disabled={values?.organization_name ? false : true}
                      as={Autocomplete}
                      disableCloseOnSelect
                      filterSelectedOptions
                      clearOnEscape
                      openOnFocus
                      className="max-w-xs"
                      value={values?.instructors}
                      size="small"
                      options={
                        instructorsData?.instructor
                          ? instructorsData?.instructor
                          : []
                      }
                      // groupBy={(option: any) => option?.organization_name}
                      getOptionLabel={(option: any) => option?.name}
                      isOptionEqualToValue={(option: any, value: any) => {
                        return option.id === value.id;
                      }}
                      onChange={(event: any, instructor: any) => {
                        if (
                          instructor[instructor?.length - 1]?.name ==
                          'INVITE NEW USER'
                        ) {
                          setOpenAddInstructorForm({
                            isOpen: true,
                            callback: setFieldValue,
                            name: 'instructor',
                            data: instructor,
                          });
                        } else if (
                          instructor[instructor?.length - 1]?.name ==
                          'ADD USER BY EMAIL'
                        ) {
                          setOpenLookupForm(true);
                          //to set add new user form fields
                          setOpenAddInstructorForm({
                            isOpen: false,
                            callback: setFieldValue,
                            name: 'instructor',
                            data: instructor,
                          });
                        } else {
                          setFieldValue('instructors', instructor);
                        }
                      }}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select"
                          required={values?.instructors?.length === 0}
                        />
                      )}
                    />
                  )}

                  {getUserDataAndType?.data?.type === 'faculty' && (
                    <Field
                      name="instructors"
                      multiple
                      as={Autocomplete}
                      disableCloseOnSelect
                      filterSelectedOptions
                      clearOnEscape
                      openOnFocus
                      className="max-w-xs"
                      value={values.instructors}
                      size="small"
                      options={
                        instructorsData?.instructor
                          ? instructorsData?.instructor
                          : []
                      }
                      // groupBy={(option: any) => option?.organization_name}
                      getOptionLabel={(option: any) => option?.name}
                      isOptionEqualToValue={(option: any, value: any) => {
                        return option.id === value.id;
                      }}
                      onChange={(event: any, instructor: any) => {
                        if (
                          instructor[instructor?.length - 1]?.name ==
                          'INVITE NEW USER'
                        ) {
                          setOpenAddInstructorForm({
                            isOpen: true,
                            callback: setFieldValue,
                            name: 'instructor',
                            data: instructor,
                          });
                        } else if (
                          instructor[instructor?.length - 1]?.name ==
                          'ADD USER BY EMAIL'
                        ) {
                          setOpenLookupForm(true);
                          setOpenAddInstructorForm({
                            isOpen: false,
                            callback: setFieldValue,
                            name: 'instructor',
                            data: instructor,
                          });
                        } else {
                          //
                          setFieldValue('instructors', instructor);
                          //
                        }
                      }}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select"
                          required={values?.instructors?.length === 0}
                        />
                      )}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>
                    Assessment Coordinators
                  </label>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {getUserDataAndType?.data?.type === 'admin' && (
                    <Field
                      name="assessment_coordinators"
                      multiple
                      as={Autocomplete}
                      disabled={values?.organization_name ? false : true}
                      disableCloseOnSelect
                      filterSelectedOptions
                      clearOnEscape
                      openOnFocus
                      className="max-w-xs"
                      value={values?.assessment_coordinators}
                      size="small"
                      options={
                        instructorsData?.coordinator
                          ? instructorsData?.coordinator
                          : []
                      }
                      //groupBy={(option: any) => option?.organization_name}
                      getOptionLabel={(option: any) => option?.name}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.id === value.id
                      }
                      onChange={(event: any, assessment_coordinators: any) => {
                        if (
                          assessment_coordinators[
                            assessment_coordinators?.length - 1
                          ]?.name == 'INVITE NEW USER'
                        ) {
                          setOpenAddInstructorForm({
                            isOpen: true,
                            callback: setFieldValue,
                            name: 'assessment_coordinators',
                            data: assessment_coordinators,
                          });
                        } else {
                          setFieldValue(
                            'assessment_coordinators',
                            assessment_coordinators
                          );
                        }
                      }}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select"
                          // required={
                          //   values?.assessment_coordinators?.length === 0
                          // }
                        />
                      )}
                    />
                  )}

                  {getUserDataAndType?.data?.type === 'faculty' && (
                    <Field
                      name="assessment_coordinators"
                      multiple
                      as={Autocomplete}
                      disableCloseOnSelect
                      filterSelectedOptions
                      clearOnEscape
                      openOnFocus
                      className="max-w-xs"
                      value={values.assessment_coordinators}
                      size="small"
                      options={
                        instructorsData?.coordinator
                          ? instructorsData?.coordinator
                          : []
                      }
                      //groupBy={(option: any) => option?.organization_name}
                      getOptionLabel={(option: any) => option?.name}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.id === value.id
                      }
                      onChange={(event: any, assessment_coordinators: any) => {
                        if (
                          assessment_coordinators[
                            assessment_coordinators?.length - 1
                          ]?.name == 'INVITE NEW USER'
                        ) {
                          setOpenAddInstructorForm({
                            isOpen: true,
                            callback: setFieldValue,
                            name: 'assessment_coordinators',
                            data: assessment_coordinators,
                          });
                        } else {
                          setFieldValue(
                            'assessment_coordinators',
                            assessment_coordinators
                          );
                        }
                      }}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select"
                          // required={
                          //   values?.assessment_coordinators?.length === 0
                          // }
                        />
                      )}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>Is the course</label>
                  {errors?.learning_type && touched?.learning_type ? (
                    <p className="text-red-400 mt-1 font-bold text-base italic">
                      Required Field
                    </p>
                  ) : (
                    ''
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid>
                    <Field
                      as={Checkbox}
                      sx={{ marginLeft: '-10px' }}
                      name="learning_type"
                      checked={values?.learning_type?.includes('1')}
                      value={'1'}
                    />
                    <span className="ml-5 inline-block">In Person</span>
                  </Grid>
                  <Grid>
                    <Field
                      as={Checkbox}
                      sx={{ marginLeft: '-10px' }}
                      name="learning_type"
                      checked={values?.learning_type?.includes('2')}
                      value={'2'}
                    />
                    <span className="ml-5 inline-block">Online</span>
                  </Grid>
                  <Grid>
                    <Field
                      as={Checkbox}
                      sx={{ marginLeft: '-10px' }}
                      name="learning_type"
                      checked={values?.learning_type?.includes('3')}
                      value={'3'}
                    />
                    <span className="ml-5 inline-block">Hybrid</span>
                  </Grid>
                  <Grid>
                    <span className="mx-1 font-[450] mr-3 mt-2 inline-block">
                      Other
                    </span>
                    <Field
                      name="learning_type_other"
                      as={TextField}
                      placeholder="other"
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>
                    Course Enrollment: Majors in your discipline
                  </label>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="course_enrollment_major"
                    as={TextField}
                    variant="outlined"
                    size="small"
                    placeholder="Percent"
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 100,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    onChange={(e: any) => {
                      const value = parseInt(e.target.value);
                      if (value > 100) {
                        e.target.value = '100';
                        handleChange(e);
                        handleChange({
                          target: {
                            name: 'course_enrollment_other',
                            value: '0',
                          },
                        });
                      } else {
                        handleChange(e);
                        handleChange({
                          target: {
                            name: 'course_enrollment_other',
                            value: `${100 - value}`,
                          },
                        });
                      }
                    }}
                    error={
                      errors.course_enrollment_major &&
                      touched.course_enrollment_major
                    }
                    required
                  />
                  {errors.course_enrollment_major &&
                    touched.course_enrollment_major && (
                      <p style={{ color: 'red' }}>
                        Please enter a value less than or equal to 100%
                      </p>
                    )}
                </Grid>

                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>
                    Course Enrollment: Majors in other disciplines
                  </label>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    name="course_enrollment_other"
                    as={TextField}
                    variant="outlined"
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 100,
                      step: 1, // Restrict to integer values only
                    }}
                    size="small"
                    placeholder="Percent"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    onChange={(e: any) => {
                      const value = parseInt(e.target.value);
                      if (value > 100) {
                        e.target.value = '100';
                        handleChange(e);
                        handleChange({
                          target: {
                            name: 'course_enrollment_major',
                            value: '0',
                          },
                        });
                      } else {
                        handleChange(e);
                        handleChange({
                          target: {
                            name: 'course_enrollment_major',
                            value: `${100 - value}`,
                          },
                        });
                      }
                    }}
                    error={
                      errors.course_enrollment_other &&
                      touched.course_enrollment_other
                    }
                    required
                  />
                  <ErrorMessage
                    name="course_enrollment_other"
                    component="div"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>
                    Weekly contact hours for students in the course
                  </label>
                </Grid>
                <Grid
                  item
                  container
                  xs={12}
                  sm={6}
                  rowGap={2}
                  columnGap={10}
                  sx={{ alignItems: 'center' }}
                  // sx={{ columnGap: '120px' }}
                >
                  <Grid item xs={12} sm={3}>
                    <label>a. Lecture</label>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="weekly_contact_hours.1"
                      as={TextField}
                      variant="outlined"
                      size="small"
                      type="number"
                      inputProps={{
                        min: 0,
                        max: 100,
                      }}
                      error={
                        errors.weekly_contact_hours &&
                        touched.weekly_contact_hours
                          ? true
                          : false
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <label>b. Lab</label>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="weekly_contact_hours.2"
                      as={TextField}
                      variant="outlined"
                      size="small"
                      inputProps={{
                        min: 0,
                        max: 100,
                      }}
                      error={
                        errors.weekly_contact_hours &&
                        touched.weekly_contact_hours
                          ? true
                          : false
                      }
                      type="number"
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <div style={{ width: '13rem' }} className="flex gap-1">
                      <span>c.</span>
                      <label>Combined Lecture / Lab</label>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="weekly_contact_hours.3"
                      as={TextField}
                      variant="outlined"
                      size="small"
                      type="number"
                      inputProps={{
                        min: 0,
                        max: 100,
                      }}
                      error={
                        errors.weekly_contact_hours &&
                        touched.weekly_contact_hours
                          ? true
                          : false
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <div style={{ width: '13rem' }} className="flex gap-1">
                      <span>d.</span>
                      <label>Discussion / Recitation</label>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="weekly_contact_hours.4"
                      as={TextField}
                      variant="outlined"
                      size="small"
                      type="number"
                      inputProps={{
                        min: 0,
                        max: 100,
                      }}
                      error={
                        errors.weekly_contact_hours &&
                        touched.weekly_contact_hours
                          ? true
                          : false
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <label>e. Other</label>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      name="weekly_contact_hours.5"
                      as={TextField}
                      variant="outlined"
                      size="small"
                      type="number"
                      inputProps={{
                        min: 0,
                        max: 100,
                      }}
                      error={
                        errors.weekly_contact_hours &&
                        touched.weekly_contact_hours
                          ? true
                          : false
                      }
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>
                    Does your course use near-peer instructors?
                  </label>
                  {errors?.use_near_peer && touched?.use_near_peer ? (
                    <p className="text-red-400 mt-1 font-bold text-base italic">
                      Required Field
                    </p>
                  ) : (
                    ''
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid>
                    <Field
                      as={Checkbox}
                      sx={{ marginLeft: '-10px' }}
                      name="use_near_peer"
                      checked={
                        values?.use_near_peer?.includes('1') &&
                        !values?.use_near_peer?.includes('5')
                      }
                      value={'1'}
                      onChange={(event: any) => {
                        const isChecked = event.target.checked;
                        let updatedValues = values?.use_near_peer || [];

                        if (isChecked) {
                          updatedValues = updatedValues.filter(
                            (value: any) => value !== '5'
                          );
                          updatedValues.push('1');
                        } else {
                          updatedValues = updatedValues.filter(
                            (value: any) => value !== '1' && value !== '5'
                          );
                        }

                        setFieldValue('use_near_peer', updatedValues);
                      }}
                    />
                    <span className="ml-1">Learning assistants</span>
                  </Grid>
                  <Grid>
                    <Field
                      as={Checkbox}
                      sx={{ marginLeft: '-10px' }}
                      name="use_near_peer"
                      checked={
                        values?.use_near_peer?.includes('2') &&
                        !values?.use_near_peer?.includes('5')
                      }
                      value={'2'}
                      onChange={(event: any) => {
                        const isChecked = event.target.checked;
                        let updatedValues = values?.use_near_peer || [];

                        if (isChecked) {
                          updatedValues = updatedValues.filter(
                            (value: any) => value !== '5'
                          );
                          updatedValues.push('2');
                        } else {
                          updatedValues = updatedValues.filter(
                            (value: any) => value !== '2' && value !== '5'
                          );
                        }

                        setFieldValue('use_near_peer', updatedValues);
                      }}
                    />
                    <span className="ml-1">Supplemental instruction</span>
                  </Grid>
                  <Grid>
                    <Field
                      as={Checkbox}
                      sx={{ marginLeft: '-10px' }}
                      name="use_near_peer"
                      checked={
                        values?.use_near_peer?.includes('3') &&
                        !values?.use_near_peer?.includes('5')
                      }
                      value={'3'}
                      onChange={(event: any) => {
                        const isChecked = event.target.checked;
                        let updatedValues = values?.use_near_peer || [];

                        if (isChecked) {
                          updatedValues = updatedValues.filter(
                            (value: any) => value !== '5'
                          );
                          updatedValues.push('3');
                        } else {
                          updatedValues = updatedValues.filter(
                            (value: any) => value !== '3' && value !== '5'
                          );
                        }

                        setFieldValue('use_near_peer', updatedValues);
                      }}
                    />
                    <span className="ml-1">Peer led team learning</span>
                  </Grid>
                  <Grid>
                    <Field
                      as={Checkbox}
                      sx={{ marginLeft: '-10px' }}
                      name="use_near_peer"
                      checked={
                        values?.use_near_peer?.includes('4') &&
                        !values?.use_near_peer?.includes('5')
                      }
                      value={'4'}
                      onChange={(event: any) => {
                        const isChecked = event.target.checked;
                        let updatedValues = values?.use_near_peer || [];

                        if (isChecked) {
                          updatedValues = updatedValues.filter(
                            (value: any) => value !== '5'
                          );
                          updatedValues.push('4');
                        } else {
                          updatedValues = updatedValues.filter(
                            (value: any) => value !== '4' && value !== '5'
                          );
                        }

                        setFieldValue('use_near_peer', updatedValues);
                      }}
                    />
                    <span className="ml-1">Other</span>
                  </Grid>
                  <Grid>
                    <Field
                      as={Checkbox}
                      sx={{ marginLeft: '-10px' }}
                      name="use_near_peer"
                      checked={values?.use_near_peer?.includes('5')}
                      value={'5'}
                      onChange={(event: any) => {
                        const isChecked = event.target.checked;
                        let updatedValues = values?.use_near_peer || [];

                        if (isChecked) {
                          updatedValues = ['5'];
                        } else {
                          updatedValues = updatedValues.filter(
                            (value: any) => value !== '5'
                          );
                        }

                        setFieldValue('use_near_peer', updatedValues);
                      }}
                    />
                    <span className="ml-1">No</span>
                  </Grid>
                </Grid>

                {values?.use_near_peer.length != 0 &&
                  !values?.use_near_peer?.includes('5') && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        //style={values.use_near_peer == "" || values.use_near_peer == "5"? { display: "none" } : {}}
                      >
                        <label className={questionStyle}>
                          Which best describes your primary use of near-peer
                          instructors?
                        </label>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        //style={values.use_near_peer == "" || values.use_near_peer == "5"? { display: "none" } : {}}
                      >
                        <Stack rowGap={1}>
                          <RadioGroup name="primary_use_of_near_peer">
                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="primary_use_of_near_peer"
                                  checked={
                                    values?.primary_use_of_near_peer == '1'
                                  }
                                  value="1"
                                />
                              </label>
                              <span>
                                Less than 50% of class/lecture time will be
                                dedicated facilitating small group
                                discussions/activities
                              </span>
                            </div>

                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="primary_use_of_near_peer"
                                  checked={
                                    values?.primary_use_of_near_peer == '2'
                                  }
                                  value="2"
                                />
                              </label>
                              <span>
                                More than 50% of class/lecture time will be
                                dedicated facilitating small group
                                discussions/activities
                              </span>
                            </div>

                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="primary_use_of_near_peer"
                                  checked={
                                    values?.primary_use_of_near_peer == '3'
                                  }
                                  value="3"
                                />
                                <span>
                                  Facilitate mandatory group sessions outside of
                                  lecture
                                </span>
                              </label>
                            </div>

                            <div className="flex gap-1 items-center">
                              {/* <label>
                          <Field
                            as={Radio}
                            sx={{ paddingLeft: '0' }}
                            name="primary_use_of_near_peer"
                            checked={values.primary_use_of_near_peer == '4'}
                            value="4"
                          />
                        </label> */}
                              <span
                                style={{
                                  paddingLeft: '36px',
                                }}
                              >
                                <p>
                                  An example of a mandatory group sessions would
                                  be a weekly recitation session that meets
                                  outside of lecture where attendance is
                                  required.
                                </p>
                              </span>
                            </div>

                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="primary_use_of_near_peer"
                                  checked={
                                    values?.primary_use_of_near_peer == '4'
                                  }
                                  value="4"
                                />
                              </label>
                              <span>
                                Facilitate optional group sessions outside of
                                lecture
                              </span>
                            </div>

                            <div className="flex gap-1 items-center">
                              {/* <label>
                          <Field
                            as={Radio}
                            sx={{ paddingLeft: '0' }}
                            name="primary_use_of_near_peer"
                            checked={values.primary_use_of_near_peer == '6'}
                            value="6"
                          />
                        </label> */}
                              <span
                                style={{
                                  paddingLeft: '36px',
                                }}
                              >
                                <p>
                                  An example of an optional group session would
                                  be a weekly study section that meets outside
                                  of lecture where attendance is not required.
                                </p>
                              </span>
                            </div>

                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="primary_use_of_near_peer"
                                  checked={
                                    values?.primary_use_of_near_peer == '5'
                                  }
                                  value="5"
                                />
                              </label>{' '}
                              <span>Facilitate laboratory sessions</span>
                            </div>

                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="primary_use_of_near_peer"
                                  checked={
                                    values?.primary_use_of_near_peer == '6'
                                  }
                                  value="6"
                                />
                              </label>
                              <span>Other</span>
                              <Field
                                // {...(values.primary_use_of_near_peer == "8"
                                //   ? {}
                                //   : { style: { display: "none" } })}
                                name="primary_use_of_near_peer_other"
                                as={TextField}
                                {...(values?.primary_use_of_near_peer != '6'
                                  ? { value: '' }
                                  : {})}
                                disabled={
                                  values?.primary_use_of_near_peer != '6'
                                }
                                style={{ marginLeft: '20px' }}
                                placeholder="other"
                                size="small"
                              />
                            </div>
                          </RadioGroup>
                        </Stack>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        //style={values.use_near_peer == "" || values.use_near_peer == "5"? { display: "none" } : {}}
                      >
                        <label className={questionStyle}>
                          Which best describes your secondary use of near-peer
                          instructors?
                        </label>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        //style={values.use_near_peer == "" || values.use_near_peer == "5"? { display: "none" } : {}}
                      >
                        <Stack rowGap={1}>
                          <RadioGroup name="secondary_use_of_near_peer">
                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="secondary_use_of_near_peer"
                                  checked={
                                    values?.secondary_use_of_near_peer == '1'
                                  }
                                  value="1"
                                />
                              </label>
                              <span>
                                Less than 50% of class/lecture time will be
                                dedicated facilitating small group
                                discussions/activities
                              </span>
                            </div>

                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="secondary_use_of_near_peer"
                                  checked={
                                    values?.secondary_use_of_near_peer == '2'
                                  }
                                  value="2"
                                />
                              </label>
                              <span>
                                More than 50% of class/lecture time will be
                                dedicated facilitating small group
                                discussions/activities
                              </span>
                            </div>

                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="secondary_use_of_near_peer"
                                  checked={
                                    values?.secondary_use_of_near_peer == '3'
                                  }
                                  value="3"
                                />
                              </label>
                              <span>
                                Facilitate mandatory group sessions outside of
                                lecture
                              </span>
                            </div>

                            <div className="flex gap-1 items-center">
                              {/* <label>
                          <Field
                            as={Radio}
                            sx={{ paddingLeft: '0' }}
                            name="secondary_use_of_near_peer"
                            checked={values.secondary_use_of_near_peer == '4'}
                            value="4"
                          />
                        </label> */}
                              <span
                                style={{
                                  paddingLeft: '36px',
                                }}
                              >
                                <p>
                                  An example of a mandatory group sessions would
                                  be a weekly recitation session that meets
                                  outside of lecture where attendance is
                                  required.
                                </p>
                              </span>
                            </div>

                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="secondary_use_of_near_peer"
                                  checked={
                                    values?.secondary_use_of_near_peer == '4'
                                  }
                                  value="4"
                                />
                              </label>
                              <span>
                                Facilitate optional group sessions outside of
                                lecture
                              </span>
                            </div>

                            <div className="flex gap-1 items-center">
                              {/* <label>
                          <Field
                            as={Radio}
                            sx={{ paddingLeft: '0' }}
                            name="secondary_use_of_near_peer"
                            checked={values.secondary_use_of_near_peer == '6'}
                            value="6"
                          />
                        </label> */}
                              <span
                                style={{
                                  paddingLeft: '36px',
                                }}
                              >
                                <p>
                                  An example of an optional group session would
                                  be a weekly study section that meets outside
                                  of lecture where attendance is not required.
                                </p>
                              </span>
                            </div>

                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="secondary_use_of_near_peer"
                                  checked={
                                    values?.secondary_use_of_near_peer == '5'
                                  }
                                  value="5"
                                />
                              </label>
                              <span>Facilitate laboratory sessions</span>
                            </div>

                            <div className="flex gap-1 items-center">
                              <label>
                                <Field
                                  as={Radio}
                                  sx={{ paddingLeft: '0' }}
                                  name="secondary_use_of_near_peer"
                                  checked={
                                    values?.secondary_use_of_near_peer == '6'
                                  }
                                  value="6"
                                />
                              </label>{' '}
                              <span>Other</span>
                              <Field
                                // {...(values.secondary_use_of_near_peer == "8"
                                //   ? {}
                                //   : { style: { display: "none" } })}
                                name="secondary_use_of_near_peer_other"
                                style={{ marginLeft: '20px' }}
                                {...(values?.secondary_use_of_near_peer != '6'
                                  ? { value: '' }
                                  : {})}
                                disabled={
                                  values?.secondary_use_of_near_peer != '6'
                                }
                                as={TextField}
                                placeholder="other"
                                size="small"
                              />
                            </div>

                            <label>
                              <Field
                                as={Radio}
                                sx={{ paddingLeft: '0' }}
                                name="secondary_use_of_near_peer"
                                checked={
                                  values?.secondary_use_of_near_peer == '7'
                                }
                                value="7"
                              />
                              <span>None</span>
                            </label>
                          </RadioGroup>
                        </Stack>
                      </Grid>
                    </>
                  )}
              </Grid>
            </Box>
            <Box className="border border-[#CBD5E1] rounded-md mt-5 p-3 pl-2">
              <header className="text-[#485A63]">
                <Typography component="h2" variant="h6">
                  Please indicate if you plan on using the following methods to
                  improve participation.
                </Typography>
              </header>
              <Grid
                container
                rowGap={2}
                columnGap={10}
                className="p-3 pl-6 items-center"
              >
                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>
                    Will credit be offered to students who participate in the
                    pretest?
                  </label>
                </Grid>
                <Grid
                  item
                  container
                  xs={12}
                  sm={6}
                  // style={{
                  //   display: "flex",
                  //   flexDirection: "column",
                  //   marginTop: "20px",
                  //   maxWidth: "400px",
                  //   border: "2px solid red",
                  // }}
                >
                  <RadioGroup
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}
                    name="pretest_credit"
                  >
                    <Item>
                      <Field
                        as={Radio}
                        sx={{ marginLeft: '-10px' }}
                        name="pretest_credit"
                        onChange={(e: any) => {
                          setFieldValue('pretest_credit', true);
                        }}
                        checked={Boolean(values?.pretest_credit)}
                        //  value={true}
                        // required
                      />
                      <label
                        className={questionStyle}
                        style={{ marginRight: '10px' }}
                      >
                        Yes
                      </label>
                    </Item>
                    <Item>
                      <Field
                        as={Radio}
                        sx={{ marginLeft: '-10px' }}
                        name="pretest_credit"
                        onChange={(e: any) => {
                          setFieldValue('pretest_credit', false);
                        }}
                        checked={!Boolean(values?.pretest_credit)}
                        // value={false}
                        // required
                      />
                      <label
                        className={questionStyle}
                        style={{ marginRight: '10px' }}
                      >
                        No
                      </label>
                    </Item>
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>
                    Will credit be offered to students who participate in the
                    posttest?
                  </label>
                </Grid>
                <Grid
                  item
                  container
                  xs={12}
                  sm={6}
                  // style={{
                  //   display: "flex",
                  //   flexDirection: "column",
                  //   marginTop: "20px",
                  //   maxWidth: "400px",
                  //   border: "2px solid red",
                  // }}
                >
                  <RadioGroup
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}
                    name="posttest_credit"
                  >
                    <Item>
                      <Field
                        as={Radio}
                        sx={{ marginLeft: '-10px' }}
                        name="posttest_credit"
                        onChange={(e: any) => {
                          setFieldValue('posttest_credit', true);
                        }}
                        checked={Boolean(values?.posttest_credit)}
                        //  value={true}
                        // required
                      />
                      <label
                        className={questionStyle}
                        style={{ marginRight: '10px' }}
                      >
                        Yes
                      </label>
                    </Item>
                    <Item>
                      <Field
                        as={Radio}
                        sx={{ marginLeft: '-10px' }}
                        name="posttest_credit"
                        onChange={(e: any) => {
                          setFieldValue('posttest_credit', false);
                        }}
                        checked={!Boolean(values?.posttest_credit)}
                        // value={false}
                        // required
                      />
                      <label
                        className={questionStyle}
                        style={{ marginRight: '10px' }}
                      >
                        No
                      </label>
                    </Item>
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>
                    Will email reminders be used to motivate students to
                    participate?
                  </label>
                </Grid>
                <Grid
                  item
                  container
                  xs={12}
                  sm={6}
                  // style={{
                  //   display: "flex",
                  //   flexDirection: "column",
                  //   marginTop: "20px",
                  //   maxWidth: "400px",
                  //   border: "2px solid red",
                  // }}
                >
                  <RadioGroup
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}
                    name="email_reminder"
                  >
                    <Item>
                      <Field
                        as={Radio}
                        sx={{ marginLeft: '-10px' }}
                        name="posttest_credit"
                        onChange={(e: any) => {
                          setFieldValue('email_reminder', true);
                        }}
                        checked={Boolean(values?.email_reminder)}
                        //  value={true}
                        // required
                      />
                      <label
                        className={questionStyle}
                        style={{ marginRight: '10px' }}
                      >
                        Yes
                      </label>
                    </Item>
                    <Item>
                      <Field
                        as={Radio}
                        sx={{ marginLeft: '-10px' }}
                        name="email_reminder"
                        onChange={(e: any) => {
                          setFieldValue('email_reminder', false);
                        }}
                        checked={!Boolean(values?.email_reminder)}
                        // value={false}
                        // required
                      />
                      <label
                        className={questionStyle}
                        style={{ marginRight: '10px' }}
                      >
                        No
                      </label>
                    </Item>
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>
                    Will in class reminders be used to motivate students to
                    participate?
                  </label>
                </Grid>
                <Grid
                  item
                  container
                  xs={12}
                  sm={6}
                  style={{
                    display: 'flex',
                    gap: '10px',
                  }}
                >
                  <RadioGroup
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}
                    name="class_reminder"
                  >
                    <Item>
                      <Field
                        as={Radio}
                        sx={{ marginLeft: '-10px' }}
                        name="posttest_credit"
                        onChange={(e: any) => {
                          setFieldValue('class_reminder', true);
                        }}
                        checked={Boolean(values?.class_reminder)}
                        //  value={true}
                        // required
                      />
                      <label
                        className={questionStyle}
                        style={{ marginRight: '10px' }}
                      >
                        Yes
                      </label>
                    </Item>
                    <Item>
                      <Field
                        as={Radio}
                        sx={{ marginLeft: '-10px' }}
                        name="class_reminder"
                        onChange={(e: any) => {
                          setFieldValue('class_reminder', false);
                        }}
                        checked={!Boolean(values?.class_reminder)}
                        // value={false}
                        // required
                      />
                      <label
                        className={questionStyle}
                        style={{ marginRight: '10px' }}
                      >
                        No
                      </label>
                    </Item>
                  </RadioGroup>
                </Grid>
              </Grid>
            </Box>
            <Box className="border border-[#CBD5E1] rounded-md mt-5 p-3 pl-5">
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={4}>
                  <Item className="text-center">
                    <b>Description</b>
                  </Item>
                </Grid>
                <Grid item xs={1.6}>
                  <Item className="text-center">
                    <b>Not at all</b>
                  </Item>
                </Grid>
                <Grid item xs={1.5}>
                  <Item className="text-center">
                    <b>Minimally</b>
                  </Item>
                </Grid>
                <Grid item xs={1.5}>
                  <Item className="text-center">
                    <b>Somewhat</b>
                  </Item>
                </Grid>
                <Grid item xs={1.7}>
                  <Item className="text-center">
                    <b>Mostly</b>
                  </Item>
                </Grid>
                <Grid item xs={1.6}>
                  <Item className="text-center">
                    <b style={{ position: 'relative', right: '15px' }}>Very</b>
                  </Item>
                </Grid>

                <Scrollbar style={{ width: '100%', height: 400 }}>
                  {linkertScaleQuestions.map((e) => (
                    <div className="flex ml-7">
                      <Grid item xs={4.3}>
                        <Item>
                          <label className={questionStyle}>{e.question}</label>
                        </Item>
                      </Grid>

                      <Grid
                        item
                        container
                        xs={8.6}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '20px',
                        }}
                      >
                        <RadioGroup
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                          }}
                          name={`likert_questions.${e?.no}`}
                        >
                          {linkertScaleAnswers.map((ans) => (
                            <Item>
                              <Field
                                as={Radio}
                                // sx={{ paddingLeft: '0' }}
                                name={`likert_questions.${e?.no}`}
                                checked={
                                  `${values?.likert_questions[e?.no]}` ==
                                  `${ans?.val}`
                                }
                                value={ans.val}
                                required
                              />
                            </Item>
                          ))}
                        </RadioGroup>
                      </Grid>
                    </div>
                  ))}
                </Scrollbar>
              </Grid>
            </Box>
            <Box className="border border-[#CBD5E1] rounded-md mt-5 p-3 pl-2">
              <Grid container rowGap={2} columnGap={19} className="p-3 pl-6">
                <Grid item xs={12} sm={3}>
                  <label className={questionStyle}>
                    If you think we need more information about your class,
                    please explain
                  </label>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Field
                    as={TextField}
                    name="description"
                    multiline
                    rows={3}
                    fullWidth
                    className="border border-neutral-400 rounded-sm"
                    value={values?.description}
                    error={errors.description && touched.description}
                    helpertext={
                      errors.description && touched.description
                        ? errors.description
                        : ''
                    }
                  />
                </Grid>
              </Grid>
            </Box>
            <Stack spacing={2} className="ml-3 mt-4">
              <div className="flex gap-1 items-center">
                <label>
                  <Field
                    type="checkbox"
                    className="mr-3"
                    name="is_agree"
                    required
                    checked={values?.is_agree}
                  />
                </label>
                <span className="text-sm">
                  I agree that data associated with this course may be
                  anonymized, aggregated, and shared with researchers who have
                  appropriate IRB approval. For more information, please see the
                  <a
                    className="text-blue-600 ml-1 underline"
                    href="https://lassoeducation.org/faq/"
                  >
                    LASSO platform FAQ.
                  </a>
                  <span className="text-orange-400">
                    &nbsp;To create a class on the LASSO platform you must agree
                    to the terms for sharing data.
                  </span>
                </span>
              </div>

              <div className="flex gap-1 items-center">
                <label>
                  <Field
                    type="checkbox"
                    name="is_test_course"
                    checked={values?.is_test_course}
                    className="mr-3"
                  />
                </label>
                <span className="text-sm">This is a test course.</span>
              </div>
            </Stack>
            <div className="flex gap-5 justify-center my-5">
              <Button
                variant="contained"
                style={{ textTransform: 'capitalize', width: '100px' }}
                onClick={() => navigateToCourse()}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                style={{ textTransform: 'capitalize', width: '100px' }}
                type="submit"
                // fullWidth
                disabled={!values?.is_agree || button}
              >
                {pathname == '/addcourse' ? 'Save' : 'Update'}
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
        )}
      </Formik>
      <AddCoursePrefix
        openDialog={openForm}
        setOpenForm={setOpenForm}
        initialValuesPrefix={initialValuesPrefix}
        setInitialValuePrefix={setInitialValuePrefix}
        setInitialValues={setInitialValues}
        initialValues={initialValues}
        organization={organization}
      />

      <AddCourseDetails
        openDialog={openFormDetails}
        setOpenFormDetails={setOpenFormDetails}
        initialValuesDetails={initialValuesDetails}
        setInitialValueDetails={setInitialValueDetails}
        organization={organization}
        coursePrefix={coursePrefix}
        mCoursePrefixName={mCoursePrefixName}
      />

      <LookupUsers
        openDialog={openLookupForm}
        setOpenLookupForm={setOpenLookupForm}
        setOpenAddInstructorForm={setOpenAddInstructorForm}
        openAddInstructorForm={openAddInstructorForm}
      />

      <Dialog open={openAddInstructorForm.isOpen} style={{ zIndex: +1 }}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>Add User</div>

            <IconButton>
              <AiOutlineClose
                onClick={handleCloseAddUserForm}
                style={{ color: 'white' }}
              />
            </IconButton>
          </div>
        </DialogTitle>

        <Formik
          initialValues={(() => {
            if (typeof openAddInstructorForm?.data == 'string') {
              return {
                first_name: '',
                last_name: '',
                middle_name: '',
                email: openAddInstructorForm?.addnew,
                organization: '',
              };
            } else {
              return {
                first_name: '',
                last_name: '',
                middle_name: '',
                email: '',
                organization: '',
              };
            }
          })()}
          validationSchema={userValidation}
          onSubmit={(values) => {
            values.organization = state?.organization_name
              ? state?.organization_name
              : organization;
            dispatch(
              inviteUser(
                values,
                openAddInstructorForm,
                setOpenAddInstructorForm,
                instructorsData
              )
            );
          }}
        >
          {({ values, errors, touched, isValid }) => (
            <DialogContent
              sx={{ width: '600px', height: 'fitContent', overflowX: 'hidden' }}
            >
              <Form>
                <Field
                  as={TextField}
                  label="First Name"
                  variant="standard"
                  required
                  name="first_name"
                  value={values.first_name}
                  helperText={
                    errors.first_name && touched.first_name
                      ? errors.first_name
                      : ''
                  }
                  fullWidth
                  error={errors.first_name && touched.first_name}
                  sx={{ marginBottom: '15px' }}
                />
                <Field
                  variant="standard"
                  as={TextField}
                  label="Middle Name"
                  name="middle_name"
                  value={values.middle_name}
                  helperText={
                    errors.middle_name && touched.middle_name
                      ? errors.middle_name
                      : ''
                  }
                  fullWidth
                  error={errors.middle_name && touched.middle_name}
                  sx={{ marginBottom: '15px' }}
                />
                <Field
                  variant="standard"
                  as={TextField}
                  label="Last Name"
                  required
                  name="last_name"
                  value={values.last_name}
                  helperText={
                    errors.last_name && touched.last_name
                      ? errors.last_name
                      : ''
                  }
                  fullWidth
                  error={errors.last_name && touched.last_name}
                  sx={{ marginBottom: '15px' }}
                />
                <Field
                  variant="standard"
                  as={TextField}
                  label="Organization Email"
                  required
                  name="email"
                  value={values.email}
                  helperText={errors.email && touched.email ? errors.email : ''}
                  fullWidth
                  error={errors.email && touched.email}
                  sx={{ marginBottom: '15px' }}
                />
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="contained"
                    // fullWidth
                    onClick={handleCloseAddUserForm}
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
              </Form>
            </DialogContent>
          )}
        </Formik>
      </Dialog>
    </main>
  );
}

export default AddEditCourse;

interface SearchItem {
  id: string;
  name: string;
}

type Instructors = {
  id: string;
  name: string;
  organization_name: string;
  assessment_coordinators: AssessmentCoordinators[];
};

type AssessmentCoordinators = {
  id: string;
  name: string;
  organization_name: string;
};

const LookupUsers = ({
  openDialog,
  setOpenLookupForm,
  setOpenAddInstructorForm,
  openAddInstructorForm,
}: any) => {
  const handleClickClose = () => {
    setOpenLookupForm(false);
    setSearchResults([]);
    setSelectedItems([]);
  };

  const dispatch = useDispatch();
  const instructorsData: any[] = useSelector(
    (state: any) => state.users.instructorsData
  );

  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SearchItem[]>([]);

  const handleSearch = async (searchTerm: string | any) => {
    // Send search request to server and set search results
    searchFromOtherOrg(
      { email: searchTerm?.name },
      setSearchResults,
      setSelectedItems,
      searchResults,
      setOpenAddInstructorForm,
      setOpenLookupForm,
      openAddInstructorForm
    );
  };

  const handleRemove = (item: SearchItem) => {
    setSelectedItems(
      selectedItems.filter((selectedItem) => selectedItem !== item)
    );
  };

  const handleAddInstructors = () => {
    const instructors = instructorsData;

    const updatedInstructors = [...instructors, ...selectedItems].map((x) =>
      JSON.stringify(x)
    );
    const newSet = [...new Set(updatedInstructors)].map((x) => JSON.parse(x));

    dispatch(handleGetInstructors(newSet));
    openAddInstructorForm.callback('instructors', [
      ...openAddInstructorForm.data.filter(
        (d: any) => d.name !== 'ADD USER BY EMAIL'
      ),
      ...selectedItems,
    ]);
    // openAddInstructorForm.callback('instructor', [...openAddInstructorForm.data, ...newSet])
    handleClickClose();
  };

  const validation = Yup.object({
    search: Yup.object({
      id: Yup.string(),
      name: Yup.string().email('invalid email').required('Required Field'),
    }),
  });

  return (
    <Dialog open={openDialog}>
      <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
        <div className="flex justify-between items-center">
          <div>Add Users</div>
          <IconButton>
            <AiOutlineClose
              onClick={handleClickClose}
              style={{ color: 'white' }}
            />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent
        sx={{
          width: '600px',
          marginTop: '20px',
          height: 'fitContent',
          overflowX: 'hidden',
        }}
      >
        <Formik
          initialValues={{ search: { id: '', name: '' } }}
          validationSchema={validation}
          onSubmit={(values) => {
            handleSearch(values?.search);
          }}
        >
          {({ values, setFieldValue, errors, touched, handleBlur }) => (
            <Form>
              <Field
                name="search"
                as={Autocomplete}
                freeSolo
                value={values?.search}
                options={searchResults?.length > 0 ? searchResults : []}
                // fullWidth
                isOptionEqualToValue={(option: any, value: any) =>
                  option?.id === value
                }
                disableClearable
                // renderOption={(option: SearchItem) => option.name}
                getOptionLabel={(option: SearchItem) => option?.name}
                // onChange={(_: any, name: any) => {
                //
                //   setFieldValue("search", name);
                // }}
                renderInput={(params: AutocompleteRenderInputParams) => (
                  <TextField
                    {...params}
                    name="search"
                    placeholder="Enter Email Id"
                    variant="outlined"
                    size="small"
                    sx={{ paddingRight: '6px' }}
                    onChange={(e) => {
                      setFieldValue('search', {
                        id: '',
                        name: e.target.value,
                      });
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fab
                          color="primary"
                          type="submit"
                          size="small"
                          aria-label="search"
                        >
                          <SearchIcon />
                        </Fab>
                      ),
                    }}
                    error={
                      errors?.search?.name && touched?.search ? true : false
                    }
                    helperText={
                      errors?.search?.name && touched?.search
                        ? errors?.search?.name
                        : ''
                    }
                    // value={values.search}
                  />
                )}
              />
              {/* values
              <pre>{JSON.stringify(values)}</pre>
              errors
              <pre>{JSON.stringify(errors)}</pre>
              touched
              <pre>{JSON.stringify(touched)}</pre> */}
            </Form>
          )}
        </Formik>
        <List>
          {selectedItems.map((item: SearchItem) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleRemove(item)}>
                  <RemoveIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
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
          onClick={handleAddInstructors}
          // fullWidth
          disabled={selectedItems?.length <= 0}
          style={{ textTransform: 'capitalize' }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
