import React from 'react';
import Typography from '@mui/material/Typography';

export default function Success() {
  return (
    <>
      <Typography variant="h2" align="center" sx={{ py: 4 }}>
        Email Sent
      </Typography>
      <Typography component="p" align="center">
        Please check your Email for a Account activation Link
      </Typography>
    </>
  );
}
