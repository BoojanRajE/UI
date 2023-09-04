import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import StepForm from './SteperForm';
import { StepsProvider } from '../../register/stepper/Context';

const theme = createTheme();

const Index = () => (
  <StepsProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <StepForm />
        </Paper>
      </Container>
    </ThemeProvider>
  </StepsProvider>
);

export default Index;
