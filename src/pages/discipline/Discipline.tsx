import React, { useMemo, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ColDef,
  ColumnApi,
  GridApi,
  ICellRendererParams,
} from "ag-grid-enterprise";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import {
  addDisciplineAction,
  deleteDisciplineData,
  ediDisciplineData,
} from "../../reduxStore/reducer/disciplineReducer";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../reduxStore/Store";
import { MdDelete, MdEdit } from "react-icons/md";
import moment from "moment";
import { useLocation } from "react-router";
import GridHeader2 from "../../utils/gridHeader/GridHeader2";
import { ServerSideGrid } from "../../utils/MasterGrid/ServerSideGrid";
import debounce from "lodash/debounce";
import Alert from "../../utils/Alert/Alert";

const Discipline = () => {
  const [flag, setFlag] = useState(true);
  //for changing the value on text field immediately
  const [searchQuery, setSearchQuery] = useState("");

  //Delays capturing, changing text on text field
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();

  const dispatch = useDispatch<AppDispatch>();
  const [disciplineDataState, setDisciplineDataState] = React.useState({
    show: false,
    data: { name: "" },
    method: "",
  });

  const handleClose = () => {
    setDisciplineDataState({
      show: false,
      data: { name: "" },
      method: "",
    });
  };

  const handleChange = (event: any) => {
    const { name, value, keyCode } = event.target;
    setDisciplineDataState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (disciplineDataState.data.name === "") {
      setDisciplineDataState({
        show: false,
        data: { name: "" },
        method: "",
      });

      return Alert.error({ title: "Enter Discipline Name", text: "" });
    }

    if (disciplineDataState.method === "Add") {
      addDisciplineAction(disciplineDataState.data, gridApi);
    } else if (disciplineDataState.method === "Update") {
      ediDisciplineData(disciplineDataState.data, gridApi);
    }
    setDisciplineDataState({
      show: false,
      data: { name: "" },
      method: "",
    });
  };

  const debounceSearch = debounce((value: string) => {
    setDebouncedSearchQuery(value);
  }, 500);

  const transactionDefs: any = [
    {
      headerName: "Name",
      field: "name",
      filter: "agTextColumnFilter",
      sortable: flag,
    },
    {
      headerName: "Created By",
      field: "created_by",
      filter: "agTextColumnFilter",
      sortable: flag,
    },

    {
      headerName: "Created At",
      field: "created_at",
      filter: "agDateColumnFilter",
      sort: "desc",
      cellRenderer: (row: any) => {
        return moment(moment(row.data.created_at).utc())
          .local()
          .format("MM-DD-YYYY hh:mm a");
      },
    },
    {
      headerName: "Action",
      field: "action",
      minWidth: 130,
      maxWidth: 140,
      sortable: false,
      filter: false,

      cellRenderer: (row: ICellRendererParams) => {
        return (
          <>
            <IconButton
              onClick={() =>
                setDisciplineDataState({
                  show: true,
                  data: { name: "", ...row.data },
                  method: "Update",
                })
              }
            >
              <MdEdit className="text-edit-icon" />
            </IconButton>

            <IconButton
              onClick={() => {
                dispatch(deleteDisciplineData(row.data.id, gridApi));
              }}
            >
              <MdDelete className="text-delete-icon" />
            </IconButton>
          </>
        );
      },
    },
  ];

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const onFilterTextBoxChanged1 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(e.target.value);
    const value = e.target.value;
    debounceSearch(value);
  };

  const handleOpenForm = () => {
    setDisciplineDataState({
      show: true,
      data: { name: "" },
      method: "Add",
    });
  };

  const textFieldProps = {
    value: searchQuery,
    onChange: onFilterTextBoxChanged1,
  };
  const buttonProps = {
    children: "Add Discipline",
    onClick: handleOpenForm,
    sm: "Add",
  };

  return (
    <main>
      <header className="header">Discipline</header>
      <GridHeader2 textFieldProps={textFieldProps} buttonProps={buttonProps} />

      <ServerSideGrid
        rowDataUrl="/discipline/"
        debouncedSearchQuery={searchQuery}
        columnDefs={transactionDefs}
        gridApi={gridApi}
        columnApi={columnApi}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
      />

      <Dialog disableEscapeKeyDown={true} open={disciplineDataState.show}>
        <div className="popup_box">
          <div className="flex justify-between bg-sky-800 text-white p-3">
            <div>{disciplineDataState.method} Discipline</div>
            <div>
              <AiOutlineClose onClick={handleClose} />
            </div>
          </div>
          <DialogContent>
            <div className="block mt-2.5 text-base">
              <div className="flex gap-5 justify-start items-center p-2">
                <label htmlFor="Discipline" className="w-56">
                  Discipline Name
                </label>

                <input
                  className="Input-Box w-28"
                  required
                  type="text"
                  placeholder="Enter Discipline Name"
                  name="name"
                  value={disciplineDataState.data.name || ""}
                  onChange={handleChange}
                />
              </div>

              {disciplineDataState.data.name && (
                <div
                  style={{
                    width: "300px",
                    position: "relative",
                    left: "11rem",
                    fontSize: "12px",
                    color: "red",
                  }}
                >
                  {/\s$/.test(disciplineDataState.data.name) ? (
                    <label>Ending letter should not be a space.</label>
                  ) : !/^[a-zA-Z].*$/.test(disciplineDataState.data.name) ? (
                    <label>The starting letter should not be a space.</label>
                  ) : !/^[a-zA-Z\s]+$/.test(disciplineDataState.data.name) ? (
                    <label>Only alphabets and spaces are allowed.</label>
                  ) : disciplineDataState.data.name.length < 3 ? (
                    <label>Please enter a minimum of 3 letters.</label>
                  ) : null}
                </div>
              )}
            </div>
          </DialogContent>

          <DialogActions>
            <div className="flex gap-3 justify-end">
              <Button
                style={{ textTransform: "capitalize" }}
                onClick={handleClose}
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !/^[a-zA-Z][a-zA-Z\s]*$/.test(disciplineDataState.data.name)
                }
                style={{ textTransform: "capitalize" }}
                onClick={handleSave}
                variant="contained"
                color="primary"
              >
                {disciplineDataState.method === "Add" ? "Save" : "Update"}
              </Button>
            </div>
          </DialogActions>
        </div>
      </Dialog>
    </main>
  );
};

export default Discipline;
