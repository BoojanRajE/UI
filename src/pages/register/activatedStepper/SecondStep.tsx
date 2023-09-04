import React, { useCallback, useContext } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { AppContext } from './Context';
import Select, { components, IndicatorsContainerProps } from 'react-select';

export default function SecondStep() {
  const { formValues, handleChange, handleBack, handleNext, variant, margin } =
    useContext(AppContext);
  const { communications, workshops, lasso, research, program, none } =
    formValues;

  const isError = useCallback(
    () =>
      Object.keys({
        communications,
        workshops,
        lasso,
        research,
        program,
        none,
      }).some(
        (name) =>
          (formValues[name].required && !formValues[name].value) ||
          formValues[name].error
      ),
    [communications, workshops, lasso, research, program, none, formValues]
  );

  const condition =
    program.value !== false ||
    communications.value !== false ||
    workshops.value !== false ||
    lasso.value !== false ||
    research.value !== false ||
    none.value !== false;

  return (
    <>
      <Grid container spacing={2}>
        <h1>
          <b>LASSO email options</b>
        </h1>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={communications.value}
                onChange={handleChange}
                name="communications"
                color="primary"
                disabled={none.value}
                required={communications.required}
                size="small"
              />
            }
            label="All communications"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={workshops.value}
                onChange={handleChange}
                name="workshops"
                color="primary"
                disabled={none.value}
                required={workshops.required}
                size="small"
              />
            }
            label="LASSO related workshops"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={lasso.value}
                onChange={handleChange}
                name="lasso"
                color="primary"
                disabled={none.value}
                required={lasso.required}
                size="small"
              />
            }
            label="LASSO updates"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={research.value}
                onChange={handleChange}
                name="research"
                color="primary"
                disabled={none.value}
                required={research.required}
                size="small"
              />
            }
            label="LASSO related research"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={program.value}
                onChange={handleChange}
                name="program"
                color="primary"
                disabled={none.value}
                required={program.required}
                size="small"
              />
            }
            label="LA Program Resources"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={none.value}
                onChange={handleChange}
                name="none"
                color="primary"
                required={none.required}
                size="small"
              />
            }
            label="None/Unsubscribed
            "
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button
          variant="contained"
          disabled={!condition}
          color="primary"
          onClick={condition ? handleNext : () => null}
        >
          Next
        </Button>
      </Box>
    </>
  );
}
