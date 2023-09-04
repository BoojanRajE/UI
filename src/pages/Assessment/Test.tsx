import React, { useState } from 'react';
import { makeStyles } from '@mui/material';
import { MobileStepper, MenuItem, Select } from '@mui/material';

const Test = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

  const handleStepChange = (event: any) => {
    setActiveStep(Number(event.target.value));
  };

  const useStyles: any = makeStyles((theme: any) => ({
    root: {
      maxWidth: 400,
      flexGrow: 1,
    },
    select: {
      marginLeft: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MobileStepper
        variant="text"
        steps={steps.length}
        position="static"
        activeStep={activeStep}
        backButton={
          <button
            onClick={() =>
              setActiveStep((prevActiveStep) => prevActiveStep - 1)
            }
          >
            Back
          </button>
        }
        nextButton={
          <button
            onClick={() =>
              setActiveStep((prevActiveStep) => prevActiveStep + 1)
            }
          >
            Next
          </button>
        }
        // title={
        //   <>
        //     <Select
        //       className={classes.select}
        //       value={activeStep}
        //       onChange={handleStepChange}
        //     >
        //       {steps.map((step, index) => (
        //         <MenuItem key={step} value={index}>
        //           {step}
        //         </MenuItem>
        //       ))}
        //     </Select>
        //   </>
        // }
      />
    </div>
  );
};

export default Test;
