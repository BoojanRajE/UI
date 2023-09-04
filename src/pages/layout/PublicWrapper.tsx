import React from 'react';
import { Outlet, matchPath } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import SideBar from './SideBar';
import Box from '@mui/material/Box';
import BreadCrumb from '../../utils/BreadCrumb/BreadCrumb';
import { useLocation } from 'react-router';

const PublicWrapper = () => {
  const user = localStorage.getItem('token');
  const location = useLocation();
  // const pathnames:any = location.pathname.split("/").filter((x) => x);

  const pathConfig = [
    {
      pathname: '/home',
      label: 'Dashboard',
    },
    {
      pathname: '/discipline',
      label: 'Discipline',
    },
    {
      pathname: '/administration/:courseassessmentid',
      label: 'tEST',
    },

    {
      pathname: '/subdiscipline',
      label: 'Sub Discipline',
    },
    {
      pathname: '/myaccount',
      label: 'My Account',
    },
    {
      pathname: '/organization',
      label: 'Organization',
    },
    {
      pathname: '/addorganization',
      label: 'Add Organization',
    },
    {
      pathname: '/editorganization',
      label: 'Edit Organization',
    },
    {
      pathname: '/centers',
      label: 'Center',
    },
    {
      pathname: '/college',
      label: 'College',
    },
    {
      pathname: '/users',
      label: 'Users',
    },
    // {
    //   pathname: '/users',
    //   label: 'Users',
    // },
    // {
    //   pathname: '/users',
    //   label: 'Users',
    // },
    // {
    //   pathname: '/users',
    //   label: 'Users',
    // },
    // {
    //   parent: {
    //     pathname: "/department",
    //     label: "Unit",
    //   },
    //   pathname: "/department",
    //   label: "Department",
    // },
    // {
    //   pathname: '/users',
    //   label: 'Users',
    // },
    // {
    //   parent: {
    //     pathname: "/department",
    //     label: "Unit",
    //   },
    //   pathname: "/department",
    //   label: "Department",
    // },
    {
      pathname: '/department',
      label: 'Department',
    },

    {
      pathname: '/program',
      label: 'Program',
    },
    {
      pathname: '/likert',
      label: 'Likert',
    },
    // {
    //   parent: {
    //     pathname: "/department",
    //     label: "Unit",
    //   },
    //   pathname: "/department",
    //   label: "Department",
    // },
    {
      pathname: '/administrative',
      label: 'Administrative Office',
    },

    {
      parent: {
        pathname: '/course',
        label: 'Course',
      },
      pathname: '/administration/:courseassessmentid/:courseid',
      label: 'administraion',
    },
    {
      pathname: '/unitroles',
      label: 'Unit Roles',
    },
    {
      pathname: '/activated/userOrganization/:id',
      label: 'Affiliation',
    },
    // {
    //   parent: {
    //     pathname: "/course",
    //     label: "Course",
    //   },
    //   pathname: "/administration/:courseassessmentid/:courseid",
    //   label: "administraion",
    // },
    {
      pathname: '/course',
      label: 'Course',
    },
    {
      pathname: '/addstudent',
      label: 'Add Student',
    },
    {
      pathname: '/courseprefix',
      label: 'Course Prefix',
    },
    {
      pathname: '/coursedetails',
      label: 'Course Details',
    },
    {
      pathname: '/assessment',
      label: 'Assessment',
    },
    // {
    //   pathname: '/administration',
    //   label: 'Administration',
    // },
    {
      pathname: '/addcourse',
      label: 'Add Course',
    },
    {
      pathname: '/editcourse',
      label: 'Edit Course',
    },
    {
      pathname: '/question',
      label: 'Add Assessment',
    },
    {
      pathname: '/helpcenter',
      label: 'Help Center',
    },
    {
      pathname: '/openrequest',
      label: 'Open Request',
    },
    {
      pathname: '/newreports',
      label: 'New Reports',
    },
    {
      pathname: '/featurecenter',
      label: 'Feature Center',
    },
    {
      pathname: '/addstudent',
      label: 'Add Student',
    },
    {
      pathname: '/courseprefix',
      label: 'Course Prefix',
    },
    {
      pathname: '/coursedetails',
      label: 'Course Details',
    },

    {
      pathname: '/administration',
      label: 'Administration',
    },

    {
      pathname: '/q',
      label: 'Edit Assessment',
    },
    // {
    //   pathname: '/dashboard',
    //   label: 'Dashboard',
    // },
  ];

  const path = pathConfig.filter((item: any) =>
    matchPath({ path: item.pathname }, location.pathname)
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header />
          <div style={{ padding: '10px' }}>
            <Outlet />
          </div>
          {/* <div>
            <Footer />
          </div> */}
        </Box>
      </Box>
    </>
  );
};

export default PublicWrapper;
