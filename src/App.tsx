import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./reduxStore/Store";
import MainRoutes from "./routes/MainRoutes";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { LicenseManager } from "ag-grid-enterprise";

const theme = createTheme({
  typography: {
    fontFamily: "verdana, sans-serif",
  },
});
LicenseManager.setLicenseKey(
  "CompanyName=VanAm Tool & Engineering,LicensedApplication=VanAm Tool & Engineering Dashboard,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-035594,SupportServicesEnd=28_February_2024_[v2]_MTcwOTA3ODQwMDAwMA==afe1be97e6af061b6ee8fe664bc2a567"
  );


function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        {/* <ThemeProvider theme={theme}> */}
        {/* <StyledEngineProvider injectFirst> */}
        {/* <CssBaseline /> */}
        <MainRoutes />
        {/* </StyledEngineProvider> */}
        {/* </ThemeProvider> */}
      </Provider>
    </BrowserRouter>
  );
}

export default App;
