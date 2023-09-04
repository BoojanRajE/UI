import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../Store';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as assessmentRoute from '../route/assessmentRoute';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import { handleDeleteTransaction } from '../../utils/gridMethod/GridTransaction';
import Alert from '../../utils/Alert/Alert';

export interface AxiosError<T = any> extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: object;
  data: object;
  response?: AxiosResponse<T>;
  isAxiosError: boolean;
  toJSON: () => object;
}

const initialState = {
  assessmentDiscipline: [],
  assessmentStatus: {},
  assessmentById: [],
  assessmentDetails: [],
  AssessmentData: [],
  collegeName: [],
  assessmentStudent: [],
  assessmentQuestion: null,
  loading: false,
};

const getAssessmentDetail = () => async (dispatch: AppDispatch) => {
  return assessmentRoute
    .getAssessmentDetails()
    .then((res: AxiosResponse) => {
      if (res?.data) {
        dispatch(handleGetAssessment(res.data));
      }
    })
    .catch((err: AxiosError) => {});
};

const addAssessmentData = (
  data: any,
  setOpen: any,
  getAssessmentByCourse: any,
  params: any
) => {
  return assessmentRoute
    .addCourseAssessment(data)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        if (
          res?.data?.message === 'Assessment already exists for this course'
        ) {
          Alert.already({ title: 'Assessment', text: '' });
          setOpen(false);
        } else {
          Alert.add({ title: 'Assessment', text: '' });
          setOpen(false);
          // getAssessmentByCourse(params);
          if (params) getAssessmentByCourse(params);
        }
      }
    })
    .catch((err: AxiosError) => {
      Alert.addError({ title: 'Assessment', text: '' });
      setOpen(false);
    });
};

const getAssessmentData =
  (data: PaginationProp, params: any) => async (dispatch: AppDispatch) => {
    return assessmentRoute
      .getAssessment(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          const { records, totCount } = res?.data;
          if (!records?.length) {
            params.api.showNoRowsOverlay();
          } else params.api.hideOverlay();

          return params.success({
            rowData: records,
            rowCount: totCount || 0,
          });
        }
      })
      .catch((err: AxiosError) => {
        params.fail();
      });
  };

const addAssessment =
  (data: any, dataSource: any, params: any, navigate: any, setButton: any) =>
  async (dispatch: AppDispatch) => {
    return assessmentRoute
      .addAssessment(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res?.data?.errorMessage === 'Assessment code exists') {
            setButton(false);
            Alert.info({
              title: 'Assessment with same code already exists',
              text: '',
            });
          } else {
            navigate('/assessment');
            Alert.add({ title: 'Assessment', text: '' });
          }
        }
      })
      .catch((err: AxiosError) => {
        Alert.addError({ title: 'Assessment', text: '' });
      });
  };

const editAssessmentData =
  (data: any, dataSource: any, params: any, navigate: any, setButton: any) =>
  async (dispatch: AppDispatch) => {
    return assessmentRoute
      .editAssessment(data, data?.id)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res.data.message === 'Assessment code exists') {
            setButton(false);
            Alert.info({
              title: 'Assessment with same code already exists',
              text: '',
            });
          } else {
            navigate('/assessment');
            Alert.update({ title: 'Assessment', text: '' });
          }
        }
      })
      .catch((err: AxiosError) => {
        Alert.updateError({ title: 'Assessment', text: '' });
      });
  };

const getAssessmentById = (data: any) => async (dispatch: AppDispatch) => {
  return assessmentRoute
    .getAssessmentById(data)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        dispatch(handleAssessmentById(res.data));
      }
    })
    .catch((err: AxiosError) => err);
};

const deleteAssessment =
  (data: any, gridApi: any) => async (dispatch: AppDispatch) => {
    return assessmentRoute
      .deleteAssessment(data.id)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res.data.message === 'Assessment is already used in course') {
            Alert.info({
              title: 'Assessment is already used in course',
              text: '',
            });
          } else {
            handleDeleteTransaction(gridApi, data);
            Alert.delete({ title: 'Assessment', text: '' });
          }
        }
      })
      .catch((err: AxiosError) =>
        Alert.deleteError({ title: 'Assessment', text: '' })
      );
  };

const takeAssessment =
  (data: any, navigate: any) => async (dispatch: AppDispatch) => {
    return assessmentRoute
      .takeassessment(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res.data.message === 'Already taken the test') {
            Alert.info({ title: 'Assessment already taken', text: '' }).then(
              () => navigate('/login')
            );
          } else if (res.data.message === 'Assessment End time crossed') {
            Alert.info({ title: 'Assessment Deadline crossed', text: '' }).then(
              () => navigate('/login')
            );
          } else {
            Alert.success({ title: 'Assessment Completed', text: '' }).then(
              () => navigate('/login')
            );
          }
        }
      })
      .catch((err: AxiosError) => err);
  };

const checkAssessmentStatus =
  (data: any, navigate: any) => async (dispatch: AppDispatch) => {
    return assessmentRoute
      .checkAssessmentStatus(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res.data.message === 'Assessment Not Found') {
            Alert.info({ title: 'Assessment Not Found', text: '' }).then(() =>
              navigate('/login')
            );
          } else {
            dispatch(handleAssessmentStatus(res?.data?.data));
          }
        }
      })
      .catch((err: AxiosError) => {
        Alert.info({ title: 'Assessment Not Found', text: '' }).then(() =>
          navigate('/login')
        );
      });
  };

