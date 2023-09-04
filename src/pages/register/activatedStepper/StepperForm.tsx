import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import Success from './Success';
import { AppContext } from './Context';
import ThirdStep from './ThirdStep';
import FourthStep from './FourthStep';
import Confirm from './Confirm';

// Step titles
const labels = [
  'First Step',
  'Second Step',
  'Third Step',
  'Fourth Step',
  'Confirmation',
];
const handleSteps = (step: number) => {
  switch (step) {
    case 0:
      return <FirstStep />;
    case 1:
      return <SecondStep />;
    case 2:
      return <ThirdStep />;
    case 3:
      return <FourthStep />;
    case 4:
      return <Confirm />;
    default:
      throw new Error('Unknown step');
  }
};

export default function StepForm() {
  const { activeStep } = useContext(AppContext);

  return (
    <>
      {activeStep === labels.length ? (
        <Success />
      ) : (
        <>{handleSteps(activeStep)}</>
      )}
    </>
  );
}
