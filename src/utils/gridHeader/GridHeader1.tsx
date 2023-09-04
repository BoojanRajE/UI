import { Button, InputAdornment, TextField } from "@mui/material";
import { BsSearch } from "react-icons/bs";

const GridHeader1 = (props: any) => {
  const { textFieldProps, buttonProps } = props;

  return (
    <div className="text-end pr-5 flex gap-x-16 justify-end items-center">
      <TextField
        size="small"
        id="search-field"
        placeholder="Search..."
        onChange={(e) => textFieldProps.onChange(e)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BsSearch />
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        size="large"
        component="label"
        onClick={buttonProps.onClick}
        sx={{ textTransform: "capitalize", height: "40px" }}
      >
        {buttonProps.name}
      </Button>
    </div>
  );
};

export default GridHeader1;
