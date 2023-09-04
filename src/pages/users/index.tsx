import React, { useMemo, useState, useRef, useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridApi } from "ag-grid-community";
import {
  Button,
  InputAdornment,
  Menu,
  Switch,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Tab,
  Tabs,
  Typography,
  Box,
  IconButton,
  Badge,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation } from "react-router";
import { AppDispatch, RootState } from "../../reduxStore/Store";
import debounce from "lodash/debounce";
import {
  addUserAdmin,
  getSearchApprovalData,
  getUsersBadge,
  getUsersByOrganization,
  getUsersByOrganizationPopup,
  getUsersData,
  updateUserAdmin,
  updateUserLockedStatus,
  updateUserStatus,
} from "../../reduxStore/reducer/userReducer";
import { createServerSideDatasource } from "../../utils/gridMethod/createServerSideDatasource";
import { GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import { BsSearch } from "react-icons/bs";
import { Formik, Form, Field, ErrorMessage } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import { ServerSideGrid } from "../../utils/MasterGrid/ServerSideGrid";
import GridHeader2 from "../../utils/gridHeader/GridHeader2";
import { ColumnApi } from "ag-grid-community";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Users = () => {
  const gridRef = useRef<AgGridReact>(null);
  const gridRef1 = useRef<AgGridReact>(null);
  const getRowId = (params: any) => params.data.id;
  const getRowId1 = (params: any) => params.data.id;
  //for changing the value on text field immediately
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");

  //Delays capturing, changing text on text field
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [gridApi1, setGridApi1] = useState<GridApi>();
  const [gridApi2, setGridApi2] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();
  const [columnApi1, setColumnApi1] = useState<ColumnApi>();
  const [columnApi2, setColumnApi2] = useState<ColumnApi>();

  const dispatch = useDispatch<AppDispatch>();
  const users: any = useSelector((state: RootState) => state.users.usersData);

  const transactions = (operation: string, data: any) => {
    if (gridRef1.current) {
      gridRef1.current!.api.applyTransaction({
        [operation]: [data],
      });
    }
  };

  const pendingUserData = useSelector((state: any) => state.users.badgeData);

  useEffect(() => {
    dispatch(getUsersBadge());
  }, [dispatch]);

  const updateRoWData = (data: any) => {
    const result: any = gridRef1?.current?.api.applyServerSideTransactionAsync({
      remove: [data],
    });
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      resizable: true,
      flex: 1,
      minWidth: 100,
      filterParams: {
        suppressAndOrCondition: true,
        trimInput: true,
        buttons: ["reset", "clear"],
      },
    };
  }, []);

  const [dataSource, setDataSource] = useState();
  const [params, setParams] = useState();
  const [dataSource1, setDataSource1] = useState();
  const [params1, setParams1] = useState();

  const onGridReady = (params: GridReadyEvent) => {
    const datasource = createServerSideDatasource(
      dispatch,
      getUsersData,
      setDataSource,
      setParams
    );
    params.api.setServerSideDatasource(datasource);
  };

  const onGridReady1 = (params: GridReadyEvent) => {
    const dataSource1 = createServerSideDatasource(
      dispatch,
      getUsersByOrganization,
      setDataSource1,
      setParams1
    );
    params.api.setServerSideDatasource(dataSource1);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function removeSpaces(str: any) {
    return str ? str.replace(/\s/g, "") : str;
  }

  function Actions(row: any) {
    return (
      <div className="">
        <IconButton
          onClick={() => {
            row.setIsEdit(true);
            row.handleUpdate(row.data);
          }}
        >
          <EditIcon className="float-right text-blue-600" />
        </IconButton>
      </div>
    );
  }

  const handleUpdate = (data: any) => {
    setInitialValue({ ...data });
    setOpen(true);
  };

  const transactionDefs = [
    {
      headerName: "First Name",
      field: "first_name",
      sortable: true,
      filter: "agTextColumnFilter",
      // resizable: false,
    },

    {
      headerName: "Last Name",
      field: "last_name",
      sortable: true,
      filter: "agTextColumnFilter",
      // resizable: false,
    },

    {
      headerName: "User Type",
      field: "type",
      sortable: true,
      filter: "agTextColumnFilter",
      // resizable: false,
    },

    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: "agTextColumnFilter",
      // resizable: false,
    },
    {
      headerName: "Locked",
      // resizable: false,

      field: "is_locked",
      cellRenderer: (param: any) => {
        return (
          <Switch
            type="checkbox"
            checked={param?.data?.is_locked || false}
            onChange={(e: any) => {
              dispatch(
                updateUserLockedStatus(e.target.checked, param.data, gridApi)
              );
            }}
          />
        );
      },
    },
    {
      headerName: "Action",
      field: "action",
      sortable: false,
      // resizable: false,

      filter: false,
      minWidth: 130,
      maxWidth: 140,
      cellRenderer: Actions,
      cellRendererParams: (params: ICellRendererParams) => ({
        ...params,
        setIsEdit,
        handleUpdate,
      }),
    },
    {
      headerName: "Created At",
      field: "created_at",
      // resizable: false,

      filter: "agDateColumnFilter",
      sortable: true,
      cellRenderer: (row: any) => {
        return moment(row?.data?.created_at).format("MM/DD/YYYY h:mm:ss A");
      },
    },
  ];
  const transactionUsersByOrganizationDefs = [
    {
      headerName: "First Name",
      field: "first_name",
      sortable: true,
      filter: "agTextColumnFilter",
    },

    {
      headerName: "Last Name",
      field: "last_name",
      sortable: true,
      filter: "agTextColumnFilter",
    },

    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: "agTextColumnFilter",
    },

    {
      headerName: "Organization",
      field: "name",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Activation Status",
      field: "status",
      cellRenderer: (param: any) => {
        return (
          <div>
            <div>
              {param?.data?.status || param?.data?.status == true ? (
                <b>Approved</b>
              ) : param?.data?.status == false ? (
                <b>Rejected</b>
              ) : (
                <b>Pending</b>
              )}
            </div>
          </div>
        );
      },
    },
    {
      headerName: "Actions",
      field: "status",
      cellRenderer: (param: any) => {
        return (
          <div>
            <Button
              color="primary"
              disabled={param?.data?.status}
              variant="contained"
              size="small"
              style={{
                fontSize: "12px",
                height: "29px",
                alignSelf: "center",
                marginRight: "5px",
              }}
              onClick={() => {
                dispatch(updateUserStatus(true, param.data, gridApi, gridApi1));
              }}
            >
              Approve
            </Button>
            <Button
              color="error"
              variant="contained"
              disabled={param?.data?.status == false}
              size="small"
              style={{
                fontSize: "12px",
                height: "29px",
                alignSelf: "center",
              }}
              onClick={() => {
                dispatch(
                  updateUserStatus(false, param.data, gridApi, gridApi1)
                );
              }}
            >
              Reject
            </Button>
          </div>
          // <Switch
          //   type="checkbox"
          //   checked={param?.data?.status || false}
          //   onChange={(e: any) => {
          //     dispatch(
          //       updateUserStatus(
          //         e.target.checked,
          //         param.data,
          //         gridApi,
          //         gridApi1
          //       )
          //     );
          //   }}
          // />
        );
      },
    },
  ];
  const transactionUserInviteDefs = [
    {
      headerName: "First Name",
      field: "first_name",
      sortable: true,
      filter: "agTextColumnFilter",
    },

    {
      headerName: "Last Name",
      field: "last_name",
      sortable: true,
      filter: "agTextColumnFilter",
    },

    {
      headerName: "Organization Email",
      field: "organization_email_id",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Organization",
      field: "organization_name",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Created At",
      field: "created_at",
      filter: "agDateColumnFilter",
      sortable: true,
      cellRenderer: (row: any) => {
        return moment(row.data.created_at).format("MM/DD/YYYY h:mm:ss A");
      },
    },
  ];

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onFilterTextBoxChanged1 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(getSearchApprovalData(e?.target?.value, params));
  };

  const [open, setOpen] = useState(false);
  const handleClickClose = () => {
    setOpen(false);
  };

  const [initialValues, setInitialValue] = useState<any>({
    id: "",
    first_name: null,
    middle_name: "",
    last_name: "",
    email: null,
  });

  const handleOpenForm = () => {
    setOpen(true);
    setIsEdit(false);
    setInitialValue({
      id: "",
      first_name: null,
      middle_name: "",
      last_name: "",
      email: null,
    });
  };

  const textFieldProps1 = {
    onChange: onFilterTextBoxChanged1,
  };

  const [isEdit, setIsEdit] = useState(false);

  const validation = Yup.object({
    first_name: Yup.string()
      .nullable()

      .matches(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed.")
      .matches(/^[^\s].*$/, "The starting letter should not be a space.")
      .matches(/[^\s]$/, "Ending letter should not be a space.")
      .min(3, "Please enter a minimum of 3 letters.")
      .required("Required Field"),
    middle_name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed.")
      .matches(/^[^\s].*$/, "The starting letter should not be a space.")
      .matches(/[^\s]$/, "Ending letter should not be a space.")
      .min(3, "Please enter a minimum of 3 letters."),
    last_name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed.")
      .matches(/^[^\s].*$/, "The starting letter should not be a space.")
      .matches(/[^\s]$/, "Ending letter should not be a space.")
      .min(3, "Please enter a minimum of 3 letters.")
      .required("Required Field"),
    email: Yup.string()
      .email()
      .nullable()

      .required("entered text is not a valid email"),
  });

  const debounceSearch = debounce((value: string) => {
    setDebouncedSearchQuery(value);
  }, 500);
  const debounceSearch1 = debounce((value: string) => {
    setDebouncedSearchQuery(value);
  }, 500);
  const debounceSearch2 = debounce((value: string) => {
    setDebouncedSearchQuery(value);
  }, 500);

  const onFilterTextBoxChanged = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(e.target.value);
    const value = e.target.value;
    debounceSearch(value);
  };

  const onFilterTextBoxChanged2 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery1(e.target.value);
    const value = e.target.value;
    debounceSearch1(value);
  };

  const onFilterTextBoxChanged3 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery2(e.target.value);
    const value = e.target.value;
    debounceSearch2(value);
  };

  const textFieldProps = {
    value: searchQuery,
    onChange: onFilterTextBoxChanged,
  };
  const buttonProps = {
    children: "Add User",
    onClick: handleOpenForm,
    sm: "Add",
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Users" {...a11yProps(0)} />
            <Tab
              label={
                <Badge
                  badgeContent={
                    pendingUserData.length ? pendingUserData.length : 0
                  }
                  color="error"
                >
                  Pending Approvals
                </Badge>
              }
              {...a11yProps(1)}
            />
            <Tab label="Pending Invites" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <GridHeader2
            textFieldProps={textFieldProps}
            buttonProps={buttonProps}
          />
          <ServerSideGrid
            rowDataUrl="/users/"
            debouncedSearchQuery={searchQuery}
            columnDefs={transactionDefs}
            gridApi={gridApi}
            columnApi={columnApi}
            setGridApi={setGridApi}
            setColumnApi={setColumnApi}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className="box-border mt-8 mr-4 shadow-2xl pt-2">
            <div className="text-end pr-5 flex gap-x-16 justify-end items-center">
              <TextField
                size="small"
                id="search-field"
                placeholder="Search"
                onChange={(e) => onFilterTextBoxChanged2(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BsSearch />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <ServerSideGrid
              rowDataUrl="/users/organization"
              debouncedSearchQuery={searchQuery1}
              columnDefs={transactionUsersByOrganizationDefs}
              gridApi={gridApi1}
              columnApi={columnApi1}
              setGridApi={setGridApi1}
              setColumnApi={setColumnApi1}
            />
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div className="box-border mt-8 mr-4 shadow-2xl pt-2">
            <div className="text-end pr-5 flex gap-x-16 justify-end items-center">
              <TextField
                size="small"
                id="search-field"
                placeholder="Search"
                onChange={(e) => onFilterTextBoxChanged3(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BsSearch />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <ServerSideGrid
              rowDataUrl="/users/invite"
              debouncedSearchQuery={searchQuery2}
              columnDefs={transactionUserInviteDefs}
              gridApi={gridApi2}
              columnApi={columnApi2}
              setGridApi={setGridApi2}
              setColumnApi={setColumnApi2}
            />
          </div>
        </TabPanel>
      </Box>

      <Dialog open={open} style={{ zIndex: +1 }}>
        <DialogTitle sx={{ backgroundColor: "#1663ab", color: "white" }}>
          <div className="flex justify-between items-center">
            <div>{isEdit ? "Update User" : "Add User"}</div>
            <div>
              <CloseIcon onClick={handleClickClose} />
            </div>
          </div>
        </DialogTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={(values) => {
            if (!isEdit) {
              dispatch(addUserAdmin(values, gridApi, setOpen));
            } else {
              dispatch(updateUserAdmin(values, gridApi, setOpen));
            }
          }}
        >
          {({ values, errors, touched, isValid }) => (
            <DialogContent
              sx={{ width: "600px", height: "fitContent", overflowX: "hidden" }}
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
                      : ""
                  }
                  fullWidth
                  error={errors.first_name && touched.first_name}
                  sx={{ marginBottom: "15px" }}
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
                      : ""
                  }
                  fullWidth
                  error={errors.middle_name && touched.middle_name}
                  sx={{ marginBottom: "15px" }}
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
                      : ""
                  }
                  fullWidth
                  error={errors.last_name && touched.last_name}
                  sx={{ marginBottom: "15px" }}
                />

                <Field
                  variant="standard"
                  as={TextField}
                  label="Email"
                  required
                  name="email"
                  value={values.email}
                  helperText={errors.email && touched.email ? errors.email : ""}
                  fullWidth
                  error={errors.email && touched.email}
                  sx={{ marginBottom: "15px" }}
                />

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="contained"
                    onClick={handleClickClose}
                    style={{ textTransform: "capitalize" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!isValid}
                    style={{ textTransform: "capitalize" }}
                  >
                    {isEdit ? "Update" : "Save"}
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

export default Users;
