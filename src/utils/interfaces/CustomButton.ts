import { ButtonProps } from '@mui/material';

export interface CustomButtonProps extends ButtonProps {
  label?: string;
  onClick: () => void;
}





