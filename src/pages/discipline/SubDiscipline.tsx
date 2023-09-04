import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ICellRendererParams,
  ColGroupDef,
  GridReadyEvent,
  ColumnApi,
  GridApi,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-grid.css";
import { MdDelete, MdEdit } from "react-icons/md";
import { getDisciplineDetails } from "../../reduxStore/reducer/disciplineReducer";
import {
  addSubDisciplineAction,
  updateSubDisciplineAction,
  deleteSubDisciplineData,
} from "../../reduxStore/reducer/subDisciplineReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../reduxStore/Store";
import moment from "moment";
import { useLocation } from "react-router";
import Autocomplete from "@mui/material/Autocomplete";

import { AiOutlineClose } from "react-icons/ai";
import GridHeader2 from "../../utils/gridHeader/GridHeader2";
import debounce from "lodash/debounce";
import { ServerSideGrid } from "../../utils/MasterGrid/ServerSideGrid";

const textPattern = /^[A-Za-z _]+$/;

function validateSubdata(subdata: any) {
  // Check if name is a string
  if (!textPattern.test(subdata.name)) {
    return false;
  }

  // Check if discipline_id is not empty
  if (subdata.discipline_id === "") {
    return false;
  }

  return true;
}

const SubDiscipline = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  //for changing the value on text field immediately
  const [searchQuery, setSearchQuery] = useState("");

  //Delays capturing, changing text on text field
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();

  const [flag, setFlag] = useState(true);
  const [value, setValue] = React.useState<any | null>();
  const [inputValue, setInputValue] = React.useState("Discipline 1");

  const [autoComplete, setAutoComplete] = useState({
    value: {},
    input: "",
  });
  const getDisciplineData = useSelector(
    (state: any) => state.discipline.getDisciplineDetails
  );

  const disciplineName = getDisciplineData.map((o: any) => ({
    id: o.id,
    name: o.name,
  }));

  disciplineName.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));

  useEffect(() => {
    dispatch(getDisciplineDetails());
  }, [dispatch]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setInputForm({
      discipline_id: "",
      name: "",
    });
    setAutoComplete({
      value: {},
      input: "",
    });
  };

  const init_subdata = {
    discipline_id: "",
    name: "",
  };

  const [inputForm, setInputForm] = React.useState(init_subdata);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInputForm({ ...inputForm, [name]: value });
  };

  const handleSave = async () => {
    const disciplineData = getDisciplineData.find(
      (item: any) => item.id === inputForm?.discipline_id
    );
    const data = { ...inputForm, discipline_name: disciplineData?.name || "" };
    if (!isEdit) {
      dispatch(
        addSubDisciplineAction(
          data,
          setOpen,
          gridApi,
          setInputForm,
          setAutoComplete
        )
      );
    } else {
      dispatch(
        updateSubDisciplineAction(
          data,
          setOpen,
          gridApi,
          setInputForm,
          setAutoComplete
        )
      );
    }
    setOpen(false);
  };

  const handleEdit = (data: any) => {
    const disciplineData = disciplineName.find(
      (i: any) => i.name === data.discipline_name
    );
    data.discipline_id = disciplineData?.id || "";
    setInputForm(data);
    setOpen(true);
    setIsEdit(true);
    setAutoComplete({
      ...autoComplete,
      value: { discipline_id: data.discipline_id, name: data.discipline_name },
    });
  };

  const handleDelete = (data: any) => {
    dispatch(deleteSubDisciplineData(data, gridApi));
    setOpen(false);
  };

  const gridRef = useRef<AgGridReact>(null);

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: flag,
    pagination: true,
    filter: "agTextColumnFilter",
    filterParams: {
      suppressAndOrCondition: true,
      trimInput: true,
      buttons: ["reset", "clear"],
    },
  };
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const transactionDefs: any = [
    {
      headerName: "Name",
      field: "name",
    },
    {
      headerName: "Discipline",
      field: "discipline_name",
    },

    {
      headerName: "Created By",
      field: "created_by",
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
      sortable: false,
      filter: false,
      minWidth: 130,
      maxWidth: 140,
      cellRenderer: (row: ICellRendererParams) => {
        return (
          <>
            <IconButton onClick={() => handleEdit(row.data)}>
              <MdEdit className="text-edit-icon" />
            </IconButton>

            <IconButton onClick={() => handleDelete(row.data)}>
              <MdDelete className="text-delete-icon" />
            </IconButton>
          </>
        );
      },
    },
  ];

  const debounceSearch = debounce((value: string) => {
    setDebouncedSearchQuery(value);
  }, 500);

  const handleOpenForm = () => {
    setIsEdit(false);
    handleClickOpen();
  };

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
    children: "Add Sub Discipline",
    onClick: handleOpenForm,
    sm: "Add",
  };

  return (
    <main>
      <header className="header">Sub Discipline</header>
      <GridHeader2 textFieldProps={textFieldProps} buttonProps={buttonProps} />

      <ServerSideGrid
        rowDataUrl="/sub_discipline/"
        debouncedSearchQuery={searchQuery}
        columnDefs={transactionDefs}
        gridApi={gridApi}
        columnApi={columnApi}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
      />

      <Dialog open={open}>
        <div className="popup_box">
          <DialogTitle className="flex justify-between bg-sky-800 text-white p-3">
            <div>{isEdit ? "Update Sub Discipline" : "Add Sub Discipline"}</div>
            <div>
              <AiOutlineClose onClick={handleClose} />
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="flex gap-5 justify-start items-center p-2">
              <label htmlFor="Discipline" className="w-72">
                Discipline Name
              </label>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                disableClearable={true}
                options={disciplineName.length ? disciplineName : []}
                getOptionLabel={(option: any) =>
                  option.name === undefined ? "" : option.name
                }
                sx={{ width: "100%" }}
                ListboxProps={{ style: { maxHeight: 120 } }}
                renderInput={(params: any) => {
                  return <TextField {...params} size={"small"} />;
                }}
                value={autoComplete.value}
                onChange={(event: any, newValue: any | null) => {
                  setValue(newValue);
                  setInputForm({
                    ...inputForm,
                    discipline_id: newValue?.id || "",
                  });
                  setAutoComplete({
                    ...autoComplete,
                    value: {
                      discipline_id: newValue?.id || "",
                      name: newValue.name,
                    },
                  });
                }}
                inputValue={autoComplete.input}
                onInputChange={(event, newInputValue) => {
                  setAutoComplete({ ...autoComplete, input: newInputValue });
                }}
              />
            </div>
            <div className="flex gap-5 justify-start items-center p-2">
              <label htmlFor="Discipline" className="w-72">
                Sub Discipline Name
              </label>
              <input
                className="Input-Box"
                type="text"
                placeholder="Enter Sub Discipline Name"
                name="name"
                value={inputForm.name || ""}
                onChange={handleChange}
              />
            </div>

            {/* Regex pattern error messages */}
            <div
              style={{
                width: "300px",
                position: "relative",
                left: "13rem",
                fontSize: "12px",
                color: "red",
              }}
            >
              {inputForm.name && /\s$/.test(inputForm.name) && (
                <label>Ending letter should not be a space.</label>
              )}
              {inputForm.name && !/^[a-zA-Z].*$/.test(inputForm.name) && (
                <label>The starting letter should not be a space.</label>
              )}
              {inputForm.name && !/^[a-zA-Z\s]+$/.test(inputForm.name) && (
                <label>Only alphabets and spaces are allowed.</label>
              )}
              {inputForm.name && inputForm.name.length < 3 && (
                <label>Please enter a minimum of 3 letters.</label>
              )}
            </div>
          </DialogContent>

          <DialogActions>
            <div className="flex gap-3">
              <Button
                style={{ textTransform: "capitalize" }}
                onClick={handleClose}
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                style={{ textTransform: "capitalize" }}
                disabled={validateSubdata(inputForm) ? false : true}
                onClick={handleSave}
                variant="contained"
              >
                {isEdit ? "Update" : "Save"}
              </Button>
            </div>
          </DialogActions>
        </div>
      </Dialog>
    </main>
  );
};

export default SubDiscipline;
