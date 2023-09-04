import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import FirstStep from '../register/activatedStepper/FirstStep';
import { AppContext } from './Context';

// Step titles
const labels = ['First Step'];
const handleSteps = (step: number) => {
  switch (step) {
    case 0:
      return <FirstStep />;
    default:
      throw new Error('Unknown step');
  }
};

export default function StepForm() {
  const { activeStep } = useContext(AppContext);

  return (
    <>{activeStep === labels.length ? '' : <>{handleSteps(activeStep)}</>}</>
  );
}
