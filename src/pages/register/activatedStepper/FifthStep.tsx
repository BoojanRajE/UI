import React, { useCallback, useContext } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { AppContext } from './Context';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Radio, RadioGroup } from '@mui/material';

export default function ThirdStep() {
  const { formValues, handleChange, handleBack, handleNext, variant, margin } =
    useContext(AppContext);
  const { ethnicity, gender, race, parent, units, roles } = formValues;

  const isError = useCallback(
    () =>
      Object.keys({
        ethnicity,
        gender,
        race,
        parent,
        units,
        roles,
      }).some(
        (name) =>
          (formValues[name].required && !formValues[name].value) ||
          formValues[name].error
      ),
    [ethnicity, gender, race, parent, units, roles]
  );

  return (
    <>
      <Grid container spacing={2}>
        <h2>{units.value}</h2>
        <Grid item xs={12} sm={12}>
          <h2>
            <b>Roles</b>
          </h2>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={roles.value}
              name="roles"
              // value={gender.value}
              onClick={handleChange}
              // onChange={handleChange}
            >
              <FormControlLabel
                value="President"
                control={<Radio size="small" />}
                label="President"
              />
              <FormControlLabel
                value="Chancellor"
                control={<Radio size="small" />}
                label="Chancellor"
              />
              <FormControlLabel
                value="Assistant / Associate Chancellor"
                control={<Radio size="small" />}
                label="Assistant / Associate Chancellor"
              />
              <FormControlLabel
                value="Provost"
                control={<Radio size="small" />}
                label="Provost"
              />

              <FormControlLabel
                value="Assistant / Associate Provost"
                control={<Radio size="small" />}
                label="Assistant / Associate Provost"
              />

              <FormControlLabel
                value="Genderqueer/Gender non-conforming"
                control={<Radio size="small" />}
                label="Genderqueer/Gender non-conforming"
              />

              <FormControlLabel
                value="Dean"
                control={<Radio size="small" />}
                label="Dean"
              />

              <FormControlLabel
                value="Chair"
                control={<Radio size="small" />}
                label="Chair"
              />
              <FormControlLabel
                value="Instructor"
                control={<Radio size="small" />}
                label="Instructor"
              />
              <FormControlLabel
                value="Faculty"
                control={<Radio size="small" />}
                label="Faculty"
              />
              <FormControlLabel
                value="Lecturer"
                control={<Radio size="small" />}
                label="Lecturer"
              />
              <FormControlLabel
                value="Staff"
                control={<Radio size="small" />}
                label="Staff"
              />
              <FormControlLabel
                value="Administrative"
                control={<Radio size="small" />}
                label="Administrative"
              />

              <FormControlLabel
                value="Director"
                control={<Radio size="small" />}
                label="Director"
              />
              <FormControlLabel
                value="Assistant / Associate Director"
                control={<Radio size="small" />}
                label="Assistant / Associate Director"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button
          variant="contained"
          disabled={isError()}
          color="primary"
          onClick={!isError() ? handleNext : () => null}
        >
          Next
        </Button>
      </Box>
    </>
  );
}
