import {
  TextFieldProps,
  ButtonProps
} from "@mui/material";
import { ResponsiveButtonProps } from "./ResponsiveButtonProps";

export interface GridHeader2Props {
  textFieldProps: TextFieldProps;
  buttonProps: ButtonProps & ResponsiveButtonProps;
}


