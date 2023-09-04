import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { AnyMap } from "immer/dist/internal";

const isGridLoading = (loading: any, grid_ref: any) => {
  if (loading) {
    grid_ref?.showLoadingOverlay();
  } else {
    grid_ref?.hideOverlay();
  }
};

const GridLoading = (props: any) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
};

export { isGridLoading, GridLoading };
