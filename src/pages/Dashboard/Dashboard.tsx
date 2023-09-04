import React, { useEffect, useState, useMemo } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import {
  AgChartOptions,
  AgHistogramSeriesTooltipRendererParams,
} from 'ag-charts-community';
import { Grid } from '@mui/material';
// import ChartExample from './Chart';
import { Organization } from '../organisation/OrganizationForm';
import { AppDispatch } from '../../reduxStore/Store';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDashboardData,
  getOrganizationCountBasedOnStatus,
  getUsersCountBasedOnYear,
} from '../../reduxStore/reducer/dashboardReducer';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Link } from 'react-router-dom';
import PieChart from './PieChart';
import FacultyDashboard from './FacultyDashboard/FacultyDashboard';
import { getUserById } from '../../reduxStore/reducer/registerReducer';
import ChartExample from './Chart';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const getUserDataAndType = useSelector(
    (state: any) => state.register.getUserById
  );

  const data = {
    // define your properties here
  };
  useEffect(() => {
    dispatch(
      getUserById({
        id: `${JSON.parse(localStorage.getItem('token') || '{}')}`,
      })
    );
    // pass the `data` object as an argument
    // dispatch(getSubDisciplineAction());
  }, [dispatch]);

  const formatNumber = (value: number) => {
    // Implement your number formatting logic here
    return value.toString();
  };

  const [orgCount, setOrgCount] = useState(null);
  const [course, setCourse] = useState(null);
  const [student, setStudent] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [users, setUsers] = useState(null);

  const [usersCount, setUsersCount] = useState<any[]>();

  const [options, setOptions] = useState<AgChartOptions>({
    autoSize: true,
    data: [],
    title: {
      text: 'Registered Users Count',
      fontSize: 18,
      spacing: 25,
    },
    footnote: {
      text: 'Users',
    },
    series: [
      {
        type: 'column',
        xKey: 'month',
        yKey: 'count',
        fill: '#0084e7',
        strokeWidth: 0,
        shadow: {
          xOffset: 3,
        },
        label: {
          enabled: true,
          color: '#eeeeee',
          formatter: ({ value }: { value: number }) => formatNumber(value),
        },
        tooltip: {
          renderer: (params: AgHistogramSeriesTooltipRendererParams) => {
            const { yValue, xValue } = params;
            return { title: xValue, content: formatNumber(yValue) };
          },
        },
      },
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: 'Year',
        },
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Total Users',
        },
        label: {
          formatter: ({ value }: { value: number }) => formatNumber(value),
        },
      },
    ],
    legend: {
      enabled: false,
    },
  });

  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    dispatch(
      getDashboardData(
        setOrgCount,
        setCourse,
        setStudent,
        setAssessment,
        setUsers
      )
    );
    dispatch(getUsersCountBasedOnYear(options, setOptions));
    dispatch(getOrganizationCountBasedOnStatus(setCardsData));
  }, [dispatch]);

  // useEffect(() => {

  // }, [dispatch]);

  const gridStyle = useMemo(() => ({ height: '300px', width: '100%' }), []);

  // useEffect(() => {
  //   dispatch(getDashboardData(setOrgCount, setCourse, setStudent));
  // }, []);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: 'Name' },
    { field: 'Usage' },
    { field: 'Type' },
    { field: 'Activity' },
    { field: 'total' },
  ]);

  return (
    <>
      {' '}
      <header className="header">Dashboard</header>
      {getUserDataAndType?.data?.type === 'admin' && (
        <section className="text-gray-600 body-font">
          <div className="container  py-10 mx-auto">
            <div className="flex flex-wrap ">
              <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
              />
              <div className="lg:w-1/5 md:w-1/2 p-4 w-full">
                <div className="mt-4">
                  <Link to="/course">
                    <div className="block relative h-32 rounded overflow-hidden bg-gradient-to-r from-blue-900 to-blue-200 text-white animate__animated animate__bounce shadow">
                      <h2 className="text-gray-100 title-font text-base font-bold p-4">
                        Course Count
                      </h2>
                      <p className="text-black text-2xl font-bold flex items-center justify-center ">
                        {course}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="lg:w-1/5 md:w-1/2 p-4 w-full">
                <div className="mt-4">
                  <Link to="/organization">
                    <div className="block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#2eb85c] to-green-300 text-white animate__animated animate__bounce ">
                      <h2 className="text-gray-100 title-font text-base font-bold p-4">
                        Organization Count{' '}
                      </h2>
                      <p className="text-black text-2xl font-bold flex items-center justify-center ">
                        {orgCount}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/5 md:w-1/2 p-4 w-full">
                <div className="mt-4">
                  {/* <Link to="/course"> */}
                  <div className="block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#f9b115] to-orange-300 text-white animate__animated animate__bounce">
                    <h2 className="text-gray-100 title-font text-base font-bold p-4">
                      Student Count{' '}
                    </h2>
                    <p className="text-black text-2xl font-bold flex items-center justify-center ">
                      {student}
                    </p>
                  </div>
                  {/* </Link> */}
                </div>
              </div>
              <div className="lg:w-1/5 md:w-1/2 p-4 w-full">
                <div className="mt-4">
                  <Link to="/assessment">
                    <div className="block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#e55353] to-red-300 text-white animate__animated animate__bounce">
                      <h2 className="text-gray-100 title-font text-base font-bold p-4">
                        Assessment Count
                      </h2>
                      <p className="text-black text-2xl font-bold flex items-center justify-center ">
                        {assessment}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/5 md:w-1/2 p-4 w-full">
                <div className="mt-4">
                  <Link to="/users">
                    <div className="block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#39f] to-blue-300 text-white animate__animated animate__bounce">
                      <h2 className="text-gray-100 title-font text-base font-bold p-4">
                        Users Count{' '}
                      </h2>
                      <p className="text-black text-2xl font-bold flex items-center justify-center ">
                        {users}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
              <div
                className="lg:w-1/2 md:w-1/2 p-4 w-full"
                style={{ height: '500px' }}
              >
                <AgChartsReact options={options} />
              </div>
              <div
                className="lg:w-1/2 md:w-1/2 p-4 w-full"
                style={{ height: '420px' }}
              >
                <PieChart />
              </div>
              <div
                className="lg:w-full md:w-1/2 p-4 w-full"
                // style={{ overflowX: 'auto' }}
              >
                <div className="flex flex-nowrap">
                  {cardsData.map((d: any) => (
                    <>
                      <div className="mx-auto mt-11 w-1/5">
                        {/* <h2 className="text-2xl font-bold">{d.name}</h2> */}
                        <div className="block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#39f] to-blue-300 text-white animate__animated animate__bounce shadow">
                          {' '}
                          <h2 className="text-gray-100 title-font text-3xl font-bold p-4">
                            {d.name}
                          </h2>
                        </div>

                        <div className="p-4 shadow-md ">
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-evenly',
                              alignItems: 'center', // Added to vertically align the content
                              gap: '10px', // Added to create some spacing between the text and the line
                            }}
                          >
                            <div>
                              <span
                                style={{ fontSize: '25px', fontWeight: 'bold' }}
                              >
                                Users
                              </span>{' '}
                              <br />
                              <span
                                style={{ fontSize: '23px', marginLeft: '22px' }}
                              >
                                {d.userOrganizationCount}
                              </span>
                            </div>
                            <div
                              style={{
                                borderLeft: '1px solid black', // Added to create a vertical line
                                height: '50px', // Adjust the height of the line as needed
                              }}
                            />
                            <div>
                              <span
                                style={{ fontSize: '25px', fontWeight: 'bold' }}
                              >
                                Course
                              </span>{' '}
                              <br />
                              <span
                                style={{ fontSize: '23px', marginLeft: '22px' }}
                              >
                                {d.courseCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>

              <div
                className="lg:w-full md:w-1/2 p-4 w-full"
                style={{ height: '500px' }}
              >
                <ChartExample />
              </div>
            </div>
          </div>
        </section>
      )}
      {getUserDataAndType?.data?.type === 'faculty' && (
        <div>
          <FacultyDashboard />
        </div>
      )}
      {/* <div id="container">
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact columnDefs={columnDefs}></AgGridReact>
        </div>
      </div> */}
    </>
  );
};

export default Dashboard;
