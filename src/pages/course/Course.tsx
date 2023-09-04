import React, { useState } from 'react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AppDispatch } from '../../reduxStore/Store';
import { useDispatch } from 'react-redux';
import { Button, DialogProps, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router';
import {
  CellClickedEvent,
  ICellRendererParams,
  RowClickedEvent,
} from 'ag-grid-community';
import moment from 'moment';

import { Actions, ExtendedICellRendererParams } from './Actions';
import {
  deleteCourseData,
  getAssessmentByCourseId,
  getCourseDetail,
} from '../../reduxStore/reducer/courseReducer';
import { AiOutlineFileAdd } from 'react-icons/ai';

import AddAssessment from './AddAssessment';
import FileImport from '../courseDetails/FileImport';
import axios from 'axios';

import { ServerSideGrid } from '../../utils/MasterGrid/ServerSideGrid';
import GridHeader2 from '../../utils/gridHeader/GridHeader2';
import { useLocation, Link } from 'react-router-dom';

function Course() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [openAssessment, setOpenAssessment] = useState<boolean>(false);
  const [assessmentInitialValues, setAssessmentInitialValues] = useState<any>();
  const [search, setSearch] = useState('');
  const [courseId, setCourseId] = useState();
  const [gridApi, setGridApi] = useState<any>(null);
  const [masterGridparams, setMasterGridParams] = useState<any>(null);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const [searchQuery, setSearchQuery] = useState('');
  const [columnApi, setColumnApi] = useState<any>(null);

  const getCourseDetails = (
    row: ExtendedICellRendererParams,
    scrollType: DialogProps['scroll']
  ) => {
    getCourseDetail(row.data).then((data) => {
      setAssessmentInitialValues(data);
      setOpenAssessment(true);
      setScroll(scrollType);
    });
  };

  let courseDefs: any = [
    {
      headerName: 'Year',
      field: 'year',
      minWidth: 80,
      maxWidth: 90,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Term',
      field: 'term',
      minWidth: 90,
      maxWidth: 100,
      filter: 'agSetColumnFilter',
      filterParams: {
        values: ['Fall', 'Spring', 'Summer', 'Winter'],
      },
    },
    {
      headerName: 'Course',
      field: 'course_details_name',
      minWidth: 250,
      cellRenderer: 'agGroupCellRenderer',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Action',
      field: 'action',
      // headerClass: 'relative left-20',
      headerComponent: () => <div className="relative left-[44%]">Action</div>,
      filter: false,
      sortable: false,
      minWidth: 240,
      cellRenderer: Actions,
      cellRendererParams: (params: ICellRendererParams) => ({
        ...params,
        handleUpdate,
        handleDelete,
        handleCopy,
        getCourseDetails,
      }),
    },
    {
      headerName: 'Course Prefix',
      field: 'course_prefix_name',
      minWidth: 150,
      maxWidth: 160,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Course Number',
      field: 'number',
      // minWidth: 90,
      minWidth: 160,
      maxWidth: 170,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Organization',
      field: 'organization_name',
      minWidth: 250,
    },
    {
      headerName: 'Created By',
      field: 'created_by',
      hide: true,
    },
    {
      headerName: 'Created At',
      field: 'created_at',
      filter: 'agDateColumnFilter',
      cellRenderer: (row: ICellRendererParams) => {
        return moment(moment(row.data.created_at).utc())
          .local()
          .format('MM-DD-YYYY hh:mm a');
      },
      hide: true,
    },
  ];

  const handleUpdate = (data: any) => {
    getCourseDetail(data, navigate, '/editcourse');
  };

  const handleCopy = (data: any) => {
    getCourseDetail(data, navigate, '/addcourse');
  };

  const handleDelete = (data: any) => {
    dispatch(deleteCourseData(data, gridApi));
  };

  const onFilterTextBoxChanged = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(e.target.value);
  };

  const navigateToCourse = () => {
    navigate('/addcourse');
  };

  const [assessmentGrid, setAssessmentGrid] = useState({
    detailGridOptions: {
      columnDefs: [
        {
          headerName: 'Assessment',
          field: 'official_name',
          width: 353,
        },
        {
          headerName: 'Label',
          field: 'label',
          width: 353,
          // cellRenderer: ViewAdministration,
          // cellRendererParams: (params: ICellRendererParams) => ({
          //   params,
          // }),
        },
      ],
      // detailRowHeight: 400,
      defaultColDef: {
        suppressCopyRowsToClipboard: false,
        flex: 1,
        resizable: true,
        sortable: true,
        width: 100,
      },
      getContextMenuItems: (params: any) => null,
      onRowClicked: (e: RowClickedEvent) => {
        navigate(`/administration/${e.data.id}/${e.data.courseId}`);
      },
    },
    getDetailRowData: (params: any) => {
      getAssessmentByCourse(params);
    },
  });

  const getAssessmentByCourse = (params: any) => {
    setMasterGridParams(params);

    //getAssessmentByCourseId(params)

    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/course/get-assessment-by-course/${params.data.id}`
      )
      .then(
        (result) => {
          const output = result.data.records.map((e: any) => ({
            ...e,
            courseId: params.data.id,
          }));

          params.successCallback(output);
        },
        (error) => {
          params.successCallback([]);
        }
      );
  };

  const textFieldProps = {
    value: searchQuery,
    onChange: onFilterTextBoxChanged,
  };
  const buttonProps = {
    children: 'Add Course',
    onClick: navigateToCourse,
    sm: 'Add',
  };

  const gridOptions = {
    onCellClicked: (e: CellClickedEvent) => {
      if (e.colDef.headerName !== 'Action')
        e.node.setExpanded(!e.node.expanded);
    },
  };
  return (
    <main>
      <header className="header">Course</header>
      <GridHeader2 textFieldProps={textFieldProps} buttonProps={buttonProps} />

      <ServerSideGrid
        rowDataUrl="/course/"
        debouncedSearchQuery={searchQuery}
        columnDefs={courseDefs}
        gridApi={gridApi}
        columnApi={columnApi}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
        masterDetail
        detailRowHeight={325}
        detailCellRendererParams={assessmentGrid}
        gridOptions={gridOptions}
      />

      {assessmentInitialValues && (
        <AddAssessment
          openAssessment={openAssessment}
          setOpenAssessment={setOpenAssessment}
          assessmentInitialValues={assessmentInitialValues}
          params={masterGridparams}
          getAssessmentByCourse={getAssessmentByCourse}
          scroll={scroll}
        />
      )}
    </main>
  );
}

export default Course;

function ViewAdministration(row: any) {
  const navigate = useNavigate();

  const location = useLocation();

  //<Route path="/administration/:courseassessmentid" element={<Administration />} />
  return (
    <Link
      to={`/administration/${row.data.id}/${row.data.courseId}`}
      className="text-blue-700 underline"
    >
      {row.data.code}
    </Link>
    // <Link
    //   href=''
    //   // href={`/administration/${row.data.id}/${row.data.courseId}`}
    //   onClick={
    //     () => navigate(`/administration/${row.data.id}/${row.data.courseId}`)
    //   }
    // >
    //   {row.data.code}
    // </Link>
  );
}
