import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Button, CircularProgress, TextField, Tooltip } from '@mui/material';
import AGGrid from '../../utils/MasterGrid/MasterGrid';
import { ColDef, ColGroupDef, GridOptions } from 'ag-grid-community';
import StudentMail from '../AddStudent/StudentMail';
import MasterGrid from '../../utils/MasterGrid/MasterGrid';
import { ICellRendererParams } from 'ag-grid-community';
import { createServerSideDatasource } from '../../utils/gridMethod/createServerSideDatasource';
import { GridReadyEvent } from 'ag-grid-community';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { AnyIfEmpty, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import {
  updateTime,
  getCourseAdministraionByCourse,
  getReportsData,
  getResultAnalysis,
  getResultAnalysisAdm,
  getStudentAndAdministrationByAssessmentId,
  getStudentsByCourse,
} from '../../reduxStore/reducer/administrationReducer';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import IconButton from '@mui/material/IconButton/IconButton';
import { AiOutlineMail } from 'react-icons/ai';
// import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CheckBox } from '@mui/icons-material';
import { Input } from 'postcss';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FileImport from '../courseDetails/FileImport';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import moment from 'moment';
import debounce from 'lodash/debounce';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Form, Formik, FormikProps } from 'formik';

import ContactMailIcon from '@mui/icons-material/ContactMail';
import { getUserById } from '../../reduxStore/reducer/registerReducer';
import * as readxlsx from 'xlsx';
import Alert from '../../utils/Alert/Alert';

let cancelGetStudentsByCourse: any;
let studentData: any = [];

const defaultAdministrationDefinition: any = [
  {
    headerName: 'First Name',
    field: 'first_name',
    minWidth: 180,
  },
  { headerName: 'Last Name', field: 'last_name', minWidth: 220 },
  { headerName: 'Email Id', field: 'email_id', minWidth: 220 },
];
let administrationBox: any = [];

