import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Link,
  TextField,
} from "@mui/material";
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import debounce from "lodash/debounce";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ICellRendererParams,
  ColGroupDef,
  GridReadyEvent,
  GridApi,
  ColumnApi,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-grid.css";
import { MdDelete, MdEdit } from "react-icons/md";
import { AiOutlineClose, AiOutlineHome } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";

import { MdKeyboardArrowRight } from "react-icons/md";

import {
  addDisciplineAction,
  getDiscipline,
  deleteDisciplineData,
  ediDisciplineData,
  getDisciplineDetails,
} from "../../reduxStore/reducer/disciplineReducer";
import {
  addCenterAction,
  // getCenterAction,
  deleteCenterAction,
  getCenterData,
  getSearchData,
  updateCenterAction,
} from "../../reduxStore/reducer/centerReducer";
import {
  addSubDisciplineAction,
  getSubDisciplineDetailAction,
  updateSubDisciplineAction,
} from "../../reduxStore/reducer/subDisciplineReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../reduxStore/Store";
import { addSubDiscipline } from "../../reduxStore/route/subDisciplineRoute";
import {
  deleteSubDisciplineData,
  // getSubDisciplineAction,
} from "../../reduxStore/reducer/subDisciplineReducer";
import moment from "moment";
import { useLocation } from "react-router";
import Autocomplete from "@mui/material/Autocomplete";
// import { getOrganisations } from "../../reduxStore/route/organisationRoute";
import {
  getOrganisationData,
  getOrganizationName,
} from "../../reduxStore/reducer/organisationReducer";
// import { getCenter } from "../../reduxStore/route/centerRoute";
import { ClassNames } from "@emotion/react";
import { log } from "console";

import { getSearchDataCenter } from "../../reduxStore/route/centerRoute";
import { createServerSideDatasource } from "../../utils/gridMethod/createServerSideDatasource";
import { ServerSideGrid } from "../../utils/MasterGrid/ServerSideGrid";
import GridHeader2 from "../../utils/gridHeader/GridHeader2";

const textPattern = /^[A-Za-z _]+$/;

function validateUrl(value: any) {
  return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(
    value
  );
}

function validateInputState(inputState: any) {
  // Check if name is a non-empty string
  if (!textPattern.test(inputState.name)) {
    return false;
  }

  // Check if sub_discipline_id, organization_id, and discipline_id are not null
  if (
    inputState.sub_discipline_id === "" ||
    inputState.organization_id === "" ||
    inputState.discipline_id === ""
  ) {
    return false;
  }

  // Check if website is a valid URL
  const urlPattern =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  if (!urlPattern.test(inputState.website)) {
    return false;
  }

  return true;
}

