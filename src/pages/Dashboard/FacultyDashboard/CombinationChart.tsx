import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AgChartsReact } from 'ag-charts-react';
import { AgChart, AgChartOptions } from 'ag-charts-community';
import { getData } from './CombinationChartData';
import { useDispatch } from 'react-redux';
import { getAdministrationCountBasedOnStatus } from '../../../reduxStore/reducer/dashboardReducer';
import { AppDispatch } from '../../../reduxStore/Store';

const CombinationChart = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAdministrationCountBasedOnStatus(chartData, setChartData));
  }, [dispatch]);
  const [chartData, setChartData] = useState([]);

  return (
    <AgChartsReact
      options={{
        autoSize: true,
        data: chartData,
        theme: {
          palette: {
            fills: ['#c16068', '#a2bf8a', '#80a0c3'],
            strokes: ['#c16068', '#a2bf8a', '#80a0c3'],
          },
          overrides: {
            column: { series: { strokeWidth: 0 } },
            line: { series: { strokeWidth: 5, marker: { enabled: false } } },
          },
        },
        title: {
          text: 'Student and course count',
          fontSize: 18,
          spacing: 25,
        },

        series: [
          {
            type: 'column',
            xKey: 'month',
            yKey: 'course_count',
            yName: 'Course Count',
          },
          {
            type: 'column',
            xKey: 'month',
            yKey: 'course_students_count',
            yName: 'Student Count',
          },
          {
            type: 'column',
            xKey: 'month',
            yKey: 'course_assessment_count',
            yName: 'Assessment Count',
          },
          // {
          //   type: 'line',
          //   xKey: 'month',
          //   yKey: 'course_administration_count',
          //   yName: 'Administration Count',
          // },
        ],
        axes: [
          {
            type: 'category',
            position: 'bottom',
          },
          {
            type: 'number',
            position: 'left',
            keys: [
              'course_count',
              'course_students_count',
              'course_administration_count',
            ],
            title: {
              text: 'Student and course count',
            },
            label: {
              formatter: (params) => {
                return params.value;
              },
            },
          },
          {
            type: 'number',
            position: 'right',
            keys: ['course_administration_count'],
            // title: {
            //   text: 'Student Count',
            // },
            label: {
              formatter: (params) => {
                return params.value;
              },
            },
          },
        ],
        legend: {
          position: 'bottom',
          item: {
            marker: {
              shape: 'square',
              strokeWidth: 0,
            },
          },
        },
      }}
    />
  );
};

export default CombinationChart;
