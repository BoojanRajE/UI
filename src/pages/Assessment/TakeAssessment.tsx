import {
  Box,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  Button,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import {
  checkAssessmentStatus,
  getAssessmentStudent,
} from '../../reduxStore/reducer/assessmentReducer';
import Alert from '../../utils/Alert/Alert';
import { date } from 'yup';
import moment from 'moment';

function addQuotesIfNeeded(str: any) {
  if (str) {
    return str.replace(
      /"([^"]*)"|'([^']*)'|\b([^'",\s]+)\b/g,
      (match: any, doubleQuoted: any, singleQuoted: any, unquoted: any) => {
        if (doubleQuoted || singleQuoted) {
          // Already quoted, return as is
          return match;
        } else {
          // Add double quotes around unquoted word
          return `"${unquoted}"`;
        }
      }
    );
  } else {
    return {};
  }
}

const TakeAssessment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { course_student_id, course_assessment_id, administration_no } =
    useParams();

  useEffect(() => {
    dispatch(
      checkAssessmentStatus(
        {
          course_assessment_id: course_assessment_id,
          course_student_id: course_student_id,
          administration_no: administration_no,
        },
        navigate
      )
    );
    dispatch(getAssessmentStudent({ id: course_student_id }, navigate));
  }, []);

  const selectedData: any = useSelector(
    (state: RootState) => state.assessment.assessmentStatus
  );
  const studentData: any = useSelector((state: RootState) => {
    let data: any = { ...state.assessment.assessmentStudent };

    const alterFunction = (data: any) => {
      if (data) {
        return JSON.parse(
          data.replace(/\\/g, '').replace(/[{}]/g, (match: any) => {
            return match === '{' ? '[' : ']';
          })
        );
      } else {
        return {};
      }
    };

    if (data?.id) {
    }

    if (data?.id) {
      data.ethnicity = data?.ethnicity
        ? alterFunction(addQuotesIfNeeded(data?.ethnicity))
        : {};
      data.gender = data?.gender
        ? alterFunction(addQuotesIfNeeded(data?.gender))
        : {};
      data.race = data?.race
        ? alterFunction(addQuotesIfNeeded(data?.race))
        : {};
    }

    return data;
  });

  useEffect(() => {
    if (
      selectedData?.test_status && selectedData?.end_date_time
        ? moment(selectedData?.end_date_time) < moment()
        : false
    ) {
      Alert.info({ title: 'Assessment already taken', text: '' });
      navigate('/login');
    }
    if (
      (selectedData?.test_status === false ||
        selectedData?.test_status === null) &&
      selectedData?.end_date_time
        ? moment(selectedData?.end_date_time) < moment()
        : false
    ) {
      Alert.info({ title: 'Assessment Deadline crossed', text: '' });
      navigate('/login');
    }

    if (
      selectedData?.start_date_time === '' ||
      selectedData?.end_date_time === ''
    ) {
      Alert.info({ title: 'Assessment not started', text: '' });
      navigate('/login');
    }

    if (
      (selectedData?.test_status === false ||
        selectedData?.test_status === null) &&
      selectedData?.start_date_time
        ? moment(selectedData?.start_date_time) > moment()
        : false
    ) {
      Alert.info({ title: 'Assessment not started', text: '' });
      navigate('/login');
    }

    if (selectedData?.test_status) {
      Alert.info({ title: 'Assessment already taken', text: '' });
      navigate('/login');
    }

    // if (
    //   selectedData?.end_date_time
    //     ? moment(selectedData?.end_date_time) < moment()
    //     : false
    // ) {
    //   Alert.info({ title: 'Assessment Deadline crossed', text: '' });
    //   navigate('/login');
    // }
  }, [selectedData]);

  // // Replace curly braces with square brackets
  // studentData.role_in_class =   studentData.role_in_class.replace(/[{}]/g, match => {
  //   return match === '{' ? '[' : ']';
  // });

  return (
    <div>
      {selectedData?.test_status === false ? (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Participation Consent Form
          </Typography>
          <div className="p-2 flex flex-col gap-6">
            <p style={{ fontSize: '14px' }}>
              You are being asked to respond to a survey with a background
              questionnaire. You can complete the survey on the web at your
              convenience. The survey will take about 10-30 minutes of your
              time.instruction have been asked to not use your answers on this
              survey to affect your course grade.
            </p>
            <p style={{ fontSize: '14px' }}>
              By completing this survey you are agreeing to the following terms
              of service:
              <div className="font-semibold text-sm p-3">
                Your name and answers will be stored and shared with your
                instructor and a department assessment coordinator (if
                applicable).
              </div>
            </p>
            {/* <Typography variant="subtitle2" gutterBottom> */}

            {/* </Typography> */}
            <p style={{ fontSize: '14px' }}>
              Optionally, we would like to include your anonymized data in a
              dataset of student learning outcomes.{' '}
            </p>
            <p style={{ fontSize: '14px' }}>
              If you give permission, your answers will be stripped of
              identifiable information and included in the Learning About STEM
              Student Outcomes (LASSO) research dataset. The LASSO research
              dataset is a large collection of student and class information
              that is anonymized and shared with researchers investigating
              issues of teaching and learning. By anonymizing the data in the
              dataset, we ensure that no answers can be linked to any individual
              student. To further ensure the ethical use of students data, only
              researchers with approved Institutional Review Board protocols are
              allowed access to the LASSO research dataset. For more details on
              how data is protected, please see the LASSO platforms FAQ.{' '}
            </p>
            <p style={{ fontSize: '14px' }}>
              Sharing your answers with the LASSO research dataset is entirely
              voluntary. Your agreement to include your data (or not) in the
              research dataset is indicated by clicking one of the two buttons
              below. You must be over 18 to agree to share your data in the
              LASSO research dataset. If you do not agree to share your data
              with the LASSO research dataset, your answers will still be stored
              and shared with your instructor and/or assessment coordinator.
              Your signature is not required on any document. Questions can be
              directed to contact @Ilearningassistantalliance.org.{' '}
            </p>
            <div>
              <Formik
                initialValues={{
                  picked: '1',
                }}
                onSubmit={async (values) => {
                  // await new Promise((r) => setTimeout(r, 500));
                  // alert(JSON.stringify(values, null, 2));
                  navigate('/demographicsquestionnaire', {
                    state: {
                      course_student_id: course_student_id,
                      course_assessment_id: course_assessment_id,
                      administration_no: administration_no,
                      participation: values?.picked,
                      data: studentData,
                    },
                  });
                  // navigate('/demographicsquestionnaire', id);
                }}
              >
                {({ values }) => (
                  <Form>
                    <div
                      className="flex flex-col"
                      role="group"
                      aria-labelledby="my-radio-group"
                    >
                      <label style={{ display: 'flex' }}>
                        <Field
                          as={Radio}
                          checked={values.picked == '1'}
                          type="radio"
                          size="small"
                          name="picked"
                          value="1"
                        />
                        <p
                          style={{
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          I give permission to share my anonymized data with the
                          LASSO research dataset and understand that my data
                          will be shared with my instructor.
                        </p>
                      </label>
                      <label style={{ display: 'flex' }}>
                        <Field
                          as={Radio}
                          type="radio"
                          size="small"
                          name="picked"
                          value="2"
                          checked={values.picked == '2'}
                        />
                        <p
                          style={{
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          I do not want my anonymized data shared with the LASSO
                          research dataset and understand that my data will be
                          shared with my instructor.
                        </p>
                      </label>

                      {/* <div>Picked: {values.picked}</div> */}
                    </div>
                    <div className="mt-5">
                      <Button
                        sx={{ textTransform: 'capitalize' }}
                        size="small"
                        variant="contained"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Box>
      ) : (
        ''
      )}
    </div>
  );
};

export default TakeAssessment;
