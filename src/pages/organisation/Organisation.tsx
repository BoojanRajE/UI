import React, { useState } from 'react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  deleteOrganizationData,
  getOrganisationDetail,
  getSearchData,
} from '../../reduxStore/reducer/organisationReducer';
import { useNavigate } from 'react-router';
import {
  ColumnApi,
  GridApi,
  ICellRendererParams,
  ServerSideTransaction,
} from 'ag-grid-community';
import moment from 'moment';
import { Actions } from '../../utils/gridMethod/Actions';
import { Organization } from './OrganizationForm';
import AddOrganisation from './AddOrganisation';
import GridHeader2 from '../../utils/gridHeader/GridHeader2';
import { ServerSideGrid } from '../../utils/MasterGrid/ServerSideGrid';
import debounce from 'lodash/debounce';
import {
  handleAddTransaction,
  handleDeleteTransaction,
  handleUpdateTransaction,
} from '../../utils/gridMethod/GridTransaction';
import { DialogProps } from '@mui/material';
function Organisation() {
  const navigate = useNavigate();

  //for changing the value on text field immediately
  const [searchQuery, setSearchQuery] = useState('');
  const [flag, setFlag] = useState(true);

  //Delays capturing, changing text on text field
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  //opens add org form
  const [openOrg, setOpenOrg] = React.useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [initialValues, setInitialValue] = useState<any>();
  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  let organizationDefs: any = [
    { headerName: 'Name', field: 'name', minWidth: 330 },
    { headerName: 'City', field: 'city' },
    { headerName: 'State', field: 'state', minWidth: 190 },
    { headerName: 'Country', field: 'country', minWidth: 270 },
    {
      headerName: 'Sector',
      field: 'sector',
      filter: false,
      sortable: false,
      maxWidth: 100,
      valueFormatter: (params: ICellRendererParams) => {
        switch (params.data.sector) {
          case '1':
            return 'Public';
          case '2':
            return 'Private';
          default:
            return '';
        }
      },
    },
    {
      headerName: 'Type',
      field: 'type',
      filter: false,
      minWidth: 240,
      valueFormatter: (params: ICellRendererParams) => {
        switch (params.data.type) {
          case '1':
            return 'Institution of Higher Education';
          case '2':
            return 'Government agency';
          case '3':
            return 'K-12 School';
          case '4':
            return 'Other non-profit organization';
          case '5':
            return 'Professional society';
          case '6':
            return 'For-profit enterprise';
          case '7':
            return 'Other';
          default:
            return '';
        }
      },
    },
    { headerName: 'Created By', field: 'created_by', minWidth: 180 },
    {
      headerName: 'Created At',
      field: 'created_at',
      filter: 'agDateColumnFilter',
      sort: 'desc',
      minWidth: 200,
      cellRenderer: (row: ICellRendererParams) => {
        return moment(moment(row.data.created_at).utc())
          .local()
          .format('MM-DD-YYYY hh:mm a');
      },
    },
    {
      headerName: 'Action',
      field: 'action',
      filter: false,
      sortable: false,
      minWidth: 130,
      maxWidth: 140,
      cellRenderer: Actions,
      cellRendererParams: (params: ICellRendererParams) => ({
        params,
        handleUpdate,
        handleDelete,
      }),
    },
  ];
  // React.useEffect(() => {
  //   setDebouncedSearchQuery(searchQuery);
  // }, [searchQuery]);
  const debounceSearch = debounce((value: string) => {
    setDebouncedSearchQuery(value);
  }, 500);
  const handleUpdate = (params: ICellRendererParams) => {
    getOrganisationDetail(
      params.data.id,
      setOpenOrg,
      setInitialValue,
      setIsEdit
    );
  };
  const handleDelete = (params: ICellRendererParams) => {
    if (gridApi)
      deleteOrganizationData(params.data.id, gridApi, handleDeleteTransaction);
  };
  const handleOpenForm = (scrollType: DialogProps['scroll']) => {
    setIsEdit(false);
    setInitialValue({
      id: '',
      name: '',
      city: '',
      state: null,
      country: null,
      sector: '1',
      type: '1',
      other_type_desc: '',
      ihe_classification: [],
      ug_full_time_enrollment: false,
      ug_part_time_enrollment: false,
      graduate_enrollment: false,
      is_active: true,
      created_by: '',
    });
    setOpenOrg(true);
    setScroll(scrollType);
  };
  const onFilterTextBoxChanged = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(e.target.value);
    const value = e.target.value;
    // debounceSearch(value);
  };
  const textFieldProps = {
    value: searchQuery,
    onChange: onFilterTextBoxChanged,
  };
  const buttonProps = {
    children: 'Add Organization',
    onClick: () => handleOpenForm('paper'),
    sm: 'Add',
  };
  return (
    <main>
      {' '}
      <header className="header">Organization</header>{' '}
      <GridHeader2 textFieldProps={textFieldProps} buttonProps={buttonProps} />{' '}
      <ServerSideGrid
        rowDataUrl="/organization/"
        debouncedSearchQuery={searchQuery}
        columnDefs={organizationDefs}
        gridApi={gridApi}
        columnApi={columnApi}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
      />{' '}
      {openOrg && gridApi && columnApi && (
        <AddOrganisation
          setOpen={setOpenOrg}
          gridApi={gridApi}
          columnApi={columnApi}
          isEdit={isEdit}
          editFormValues={initialValues}
          editFormSetValues={setInitialValue}
          scroll={scroll}
        />
      )}
    </main>
  );
}
export default Organisation;
