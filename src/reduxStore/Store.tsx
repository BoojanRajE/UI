import { combineReducers } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import authenticateReducer from './reducer/authenticateReducer';
import homeReducer from './reducer/homeReducer';
import organisationReducer from './reducer/organisationReducer';
import disciplineReducer from './reducer/disciplineReducer';
import subDiciplineReducer from './reducer/subDisciplineReducer';
import register from './reducer/registerReducer';
import collegeReducer from './reducer/collegeReducer';
import departmentReducer from './reducer/departmentReducer';
import administrativeReducer from './reducer/administrativeReducer';
import programReducer from './reducer/programReducer';
import unitrolesReducer from './reducer/unitrolesReducer';
import userReducer from './reducer/userReducer';
import centerReducer from './reducer/centerReducer';
import metaDataReducer from './reducer/metaDataReducer';
import coursePrefixReducer from './reducer/coursePrefixReducer';
import assessmentReducer from './reducer/assessmentReducer';
import courseDetailReducer from './reducer/courseDetailsReducer';
import administrationReducer from './reducer/administrationReducer';
import dashboardReducer from './reducer/dashboardReducer';

const createReducer = (state: any, action: any) => {
  const combinedReducer = combineReducers({
    authenticate: authenticateReducer,
    test: homeReducer,
    organization: organisationReducer,
    courseprefix: coursePrefixReducer,

    coursedetails: courseDetailReducer,

    discipline: disciplineReducer,
    subdiscipline: subDiciplineReducer,
    register: register,
    college: collegeReducer,
    department: departmentReducer,
    assessment: assessmentReducer,

    center: centerReducer,
    administrative: administrativeReducer,
    program: programReducer,
    unitroles: unitrolesReducer,
    users: userReducer,
    metaData: metaDataReducer,
    administration: administrationReducer,
    dashboard: dashboardReducer,
  });

  if (action.type === 'LOGOUT') {
    state = {};
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),

  reducer: createReducer,
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
