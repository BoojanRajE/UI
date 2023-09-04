import {
  Input,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  CircularProgress,
} from "@mui/material";
import {
  ColumnApi,
  Environment,
  GridApi,
  ICellRendererParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { MdModeEdit, MdDelete, MdEdit } from "react-icons/md";
import { ServerSideGrid } from "../../utils/MasterGrid/ServerSideGrid";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function Support() {
  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();
  const [gridApi1, setGridApi1] = useState<GridApi>();
  const [columnApi1, setColumnApi1] = useState<ColumnApi>();
  const [gridApi2, setGridApi2] = useState<GridApi>();
  const [columnApi2, setColumnApi2] = useState<ColumnApi>();
  const [loading, setLoading] = useState(true);

  //setTimeout(() => setLoading(false), 400);
  const [newReportRowData, setNewReportRowData] = useState([]);
  const [openReportRowData, setOpenReportRowData] = useState([]);
  const [resolvedReportRowData, setResolvedReportRowData] = useState([]);

  const navigate = useNavigate();

  const getReportsByStatus = async (status: string) => {
    try {
      const url = `${process.env.REACT_APP_BASE_URL}/api/helpcenter?status=${status}`;

      const res = await axios({
        method: "get",
        url,
        headers: {
          authorization: localStorage.getItem("token")
            ? `Bearer ${JSON.parse(localStorage.getItem("token") || "{}")}`
            : "",
          "Content-Type": "application/json",
        },
      });

      return { [status]: res?.data?.data || null };
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const status = ["new", "open", "resolved"];
    console.log("Environment", process.env.NODE_ENV);
    Promise.allSettled(status.map((s) => getReportsByStatus(s))).then(
      (result) => {
        result.forEach((e: any) => {
          const { status, value } = e;
          if (status !== "fulfilled") return;
          if (value?.new) {
            setNewReportRowData(value?.new || []);
          }
          if (value?.open) {
            setOpenReportRowData(value?.open || []);
          }
          if (value?.resolved) {
            setResolvedReportRowData(value?.resolved || []);
          }
        });
        setLoading(false);
      }
    );
    // setNewReportRowData(newReports)
  }, []);

  const newReportColumnDefs = [
    {
      headerName: "Submitted",
      field: "created_at",
      // minWidth: 250,
      // maxWidth: 400,
      cellRenderer: (row: any) => {
        return moment(moment(row.data.created_at).utc())
          .local()
          .format("MM-DD-YYYY hh:mm a");
      },
    },
    {
      headerName: "Ref #	",
      field: "id",
      // minWidth: 300,
      // maxWidth: 400,
    },

    {
      headerName: "Message",
      field: "description",
      // minWidth: 300,
      // maxWidth: 400,
    },
    {
      headerName: "Action",
      field: "action",
      // minWidth: 300,
      // maxWidth: 400,
      sortable: false,
      filter: false,

      cellRenderer: (row: ICellRendererParams) => {
        return (
          <>
            {/* <IconButton>
              <MdEdit className="text-edit-icon" />
            </IconButton> */}
            {/* <Button style={{ textTransform: "capitalize" }}>View</Button> */}
            <Button
              style={{ textTransform: "capitalize" }}
              onClick={() => {
                navigate("/newreports", { state: row.data });
              }}
            >
              View
            </Button>
            {/* <IconButton
              onClick={() => {
                ""
                // dispatch(deleteDisciplineData(row.data.id, gridApi));
              }}
            >
              <MdDelete className="text-delete-icon" />
            </IconButton> */}
          </>
        );
      },
    },
  ];
  const openReportColumnDefs: any = [
    {
      headerName: "Submitted",
      field: "created_at",
      // minWidth: 250,
      // maxWidth: 400,
      cellRenderer: (row: any) => {
        return moment(moment(row.data.created_at).utc())
          .local()
          .format("MM-DD-YYYY hh:mm a");
      },
    },
    // {
    //   headerName: "Updated",
    //   field: "created_at",
    //   // minWidth: 250,
    //   // maxWidth: 400,
    //   cellRendererFramework: (row: any) => {
    //     return moment(moment(row.data.created_at).utc())
    //       .local()
    //       .format("MM-DD-YYYY hh:mm a");
    //   },
    // },

    // {
    //   headerName: "Issue Type	",
    //   field: "",
    // },
    {
      headerName: "Topic/Module	",
      field: "module",
    },
    {
      headerName: "Title",
      field: "title",
    },
    {
      headerName: "Action",
      field: "action",
      // minWidth: 300,
      // maxWidth: 400,
      sortable: false,
      filter: false,

      cellRenderer: (row: ICellRendererParams) => {
        return (
          <>
            <Button
              style={{ textTransform: "capitalize" }}
              onClick={() => {
                navigate("/openrequest", { state: row.data });
              }}
            >
              View
            </Button>
          </>
        );
      },
    },
  ];
  const resolvedColumnDefs: any = [
    {
      headerName: "Submitted",
      field: "created_at",
      // minWidth: 250,
      // maxWidth: 400,
      cellRenderer: (row: any) => {
        return moment(moment(row.data.created_at).utc())
          .local()
          .format("MM-DD-YYYY hh:mm a");
      },
      filter: "agDateColumnFilter",
    },
    // {
    //   headerName: "Updated",
    //   field: "created_at",
    //   // minWidth: 250,
    //   // maxWidth: 400,
    //   cellRendererFramework: (row: any) => {
    //     return moment(moment(row.data.created_at).utc())
    //       .local()
    //       .format("MM-DD-YYYY hh:mm a");
    //   },
    // },
    // {
    //   headerName: "Issue Type	",
    //   field: "",
    // },
    {
      headerName: "Topic/Module	",
      field: "module",
    },
    {
      headerName: "Title",
      field: "title",
    },
    {
      headerName: "Action",
      field: "action",
      // minWidth: 300,
      // maxWidth: 400,
      sortable: false,
      filter: false,

      cellRenderer: (row: ICellRendererParams) => {
        return (
          <>
            <Button
              style={{ textTransform: "capitalize" }}
              onClick={() => {
                navigate("/featurecenter", { state: row.data });
              }}
            >
              View
            </Button>
          </>
        );
      },
    },
  ];

  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
    pagination: true,
    flex: 1,
    minWidth: 150,
  };
  return (
    <div>
      <div
        className="text-center flex justify-center items-center h-screen"
        style={loading ? {} : { display: "none" }}
      >
        <CircularProgress />
      </div>
      <div style={loading ? { display: "none" } : {}}>
        <h1 className="text-3xl font-large p-2">Support</h1>
        <section
          id="support"
          className="border-2 border-slate-300 rounded-xl mt-4 mb-4 mr-4 ml-4"
        >
          <p className="text-xl font-medium p-2">New Reports</p>

          <div
            className="ag-theme-alpine h-420 p-1 pt-0 mt-3"
            style={{ width: "100%" }}
          >
            <ServerSideGrid
              rowDataUrl="/helpcenter?status=new"
              columnDefs={newReportColumnDefs}
              gridApi={gridApi}
              columnApi={columnApi}
              setGridApi={setGridApi}
              setColumnApi={setColumnApi}
            />
          </div>
        </section>
        <section
          id="support"
          className="border-2 border-slate-300 rounded-xl mt-4 mb-4 mr-4 ml-4"
        >
          <p className="text-xl font-medium p-2">
            Open Requests/Support/Trouble Reports
          </p>

          <div
            className="ag-theme-alpine h-420 p-1 pt-0 mt-3"
            style={{ width: "100%" }}
          >
            <ServerSideGrid
              rowDataUrl="/helpcenter?status=open"
              columnDefs={openReportColumnDefs}
              gridApi={gridApi1}
              columnApi={columnApi1}
              setGridApi={setGridApi1}
              setColumnApi={setColumnApi1}
            />
          </div>
        </section>
        <section
          id="support"
          className="border-2 border-slate-300 rounded-xl mt-4 mb-4 mr-4 ml-4"
        >
          <p className="text-xl font-medium p-2">
            Resolved Requests/Support/Trouble Reports
          </p>
          <div
            className="ag-theme-alpine h-420 p-1 pt-0 mt-3"
            style={{ width: "100%" }}
          >
            <ServerSideGrid
              rowDataUrl="/helpcenter?status=resolved"
              columnDefs={resolvedColumnDefs}
              gridApi={gridApi2}
              columnApi={columnApi2}
              setGridApi={setGridApi2}
              setColumnApi={setColumnApi2}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Support;
