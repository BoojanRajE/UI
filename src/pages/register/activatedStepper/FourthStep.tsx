import React, { useCallback, useContext } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AppContext } from './Context';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

export default function FirstStep() {
  const { formValues, handleChange, handleBack, handleNext, variant, margin } =
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
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <h2>
            <b>Set a password</b>
          </h2>

          <FormControl
            fullWidth
            sx={{ m: 1 }}
            variant={variant}
            margin={margin}
          >
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <Input
              name="password"
              placeholder="password"
              value={password.value}
              onChange={handleChange}
              error={!!password.error}
              required={password.required}
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText error={!!password.error}>
              {password.error ? (
                <div className="mr-5">
                  <li>10-128 characters</li>
                  Must have 3 of these 4 features:
                  <li>at least 1 uppercase character (A-Z)</li>
                  <li>at least 1 lowercase character (a-z)</li>
                  <li>at least 1 digit (0-9), at least 1 symbol</li>
                  <li>Passwords are case sensitive</li>
                </div>
              ) : (
                ''
              )}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12}>
          <FormControl
            fullWidth
            sx={{ m: 1 }}
            variant={variant}
            margin={margin}
          >
            <InputLabel htmlFor="standard-adornment-reEnterPassword">
              Re-Enter Password
            </InputLabel>
            <Input
              name="reEnterPassword"
              onPaste={(e) => e.preventDefault()}
              placeholder="Re-Enter Password"
              value={reEnterPassword.value}
              onChange={handleChange}
              error={!!reEnterPassword.error}
              required={reEnterPassword.required}
              id="standard-adornment-password"
              type={showRePassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowRePassword}
                    onMouseDown={handleMouseDownRePassword}
                  >
                    {showRePassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText
              error={
                !!reEnterPassword.error ||
                reEnterPassword.value !== password.value
              }
            >
              {/* {reEnterPassword.error} */}

              {reEnterPassword.error ? (
                <div className="mr-5">
                  <li>10-128 characters</li>
                  Must have 3 of these 4 features:
                  <li>at least 1 uppercase character (A-Z)</li>
                  <li>at least 1 lowercase character (a-z)</li>
                  <li>at least 1 digit (0-9), at least 1 symbol</li>
                  <li>Passwords are case sensitive</li>
                </div>
              ) : '' || reEnterPassword.value === password.value ? (
                ''
              ) : (
                'Password and Confirm Password must be match'
              )}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button
          variant="contained"
          disabled={isError() || password.value !== reEnterPassword.value}
          color="primary"
          onClick={!isError() ? handleNext : () => null}
        >
          Next
        </Button>
      </Box>
    </>
  );
}