const Center = () => {
  // const getRowId = (params: any) => params.data.id;
  const [dataSource, setDataSource] = useState();
  const [params, setParams] = useState();

  const [open, setOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [flag, setFlag] = React.useState(true);
  const [value, setValue] = React.useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  //Delays capturing, changing text on text field
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();

  const [inputValue, setInputValue] = React.useState("");

  const [autoComplete, setAutoComplete] = useState({
    value: {},
    input: "",
  });

  const [orgAutoComplete, setOrgAutoComplete] = useState({
    value: {},
    input: "",
  });

  const [subAutoComplete, setSubAutoComplete] = useState({
    value: {},
    input: "",
  });

  const dispatch = useDispatch<AppDispatch>();

  const getSubDisciplineData = useSelector(
    (state: any) => state.subdiscipline.getAllSubDisciplineDetail
  );

  const getDisciplineData = useSelector(
    (state: any) => state.discipline.getDisciplineDetails
  );

  const disciplineName = getDisciplineData.map((o: any) => ({
    id: o.id,
    name: o.name,
  }));

  // disciplineName.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));

  const organizationName = useSelector(
    (state: any) => state.organization.organizationName
  );

  // const getCenterData = useSelector((state: any) => state.center.getAllCenter);

  //
  //   getCenterData,
  //   "getCenterDatagetCenterDatagetCenterDatagetCenterData"
  // );

  const SubDisciplineName = getSubDisciplineData.map((o: any) => ({
    id: o.id,
    name: o.name,
  }));

  // SubDisciplineName.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));

  // const organizationName = getOrganizationData.map((o: any) => ({
  //   id: o.id,
  //   name: o.name,
  // }));

  // organizationName.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));

  //

  useEffect(() => {
    // dispatch(getDiscipline());
    dispatch(getDisciplineDetails());

    // dispatch(getSubDisciplineAction());
    // dispatch(getOrganisationData());
    // dispatch(getCenterAction());

    dispatch(getOrganizationName());
    dispatch(getSubDisciplineDetailAction());
  }, []);

  //

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setInputForm(init_input_state);

    setOrgAutoComplete({
      value: {},
      input: "",
    });
    setSubAutoComplete({
      value: {},
      input: "",
    });

    setAutoComplete({
      value: {},
      input: "",
    });
  };

  const init_input_state = {
    id: "",
    sub_discipline_id: "",
    organization_id: "",
    discipline_id: "",
    name: "",
    short_name: "",
    website: "",
  };

  const [inputForm, setInputForm] = React.useState(init_input_state);

  const getSubDisciplineByDiscipline = useCallback(
    (discipline_id: any) => {
      let data = [];
      data = getSubDisciplineData?.length
        ? getSubDisciplineData.filter((item: any) => {
            return item.discipline_id === discipline_id;
          })
        : [];
      return data;
    },
    [inputForm.discipline_id]
  );

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInputForm({ ...inputForm, [name]: value });
    //
  };

  // const transactions = (operation: string, data: any) => {
  //   const res = gridRef.current!.api.applyTransaction({
  //     [operation]: [data],
  //   });

  //   setInputForm(init_input_state);

  //   setOpen(false);

  //   setOrgAutoComplete({
  //     value: {},
  //     input: "",
  //   });
  //   setSubAutoComplete({
  //     value: {},
  //     input: "",
  //   });

  //   setAutoComplete({
  //     value: {},
  //     input: "",
  //   });
  // };

  const handleSave = async () => {
    const subdisciplineData = getSubDisciplineData.find(
      (item: any) => item.id === inputForm?.sub_discipline_id
    );

    const organizationData = organizationName.find(
      (item: any) => item.id === inputForm?.organization_id
    );

    const getDisciplineDetails = getDisciplineData.find(
      (item: any) => item.id === inputForm?.discipline_id
    );

    const data = {
      ...inputForm,
      sub_discipline_name: subdisciplineData?.name || "",
      organization_name: organizationData?.name || "",
      discipline_name: getDisciplineDetails?.name || "",
    };

    if (!isEdit) {
      dispatch(addCenterAction(data, "", "", gridApi));
    } else {
      dispatch(updateCenterAction(data, setOpen, gridApi));

      // dispatch(getCenterAction());
    }
    // dispatch(getCenterAction());

    setOpen(false);
    setInputForm(init_input_state);

    setOrgAutoComplete({
      value: {},
      input: "",
    });
    setSubAutoComplete({
      value: {},
      input: "",
    });

    setAutoComplete({
      value: {},
      input: "",
    });
  };

  const handleEdit = (data: any) => {
    getSubDisciplineByDiscipline(data.discipline_id);
    setInputForm({
      id: data.id,
      sub_discipline_id: data.sub_discipline_id,
      organization_id: data.organization_id,
      discipline_id: data.discipline_id,
      name: data.name,
      short_name: data.short_name,
      website: data.website,
    });
    setOpen(true);
    setIsEdit(true);
    setSubAutoComplete({
      ...subAutoComplete,
      value: {
        sub_discipline_id: data?.sub_discipline_id || "",
        name: data.sub_discipline_name,
      },
    });

    setOrgAutoComplete({
      ...orgAutoComplete,
      value: {
        organization_id: data?.organization_id || "",
        name: data.organization_name,
      },
    });

    setAutoComplete({
      ...autoComplete,
      value: {
        discipline_id: data?.discipline_id || "",
        name: data.discipline_name,
      },
    });
  };

  const handleDelete = (data: any) => {
    dispatch(deleteCenterAction(data, gridApi));
    setOpen(false);
  };

  //

  const gridRef = useRef<AgGridReact>(null);

  const onFilterTextBoxChanged = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let str = e?.target?.value;

    const regex = /[*()[\];,'.$:%]/g;

    const matcher = str.match(regex);
    let found = matcher?.filter((c, index) => {
      return matcher?.indexOf(c) === index;
    });

    found?.forEach((sym) => {
      if (sym == "'") str = str.replace(/'/g, "'" + sym);
      if (sym == "%") str = str.replace(/%/g, "\\" + sym);
      //if (sym == '\\') str = str.replace(sym, '\\' + sym);
    });

    dispatch(getSearchData(str, params, setFlag));
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: flag,
      filter: "agTextColumnFilter",
      filterParams: {
        suppressAndOrCondition: true,
        trimInput: true,
        buttons: ["reset", "clear"],
      },
      // floatingFilter: true,
    };
  }, [flag]);
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const transactionDefs: any = [
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      minWidth: 150,
    },
    {
      headerName: "Discipline",
      field: "discipline_name",
      sortable: true,
      minWidth: 150,
    },
    {
      headerName: "Sub Discipline",
      field: "sub_discipline_name",
      sortable: true,
      minWidth: 150,
    },

    {
      headerName: "Organization",
      field: "organization_name",
      sortable: true,
      minWidth: 150,
    },
    {
      headerName: "Website",
      field: "website",
      sortable: true,
      minWidth: 150,
    },
    {
      headerName: "Short Name",
      field: "short_name",
      minWidth: 150,
      sortable: true,
    },

    {
      headerName: "Created By",
      field: "created_by",
      sortable: true,
      minWidth: 150,
    },
    {
      headerName: "Created At",
      field: "created_at",
      sortable: true,
      filter: "agDateColumnFilter",
      minWidth: 200,
      sort: "desc",
      cellRenderer: (row: any) => {
        return moment(moment(row.data.created_at).utc())
          .local()
          .format("MM-DD-YYYY hh:mm a");
      },
    },
    {
      headerName: "Action",
      minWidth: 130,
      maxWidth: 140,
      field: "action",
      sortable: false,
      filter: false,

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

  // const onGridReady = (params: GridReadyEvent) => {
  //   const datasource = createServerSideDatasource(
  //     dispatch,
  //     getCenterData,
  //     setDataSource,
  //     setParams
  //   );
  //   params.api.setServerSideDatasource(datasource);
  // };
  const handleOpenForm = () => {
    setInputForm(init_input_state);

    setOrgAutoComplete({
      value: {},
      input: "",
    });
    setSubAutoComplete({
      value: {},
      input: "",
    });

    setAutoComplete({
      value: {},
      input: "",
    });
    setIsEdit(false);
    handleClickOpen();
    setInputForm({
      id: "",
      sub_discipline_id: "",
      organization_id: "",
      discipline_id: "",
      name: "",
      short_name: "",
      website: "",
    });
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

  const textFieldProps = {
    value: searchQuery,
    onChange: onFilterTextBoxChanged1,
  };
  const buttonProps = {
    children: "Add Center",
    onClick: handleOpenForm,
    sm: "Add",
  };

  return (
    <main>
      <header className="header">Center</header>
      <GridHeader2 textFieldProps={textFieldProps} buttonProps={buttonProps} />

      <ServerSideGrid
        rowDataUrl="/center/"
        debouncedSearchQuery={searchQuery}
        columnDefs={transactionDefs}
        gridApi={gridApi}
        columnApi={columnApi}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
      />

      <Dialog open={open}>
        <div className="popup_box">
          <DialogTitle className=" flex justify-between bg-sky-800 text-white p-3">
            {/* {props.edit ? "Update" : "Add"} */}
            <div>{isEdit ? "Update Center" : "Add Center"}</div>
            <div>
              <AiOutlineClose onClick={handleClose} />
            </div>

            {/* Centers */}
            {/* <Divider /> */}
          </DialogTitle>
          <DialogContent>
            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Discipline Name
              </label>
              <Autocomplete
                disablePortal
                disableClearable={true}
                options={disciplineName.length ? disciplineName : []}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.name === value
                }
                getOptionLabel={(sub: any) =>
                  sub.name === undefined ? "" : sub.name
                }
                sx={{ width: "100%" }}
                value={autoComplete.value}
                onChange={(_: any, newValue: any) => {
                  setAutoComplete({
                    ...autoComplete,
                    value: {
                      discipline_id: newValue?.id || "",
                      name: newValue.name,
                    },
                  });
                  // setOrgAutoComplete({
                  //   value: {},
                  //   input: "",
                  // });
                  setSubAutoComplete({
                    value: {},
                    input: "",
                  });
                  setInputForm({
                    ...inputForm,
                    discipline_id: newValue?.id || "",
                  });
                }}
                inputValue={autoComplete.input}
                onInputChange={(event, newInputValue) => {
                  setAutoComplete({ ...autoComplete, input: newInputValue });
                }}
                renderInput={(params: any) => {
                  return <TextField {...params} size={"small"} />;
                }}
              />
            </div>
            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Sub Discipline Name
              </label>
              <Autocomplete
                disableClearable={true}
                disablePortal
                options={getSubDisciplineByDiscipline(
                  inputForm?.discipline_id || ""
                )}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.name === value
                }
                getOptionLabel={(sub: any) =>
                  sub.name === undefined ? "" : sub.name
                }
                sx={{ width: "100%" }}
                value={subAutoComplete.value}
                onChange={(_: any, newValue: any) => {
                  setSubAutoComplete({
                    ...subAutoComplete,
                    value: {
                      sub_discipline_id: newValue?.id || "",
                      name: newValue.name,
                    },
                  });
                  setInputForm({
                    ...inputForm,
                    sub_discipline_id: newValue.id,
                  });
                }}
                inputValue={subAutoComplete.input}
                onInputChange={(event, newInputValue) => {
                  setSubAutoComplete({
                    ...subAutoComplete,
                    input: newInputValue,
                  });
                }}
                renderInput={(params: any) => {
                  return <TextField {...params} size={"small"} />;
                }}
              />
            </div>

            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Organization Name
              </label>

              <Autocomplete
                disablePortal
                disableClearable={true}
                options={organizationName?.length ? organizationName : []}
                getOptionLabel={(org: any) =>
                  org.name === undefined ? "" : org.name
                }
                sx={{ width: "100%" }}
                value={orgAutoComplete.value}
                onChange={(_: any, newValue: any) => {
                  setOrgAutoComplete({
                    ...orgAutoComplete,
                    value: {
                      organization_id: newValue.id,
                      name: newValue.name,
                    },
                  });
                  setInputForm({
                    ...inputForm,
                    organization_id: newValue.id,
                  });
                }}
                inputValue={orgAutoComplete.input}
                onInputChange={(event, newInputValue) => {
                  setOrgAutoComplete({
                    ...orgAutoComplete,
                    input: newInputValue,
                  });
                }}
                renderInput={(params: any) => {
                  return <TextField {...params} size={"small"} />;
                }}
              />
            </div>
            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Center Name
              </label>

              <input
                className="Input-Box"
                type="text"
                placeholder="Enter Center Name"
                name="name"
                value={inputForm.name}
                onChange={handleChange}
              />
            </div>
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
            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Short Name
              </label>

              <input
                className="Input-Box"
                type="text"
                placeholder="Enter Short Name"
                name="short_name"
                value={inputForm.short_name}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Website Url
              </label>

              <input
                className="Input-Box"
                type="url"
                placeholder="Enter Website"
                name="website"
                value={inputForm.website}
                onChange={handleChange}
              />
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
                disabled={validateInputState(inputForm) ? false : true}
                // onClick={() => {
                //

                //   addSubDiscipline(inputForm);
                // }}
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

export default Center;
