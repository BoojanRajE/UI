import React, { useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AppContext } from '../register/activatedStepper/Context';
import { Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { resetAction } from '../../reduxStore/reducer/authenticateReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { activatePassword } from '../../reduxStore/reducer/userReducer';

const theme = createTheme();

function Password() {
  const initialValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate: any = useNavigate();
  const { formValues, handleChange, handleNext, variant, margin } =
    useContext(AppContext);
  const { password, reEnterPassword } = formValues;

  // Check if all values are not empty and if there are some errors
  const isError = useCallback(
    () =>
      Object.keys({ password, reEnterPassword }).some(
        (name) =>
          (formValues[name].required && !formValues[name].value) ||
          formValues[name].error
      ),
    [formValues, password, reEnterPassword]
  );

  const errorMessage =
    password.value !== reEnterPassword.value
      ? 'Password and Confirm Password Mismatch'
      : '';

  const [showPassword, setShowPassword] = React.useState(false);
  const [showRePassword, setShowRePassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowRePassword = () => setShowRePassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseDownRePassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 1 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            Create Password
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              newPassword: Yup.string()
                .required('Password is required')
                .matches(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&_]{10,128}$/,
                  () => {
                    return (
                      <div className="mr-5">
                        <li>10-128 characters</li>
                        Must have 3 of these 4 features:
                        <li>at least 1 uppercase character (A-Z)</li>
                        <li>at least 1 lowercase character (a-z)</li>
                        <li>at least 1 digit (0-9), at least 1 symbol</li>
                        <li>Passwords are case sensitive</li>
                      </div>
                    );
                  }
                  // '10-128 characters<br/> Must have 3 of these 4 features:,  at least 1 uppercase character (A-Z),  at least 1 lowercase character (A-Z), at least 1 digit (0-9), at least 1 symbol, Passwords are case sensitive'
                )
                .typeError('A number is required'),
              confirmPassword: Yup.string().oneOf(
                [Yup.ref('newPassword'), null],
                'Password and Confirm Password must be match'
              ),
            })}
            onSubmit={(values) => {
              dispatch(
                activatePassword(
                  { token: id, password: values.confirmPassword },
                  navigate
                )
              );
            }}
          >
            <Form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
              <div>
                <FormControl
                  fullWidth
                  sx={{ m: 1 }}
                  variant={variant}
                  margin={margin}
                >
                  <InputLabel htmlFor="standard-adornment-password">
                    Password
                  </InputLabel>
                  <Field
                    as={Input}
                    name="newPassword"
                    placeholder="password"
                    id="standard-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    onCopy={(e: any) => e.preventDefault()}
                    // onCopy={(e: any) => {
                    //   e.preventDefault();
                    //   alert('Copying the password is not allowed.');
                    // }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? (
                            <AiFillEyeInvisible />
                          ) : (
                            <AiFillEye />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText error={!!password.error}>
                    {password.error}
                  </FormHelperText>
                </FormControl>
                <ErrorMessage
                  name="newPassword"
                  component="span"
                  className="text-red-600 ml-2 text-sm"
                />
              </div>
              <div>
                <FormControl
                  fullWidth
                  sx={{ m: 1 }}
                  variant={variant}
                  margin={margin}
                >
                  <InputLabel htmlFor="standard-adornment-reEnterPassword">
                    Confirm Password
                  </InputLabel>
                  <Field
                    as={Input}
                    name="confirmPassword"
                    placeholder="Re-Enter Password"
                    id="standard-adornment-password"
                    type={showRePassword ? 'text' : 'password'}
                    onCopy={(e: any) => e.preventDefault()}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowRePassword}
                          onMouseDown={handleMouseDownRePassword}
                        >
                          {showRePassword ? (
                            <AiFillEyeInvisible />
                          ) : (
                            <AiFillEye />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText error={!!reEnterPassword.error}>
                    {reEnterPassword.error}
                  </FormHelperText>
                </FormControl>
                <ErrorMessage
                  name="confirmPassword"
                  component="span"
                  className="text-red-600 ml-2 text-sm"
                />
              </div>
              <Button
                style={{ marginTop: '25px', marginBottom: '25px' }}
                // className="mt-24"
                fullWidth
                type="submit"
                variant="contained"
              >
                Activate password
              </Button>
            </Form>
          </Formik>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default Password;
