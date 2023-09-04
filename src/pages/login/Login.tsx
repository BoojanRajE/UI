import React, { useState, useEffect } from 'react';
import {
  forgotAction,
  login,
} from '../../reduxStore/reducer/authenticateReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { LoginAppType } from '../../TypeFile/TypeScriptType';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { CircularProgress, Input, Link, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

const Login = () => {
  const handleStepperNavigate = () => {
    navigate('/register');
  };

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate: any = useNavigate();
  const [Login, setLogin] = useState<LoginAppType>({
    email: '',
    password: '',
  });

  const [cookies, setCookie] = useCookies(['refresh_token']);

  const LoginResponseData = useSelector(
    (state: RootState) => state.authenticate
  );

  const condition = Login.email !== '' && Login.password !== '';
  const handleChange = (e: any) => {
    setLogin({ ...Login, [e.target.name]: e.target.value });
  };

  function handleCookie(res: any) {
    let expires = new Date();
    expires.setTime(expires.getTime() * 10000);
    setCookie('refresh_token', res.refresh_token, { path: '/', expires });
    // setCookies is used, but cookies is not used need to work on logic
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    dispatch(login(Login, navigate, setLoading));
    if (LoginResponseData.logged) {
      handleCookie(LoginResponseData);
    }
  };

  const [email, setEmail] = useState({
    email: '',
  });
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEmail = () => {
    dispatch(forgotAction(email));
    setEmail({ email: '' });
    setOpen(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail({ ...email, [e.target.name]: e.target.value });
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const inputStyle = { WebkitBoxShadow: '0 0 0 1000px white inset' };
  const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const loadSty = loading
    ? 'flex justify-center items-center h-[calc(100vh-85px)]'
    : '';
  return (
    <>
      <div className={loadSty}>
        {loading ? (
          <CircularProgress />
        ) : (
          <section className="text-gray-600 body-font">
            <form
              className="container px-5 py-1 mx-auto flex flex-wrap items-center"
              onSubmit={(e: any) => handleSubmit(e)}
            >
              <div className="lg:w-2/6 md:w-1/2 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
                  If you already have an account, sign in
                </h2>
                <div className="relative mb-4">
                  <label
                    htmlFor="Email"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Email
                  </label>
                  <OutlinedInput
                    size="small"
                    type="email"
                    id="email"
                    name="email"
                    className="Input-Box"
                    onChange={handleChange}
                    value={Login.email}
                    inputProps={{ style: inputStyle }}
                  />
                </div>
                <div className="relative mb-4">
                  <label
                    htmlFor="password"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Password
                  </label>
                  <FormControl fullWidth>
                    <OutlinedInput
                      onChange={handleChange}
                      value={Login.password}
                      className="Input-Box"
                      size="small"
                      name="password"
                      id="standard-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      inputProps={{ style: inputStyle }}
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
                  </FormControl>
                </div>
                <div className="flex justify-between">
                  {/* <div className="text-sm items-center"> */}
                  <a
                    // sx={{ cursor: 'pointer' }}
                    onClick={handleClickOpen}
                    className="no-underline hover:underline  text-link cursor-pointer mt-2"
                  >
                    I need to reset my password
                  </a>
                  {/* </div> */}
                  <Button
                    type="submit"
                    disabled={!condition}
                    variant="contained"
                    className="text-white bg-sign-in border-0 py-1 px-2 focus:outline-none hover:bg-blue-800 rounded "
                    // onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    //   handleSubmit(e)
                    // }

                    // className={classes.submit}
                  >
                    Sign In
                  </Button>
                </div>
                <div>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {'Password Reset Email Request'}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        To change your password, please enter your email and an
                        email will be sent to you shortly with a single use link
                        to reset your password
                      </DialogContentText>
                      <TextField
                        fullWidth
                        className="Input-Box-Email"
                        size={'small'}
                        style={{ marginTop: '10px' }}
                        id="email"
                        type="text"
                        name="email"
                        value={email.email}
                        placeholder="Email"
                        onChange={handleEmailChange}
                        required
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button
                        onClick={handleEmail}
                        disabled={!isEmail.test(email.email)}
                      >
                        Ok
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </div>
              <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                <h1 className="title-font font-medium text-3xl text-gray-900">
                  Don't have an account? Sign up now.
                </h1>
                <p className="leading-relaxed mt-4">
                  The LASSO website has software tools and resources for faculty
                  and students. Access to these features requires creating an
                  account.
                </p>
                <h1 className="text-lg font-bold">
                  To create a new account, click the link below.
                </h1>
                {/* <div>
              <a onClick={()=>handleNavigate()} href="#!" className="no-underline hover:underline  text-link">
                I am undergraduate student.
              </a>
            </div> */}
                <div>
                  <a
                    onClick={() => handleStepperNavigate()}
                    // href=""
                    style={{
                      marginTop: '20px',
                    }}
                    className="no-underline hover:underline  text-link cursor-pointer"
                  >
                    I am a faculty or staff member of an academic institution.
                  </a>
                </div>
                {/* <div>
                <a
                  onClick={() => handleStepperNavigate()}
                  // href="#!"
                  className="no-underline hover:underline  text-link cursor-pointer"
                >
                  I am associated with a non-academic organization.
                </a>
              </div> */}
              </div>
            </form>
          </section>
        )}
      </div>
    </>
  );
};
export default Login;
