import AddCourse from '../pages/course/AddCourseDetails';
import StepperIndex from '../pages/register/stepper/Index';
import SetepperActivatedIndex from '../pages/register/activatedStepper/Index';
import SetepperActivatedAffiliateIndex from '../pages/MyAccount/activatedStepper/Index';
import SetepperIndex from '../pages/register/stepper/Index';
import Activate from '../pages/register/activate/Activate';
import ActivateAffiliate from '../pages/MyAccount/activate/Activate';
import Users from '../pages/users';
import Discipline from '../pages/discipline/Discipline';
import { Routes, Route, Outlet } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import PublicRoute from './PublicRoute';
import { Navigate } from 'react-router-dom';
import LoginComponent from '../pages/login/Login';
import Reset from '../pages/login/Reset';
import Home from '../pages/home/Home';
import Index from '../pages/layout/PrivateWrapper';
// import Center from '../pages/Centers/center';
import Organisation from '../pages/organisation/Organisation';
import AddOrganisation from '../pages/organisation/AddOrganisation';
import College from '../pages/college/College';
import Department from '../pages/department/Department';
import SubDiscipline from '../pages/discipline/SubDiscipline';
import Administrative from '../pages/administrative/Administrative';
import Program from '../pages/program/Program';
import Unitroles from '../pages/unitroles/Unitroles';
import MyAccount from '../pages/MyAccount/MyAccount';
import Center from '../pages/Center/Center';
import Org from '../pages/register/stepper/SecondStep';
import Org1 from '../pages/register/stepper/ThirdStep';
import AddStudent from '../pages/AddStudent/AddStudent';
import Course from '../pages/course/Course';
import Password from '../pages/login/Password';
import PasswordActivate from '../pages/register/activate/PasswordActivate';
import CourseAddAssestment from '../pages/Assessment/Index';
import CoursePrefix from '../pages/coursePrefix/CoursePrefix';
import CourseDetails from '../pages/courseDetails/CourseDetails';
// import AddAssessment from "../pages/Assessment/AddAssessmentz";
import AddEditCourse from '../pages/course/AddEditCourse';
import Administration from '../pages/Administration/Administration';
import { GetReport } from '../pages/Administration/GetReport';
// import Sendmail from '../pages/Administration/Sendmail';
import Likert from '../pages/Assessment/Likert';
import TakeAssessment from '../pages/Assessment/TakeAssessment';
import DemographicIndex from '../pages/Assessment/activatedStepper/Index';
import TakeAssessmentQuestion from '../pages/Assessment/TakeAssessmentQuestion';
import AddAssestment from '../pages/Assessment/AddAssessment';
import AssesmentQuestion from '../pages/Assessment/AssesmentQuestion';
import ViewAssessment from '../pages/Assessment/ViewAssessment';
import CourseRegisterIndex from '../pages/course/Register/Index';
import ViewTest from '../pages/Assessment/Test';
import OpenRequest from '../pages/MyAccount/Stepper/OpenRequest';
import HelpCenter from '../pages/MyAccount/Stepper/HelpCenter';
import FeatureRequest from '../pages/MyAccount/Stepper/FeatureRequest';
import NewReports from '../pages/MyAccount/Stepper/NewReports';
import TestComponent from '../pages/Test';
import Dashboard from '../pages/Dashboard/Dashboard';
import PrivateWrapper from '../pages/layout/PrivateWrapper';
import PublicWrapper from '../pages/layout/PublicWrapper';

