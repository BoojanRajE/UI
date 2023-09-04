import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ICellRendererParams } from 'ag-grid-community';
import Button from '@mui/material/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  TextField,
  Tooltip,
} from '@mui/material';
// import { ColDef, ColGroupDef, GridOptions } from "ag-grid-community";
import AGGrid from '../../utils/MasterGrid/MasterGrid';
import Swal from 'sweetalert2';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import { FaUserGraduate } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import PersonAddAltSharpIcon from '@mui/icons-material/PersonAddAltSharp';
import axios from 'axios';
import { MdAllInbox, MdDelete, MdEdit } from 'react-icons/md';
import Course from '../course/Course';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Alert from '../../utils/Alert/Alert';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { studentFileupload } from '../../reduxStore/reducer/courseReducer';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxStore/Store';

export interface FileImport {
  course_id: any;
  first_name: any;
  middle_name: any;
  last_name: any;
  email_id: any;
}
const FileImport = ({ props }: any) => {
  const selectedData: any = useSelector(
    (state: RootState) => state.assessment.assessmentStatus
  );

  useEffect(() => {
    if (selectedData?.test_status === true) {
      Swal.fire({
        title: 'Assessment already taken',
        text: '',
        icon: 'info',
      }).then(() => {
        navigate('/login');
      });
    }
  }, [selectedData]);

  const navigate = useNavigate();
  const location = useLocation();

  const gridRef = useRef<AgGridReact>(null);

  const course_id = props?.data?.id;

  const setState = props?.data?.setStudentState;

  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const handleClickClose = () => {
    setOpenStudentDialog(false);
    setInitialValue({
      course_id: course_id,
      first_name: '',
      middle_name: '',
      last_name: '',
      email_id: '',
    });
  };

  const [initialValues, setInitialValue] = useState<FileImport>({
    course_id: course_id,
    first_name: '',
    middle_name: '',
    last_name: '',
    email_id: '',
  });

  const validation = Yup.object({
    first_name: Yup.string().required('Required Field'),
    last_name: Yup.string().required('Required Field'),
    email_id: Yup.string()
      .email()
      .required('entered text is not a valid email'),
  });

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const [courseCount, setCourseCount] = useState(0);

  const [gridApi, setGridApi] = useState<any>(null);

  const onGridReady = (e: any) => {
    setGridApi(e.api);
    getData();
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [file, setFile] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [fileData, setFileData] = useState<any>();
  const [cronValue, setCronValue] = useState<any>();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleUploadClick = (event: any) => {
    // 👇 We redirect the click event onto the hidden input element

    const originalFiles: any = file;
    const formData = new FormData();
    formData.append('file', originalFiles);
    formData.append('courseid', props?.data?.id);

    const callback = () => {
      getData();

      props?.setRefresh && props.setRefresh(true);
      props?.setRefresh && props.setRefresh(false);
      props?.setStudentState(false);
    };

    studentFileupload(formData, callback);
  };

  const handleAddStudent = () => {};

  const handleDelete = async (row: any) => {
    Alert.confirm(async () => {
      let data = row;
      const url = `${process.env.REACT_APP_BASE_URL}/api/course_details/student/${data.id}/${course_id}`;

      const config = {
        method: 'post',
        url: url,
        headers: {
          authorization: localStorage.getItem('token')
            ? `Bearer ${JSON.parse(localStorage.getItem('token') || '{}')}`
            : '',
          'Content-Type': 'application/json',
        },
      };
      const response = await axios(config)
        .then(async (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Student entry deleted',
            showConfirmButton: true,
            confirmButtonText: 'Ok',

            customClass: {
              container: 'swal-container',
            },
          });
          props?.setRefresh && props.setRefresh(true);
          await getData();
          props?.setRefresh && props.setRefresh(false);
        })
        .catch((error) => {
          Alert.deleteError({ title: 'Student', text: '' });
        });
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];
    const allowedExtensions = ['.csv'];
    const fileName = file.name;
    const fileExtension = fileName.slice(fileName.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      Swal.fire('Invalid File', 'Please select a CSV file.', 'error');
      e.target.value = ''; // Clear the file input
      setIsButtonDisabled(true); // Disable the upload button
      return;
    }

    setFile(file);
    setIsButtonDisabled(false); // Enable the upload button
  };
  const [columnDefs, setColumnDefs] = useState<any[]>([
    { headerName: 'First Name', field: 'first_name', sort: 'asc' },
    { headerName: 'Middle Name', field: 'middle_name' },
    { headerName: 'Last Name', field: 'last_name' },
    { headerName: 'Email', field: 'email_id', minWidth: 250 },
    {
      headerName: 'Action',
      field: 'action',
      minWidth: 130,
      maxWidth: 140,

      cellRenderer: (row: ICellRendererParams) => {
        const hasTakenAssessment = row?.data?.test_status.some(
          (t: any) => t === true
        );

        return (
          <>
            <IconButton>
              <MdDelete
                className="text-delete-icon"
                onClick={() => {
                  if (hasTakenAssessment) {
                    Swal.fire({
                      title: 'Assessment already taken',
                      text: '',
                      icon: 'info',
                    });
                  } else {
                    handleDelete(row.data);
                  }
                }}
              />
            </IconButton>
          </>
        );
      },
    },
  ]);

  const singleMemberMailSend = (e: any) => {
    if (e?.email_id) {
      sendMail([{ id: e.id, email: e.email_id }]);
    }
  };

  const multiMemberMailSend = (e: any) => {
    const multiMail: any = [];
    e.forEach((element: any) => {
      multiMail.push({ id: element.id, email: element.email_id });
    });
    if (multiMail?.length) {
      sendMail(multiMail);
    }
  };

  const sendMail = (data: any) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/course_details/mail`, {
        mails: data,
        cronValue: cronValue,
      })
      .then((res) => {
        Alert.success({ title: 'Email reminder Sent', text: '' });
      });
  };

  const defaultColDef = useMemo<any>(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
      sortable: true,
      // sortable: flag,

      filterParams: {
        suppressAndOrCondition: true,
        trimInput: true,
        buttons: ['reset', 'clear'],
      },
    };
  }, []);

  const getData = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/course_details/file/${props.data.id}`
      )
      .then((res) => {
        setCourseCount(res?.data?.records.length);
        const data = res?.data?.records || [];
        setFileData(data);
      });
  };

  const onBtnExport = useCallback(() => {
    gridApi.exportDataAsCsv({
      fileName: file?.name || 'default.csv',
      columnKeys: ['first_name', 'middle_name', 'last_name', 'email_id'],
    });
  }, [gridApi, file]);

  return (
    <div>
      {!props?.name ? (
        <Tooltip title="Manage Students">
          <IconButton onClick={() => handleClickOpen()}>
            <FaUserGraduate className="text-edit-icon" />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          onClick={() => handleClickOpen()}
          variant="contained"
          size="small"
          style={{ marginLeft: '13px' }}
        >
          <span>Manage Students</span>
        </Button>
      )}

      <Dialog
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '1000px', // Set your width here
            },
          },
        }}
        open={open}
      >
        <DialogTitle className=" flex justify-between items-center h-12  bg-sky-800  text-white ">
          {/* {props.edit ? "Update" : "Add"} */}
          <div> Add Students to Assessment</div>
          <div>
            <IconButton
              size="small"
              sx={{ color: 'white' }}
              onClick={handleClose}
            >
              <AiOutlineClose />
            </IconButton>
          </div>

          {/* <Divider /> */}
        </DialogTitle>
        <DialogContent>
          {/* <div className=""> */}
          <div className="flex items-center gap-4 justify-between">
            <div className="button-wrap flex my-1.5 items-center gap-5">
              <div>
                <Button
                  sx={{ textTransform: 'capitalize' }}
                  variant="contained"
                  // style={{ marginTop: "5px" }}
                  size="small"
                >
                  <label className="new-button" htmlFor="upload">
                    Select Course Roster
                    <input
                      className="choose-file"
                      id="upload"
                      type="file"
                      ref={inputRef}
                      onChange={(e) => handleFileChange(e)}
                    />
                  </label>
                </Button>

                {/* <div>hii</div> */}
              </div>
              {file?.name}

              <Button
                sx={{ textTransform: 'capitalize' }}
                variant="contained"
                size="small"
                onClick={handleUploadClick}
                disabled={isButtonDisabled} // Disable the button if no file is selected
              >
                upload
              </Button>

              <div className="flex gap-2">
                <span className=" font-bold">
                  Roster count <span>:</span>
                </span>
                <span className=" text-blue-600">
                  {courseCount ? courseCount : 0}
                </span>
              </div>
              <div className="flex">
                <Link component="button" variant="body2" onClick={onBtnExport}>
                  Download Course Roster Template
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ textTransform: 'initial' }}
                  onClick={() => {
                    setIsEdit(false);
                    setOpenStudentDialog(true);
                  }}
                >
                  Add a student
                </Button>
              </div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'red' }}> Only csv file *</div>

          <div
            className="ag-theme-alpine"
            style={{
              marginLeft: '0px',
              marginTop: '5px',
            }}
          >
            <AgGridReact
              ref={gridRef}
              paginationPageSize={25}
              overlayNoRowsTemplate="No rows to show"
              suppressServerSideInfiniteScroll={false}
              rowData={fileData}
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              pagination={true}
              onGridReady={onGridReady}
              cacheQuickFilter={true}
              domLayout={'autoHeight'}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'capitalize' }}
            variant="contained"
            autoFocus
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openStudentDialog}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>{isEdit ? 'Update Student' : 'Add Student'}</div>
            <div>
              <AiOutlineClose
                onClick={handleClickClose}
                className="cursor-pointer	"
              />
            </div>
          </div>
        </DialogTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={async (values) => {
            await axios
              .post(
                `${process.env.REACT_APP_BASE_URL}/api/course_details/add`,
                values
              )
              .then(async (response: any) => {
                if (
                  response.data &&
                  response?.data?.message != 'No unique data found'
                ) {
                  Swal.fire({
                    title: 'Student record updated!',
                    icon: 'success',
                    customClass: {
                      container: 'swal-container',
                    },
                  });
                  props?.setRefresh && props.setRefresh(true);
                  await getData();
                  props?.setRefresh && props.setRefresh(false);
                } else if (response?.data?.message == 'No unique data found') {
                  Swal.fire({
                    title: 'Email Id already exists!',
                    icon: 'info',
                    customClass: {
                      container: 'swal-container',
                    },
                  });
                }
              })

              .catch((err) => {});
            setOpenStudentDialog(false);
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
              sx={{
                width: '600px',
                height: 'fitContent',
                overflowX: 'hidden',
              }}
            >
              <Form>
                <Field
                  as={TextField}
                  id="firstName"
                  label="First Name"
                  variant="standard"
                  name="first_name"
                  value={values.first_name}
                  error={errors.first_name && touched.first_name}
                  helperText={
                    errors.first_name && touched.first_name
                      ? errors.first_name
                      : ''
                  }
                  className="capitalize"
                  fullWidth
                  sx={{ marginBottom: '20px', marginTop: '20px' }}
                />

                <Field
                  as={TextField}
                  id="middleName"
                  label="Middle Name"
                  variant="standard"
                  name="middle_name"
                  value={values.middle_name}
                  className="capitalize"
                  fullWidth
                  sx={{ marginBottom: '20px', marginTop: '20px' }}
                />
                <Field
                  as={TextField}
                  id="lastName"
                  label="Last Name"
                  variant="standard"
                  name="last_name"
                  value={values.last_name}
                  error={errors.last_name && touched.last_name}
                  helperText={
                    errors.last_name && touched.last_name
                      ? errors.last_name
                      : ''
                  }
                  className="capitalize"
                  fullWidth
                  sx={{ marginBottom: '20px', marginTop: '20px' }}
                />

                <Field
                  as={TextField}
                  id="email"
                  label="Email"
                  variant="standard"
                  name="email_id"
                  value={values.email_id}
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
                    disabled={!isValid}
                    onClick={handleAddStudent}
                  >
                    {isEdit ? 'Update' : 'Add'}
                  </Button>
                </div>
              </Form>
            </DialogContent>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default FileImport;
