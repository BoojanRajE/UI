import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import FirstStep from "../../register/activatedStepper/FirstStep";
import SecondStep from "../../register/activatedStepper/SecondStep";
import Success from "../../register/activatedStepper/Success";
import { AppContext } from "../../register/activatedStepper/Context";
import ThirdStep from "../../register/activatedStepper/ThirdStep";
import FourthStep from "../../register/activatedStepper/FourthStep";
import Confirm from "../../register/activatedStepper/Confirm";

// Step titles
const labels = [
  "First Step",
  //   "Second Step",
  //   "Third Step",
  //   "Fourth Step",
  "Confirmation",
];
const handleSteps = (step: number) => {
  switch (step) {
    // case 0:
      // return <FirstStep />;
    // case 1:
    //   return <SecondStep />;
    case 0:
      return <ThirdStep value='takeAssessment'/>;
    // case 3:
    //   return <FourthStep />;
    // case 1:
    //   return <Confirm value="myAccount" />;
    default:
      throw new Error("Unknown step");
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