const routeConfig = {
  faculty: [
    '/home',
    '/course',
    // "/courseprefix",
    // "/coursedetails",
    '/editcourse',
    '/administration',
    '/helpcenter',
    '/myaccount',
    '/openrequest',
    '/featurecenter',
    '/addcourse',
    '/activated/userOrganization/:id',
    '/userOrganization/activation',
    '/administration/:courseassessmentid/:courseid',
    '/dashboard',
  ],
  admin: [
    '/home',
    '/discipline',
    '/subdiscipline',
    // "subdiscipline",
    '/addstudent',
    '/openrequest',
    '/helpcenter',
    '/featurecenter',
    // "/administration",
    // '/administration/:courseassessmentid',
    '/administration/:courseassessmentid/:courseid',
    // '/sendmail',
    '/centers',
    '/organization',
    '/college',
    '/department',
    '/users',
    '/administrative',
    '/program',
    '/unitroles',
    '/myaccount',
    '/addcourse',
    '/course',
    // '/activated/register/:id',
    '/userOrganization/activation/:id',
    '/activated/userOrganization/:id',
    '/addcourse',
    '/editcourse',
    // '/courseprefix',
    // '/coursedetails',
    '/assessment',
    '/test',
    '/addassessment',
    '/question',
    '/newreports',
    '/likert',
    // '/dashboard',
  ],
};

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoutes config={routeConfig} />}>
        <Route path="/" element={<PrivateWrapper />}>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/discipline" element={<Discipline />} />
          <Route path="/subdiscipline" element={<SubDiscipline />} />
          <Route path="/addstudent" element={<AddStudent />} />
          <Route path="/openrequest" element={<OpenRequest />} />
          <Route path="/helpcenter" element={<HelpCenter />} />
          <Route path="/featurecenter" element={<FeatureRequest />} />
          {/* <Route path="/administration" element={<Administration />} /> */}

          <Route
            path="/administration/:courseassessmentid/:courseid"
            element={<Administration />}
          />
          {/* <Route path="/sendmail" element={<Sendmail />} /> */}
          <Route path="/discipline" element={<Discipline />} />
          <Route path="/subdiscipline" element={<SubDiscipline />} />
          <Route path="/centers" element={<Center />} />
          <Route path="/organization" element={<Organisation />} />
          {/* <Route path="/addorganization" element={<AddOrganisation />} /> */}
          {/* <Route path="/editorganization" element={<AddOrganisation />} />  */}
          <Route path="/college" element={<College />} />
          <Route path="/department" element={<Department />} />
          <Route path="/users" element={<Users />} />
          <Route path="/administrative" element={<Administrative />} />
          <Route path="/program" element={<Program />} />
          <Route path="/unitroles" element={<Unitroles />} />
          <Route path="/myaccount" element={<MyAccount />} />
          <Route path="/addcourse" element={<AddEditCourse />} />
          <Route path="/course" element={<Course />} />
          <Route path="/newreports" element={<NewReports />} />

          <Route
            path="/userOrganization/activation"
            element={<ActivateAffiliate />}
          />
          <Route
            path="/activated/userOrganization/:id"
            element={<SetepperActivatedAffiliateIndex />}
          />
          <Route path="/addcourse" element={<AddEditCourse />} />
          <Route path="/editcourse" element={<AddEditCourse />} />
          <Route path="/courseprefix" element={<CoursePrefix />} />
          <Route path="/coursedetails" element={<CourseDetails />} />

          <Route path="/assessment" element={<AddAssestment />} />
          {/* <Route path="/test" element={<ViewTest />} /> */}
          <Route path="/addassessment" element={<CourseAddAssestment />} />
          <Route path="/question" element={<AssesmentQuestion />} />
          <Route path="/likert" element={<Likert />} />
          <Route path="/test" element={<TestComponent />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}

          {/*<Route
            path="/activated/register/:id"
            element={<SetepperActivatedIndex />}
          />
          <Route path="/user/activation/:id" element={<Activate />} />

          {/* <Route path="/overview" element={<Overview />} />
          <Route path="/discipline" element={<Discipline />} /> */}
        </Route>
      </Route>
      <Route path="/" element={<PublicRoute />}>
        <Route path="/" element={<PublicWrapper />}>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/user/activation/:id" element={<Activate />} />
          <Route path="/resetpassword/:id" element={<Reset />} />
          <Route path="/admin/activation/:id" element={<PasswordActivate />} />
          <Route path="/admin/password/:id" element={<Password />} />
          <Route
            path="/invite/activation/:id"
            element={<CourseRegisterIndex />}
          />
          <Route
            path="/assessment/student/:course_student_id/:course_assessment_id/:administration_no"
            element={<TakeAssessment />}
          />

          <Route path="/register" element={<StepperIndex />} />
          {/* <Route path="/org" element={<Org />} />
          <Route path="/org" element={<Org1 />} /> */}
          <Route
            path="/activated/register/:id"
            element={<SetepperActivatedIndex />}
          />
          <Route
            path="/demographicsquestionnaire"
            element={<DemographicIndex />}
          />
          <Route path="/testquestion" element={<TakeAssessmentQuestion />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default MainRoutes;
