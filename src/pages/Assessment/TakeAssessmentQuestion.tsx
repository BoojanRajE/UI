import React, { useEffect, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {
  getAssessmentById,
  takeAssessment,
} from '../../reduxStore/reducer/assessmentReducer';
import { IconButton, useTheme } from '@mui/material';
import {
  MenuItem,
  Box,
  Tabs,
  Tab,
  Typography,
  Radio,
  Grid,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  OutlinedInput,
  DialogTitle,
  Checkbox,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Swal from 'sweetalert2';
import Alert from '../../utils/Alert/Alert';
interface TabPanelProps {
  children?: React.ReactNode;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TakeAssessmentQuestion = () => {
  const navigate = useNavigate();
  const location: any = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [val, setVal] = React.useState<any>({});
  const question = val?.question_data?.data.filter(
    (e: any) => e.type === 'question'
  );

  const framing = val?.question_data?.data.filter(
    (e: any) => e.type === 'framing'
  );

  const [questions, setQuestions] = useState<any>([]);

  const framingCondition = (item: any) => {
    const res = framing.find((e: any) => e.framingLabel === item);

    if (res) return res.framingContent?.replace(/\\/g, '');
    else return '';
  };

  const selectedData: any = useSelector(
    (state: RootState) => state.assessment.assessmentById
  );

  useEffect(() => {
    dispatch(getAssessmentById(location?.state?.course_assessment_id));
  }, [dispatch]);

  useEffect(() => {
    setVal({ ...selectedData?.data });
    setQuestions(
      selectedData?.data?.question_data?.data.filter(
        (e: any) => e.type === 'question'
      )
    );
  }, [selectedData]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    setValue(newValue);
  };

  const handleRadioChange = (e: any, i: any) => {
    // set the answer to the question only array
    let data = [...questions];
    const single = { ...data[i] };
    const cond1 = JSON.stringify(single);
    const fileredData = val.question_data.data.findIndex(
      (d: any) => JSON.stringify(d) === cond1
    );
    single.answer = e.target.value;
    data[i] = single;
    setQuestions(data);

    // set the answer to the global array
    const question_data: any = { ...val.question_data };
    const overallValue: any = [...val.question_data.data];
    const overallSingle: any = { ...val.question_data.data[fileredData] };
    overallSingle.answer = e.target.value;
    overallValue[fileredData] = overallSingle;
    question_data.data = overallValue;
    const newData = { ...val, question_data: question_data };

    setVal(newData);
    // setVal({...value, value.question_data.data[i].answer: e.target.value}});
  };

  const onCheckboxChange = (e: any, i: any) => {
    const { name, checked } = e.target;

    // set the answer to the question only array
    let data = [...questions];
    const single = { ...data[i] };
    const cond1 = JSON.stringify(single);
    const fileredData = val.question_data.data.findIndex(
      (d: any) => JSON.stringify(d) === cond1
    );
    const answer = (single.answer = { ...data[i].answer, [name]: checked });
    single.answer = answer;
    data[i] = single;
    setQuestions(data);

    // set the answer to the global array
    const question_data: any = { ...val.question_data };
    const overallValue: any = [...val.question_data.data];
    const overallSingle: any = { ...val.question_data.data[fileredData] };
    const overallData = {
      ...val?.question_data?.data[fileredData]?.answer,
      [name]: checked,
    };
    overallSingle.answer = overallData;
    overallValue[fileredData] = overallSingle;
    question_data.data = overallValue;
    const newData = { ...val, question_data: question_data };
    setVal(newData);
  };

  const onInputChange = (e: any, i: any) => {
    const { name, value: inputData } = e.target;

    // set the answer to the question only array
    let data = [...questions];
    const single = { ...data[i] };
    const cond1 = JSON.stringify(single);
    const fileredData = val.question_data.data.findIndex(
      (d: any) => JSON.stringify(d) === cond1
    );
    single.answer = inputData;
    data[i] = single;
    setQuestions(data);

    // set the answer to the global array
    const question_data: any = { ...val.question_data };
    const overallValue: any = [...val.question_data.data];
    const overallSingle: any = { ...val.question_data.data[fileredData] };
    overallSingle.answer = inputData;
    overallValue[fileredData] = single;
    question_data.data = overallValue;

    const newData = { ...val, question_data: question_data };
    setVal(newData);
  };

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = val?.question_data?.data?.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const data = val?.question_data?.data;

  const condData = questions?.filter((item: any) => item?.answer == '');
  const [button, setButton] = useState(false);
  const [popup, setPopup] = useState(true);

  const handleSubmit = () => {
    const questionIndex: any = [];
    const data = question.map((d: any, i: any) => {
      if (d.type == 'question' && d.answer == '') {
        questionIndex.push(i + 1);
      }
    });

    if (questionIndex?.length > 0) {
      Swal.fire({
        title: `Missing Responses to question(s): ${questionIndex.join(',')}`,
        icon: 'info',
        showCancelButton: true,
        cancelButtonText: 'Return to Assessment',
        confirmButtonText: 'Submit Incomplete Assessment',
        showCloseButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          location.state.answer = val;
          setButton(true);
          dispatch(takeAssessment(location.state, navigate));
        } else if (result.isDenied) {
          //User clicked "No"
        } else if (result.isDismissed) {
          //User dismissed the popup
        }
      });
    } else {
      location.state.answer = val;
      setButton(true);
      dispatch(takeAssessment(location.state, navigate));
    }
  };

  // const framingCondition = (item: any) =>
  //   val?.question_data?.framing.find((e: any) => e.framingLabel === item);

  // const framingData = framingCondition('Framing1');

  const synth = window.speechSynthesis;

  const speak = (altText: any) => {
    const utterance = new SpeechSynthesisUtterance(altText);
    synth.speak(utterance);
  };

  const regex = /<img.*?\>/;
  const arr: any = [];

  const imageData = val?.question_data?.data?.map((d: any) => {
    if (
      (d?.questionContent &&
        (d?.questionContent?.match(regex) !== null
          ? d?.questionContent?.match(regex)[0]
          : false)) ||
      (d?.framingContent && d?.framingContent?.match(regex) !== null
        ? d?.framingContent?.match(regex)[0]
        : false)
    ) {
      if (d?.questionContent) {
        arr.push(d?.questionContent);
      }
      if (d?.framingContent) {
        arr.push(d?.framingContent);
      }
    }
  });

  const imageAlternateData = arr?.map((d: any) => {
    const reg: any = /alt="(.*?)"/;
    const altText = reg.exec(d)[1];
    return { image: d, alt: altText ? altText : '' };
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {(questions?.length > 0 ? questions.length : 0) > 0 ? (
          <Box
            sx={{
              maxWidth: 900,
              flexGrow: 1,
            }}
          >
            <h2
              style={{
                fontSize: '35px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {val?.official_name}
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '15px',
              }}
            >
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
              <Select
                size="small"
                value={activeStep}
                onChange={(e: any) => {
                  setActiveStep(e.target.value);
                }}
                // className={classes.select}
              >
                {[
                  ...Array(questions?.length > 0 ? questions.length : 0).keys(),
                ].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num + 1}
                  </MenuItem>
                ))}
              </Select>
              <Button
                size="small"
                onClick={handleNext}
                disabled={
                  activeStep ===
                  (questions?.length > 0 ? questions.length : 0) - 1
                }
              >
                Next
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            </div>
            <Paper
              variant="outlined"
              sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            >
              <Box
                sx={{
                  minHeight: 400,
                  height: 'auto',
                  maxWidth: 900,
                  width: '100%',
                  p: 2,
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Grid
                    container
                    spacing={2}
                    // style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Grid item xs={12} sm={12}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: questions?.instruction?.replace(/\\/g, '')
                            ? `<div class="sun-editor-editable">${questions?.instruction?.replace(
                                /\\/g,
                                ''
                              )}</div>`
                            : '',
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `<div class="sun-editor-editable">${framingCondition(
                              questions[activeStep]?.framing
                            )}</div>`,
                          }}
                        />
                        {/* framingCondition(questions[activeStep]?.framing) &&
                        (framingCondition(questions[activeStep]?.framing).match(
                          regex
                        ) !== null
                          ? framingCondition(
                              questions[activeStep]?.framing
                            )?.match(regex)[0]
                          : false) ? (
                          <IconButton
                            onClick={() => {
                              const reg: any = /alt="(.*?)"/;
                              const altText = reg.exec(
                                framingCondition(questions[activeStep]?.framing)
                              )[1];
                              speak(altText);
                            }}
                          >
                            <VolumeUpIcon />
                          </IconButton>
                        ) : (
                          ''
                        )} */}
                      </div>
                    </Grid>
                    <Grid style={{ flexBasis: '2%' }} item xs={2} sm={2}>
                      <b>{questions[activeStep]?.questionLabel}</b>
                    </Grid>
                    <Grid item xs={10} sm={10}>
                      <div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `<div class="sun-editor-editable">${questions[
                              activeStep
                            ]?.questionContent?.replace(/\\/g, '')}</div>`,
                          }}
                        />
                        {/* {questions[activeStep]?.questionContent &&
                        (questions[activeStep]?.questionContent?.match(
                          regex
                        ) !== null
                          ? questions[activeStep]?.questionContent?.match(
                              regex
                            )[0]
                          : false) ? (
                          <IconButton
                            onClick={() => {
                              const reg: any = /alt="(.*?)"/;
                              const altText = reg.exec(
                                questions[activeStep]?.questionContent
                              )[1];
                              speak(altText);
                            }}
                          >
                            <VolumeUpIcon />
                          </IconButton>
                        ) : (
                          ''
                        )} */}
                      </div>
                    </Grid>

                    {questions[activeStep]?.responseType === 'Single' ? (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        // style={
                        //   val?.question_data?.data[activeStep].optionOrientation ===
                        //   'Vertical'
                        //     ? { display: 'flex', flexDirection: `row` }
                        //     : val?.question_data?.data[activeStep]
                        //         .optionOrientation === 'Horizontal'
                        //     ? { display: 'flex', flexDirection: `row` }
                        //     : {}
                        // }
                      >
                        <FormControl
                          style={{
                            paddingLeft: '21px',
                            display: 'flex',
                            flexDirection: 'row',
                          }}
                        >
                          <RadioGroup
                            defaultValue={
                              questions[activeStep]?.answer
                                ? questions[activeStep]?.answer
                                : ''
                            }
                            // defaultChecked={gender.value}
                            name="answer"
                            value={
                              questions[activeStep]?.answer
                                ? questions[activeStep]?.answer
                                : ''
                            }
                            onChange={(e) => handleRadioChange(e, [activeStep])}
                            style={
                              questions[activeStep].optionOrientation ===
                              'Vertical'
                                ? { display: 'flex', flexDirection: 'column' }
                                : questions[activeStep].optionOrientation ===
                                  'Horizontal'
                                ? { display: 'flex', flexDirection: 'row' }
                                : { display: 'flex', flexDirection: 'row' }
                            }
                          >
                            {questions[activeStep]?.responseOptions.map(
                              (item: any, index: any) => (
                                <FormControlLabel
                                  style={{
                                    marginTop: '10px',
                                    marginBottom: '10px',
                                  }}
                                  value={index}
                                  control={<Radio size="small" />}
                                  label={
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: `<div class="sun-editor-editable">${item?.optionContent?.replace(
                                          /\\/g,
                                          ''
                                        )}</div>`,
                                      }}
                                    />
                                    // <div></div>
                                  }
                                />
                              )
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    ) : (
                      ''
                    )}

                    {questions[activeStep]?.responseType === 'Multiple' ? (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        style={
                          questions[activeStep]?.optionOrientation ===
                          'Horizontal'
                            ? {
                                display: 'flex',
                              }
                            : {}
                        }
                      >
                        {questions[activeStep]?.responseOptions.map(
                          (item: any, index: any) => (
                            <label
                              key={index}
                              style={
                                questions[activeStep]?.optionOrientation ===
                                'Vertical'
                                  ? {
                                      display: 'flex',
                                      marginTop: '10px',
                                      marginBottom: '10px',
                                    }
                                  : questions[activeStep]?.optionOrientation ===
                                    'Horizontal'
                                  ? {
                                      marginTop: '10px',
                                      marginBottom: '10px',
                                    }
                                  : {
                                      display: 'flex',
                                      marginTop: '10px',
                                      marginBottom: '10px',
                                    }
                              }
                            >
                              <Checkbox
                                // value={item.value}
                                id={index}
                                size="small"
                                name={index}
                                checked={
                                  questions[activeStep]?.answer[index] || false
                                }
                                onChange={(e) =>
                                  onCheckboxChange(e, activeStep)
                                }
                              />
                              <div
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: `<div class="sun-editor-editable">${questions[
                                    activeStep
                                  ]?.responseOptions[
                                    index
                                  ].optionContent?.replace(/\\/g, '')}</div>`,
                                }}
                              ></div>
                            </label>
                          )
                        )}
                      </Grid>
                    ) : (
                      ''
                    )}

                    {questions[activeStep]?.responseType === 'Open' ? (
                      <Grid item xs={12} sm={12}>
                        {questions[activeStep]?.responseOptions.map(
                          (item: any, index: any) => (
                            <div>
                              <TextField
                                fullWidth
                                multiline
                                name="answer"
                                label="Response Input:"
                                defaultValue={
                                  questions[activeStep]?.answer || ''
                                }
                                // value={data?.answer || ''}
                                ref={(input: any) => {
                                  if (input) {
                                    input.focus();
                                  }
                                }}
                                onChange={(e: any) =>
                                  onInputChange(e, activeStep)
                                }
                              />
                            </div>
                          )
                        )}
                      </Grid>
                    ) : (
                      ''
                    )}

                    {questions[activeStep]?.responseType === 'Text' ? (
                      <Grid item xs={12} sm={12}>
                        {questions[activeStep]?.responseOptions.map(
                          (item: any, index: any) => (
                            <div>
                              <TextField
                                //  fullWidth
                                className="w-full"
                                name="answer"
                                label="Response Input:"
                                defaultValue={
                                  questions[activeStep]?.answer || ''
                                }
                                // value={data?.answer || ''}
                                onChange={(e: any) =>
                                  onInputChange(e, activeStep)
                                }
                              />
                            </div>
                          )
                        )}
                      </Grid>
                    ) : (
                      ''
                    )}

                    {questions[activeStep]?.responseType === 'Number' ? (
                      <Grid item xs={12} sm={12}>
                        {questions[activeStep]?.responseOptions.map(
                          (item: any, index: any) => (
                            <div>
                              <TextField
                                type="number"
                                name="answer"
                                label="Response Input:"
                                defaultValue={
                                  Number(questions[activeStep]?.answer) || ''
                                }
                                // value={data?.answer || ''}
                                onChange={(e: any) =>
                                  onInputChange(e, activeStep)
                                }
                              />
                            </div>
                          )
                        )}
                      </Grid>
                    ) : (
                      ''
                    )}
                  </Grid>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <Button
                      style={
                        question.length - 1 === activeStep
                          ? {}
                          : { display: 'none' }
                      }
                      variant="contained"
                      disabled={
                        // (condData?.length == 0 ? false : true) ||
                        button
                      }
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </Box>
              </Box>
            </Paper>
          </Box>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default TakeAssessmentQuestion;
