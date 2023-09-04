import React, { useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './style.css';
import {
  AgChartThemeOverrides,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  Grid,
  GridApi,
  GridOptions,
} from 'ag-grid-community';
import { getData } from './data';

function createQuarterlySalesChart(gridApi: GridApi) {
  gridApi.createCrossFilterChart({
    chartType: 'column',
    cellRange: {
      columns: ['quarter', 'sale'],
    },
    aggFunc: 'sum',
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: 'Quarterly Sales ($)',
        },
        legend: {
          enabled: false,
        },
        axes: {
          category: {
            label: {
              rotation: 0,
            },
          },
          number: {
            label: {
              formatter: (params: any) => {
                return params.value / 1000 + 'k';
              },
            },
          },
        },
      },
    },
    chartContainer: document.querySelector('#columnChart') as any,
  });
}

function createSalesByRefChart(gridApi: GridApi) {
  gridApi.createCrossFilterChart({
    chartType: 'pie',
    cellRange: {
      columns: ['salesRep', 'sale'],
    },
    aggFunc: 'sum',
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: 'Sales by Representative ($)',
        },
      },
      pie: {
        series: {
          title: {
            enabled: false,
          },
          calloutLabel: {
            enabled: false,
          },
        },
      },
    },
    chartContainer: document.querySelector('#pieChart') as any,
  });
}

function createHandsetSalesChart(gridApi: GridApi) {
  gridApi.createCrossFilterChart({
    chartType: 'bar',
    cellRange: {
      columns: ['handset', 'sale'],
    },
    aggFunc: 'count',
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: 'Handsets Sold (Units)',
        },
        legend: {
          enabled: false,
        },
      },
    },
    chartContainer: document.querySelector('#barChart') as any,
  });
}

const ApplicationChart = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: 'salesRep', chartDataType: 'category' },
    { field: 'handset', chartDataType: 'category' },
    {
      headerName: 'Sale Price',
      field: 'sale',
      maxWidth: 160,
      aggFunc: 'sum',
      filter: 'agNumberColumnFilter',
      chartDataType: 'series',
    },
    { field: 'saleDate', chartDataType: 'category' },
    {
      field: 'quarter',
      maxWidth: 160,
      filter: 'agSetColumnFilter',
      chartDataType: 'category',
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      editable: true,
      sortable: true,
      filter: 'agMultiColumnFilter',
      floatingFilter: true,
      resizable: true,
    };
  }, []);
  const chartThemes = useMemo<string[]>(() => {
    return ['ag-default'];
  }, []);
  const chartThemeOverrides = useMemo<AgChartThemeOverrides>(() => {
    return {
      cartesian: {
        axes: {
          category: {
            label: {
              rotation: 0,
            },
          },
        },
      },
    };
  }, []);

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    createQuarterlySalesChart(params.api);
    createSalesByRefChart(params.api);
    createHandsetSalesChart(params.api);
  }, []);

  return (
    <div style={containerStyle}>
      <div id="wrapper">
        <div id="top">
          <div id="columnChart" className="ag-theme-alpine-dark"></div>
          <div id="pieChart" className="ag-theme-alpine-dark"></div>
        </div>
        <div id="barChart" className="ag-theme-alpine-dark"></div>

        <div style={gridStyle} className="ag-theme-alpine-dark">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableCharts={true}
            chartThemes={chartThemes}
            chartThemeOverrides={chartThemeOverrides}
            onFirstDataRendered={onFirstDataRendered}
          ></AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default ApplicationChart;
