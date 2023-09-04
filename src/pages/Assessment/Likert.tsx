import React, { useEffect, useState, useCallback } from 'react';
import { MenuItem, useTheme } from '@mui/material';
import {
  Paper,
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
  IconButton,
} from '@mui/material';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { RiStethoscopeLine } from 'react-icons/ri';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import TakeAssessmentQuestion from './TakeAssessmentQuestion';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useLocation, useNavigate } from 'react-router';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '../../utils/Alert/Alert';
import { editAssessmentData } from '../../reduxStore/reducer/assessmentReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';

const Likert = () => {
  const { state } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [val, setVal] = React.useState<any>({});
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (state?.value?.question?.data?.length !== 0) {
      setVal(JSON.parse(JSON.stringify({ ...state.value })));
    }
  }, [state]);

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = val?.question?.data?.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const questions = val?.question?.data.filter(
    (e: any) => e.type === 'question'
  );

  const framing = val?.question?.data.filter((e: any) => e.type === 'framing');

  const framingCondition = (item: any) =>
    framing.find((e: any) => e.framingLabel === item);

  const validation = Yup.object({
    category: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .max(15, 'Maximum 15 characters are allowed')
      .required('Required Field'),
  });

  const [initialValues, setInitialValue] = useState<any>({
    category: '',
  });

  const [category, setCategory] = useState<any>(
    state?.value?.question?.likert?.category?.length > 0
      ? JSON.parse(JSON.stringify(state?.value?.question?.likert?.category))
      : []
  );

  const handleDelete = (index: any) => {
    const value = { ...val };
    const data = [...val.question.data];

    const dataMap = data.map((e: any) => {
      const likert = { ...e?.likert };
      delete likert[category[index]];
      e.likert = likert;
      return e;
    });

    value.question.likert.category.splice(index, 1);
    value.question.data = dataMap;
    setVal(value);

    let deleteValue: any = [...category];
    deleteValue.splice(index, 1);
    setCategory(deleteValue);
  };

  const handleCategory = (e: any, i: any, activeStep: any) => {
    const value = { ...val };
    const data = { ...val.question.data[activeStep] };
    data.likert = { ...data?.likert, [category[i]]: e.target.value };
    value.question.data[activeStep] = data;

    setVal(value);
  };

  //
  //

  //

  const [button, setButton] = useState(false);

  return (
    <div>
      <div
        style={{
          margin: '50px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={(values: any) => {
            //condition for duplication of category
            if (category.find((e: any) => e === values?.category)) {
              return Alert.info({ title: 'Category already exists', text: '' });
            }

            const likert: any = {
              ...val.question.likert,
            };
            likert.category = [...category, values?.category];
            const question = { ...val.question, likert: likert };

            question.data = question.data.map((data: any) => {
              return {
                ...data,
                likert: { ...data.likert, [values?.category]: '0' },
              };
            });

            setCategory(() => [...category, values?.category]);
            setVal({ ...val, question: question });
            values.category = '';
          }}
        >
          {({ values, errors, touched, isValid, setFieldValue }) => (
            <Form style={{ display: 'flex', alignItems: 'center' }}>
              <Field
                sx={{ marginRight: '10px' }}
                as={TextField}
                label="Category"
                variant="outlined"
                size="small"
                required
                name="category"
                value={values?.category}
                helperText={
                  errors.category && touched.category ? errors.category : ''
                }
                error={errors.category && touched.category}
                //   sx={{ marginBottom: '15px' }}
              />

              <Button
                sx={{
                  fontSize: '12px',
                  height: '29px',
                  // alignSelf: 'center',
                }}
                size="small"
                variant="contained"
                type="submit"
                // fullWidth
                disabled={!isValid}
                style={{ textTransform: 'capitalize' }}
              >
                Add Category
              </Button>
            </Form>
          )}
        </Formik>

        <table>
          <tbody
            style={{
              borderCollapse: 'separate',
              borderSpacing: '0 25px',
            }}
          >
            <tr style={category.length > 0 ? {} : { display: 'none' }}>
              <th>Category</th>
              <th className="pr-9">Remove?</th>
            </tr>
            {category &&
              category?.map((data: any, i: any) => {
                return (
                  <tr key={data} style={{ padding: '50px' }}>
                    <td style={{ width: '20px' }}>{data}</td>
                    <td>
                      <Button
                        sx={{
                          fontSize: '12px',
                          height: '29px',
                        }}
                        size="small"
                        variant="contained"
                        onClick={() => handleDelete(i)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <Button
          variant="contained"
          style={{
            marginTop: '20px',
          }}
          onClick={() => {
            setButton(true);
            const data = { ...state.value };
            data.question = val.question;
            dispatch(editAssessmentData(data, '', '', navigate, setButton));
            // dispatch(likertAssessment(data, '', '', navigate, setButton));
          }}
          disabled={
            JSON.stringify(state.value?.question) ===
            JSON.stringify(val?.question)
          }
        >
          Save
        </Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            maxWidth: 900,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
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
            style={{ width: '660px', alignSelf: 'center' }}
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
            {(questions?.length > 0 ? questions.length : 0) > 0 ? (
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
                    xs={12}
                    sm={12}
                    // style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Grid item xs={12} sm={12}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: val?.questions?.instruction?.replace(
                            /\\/g,
                            ''
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: framingCondition(
                            questions[activeStep]?.framing
                          )?.framingContent?.replace(/\\/g, ''),
                        }}
                      />
                    </Grid>
                    <Grid style={{ flexBasis: '2%' }} item xs={2} sm={2}>
                      <b>{questions[activeStep]?.questionLabel}</b>
                    </Grid>
                    <Grid item xs={10} sm={10}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: questions[
                            activeStep
                          ]?.questionContent?.replace(/\\/g, ''),
                        }}
                      />
                    </Grid>

                    <div>
                      {questions[activeStep]?.responseType === 'Single' ? (
                        <Grid item xs={12} sm={12}>
                          <FormControl>
                            <RadioGroup
                              style={{
                                paddingLeft: '21px',
                              }}
                              defaultValue={questions[activeStep]?.answer}
                              name="answer"
                            >
                              <div
                                style={
                                  questions[activeStep]?.optionOrientation ===
                                  'Vertical'
                                    ? {
                                        display: 'flex',
                                        flexDirection: 'column',
                                      }
                                    : questions[activeStep]
                                        ?.optionOrientation === 'Horizontal'
                                    ? {
                                        display: 'flex',
                                        flexDirection: 'row-reverse',
                                      }
                                    : {
                                        display: 'flex',
                                        flexDirection: 'column',
                                      }
                                }
                              >
                                {questions[activeStep]?.responseOptions.map(
                                  (item: any, index: any) => (
                                    <FormControlLabel
                                      style={
                                        questions[activeStep]
                                          ?.optionOrientation === 'Vertical'
                                          ? {
                                              marginTop: '10px',
                                              marginBottom: '10px',
                                            }
                                          : questions[activeStep]
                                              ?.optionOrientation ===
                                            'Horizontal'
                                          ? {
                                              marginTop: '10px',
                                              marginBottom: '10px',
                                              display: 'flex',
                                              flexDirection: 'column',
                                            }
                                          : {
                                              marginTop: '10px',
                                              marginBottom: '10px',
                                            }
                                      }
                                      value={index}
                                      control={
                                        <Radio size="small" disabled={true} />
                                      }
                                      label={
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              item?.optionContent?.replace(
                                                /\\/g,
                                                ''
                                              ),
                                          }}
                                        />
                                      }
                                    />
                                  )
                                )}
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      ) : (
                        ''
                      )}
                    </div>
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
                                disabled={true}
                                // value={item.value}
                                id={index}
                                size="small"
                                name={index}
                                checked={
                                  questions[activeStep]?.answer[index] || false
                                }
                              />
                              <div
                                style={
                                  questions[activeStep]?.optionOrientation ===
                                  'Vertical'
                                    ? {
                                        display: 'flex',
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                      }
                                    : questions[activeStep]
                                        ?.optionOrientation === 'Horizontal'
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
                                dangerouslySetInnerHTML={{
                                  __html: questions[
                                    activeStep
                                  ]?.responseOptions[
                                    index
                                  ].optionContent?.replace(/\\/g, ''),
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
                                disabled={true}
                                className="w-full"
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
                                disabled={true}
                                fullWidth
                                name="answer"
                                label="Response Input:"
                                defaultValue={
                                  questions[activeStep]?.answer || ''
                                }
                                // value={data?.answer || ''}
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
                                disabled={true}
                                type="number"
                                name="answer"
                                label="Response Input:"
                                defaultValue={
                                  Number(questions[activeStep]?.answer) || ''
                                }
                                // value={data?.answer || ''}
                              />
                            </div>
                          )
                        )}
                      </Grid>
                    ) : (
                      ''
                    )}

                    <Grid item xs={12} sm={12}>
                      <table>
                        <tbody
                          style={{
                            borderCollapse: 'separate',
                            borderSpacing: '0 25px',
                          }}
                        >
                          <tr
                            style={
                              category.length > 0 ? {} : { display: 'none' }
                            }
                          >
                            <th>Category</th>
                            <th className="pr-9">Valence</th>
                          </tr>
                          {category &&
                            category?.map((data: any, i: any) => {
                              return (
                                <tr key={data} style={{ padding: '50px' }}>
                                  <td style={{ width: '20px' }}>{data}</td>
                                  <td>
                                    <FormControl
                                      sx={{ minWidth: 120 }}
                                      size="small"
                                    >
                                      <Select
                                        size="small"
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={
                                          questions[activeStep]?.likert?.[
                                            category?.[i]
                                          ]
                                            ? questions[activeStep]?.likert?.[
                                                category?.[i]
                                              ]
                                            : '0'
                                        }
                                        // defaultChecked={
                                        //   questions?.[activeStep]?.category?.[i]
                                        //     ? questions?.[activeStep]
                                        //         ?.category?.[i]
                                        //     : '0'
                                        // }
                                        name="valence"
                                        // label="valence"
                                        onChange={(e) =>
                                          handleCategory(e, i, activeStep)
                                        }
                                        defaultValue="0"
                                      >
                                        <MenuItem value="-">-</MenuItem>
                                        <MenuItem value="0">0</MenuItem>
                                        <MenuItem value="+">+</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            ) : (
              'No Questions To Display'
            )}
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default Likert;
