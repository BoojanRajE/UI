import { Button } from '@mui/material';
import { CustomButtonProps } from '../interfaces/CustomButton';

export const CustomButton = ({ label, onClick, ...rest }: CustomButtonProps) => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        fullWidth
        {...rest}
      >
        {label}
      </Button>
    );
  };
