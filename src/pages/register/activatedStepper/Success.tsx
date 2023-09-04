import React from 'react';
import Typography from '@mui/material/Typography';
import { Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Success() {
  return (
    <>
      <Typography variant="h3" align="center" sx={{ py: 4 }}>
        Account Setup
      </Typography>
      <Typography component="p" align="center">
        Your Account Setup Process is Completed, Wait for a approval mail from
        LASSO Team
      </Typography>
      <Box textAlign="center">
        <Button
          variant="contained"
          style={{ marginTop: '20px' }}
          component={Link}
          to="/login"
        >
          Ok
        </Button>
      </Box>
    </>
  );
}