const getAssessmentStudent =
  (data: any, navigate: any) => async (dispatch: AppDispatch) => {
    return assessmentRoute
      .getAssessmentStudent(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          dispatch(handleAssessmentStudent(res?.data?.data));
        }
      })
      .catch((err: AxiosError) => {
        Alert.info({ title: 'Assessment Not Found', text: '' }).then(() =>
          navigate('/login')
        );
      });
  };

const addAssessmentDiscipline =
  (data: any, openForm?: any, setOpenForm?: any) =>
  async (dispatch: AppDispatch) => {
    return assessmentRoute
      .addAssessmentDiscipline(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res?.data?.message === 'Discipline code exists') {
            Alert.already({ title: 'Assessment Discipline', text: '' });
          } else {
            dispatch(getAssessmentDiscipline());
            Alert.add({ title: 'Assessment Discipline', text: '' });
            openForm.callback('discipline', {
              name: res?.data?.data?.name,
              id: res?.data?.data?.id,
            });
            setOpenForm({ ...openForm, isOpen: false });
          }
        }
      })
      .catch((err: AxiosError) => {
        Alert.addError({ title: 'Assessment Discipline', text: '' });
      });
  };

const getAssessmentDiscipline = () => async (dispatch: AppDispatch) => {
  return assessmentRoute
    .getAssessmentDiscipline()
    .then((res: AxiosResponse) => {
      if (res?.data) {
        dispatch(handleAssessmentDiscipline(res?.data?.data));
      }
    })
    .catch((err: AxiosError) => err);
};

const searchAssessment = (data: string, params: any) => async () => {
  return assessmentRoute
    .searchAssessment(data)
    .then((res: AxiosResponse) => {
      if (res?.data) {
        const { records, totCount } = res?.data;


        if (!records?.length) {
          params.api.showNoRowsOverlay();
        } else params.api.hideOverlay();

        params.success({
          rowData: records,
          rowCount: totCount || 0,
        });
      }
    })
    .catch((err: AxiosError) => {
      params.fail();
    });
};

const addAssessmentVersion =
  (data: any, dataSource: any, params: any, navigate: any) =>
  async (dispatch: AppDispatch) => {
    return assessmentRoute
      .addAssessmentVersion(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          navigate('/assessment');
          Alert.add({ title: 'New Version', text: '' });
        }
      })
      .catch((err: AxiosError) => {
        Alert.addError({ title: 'New Version', text: '' });
      });
  };

const updatePublishStatus =
  (data: any, gridApi: any | undefined, rowData: any) =>
  async (dispatch: AppDispatch) => {
    return assessmentRoute
      .updatePublishStatus(data)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          if (res.data.message === 'Assessment is already used in course') {
            Alert.info({
              title: 'Assessment is already used in course',
              text: '',
            });
          } else {
            gridApi.refreshServerSideStore({ purge: true });
            Alert.delete({ title: 'Assessment', text: '' });
            Alert.success({ title: 'Unpublished assessment', text: '' });
          }
        }
      })
      .catch((err: AxiosError) => {
        Alert.error({ title: 'Unpublished assessment failed!', text: '' });
      });
  };

const getAssessmentQuestion =
  (data: any, navigate: any) => async (dispatch: AppDispatch) => {
    return assessmentRoute
      .getAssessmentQuestion(data.state.state.value.question_id)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          data.state.state.value.question = res?.data?.data;
          navigate(data.url, data.state);
        }
      })
      .catch((err: AxiosError) => err);
  };

const viewAssessment =
  (data: any, setData: any, setView: any) => async (dispatch: AppDispatch) => {
    return assessmentRoute
      .getAssessmentQuestion(data.question_id)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          setData({ ...data, questions: res?.data?.data });
          setView(true);
        }
      })
      .catch((err: AxiosError) => err);
  };

const AssessmentSlice = createSlice({
  name: 'AssessmentSlice',
  initialState,
  reducers: {
    handleAssessmentDiscipline: (state, action) => {
      state.assessmentDiscipline = action.payload;
    },
    handleAssessmentStudent: (state, action) => {
      state.assessmentStudent = action.payload;
    },
    handleAssessmentStatus: (state, action) => {
      state.assessmentStatus = action.payload;
    },
    handleAssessmentById: (state, action) => {
      state.assessmentById = action.payload;
    },
    handleGetAssessment: (state, action) => {
      state.assessmentDetails = action.payload;
    },
    handleAssessmentCollege: (state, action) => {
      state.AssessmentData = action.payload;
    },
    handleGetCollegeName: (state, action) => {
      state.collegeName = action.payload;
    },
    handleAssessmentQuestion: (state, action) => {
      state.assessmentQuestion = action.payload;
    },
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

//reducers export  to pass action state to reducer type
export const {
  handleAssessmentDiscipline,
  handleAssessmentStatus,
  handleAssessmentById,
  handleAssessmentCollege,
  handleGetAssessment,
  handleLoading,
  handleGetCollegeName,
  handleAssessmentStudent,
  handleAssessmentQuestion,
} = AssessmentSlice.actions;

//action to calls in ui with dispatch methods
export {
  addAssessmentVersion,
  searchAssessment,
  getAssessmentDiscipline,
  addAssessmentDiscipline,
  checkAssessmentStatus,
  takeAssessment,
  getAssessmentById,
  addAssessment,
  getAssessmentData,
  editAssessmentData,
  getAssessmentDetail,
  addAssessmentData,
  updatePublishStatus,
  getAssessmentStudent,
  deleteAssessment,
  getAssessmentQuestion,
  viewAssessment,
};

export default AssessmentSlice.reducer;
