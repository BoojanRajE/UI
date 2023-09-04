import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxStore/Store";
import { getOrganisationData } from "../../reduxStore/reducer/organisationReducer";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { MdModeEdit, MdDelete } from "react-icons/md";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AgGridReact } from "ag-grid-react";
import {
  addUnitrolesData,
  deleteUnitrolesData,
  editUnitrolesData,
  getUnitrolesData,
  getSearchData,
} from "../../reduxStore/reducer/unitrolesReducer";
import {
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from "ag-grid-community";
import { AiOutlineClose } from "react-icons/ai";
import GridHeader2 from "../../utils/gridHeader/GridHeader2";
import { ServerSideGrid } from "../../utils/MasterGrid/ServerSideGrid";
import { ColumnApi } from "ag-grid-community";
import debounce from "lodash/debounce";

export interface Unitroles {
  id: string;
  role_name: string;
  is_active: boolean;
  created_by: string;
}

export interface ExtendedICellRendererParams extends ICellRendererParams {
  setIsEdit: any;
  handleUpdate(data: Unitroles): void;
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

function Unitroles() {
  const dispatch = useDispatch<AppDispatch>();
  //for changing the value on text field immediately
  const [searchQuery, setSearchQuery] = useState("");

  //Delays capturing, changing text on text field
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();

  const [open, setOpen] = useState(false);
  const handleClickClose = () => {
    setOpen(false);
    setInitialValue({
      id: "",
      role_name: "",
      is_active: true,
      created_by: "",
    });
  };

  const [initialValues, setInitialValue] = useState<Unitroles>({
    id: "",
    role_name: "",
    is_active: true,
    created_by: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  const validation = Yup.object({
    organization_name: Yup.object({
      id: Yup.string(),
      value: Yup.string(),
    })
      .nullable()
      .required("Required Field"),
    role_name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed.")
      .matches(/^[^ ]/, "The starting letter should not be a space.")
      .matches(/[^\s]$/, "Ending letter should not be a space.")

      .required("Required Field"),
  });

  const handleUpdate = (data: Unitroles) => {
    setOpen(true);
    setInitialValue(data);
  };

  const unitrolesDefs = [
    {
      headerName: "Role Name",
      field: "role_name",
    },
    {
      headerName: "Created By",
      field: "created_by",
    },
    {
      headerName: "Created At",
      field: "created_at",
      filter: "agDateColumnFilter",
      cellRenderer: (row: any) => {
        return moment(moment(row.data.created_at).utc())
          .local()
          .format("MM-DD-YYYY hh:mm a");
      },
    },
    {
      headerName: "Action",
      field: "action",
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

  const getData = (data: any, params: any) => {
    dispatch(getUnitrolesData(data, params));
  };
  const handleDelete = (data: Unitroles) => {
    dispatch(deleteUnitrolesData(data, gridApi));
  };

  const debounceSearch = debounce((value: string) => {
    setDebouncedSearchQuery(value);
  }, 500);

  const onFilterTextBoxChanged1 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(e.target.value);
    const value = e.target.value;
    debounceSearch(value);
  };

  const handleOpenForm = () => {
    setIsEdit(false);
    setOpen(true);
    setInitialValue({
      id: "",
      role_name: "",
      is_active: true,
      created_by: "",
    });
  };

  const textFieldProps = {
    value: searchQuery,
    onChange: onFilterTextBoxChanged1,
  };
  const buttonProps = {
    children: "Add Unit Roles",
    onClick: handleOpenForm,
    sm: "Add",
  };

  return (
    <main>
      <header className="header">Unit Roles</header>
      <GridHeader2 textFieldProps={textFieldProps} buttonProps={buttonProps} />

      <ServerSideGrid
        rowDataUrl="/unitroles/"
        debouncedSearchQuery={searchQuery}
        columnDefs={unitrolesDefs}
        gridApi={gridApi}
        columnApi={columnApi}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
      />

      <Dialog open={open}>
        <DialogTitle sx={{ backgroundColor: "#1663ab", color: "white" }}>
          <div className="flex justify-between items-center">
            <div>{isEdit ? "Update Role" : "Add Role"}</div>
            <div>
              <AiOutlineClose onClick={handleClickClose} />
            </div>
          </div>
        </DialogTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={(values) => {
            if (!isEdit) dispatch(addUnitrolesData(values, setOpen, gridApi));
            else {
              dispatch(editUnitrolesData(values, setOpen, gridApi));
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
                width: "600px",
                height: "fitContent",
                overflowX: "hidden",
              }}
            >
              <Form>
                <Field
                  as={TextField}
                  id="unitrolesName"
                  label="Role Name"
                  variant="standard"
                  name="role_name"
                  value={values.role_name}
                  error={errors.role_name && touched.role_name}
                  helperText={
                    errors.role_name && touched.role_name
                      ? errors.role_name
                      : ""
                  }
                  className="capitalize"
                  fullWidth
                  sx={{ marginBottom: "50px", marginTop: "20px" }}
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
    </main>
  );
}

export default Unitroles;
