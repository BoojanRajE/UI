import React, { useEffect, useCallback } from 'react';
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
import 'suneditor/src/assets/css/suneditor.css'; // Import Sun Editor's CSS File'
import 'suneditor/src/assets/css/suneditor-contents.css'; // Import Sun Editor's CSS File
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ViewAssessment = (state: any) => {
  //
  const [val, setVal] = React.useState<any>({});
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (state?.data?.questions?.data?.length !== 0) {
      setVal(state?.data);
    }
  }, [state]);

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = val?.questions?.data?.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const questions = val?.questions?.data.filter(
    (e: any) => e.type === 'question'
  );

  const framing = val?.questions?.data.filter((e: any) => e.type === 'framing');

  const framingCondition = (item: any) => {
    const res = framing.find((e: any) => e.framingLabel === item);

    if (res) return res.framingContent?.replace(/\\/g, '');
    else return '';
  };

  return (
    <div>
      <Dialog
        disableEscapeKeyDown={true}
        open={state.open}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>{'View Assessment'}</div>{' '}
            <div>
              <CloseIcon
                onClick={() => {
                  setActiveStep(0);
                  state.setOpen(false);
                }}
              />{' '}
            </div>{' '}
          </div>
        </DialogTitle>
        <div style={{ backgroundColor: 'white' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '15px',
              // position: 'fixed',
              minWidth: '470px',
              backgroundColor: 'white',
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
        </div>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                maxWidth: 900,
                flexGrow: 1,
              }}
            >
              {/* <Paper
                style={{
                  width: '500px',
                  marginTop: '0px',
                  marginBottom: '0px',
                }}
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
                  > */}
              <Paper
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
                        // style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Grid item xs={12} sm={12}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `<div class="sun-editor-editable">${val?.questions?.instruction?.replace(
                                /\\/g,
                                ''
                              )}</div>`,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `<div class="sun-editor-editable">${framingCondition(
                                questions[activeStep]?.framing
                              )}</div>`,
                            }}
                          />
                        </Grid>
                        <Grid style={{ flexBasis: '2%' }} item xs={2} sm={2}>
                          <b>{questions[activeStep]?.questionLabel}</b>
                        </Grid>
                        <Grid item xs={10} sm={10}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `<div class="sun-editor-editable">${questions[
                                activeStep
                              ]?.questionContent?.replace(/\\/g, '')}</div>`,
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
                                      questions[activeStep]
                                        ?.optionOrientation === 'Vertical'
                                        ? {
                                            display: 'flex',
                                            flexDirection: 'column',
                                          }
                                        : questions[activeStep]
                                            ?.optionOrientation === 'Horizontal'
                                        ? {
                                            display: 'flex',
                                            flexDirection: 'row',
                                          }
                                        : {
                                            display: 'flex',
                                            flexDirection: 'column',
                                          }
                                    }
                                  >
                                    {questions[activeStep]?.responseOptions.map(
                                      (item: any, index: any) => (
                                        <div
                                          style={
                                            index + 1 ===
                                            Number(
                                              questions?.[activeStep]
                                                ?.defaultAnswer
                                            )
                                              ? {
                                                  backgroundColor: 'yellow',
                                                  // width: '100px',
                                                }
                                              : {}
                                          }
                                        >
                                          <FormControlLabel
                                            style={
                                              questions[activeStep]
                                                ?.optionOrientation ===
                                              'Vertical'
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
                                              <Radio
                                                size="small"
                                                disabled={true}
                                              />
                                            }
                                            label={
                                              <div
                                                style={{ color: 'black' }}
                                                dangerouslySetInnerHTML={{
                                                  __html: `<div class="sun-editor-editable">${item?.optionContent?.replace(
                                                    /\\/g,
                                                    ''
                                                  )}</div>`,
                                                }}
                                              />
                                            }
                                          />
                                        </div>
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
                                          backgroundColor:
                                            questions[activeStep]
                                              ?.defaultAnswer?.[index + 1] ===
                                            true
                                              ? 'yellow'
                                              : 'transparent',
                                        }
                                      : questions[activeStep]
                                          ?.optionOrientation === 'Horizontal'
                                      ? {
                                          marginTop: '10px',
                                          marginBottom: '10px',
                                          backgroundColor:
                                            questions[activeStep]
                                              ?.defaultAnswer?.[index + 1] ===
                                            true
                                              ? 'yellow'
                                              : 'transparent',
                                        }
                                      : {
                                          display: 'flex',
                                          marginTop: '10px',
                                          marginBottom: '10px',
                                          backgroundColor:
                                            questions[activeStep]
                                              ?.defaultAnswer?.[index + 1] ===
                                            true
                                              ? 'yellow'
                                              : 'transparent',
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
                                      questions[activeStep]?.answer[index] ||
                                      false
                                    }
                                  />
                                  <div
                                    style={
                                      questions[activeStep]
                                        ?.optionOrientation === 'Vertical'
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
                                      __html: `<div class="sun-editor-editable">${item.optionContent?.replace(
                                        /\\/g,
                                        ''
                                      )}</div>`,
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
                                      Number(questions[activeStep]?.answer) ||
                                      ''
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
                      </Grid>
                    </Box>
                  </Box>
                ) : (
                  'No Questions To Display'
                )}
              </Paper>
            </Box>
          </div>
        </DialogContent>
        <div
          className="flex gap-3 justify-end"
          style={{ marginBottom: '30px', marginRight: '30px' }}
        >
          <Button
            style={{ textTransform: 'capitalize' }}
            onClick={() => {
              state.setOpen(false);
              setActiveStep(0);
            }}
            variant="contained"
          >
            Cancel
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ViewAssessment;
