import { TextField } from '@mui/material';
import { CustomTextFieldProps } from '../interfaces/CustomTextField';

export const CustomTextField = ({ label, value, onChange, ...rest }: CustomTextFieldProps) => {
    return (
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        variant="outlined"
        margin="normal"
        fullWidth
        {...rest}
      />
    );
  };
