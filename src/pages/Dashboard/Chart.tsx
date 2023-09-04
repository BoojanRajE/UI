import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './styles.css';
import {
  AgChartThemeOverrides,
  ChartCreated,
  ChartToolPanelName,
  ColDef,
  CreateRangeChartParams,
  FirstDataRenderedEvent,
} from 'ag-grid-community';
import { getUsersStudentCountBasedOnYear } from '../../reduxStore/reducer/dashboardReducer';
import { AppDispatch } from '../../reduxStore/Store';
import { useDispatch } from 'react-redux';

var chartId: string | undefined;

const ChartExample = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUsersStudentCountBasedOnYear(setRowData));
  }, [dispatch]);

  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const [loading, setLoading] = useState(true); // Loading state
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: 'Month', field: 'month', chartDataType: 'category' },
    {
      headerName: 'Admin Count',
      field: 'admin_count',
      chartDataType: 'series',
    },
    {
      headerName: 'Student Count',
      field: 'student_count',
      chartDataType: 'series',
    },
    {
      headerName: 'Faculty Count',
      field: 'faculty_count',
      chartDataType: 'series',
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
    };
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);
  const chartThemeOverrides = useMemo<AgChartThemeOverrides>(() => {
    return {
      cartesian: {
        axes: {
          category: {
            label: {
              rotation: 335,
            },
          },
        },
      },
    };
  }, []);

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    setLoading(false); // Turn off loading state when data is rendered
    const createRangeChartParams: CreateRangeChartParams = {
      cellRange: {
        columns: ['month', 'admin_count', 'student_count', 'faculty_count'],
      },
      chartType: 'groupedColumn',
      chartContainer: document.querySelector('#myChart') as any,
    };
    gridRef.current!.api.createRangeChart(createRangeChartParams);
  }, []);

  const onChartCreated = useCallback((event: ChartCreated) => {
    chartId = event.chartId;
  }, []);

  const openChartToolPanel = useCallback(
    (panel?: ChartToolPanelName) => {
      if (!chartId) {
        return;
      }
      gridRef.current!.api.openChartToolPanel({
        chartId,
        panel,
      });
    },
    [chartId]
  );

  const closeChartToolPanel = useCallback(() => {
    if (!chartId) {
      return;
    }
    gridRef.current!.api.closeChartToolPanel({ chartId });
  }, [chartId]);

  return (
    <div style={containerStyle}>
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className={loading ? 'hidden' : 'wrapper'}>
        <div id="myChart" style={{ height: '500px' }}></div>
        <div
          id="myGrid"
          style={{ height: '250px' }}
          className="ag-theme-alpine"
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableRangeSelection={true}
            popupParent={popupParent}
            enableCharts={true}
            chartThemeOverrides={chartThemeOverrides}
            onFirstDataRendered={onFirstDataRendered}
            onChartCreated={onChartCreated}
          ></AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default ChartExample;
