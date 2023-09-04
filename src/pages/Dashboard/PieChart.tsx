import React, { useState, useEffect } from 'react';
// import { createRoot } from 'react-dom/client';
import { AgChartsReact } from 'ag-charts-react';
import { AgChart, AgChartOptions } from 'ag-charts-community';
import { getData } from './PieChartData';
import { getAssessmentCountBasedOnStatus } from '../../reduxStore/reducer/dashboardReducer';
import { AppDispatch } from '../../reduxStore/Store';
import { useDispatch } from 'react-redux';

const PieChart = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAssessmentCountBasedOnStatus(options, setOptions));
  }, [dispatch]);

  const [options, setOptions] = useState<AgChartOptions>({
    autoSize: true,
    data: [],
    // title: {
    //   text: 'Assessment Status',
    //   fontSize: 18,
    //   spacing: 25,
    // },
    // footnote: {
    //   text: 'Source: Home Office',
    // },
    series: [
      {
        type: 'pie',
        calloutLabelKey: 'type',
        fillOpacity: 0.9,
        strokeWidth: 0,
        angleKey: 'count',
        sectorLabelKey: 'count',
        calloutLabel: {
          enabled: false,
        },
        sectorLabel: {
          color: 'white',
          fontWeight: 'bold',
          formatter: ({ datum, sectorLabelKey }) => {
            const value = datum[sectorLabelKey!];
            return numFormatter.format(value);
          },
        },
        title: {
          text: 'Assessment Status',
          fontSize: 18,
        },
        fills: [
          '#fb7451',
          '#f4b944',
          '#57cc8b',
          '#49afda',
          '#3988dc',
          '#72508c',
          '#b499b5',
          '#b7b5ba',
        ],
        innerRadiusRatio: 0.5,
        // innerLabels: [
        //   {
        //     text: numFormatter.format(total),
        //     fontSize: 24,
        //     fontWeight: 'bold',
        //   },
        //   {
        //     text: 'Total',
        //     fontSize: 16,
        //   },
        // ],
        highlightStyle: {
          item: {
            fillOpacity: 0,
            stroke: '#535455',
            strokeWidth: 1,
          },
        },
        tooltip: {
          renderer: ({ datum, calloutLabelKey, title, sectorLabelKey }) => {
            return {
              title,
              content: `${datum[calloutLabelKey!]}: ${numFormatter.format(
                datum[sectorLabelKey!]
              )}`,
            };
          },
        },
      },
    ],
  });

  return <AgChartsReact options={options} />;
};

// const data = getData();
const numFormatter = new Intl.NumberFormat('en-US');
// const total = data.reduce((sum, d) => sum + d['count'], 0);

// const root = createRoot(document.getElementById('root')!);
// root.render(<PieChart />);
export default PieChart;