const Administration = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [refresh, setRefresh] = useState<any>(null);
  const navigate = useNavigate();

  const { courseassessmentid: courseAssessmentId, courseid: id } = useParams();
  //
  const gridRef = useRef<any>(null);
  const [rosterCount, setRosterCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [cronValue, setCronValue] = useState<any>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [renderAdministrationBoxes, setRenderAdministrationBoxes] =
    useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const addAssessmentRow = (values: any) => {
    const transaction: any = {
      add: [values],
      addIndex: 0,
    };
    gridRef.current.api?.applyTransaction(transaction);
  };

  useEffect(() => {
    dispatch(
      getUserById({
        id: `${JSON.parse(localStorage.getItem('token') || '{}')}`,
      })
    );
  }, [dispatch]);

  const getUserDataAndType = useSelector(
    (state: any) => state.register.getUserById
  );

  const open = Boolean(anchorEl);
  // const id = open ? "simple-popper" : undefined;

  const courseData: any = useSelector(
    (state: RootState) => state.administration.getCourseAdministration
  );

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    // textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: 'agTextColumnFilter',
    pagination: true,
    flex: 1,
    minWidth: 150,
  };

  const singleMemberMailSend = (
    id: any,
    courseAdministrationId: any,
    email: any,
    first_name?: any,
    last_name?: any,
    isManual?: boolean
  ) => {
    if (id && email && courseAdministrationId) {
      sendMail(
        [
          {
            id: id,
            courseAssessmentId: courseAssessmentId,
            courseAdministrationId: courseAdministrationId,
            email: email,
            first_name,
            last_name,
          },
        ],
        isManual
      );
    }
  };

  const sendMail = (
    data: any,
    isManual?: boolean,
    setLastReminder?: any,
    index?: any
  ) => {
    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_BASE_URL}/api/course_details/mail/${
        isManual || false
      }`,
      headers: {
        authorization: localStorage.getItem('token')
          ? `Bearer ${JSON.parse(localStorage.getItem('token') || '{}')}`
          : '',
        'Content-Type': 'application/json',
      },
      data: { mails: data, cronValue: cronValue },
    };

    axios(config)
      .then(function (response) {
        setLoading(true);
        setRefresh(true);
        if (isManual) {
          const mailObj = response?.data?.data?.length
            ? response?.data?.data[0]
            : null;
          if (!mailObj) return;
          // %0D%0A%0D%0AAssessment Name: ${mailObj.assessment_name}
          // %0D%0AStart Time: ${mailObj.start_date_time}
          // %0D%0AEnd Time: ${mailObj.start_date_time}
          //
          // const body = `%0D%0ADear ${data[0].first_name} ${data[0].last_name},%0D%0A%0D%0AGreetings and a friendly reminder that you have an assessment %0D%0A%0D%0AAssessment Name: ${mailObj.assessment_name}%0D%0AStart Time: ${mailObj.start_date_time}%0D%0AEnd Time: ${mailObj.start_date_time}%0D%0A%0D%0ATo view this assessment, kindly click on the following link or copy and paste it into your%0D%0Abrowser: ${mailObj.url}   %0D%0A%0D%0AThank you %0D%0A%0D%0ABest Regards %0D%0A${getUserDataAndType?.data?.first_name} ${getUserDataAndType?.data?.last_name},`;
          const body = `%0D%0ADear ${data[0].first_name} ${data[0].last_name},
          %0D%0A%0D%0A${getUserDataAndType?.data?.first_name} ${getUserDataAndType?.data?.last_name} has requested that you participate in a short survey online. Your responses will be shared with your instructor to improve the instruction of this course. We ask that you complete the survey to the best of your ability and on your own without any assistance (e.g. from friends, books, or the internet). 
      
           %0D%0A%0D%0AThe link provided below will take you to your personal copy of the survey. The survey will take approximately (5-30 min) to complete. Your participation is appreciated. 
           %0D%0A%0D%0Abrowser: ${mailObj?.mailObj?.url}  
            %0D%0A%0D%0AAny questions should be addressed to ${getUserDataAndType?.data?.first_name} ${getUserDataAndType?.data?.last_name} at ${getUserDataAndType?.data?.email}.  
            %0D%0A%0D%0AThe deadline for completing the assessment is ${mailObj?.mailObj?.end_date_time}
            %0D%0A%0D%0AThe LASSO platform ,`;

          // const body =`Dear ${data[0].first_name} ${data[0].last_name},

          // I hope this message finds you well. I am writing to provide you with the details for your upcoming assessment, ${mailObj.assessment_name}.

          // Start Time: ${mailObj.start_date_time}
          // End Time: ${mailObj.end_date_time}

          // To access the assessment, please click on the following link: ${mailObj.url}. Kindly copy and paste the link into your browser to begin the assessment.

          // Thank you for your participation. If you have any questions or concerns, please do not hesitate to contact us.

          // Best regards,`
          openMailApp({
            to: data[0]?.email,
            subject: 'Take Assessment',
            body,
          });
        } else {
          Alert.success({ title: 'Saved and email reminder Sent', text: '' });

          if (setLastReminder && index != null && index != undefined) {
            setLastReminder((e: any) => {
              const newDateValues = [...e];
              newDateValues[index] = response?.data?.last_reminder;
              return newDateValues;
            });
          }
        }
      })

      .catch(function (error) {});
  };

  // const [studentData, setStudentData] = useState([]);
  const openMailApp = ({ to, subject, body }: any) => {
    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const callback = (result: any) => {
    const administrationData =
      result.data &&
      result.data?.administration &&
      result.data?.administration?.length
        ? result.data?.administration
        : [];

    studentData =
      result.data && result.data?.student && result.data?.student?.length
        ? result.data.student
        : [];

    administrationBox = administrationData;

    // setTimeout(() => {
    // if (!gridRef.current) return;
    gridRef.current.api.setColumnDefs([
      { field: 'id', hide: 'true' },
      { field: 'first_name' },
      { field: 'last_name' },
      { field: 'email_id' },
      ...studentData[0].test_statuses.map((data: any, index: number) => ({
        // field: `${data.csadm_id}`,
        headerName: `Administration ${++index}`,
        minWidth: 160,
        cellRenderer: (params: any) => {
          const student = params.data.test_statuses[index - 1];
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={student?.test_status}
                readOnly
                className="w-3.5 h-4 mr-2"
              />
              <Tooltip title="System mail">
                <IconButton
                  disabled={(() => {
                    let condition: boolean = false;

                    if (
                      data.start_date_time == null ||
                      data.end_date_time == null
                    ) {
                      condition = true;
                    }

                    if (
                      data.start_date_time !== null ||
                      data.end_date_time !== null
                    ) {
                      if (
                        !moment().isBetween(
                          data?.start_date_time,
                          data?.end_date_time
                        )
                      ) {
                        condition = true;
                      }
                    }

                    if (student?.test_status == true) {
                      condition = true;
                    }
                    return condition;
                  })()}
                  onClick={() => {
                    singleMemberMailSend(
                      params.data.course_student_id, //cs_id
                      params.data.test_statuses[index - 1].administration_no, //cadm_no
                      params.data.email_id,
                      params.data.first_name,
                      params.data.last_name,
                      false
                    );
                  }}
                >
                  <MailOutlineIcon className="text-edit-icon" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Default App">
                <IconButton
                  disabled={(() => {
                    let condition: boolean = false;

                    if (
                      data.start_date_time == null ||
                      data.end_date_time == null
                    ) {
                      condition = true;
                    }

                    if (
                      data.start_date_time !== null ||
                      data.end_date_time !== null
                    ) {
                      if (
                        !moment().isBetween(
                          data?.start_date_time,
                          data?.end_date_time
                        )
                      ) {
                        condition = true;
                      }
                    }

                    if (student?.test_status == true) {
                      condition = true;
                    }
                    return condition;
                  })()}
                  onClick={() => {
                    singleMemberMailSend(
                      params.data.course_student_id, //cs_id
                      params.data.test_statuses[index - 1].administration_no, //cadm_no
                      params.data.email_id,
                      params.data.first_name,
                      params.data.last_name,
                      true
                    );
                  }}
                >
                  <ContactMailIcon className="text-edit-icon" />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      })),
    ]);

    gridRef.current.api.setRowData(studentData);
    // }, 3000);

    setRosterCount(studentData?.length);
    setRenderAdministrationBoxes(administrationBox.length ? true : false);
  };
  React.useEffect(() => {
    //if (!gridRef.current) return;
    // setLoading(true);
    getStudentAndAdministrationByAssessmentId(
      courseAssessmentId,
      // { cancelToken: cancelGetStudentsByCourse.token },
      gridRef,
      callback,
      setLoading
    );
  }, [gridRef.current, refresh]);

  const onGridReady = (params: any) => {
    gridRef.current = params;
    gridRef.current.api.showLoadingOverlay();
  };

  const [studentResultsData, setStudentResultsData] = useState();
  const [courseInfoData, setCourseInfoData] = useState();

  function handleGetResultAnalysis(courseAssessmentId: any) {
    dispatch(getResultAnalysis(courseAssessmentId, downloadReportAnalysis));
  }

  function downloadReportAnalysis(
    courseInfoData: any,
    studentResultsData: any
  ) {
    const workbook = readxlsx.utils.book_new();

    // create first sheet with course info data
    //@ts-ignore
    const courseInfoSheet = readxlsx.utils.json_to_sheet(courseInfoData);
    readxlsx.utils.book_append_sheet(workbook, courseInfoSheet, 'Course Info');

    // create second sheet with student results data
    //@ts-ignore
    const studentResultsSheet =
      readxlsx.utils.json_to_sheet(studentResultsData);
    readxlsx.utils.book_append_sheet(
      workbook,
      studentResultsSheet,
      'Student Results'
    );

    // write workbook data to file and download
    const excelBuffer = readxlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    //@ts-ignore
    const fileName = `LASSO_Results_${courseInfoData[1]['']}.xlsx`;
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.style.display = 'none';
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(downloadLink);
  }

  return (
    <main>
      <h1 className="header">Administration</h1>
      <Box
        sx={{ flexGrow: 1 }}
        className="p-2"
        style={loading ? { display: 'none' } : {}}
      >
        <Grid container rowGap={{ xs: 3 }}>
          <Grid item xs={12}>
            <Item>
              <h2 className="bg-gray-200 p-1 font-bold text-lg">
                Assessment Roster
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div className="pl-1 font-semibold">
                  <label className="pr-2">Roster Count :</label> {rosterCount}
                </div>
                <div className="my-2">
                  <FileImport
                    props={{
                      data: { id },
                      setRefresh: setRefresh,
                      name: 'Manage Students',
                    }}
                  />
                </div>
              </div>

              <div
                style={
                  loading
                    ? { display: 'none' }
                    : { width: '100%', height: '600px' }
                }
                className="ag-theme-alpine  p-1 mb-14"
              >
                <AgGridReact
                  // ref={gridRef}
                  columnDefs={defaultAdministrationDefinition}
                  defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                  pagination={true}
                  suppressServerSideInfiniteScroll={false}
                  paginationPageSize={25}
                  animateRows={true}
                  overlayLoadingTemplate={
                    '<span class="ag-overlay-loading-center">Please wait while loading</span>'
                  }
                />
              </div>
            </Item>
          </Grid>

          <Grid
            container
            rowGap={{ xs: 3 }}
            columnGap={{ md: 2.5 }}
            className="border border-slate-400 rounded-md p-1.5"
          >
            {/* {renderAdministrationBoxes()} */}
            {renderAdministrationBoxes && (
              <AdministrationBoxes
                rosterCount={rosterCount}
                sendMail={sendMail}
                courseAssessmentId={courseAssessmentId}
              />
            )}
          </Grid>

          <Grid
            component={Paper}
            elevation={2}
            item
            xs={12}
            lg
            className="rounded-md"
          >
            <Grid
              component="h2"
              className="bg-gray-200 font-bold text-lg p-1 mb-2 rounded-sm"
            >
              Output
            </Grid>

            <Grid container gap={2} className="my-2 pl-2">
              <Button
                variant="outlined"
                onClick={() => handleGetResultAnalysis(courseAssessmentId)}
                disabled={(() => {
                  const arr = administrationBox?.map(
                    (e: any) => e?.end_date_time
                  );
                  if (arr?.includes(null) || arr == undefined || !arr?.length)
                    return true;
                  const bool = arr?.every((e: any) =>
                    moment().utc().isAfter(moment(e))
                  );
                  return !bool;
                })()}
              >
                Get Result & Analysis
              </Button>
              <Button
                variant="outlined"
                onClick={() => getReportsData(courseAssessmentId)}
                disabled={(() => {
                  const arr = administrationBox?.map(
                    (e: any) => e?.end_date_time
                  );
                  if (arr?.includes(null) || arr == undefined || !arr?.length)
                    return true;
                  const bool = arr?.every((e: any) =>
                    moment().utc().isAfter(moment(e))
                  );
                  return !bool;
                })()}
              >
                Get Report
              </Button>
              <Button
                variant="outlined"
                disabled={(() => {
                  const arr = administrationBox?.map(
                    (e: any) => e?.end_date_time
                  );
                  if (arr?.includes(null) || arr == undefined || !arr?.length)
                    return true;
                  const bool = arr?.every((e: any) =>
                    moment().utc().isAfter(moment(e))
                  );
                  return !bool;
                })()}
              >
                Additional Reports
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <div
        className="flex justify-center items-center h-[90vh]"
        style={!loading ? { display: 'none' } : {}}
      >
        <CircularProgress />
      </div>
    </main>
  );
};

export default Administration;

const AdministrationBoxes = ({
  rosterCount,
  sendMail,
  courseAssessmentId,
}: any) => {
  const dispatch = useDispatch<AppDispatch>();

  //pickerValues is [], if administrationBox is [] or undefined or null
  const [pickerValues, setPickerValues] = React.useState(
    administrationBox.map((e: any) => {
      if (e.start_date_time) {
        const utcDatetime = new Date(e.start_date_time); // create a Date object in UTC

        const localTimezoneOffset = new Date().getTimezoneOffset() * 60000; // get local timezone offset in milliseconds
        const localDatetime = new Date(
          utcDatetime.getTime() - localTimezoneOffset
        ); // create a Date object in local timezone

        const localDatetimeString = localDatetime.toISOString().slice(0, 16); // convert to local datetime string compatible with datetime-local input element

        return localDatetimeString;
      } else return null;
    })
  );
  const [lastReminder, setLastReminder] = React.useState(
    administrationBox.map((e: any) => {
      if (e?.last_reminder_sent) {
        const utcDatetime = new Date(e?.last_reminder_sent); // create a Date object in UTC

        const localTimezoneOffset = new Date().getTimezoneOffset() * 60000; // get local timezone offset in milliseconds
        const localDatetime = new Date(
          utcDatetime.getTime() - localTimezoneOffset
        ); // create a Date object in local timezone

        const localDatetimeString = localDatetime.toISOString().slice(0, 16); // convert to local datetime string compatible with datetime-local input element

        return localDatetimeString;
      } else return null;
    })
  );

  //pickerValuesEnd is [], if administrationBox is [] or undefined or null
  const [pickerValuesEnd, setPickerValuesEnd] = React.useState(
    administrationBox.map((e: any) => {
      if (e.end_date_time) {
        const utcDatetime = new Date(e.end_date_time); // create a Date object in UTC

        const localTimezoneOffset = new Date().getTimezoneOffset() * 60000; // get local timezone offset in milliseconds
        const localDatetime = new Date(
          utcDatetime.getTime() - localTimezoneOffset
        ); // create a Date object in local timezone

        const localDatetimeString = localDatetime.toISOString().slice(0, 16); // convert to local datetime string compatible with datetime-local input element

        return localDatetimeString;
      } else {
        return null;
      }
    })
  );

  const [isDeadlineChanged, setIsDeadlineChanged] = React.useState(
    Array(administrationBox.length).fill(false)
  );
  const [isStartDateChanged, setIsStartDateChanged] = React.useState(
    Array(administrationBox.length).fill(false)
  );

  //this return undefined if undefined or null
  return administrationBox?.map((data: any, index: number) => {
    const isDefaultExpanded = index <= 1;

    const {
      id,
      responses, //may be null or ''
      avg_score,
    } = data;

    const isDownloadBtnEnabled = data.start_date_time && data.end_date_time;

    const responsesText = `${responses ? responses : 0} / ${
      rosterCount ? rosterCount : 0
    }`;

    const saveNewDeadline = (
      id: any,
      index: number,
      administration_no: any
    ) => {
      if (rosterCount) {
        //true, if deadline not having date
        if (!pickerValuesEnd[index] || !pickerValues[index]) {
          Alert.info({
            title: 'Set both start and end date before starting an assessment',
            text: '',
          });
          throw new Error('execution stopped');
        } else {
          const timestamp1 = Date.parse(pickerValues[index]); // convert to UTC timestamp
          const date1 = new Date(timestamp1); // create a Date object in UTC time
          const utcString1 = date1.toISOString(); // convert to UTC string

          const timestamp2 = Date.parse(pickerValuesEnd[index]); // convert to UTC timestamp
          const date2 = new Date(timestamp2); // create a Date object in UTC time
          const utcString2 = date2.toISOString(); // convert to UTC string

          if (moment.utc(utcString1).isSameOrAfter(moment.utc(utcString2))) {
            Alert.info({
              title: 'Start date & time must be less than deadline',
              text: '',
            });
            throw new Error('execution stopped');
          }

          // postStartDateTime(utcString1, utcString2, id, administration_no);

          let arrData: any = [];
          const mailData = studentData.map((d: any) => {
            const found = d.test_statuses[data.administration_no - 1];
            if (found?.test_status === false) {
              arrData.push({
                id: d.course_student_id,
                courseAssessmentId: courseAssessmentId,
                courseAdministrationId: data.administration_no,
                email: d.email_id,
                first_name: d.first_name,
                last_name: d.last_name,
              });
              return {
                id: d.id,
                courseAssessmentId: courseAssessmentId,
                courseAdministrationId: data.id,
                email: d.email_id,
                first_name: d.first_name,
                last_name: d.last_name,
              };
            }
          });

          // if (moment.utc(utcString1).isBefore(moment.utc()))
          updateTime(
            {
              start_date_time: utcString1,
              end_date_time: utcString2,
              id: id,
              administration_no: administration_no,
            },
            sendMail,
            arrData,
            false,
            setLastReminder,
            index
          );
        }
      } else {
        Alert.info({
          title: 'Add students before starting an assessment',
          text: '',
        });
        throw new Error('execution stopped');
      }
    };

    function handleDownloadData(
      courseAssessmentId: string,
      administration_id: string
    ) {
      dispatch(
        getResultAnalysisAdm(
          courseAssessmentId,
          administration_id,
          downloadReportAnalysis
        )
      );
    }

    function downloadReportAnalysis(
      courseInfoData: any,
      studentResultsData: any
    ) {
      const workbook = readxlsx.utils.book_new();

      // create first sheet with course info data
      //@ts-ignore
      const courseInfoSheet = readxlsx.utils.json_to_sheet(courseInfoData);
      readxlsx.utils.book_append_sheet(
        workbook,
        courseInfoSheet,
        'Course Info'
      );

      // create second sheet with student results data
      //@ts-ignore
      const studentResultsSheet =
        readxlsx.utils.json_to_sheet(studentResultsData);
      readxlsx.utils.book_append_sheet(
        workbook,
        studentResultsSheet,
        'Student Results'
      );

      // write workbook data to file and download
      const excelBuffer = readxlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      //@ts-ignore
      const fileName = `LASSO_Results_${courseInfoData[1]['']}.xlsx`;
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);
      downloadLink.style.display = 'none';
      const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = fileName;
      downloadLink.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(downloadLink);
    }
    return (
      <Grid item xs={12} md={5.8} key={index}>
        <Accordion defaultExpanded={isDefaultExpanded}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ backgroundColor: '#e6e6e6' }}
          >
            <Typography component="h2">Administration {index + 1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container item rowGap={{ xs: 0.8, sm: 2 }} className="pl-2">
              <Grid item component="label" xs={4}>
                Responses
              </Grid>
              <Grid item component="span" xs={2}>
                :
              </Grid>
              <Grid item component="label" xs={6}>
                {responsesText}
              </Grid>

              <Grid item component="label" xs={4}>
                Average Score
              </Grid>
              <Grid item component="span" xs={2}>
                :
              </Grid>
              <Grid item component="label" xs={6}>
                {avg_score ? avg_score : 0}
              </Grid>

              <Grid item component="label" xs={4}>
                Started
              </Grid>
              <Grid item component="span" xs={2}>
                :
              </Grid>
              <Grid item component="label" xs={6}>
                {/* {pickerValues && pickerValues.length && pickerValues[index] ? ( */}
                <MaterialUIPickers
                  id={data.id} //used to update time on particular administration
                  index={index} //used to update particular index in pickerValues array
                  values={pickerValues} //array to store datetime values
                  setValues={setPickerValues} //hook to modify the array
                  minDateTime={moment().format('YYYY-MM-DDTHH:mm')}
                  admBtn={isStartDateChanged}
                  setAdmBtn={setIsStartDateChanged}
                  //postDateTime={postStartDateTime} //function to post datetime
                />
              </Grid>

              <Grid item component="label" xs={4}>
                Last reminder
              </Grid>
              <Grid item component="span" xs={2}>
                :
              </Grid>
              <Grid item component="label" xs={6}>
                {lastReminder[index]
                  ? moment(moment(lastReminder[index]).utc())
                      .local()
                      .format('MM-DD-YYYY hh:mm a')
                  : ''}
                {/* {data?.last_reminder_sent
                  ? moment(data?.last_reminder_sent)
                      .local()
                      .format('MM/DD/YYYY hh:mm A')
                  : ''} */}
              </Grid>

              <Grid item component="label" xs={4}>
                Deadline
              </Grid>
              <Grid item component="span" xs={2}>
                :
              </Grid>
              <Grid item component="label" xs={6}>
                <MaterialUIPickers
                  id={data.id} //used to update time on particular administration
                  index={index}
                  values={pickerValuesEnd}
                  setValues={setPickerValuesEnd}
                  minDateTime={
                    pickerValues[index]
                      ? moment(pickerValues[index])
                          .add(1, 'days')
                          .format('YYYY-MM-DDTHH:mm')
                      : moment().format('YYYY-MM-DDTHH:mm')
                  }
                  admBtn={isDeadlineChanged}
                  setAdmBtn={setIsDeadlineChanged}
                  // postDateTime={postEndDateTime}
                />
              </Grid>

              <Grid container columnGap={2} rowGap={1}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    // if (
                    //   isStartDateChanged[index] && isDeadlineChanged[index]
                    // )
                    saveNewDeadline(
                      courseAssessmentId,
                      index,
                      data.administration_no
                    );

                    const newStartDateValues = [...isStartDateChanged];
                    newStartDateValues[index] = false;
                    setIsStartDateChanged(newStartDateValues);

                    const newDeadlineDateValues = [...isDeadlineChanged];
                    newDeadlineDateValues[index] = false;
                    setIsDeadlineChanged(newDeadlineDateValues);
                  }}
                  disabled={
                    !(isStartDateChanged[index] || isDeadlineChanged[index])
                  }
                >
                  {isStartDateChanged[index] && isDeadlineChanged[index]
                    ? 'Save New Dates'
                    : 'Save Dates'}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    let arrData: any = [];
                    const mailData = studentData.map((d: any) => {
                      const found = d.test_statuses[data.administration_no - 1];
                      if (found?.test_status === false) {
                        arrData.push({
                          id: d.course_student_id,
                          courseAssessmentId: courseAssessmentId,
                          courseAdministrationId: data.administration_no,
                          email: d.email_id,
                          first_name: d.first_name,
                          last_name: d.last_name,
                        });
                        return {
                          id: d.course_student_id,
                          courseAdministrationId: data.administration_no,
                          email: d.email_id,
                          first_name: d.first_name,
                          last_name: d.last_name,
                        };
                      }
                    });

                    if (
                      pickerValues?.[index]
                        ? moment
                            .utc()
                            .isSameOrAfter(
                              new Date(
                                Date.parse(pickerValues?.[index])
                              ).toISOString()
                            ) &&
                          moment
                            .utc()
                            .isSameOrBefore(
                              new Date(
                                Date.parse(pickerValuesEnd[index])
                              ).toISOString()
                            )
                        : false
                    ) {
                      if (arrData?.length != 0) {
                        sendMail(arrData, false, setLastReminder, index);
                      } else {
                        Alert.info({
                          text: '',
                          title: 'All responses are captured',
                        });
                      }
                    } else if (
                      pickerValues?.[index]
                        ? moment()
                            .utc()
                            .isBefore(
                              new Date(
                                Date.parse(pickerValues[index])
                              ).toISOString()
                            )
                        : false
                    ) {
                      Alert.info({
                        title: 'Start date & time is not reached yet',
                        text: '',
                      });
                    } else if (
                      pickerValuesEnd?.[index]
                        ? moment()
                            .utc()
                            .isAfter(
                              new Date(
                                Date.parse(pickerValuesEnd[index])
                              ).toISOString()
                            )
                        : false
                    ) {
                      Alert.info({
                        title: 'Deadline is passed',
                        text: '',
                      });
                    } else if (!pickerValuesEnd?.[index]) {
                      Alert.info({
                        title: 'Set deadline before starting an assessment',
                        text: '',
                      });
                    }
                  }}
                >
                  Email Reminder
                </Button>
                <Button
                  variant="outlined"
                  disabled={!isDownloadBtnEnabled}
                  onClick={() => {
                    handleDownloadData(
                      courseAssessmentId,
                      data.administration_no
                    );
                  }}
                >
                  Download Data
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    );
  });
};

function MaterialUIPickers({
  index,
  values,
  setValues,
  minDateTime,
  admBtn,
  setAdmBtn,
}: any) {
  const handleChange = (e: any) => {
    const datetimeLocal = e.target.value;
    const newValues = [...values];
    newValues[index] = datetimeLocal;
    setValues(newValues);

    const timestamp = Date.parse(e.target.value); // convert to UTC timestamp
    const date = new Date(timestamp); // create a Date object in UTC time
    const utcString = date.toISOString(); // convert to UTC string

    // postDateTime(utcString, id);
    if (admBtn && admBtn.length && setAdmBtn) {
      const newAdmBtnValues = [...admBtn];
      newAdmBtnValues[index] = true;
      setAdmBtn(newAdmBtnValues);
    }
  };
  return (
    <TextField
      type="datetime-local"
      value={values[index]}
      size="small"
      onChange={handleChange}
      fullWidth
      inputProps={{
        min: minDateTime ? minDateTime : null,
      }}
    />
  );
}
