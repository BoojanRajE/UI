import React, { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { AppContext } from './Context';
import Select, { components, IndicatorsContainerProps } from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxStore/Store';
import {
  inviteRegister,
  register,
  registerAffiliate,
} from '../../../reduxStore/reducer/registerReducer';

export default function ThirdStep(props: any) {
  const { formValues, handleChange, handleBack, handleNext, variant, margin } =
    useContext(AppContext);
  const { organizationEmail } = formValues;

  const isError = useCallback(
    () =>
      Object.keys({ organizationEmail }).some(
        (name) =>
          (formValues[name].required && !formValues[name].value) ||
          formValues[name].error
      ),
    [organizationEmail]
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate: any = useNavigate();

  if (props?.value?.value == 'invite') {
    const user = props?.value?.data;
    const { email } = user;
    organizationEmail.value = email;
  }

  const handleSubmit = () => {
    // Remove unwanted properties from formValue object
    let form: any = {};

    Object.keys(formValues).map((name) => {
      form = {
        ...form,
        [name]: formValues[name].value,
      };
      return form;
    });
    // Do whatever with the values

    const data: any = {
      organizationEmail: form.organizationEmail,
      email: form.email,
      first_name: form.firstName,
      middle_name: form.middleName,
      last_name: form.lastName,
      other_name: form.otherName,
      organization: form.organization,
      discipline: form.discipline,
      existing_account: form.existingFlag,
      // password: Joi.string().required() //need to work on pattern
    };
    if (props.value == 'myAccount') {
      dispatch(registerAffiliate(data, navigate, handleNext));
    } else if (props?.value?.value == 'invite') {
      data.id = props?.value?.data?.id;
      data.code = props?.value?.code;
      dispatch(inviteRegister(data, navigate, handleNext));
    } else {
      dispatch(register(data, navigate, handleNext));
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1>
            <b>
              Enter Your Email Address Associated with Organization. This email
              address will be used to verify your affiliation with the
              organization.
            </b>
          </h1>
          <TextField
            size={'small'}
            style={{ marginTop: '40px' }}
            variant={variant}
            margin={margin}
            fullWidth
            label="Organization Email"
            name="organizationEmail"
            placeholder="Organization Email"
            type="text"
            value={organizationEmail.value}
            onChange={handleChange}
            error={!!organizationEmail.error}
            helperText={organizationEmail.error}
            required={organizationEmail.required}
            disabled={props?.value?.value == 'invite' ? true : false}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button
          color="success"
          variant="contained"
          disabled={isError()}
          onClick={handleSubmit}
        >
          Verify
        </Button>
      </Box>
    </>
  );
}
