import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";

const TxtField = ({ name, ...otherProps }: { name: string, otherProps: TextFieldProps }) => {
  const [field, meta] = useField(name);

  const configTextfield: any = {
    ...field,
    ...otherProps,
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return <TextField {...configTextfield} />;
};

export default TxtField;
