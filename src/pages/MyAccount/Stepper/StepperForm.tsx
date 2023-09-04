import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import FirstStep from '../../register/stepper/FirstStep';
import SecondStep from '../../register/stepper/SecondStep';
import Success from '../../register/stepper/Success';
import { AppContext } from '../../register/stepper/Context';
import ThirdStep from '../../register/stepper/ThirdStep';
import FourthStep from '../../register/activatedStepper/FourthStep';
import FifthStep from '../../register/activatedStepper/FifthStep';
import Confirm from '../../register/activatedStepper/Confirm';
import First from '../../register/activatedStepper/FirstStep';

// Step titles
const labels = ['Second Step', 'Third Step'];

export default function StepForm(props: any) {
  const { activeStep } = useContext(AppContext);

  const handleSteps = (step: number) => {
    switch (step) {
      case 0:
        return <SecondStep value="myAccount" />;
      case 1:
        return <ThirdStep value="myAccount" />;
      // case 2:
      //   return <First />;
      // case 3:
      //   return <Confirm />;
      default:
        throw new Error('Unknown step');
    }
  };

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
