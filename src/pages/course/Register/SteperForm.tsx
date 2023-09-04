import React, { useContext, useEffect } from 'react';
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
import { getUserAndOrganizationById } from '../../../reduxStore/reducer/registerReducer';
import { AppDispatch, RootState } from '../../../reduxStore/Store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// Step titles
const labels = ['First Step', 'Second Step', 'Confirmation'];

export default function StepForm() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUserAndOrganizationById({ id: id }));
  }, [dispatch]);

  const userData = useSelector((state: any) => {
    const data: any = { ...state.register.getUserById };
    data.value = 'invite';
    data.code = id;
    return data;
  });

  const { activeStep } = useContext(AppContext);

  const handleSteps = (step: number) => {
    switch (step) {
      case 0:
        return <FirstStep value={userData} />;
      case 1:
        return <SecondStep value={userData} />;
      case 2:
        return <ThirdStep value={userData} />;
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
