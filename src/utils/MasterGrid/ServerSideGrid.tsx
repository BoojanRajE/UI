import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, ColumnApi, GetRowIdParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ServerSideGridProps } from '../interfaces/ServerSideGridProps';
import api from '../../reduxStore/route';
export function ServerSideGrid({
  rowDataUrl,
  columnDefs,
  debouncedSearchQuery,
  gridApi,
  columnApi,
  setGridApi,
  setColumnApi,
  ...props
}: ServerSideGridProps) {
  const getRowId = (params: GetRowIdParams) => params.data.id;
  const [render, setRender] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      gridApi?.setServerSideDatasource({
        getRows: (params) => {
          const queryParams = {
            searchQuery: debouncedSearchQuery,
            ...params.request,
          };
          //
          api
            .get(rowDataUrl, { params: queryParams })
            .then((res: any) => {
              if (res?.data) {
                const { records, totCount } = res?.data;
                if (!records?.length) {
                  params.api.showNoRowsOverlay();
                } else {
                  params.api.hideOverlay();
                }
                params.success({
                  rowData: records,
                  rowCount: totCount || 0,
                });
              }
            })
            .catch((err: any) => {
              params.success({
                rowData: [],
                rowCount: 0,
              });
            });
        },
      });
    };
    if (gridApi && columnApi) {
      fetchData();
    }
  }, [gridApi, columnApi, rowDataUrl, debouncedSearchQuery, render]);
  const onGridReady = (params: { api: GridApi; columnApi: ColumnApi }) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };
  const onFilterChanged = () => {
    setRender(render + 1);
  };
  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: 'agTextColumnFilter',
    pagination: true,
    flex: 1,
    minWidth: 150,
    filterParams: {
      trimInput: true,
      suppressAndOrCondition: true,
      buttons: ['reset', 'clear'],
    },
    suppressDragLeaveHidesColumns: false,
  };
  //
  return (
    <div className="ag-theme-alpine w-full h-[78vh] p-1 mb-14">
      {' '}
      {/* <Button variant="contained" onClick={applyTransaction}>Add</Button> */}
      <AgGridReact
        getRowId={getRowId}
        columnDefs={columnDefs}
        rowModelType={'serverSide'}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onFilterChanged={onFilterChanged}
        suppressServerSideInfiniteScroll={false}
        animateRows={true}
        pagination={true}
        paginationPageSize={25}
        cacheBlockSize={50}
        rowSelection="single"
        overlayNoRowsTemplate="No rows to show"
        // domLayout={'autoHeight'}
        {...props}
        {...props?.gridOptions}
        suppressDragLeaveHidesColumns={true}
        // rowBuffer={rowBuffer}
        // cacheBlockSize={cacheBlockSize}
      />{' '}
    </div>
  );
}
