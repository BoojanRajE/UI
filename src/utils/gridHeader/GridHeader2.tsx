import { TextField, Button, InputAdornment, Stack } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { GridHeader2Props } from '../interfaces/GridHeader2Props';
import { organizationIcon, searchIcon } from '../icons';

const GridHeader2 = ({ textFieldProps, buttonProps }: GridHeader2Props) => {
  let { sm, md, lg, children, ...rest } = buttonProps;
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery(
    '(min-width:601px) and (max-width:960px)'
  );
  const isLargeScreen = useMediaQuery('(min-width:961px)');

  const renderChildren = () => {
    if (isSmallScreen && sm) {
      return sm;
    } else if (isMediumScreen && md) {
      return md;
    } else if (isLargeScreen && lg) {
      return lg;
    } else {
      return children;
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      spacing={3}
      p={1}
    >
      <TextField
        {...textFieldProps}
        size="small"
        variant="outlined"
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{searchIcon}</InputAdornment>
          ),
        }}
      />

      <Button
        {...rest}
        children={renderChildren()}
        size="medium"
        variant="contained"
        color="primary"
        // startIcon={organizationIcon}
      />
    </Stack>
  );
};

export default GridHeader2;
