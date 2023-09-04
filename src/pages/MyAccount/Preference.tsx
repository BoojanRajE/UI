import { Input, Button } from '@mui/material';
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
} from 'react';
import {
  update,
  getUserDetailsById,
} from '../../reduxStore/reducer/registerReducer';
import { updateUserDetails } from '../../reduxStore/reducer/registerReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import Checkbox from '@mui/material/Checkbox';
import { AppContext } from '../register/activatedStepper/Context';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';

function Preference({ userData }: any) {
  const { formValues, handleChange, handleBack, handleNext, variant, margin } =
    useContext(AppContext);
  const { communications, workshops, lasso, research, program, none } =
    formValues;

  const dispatch = useDispatch<AppDispatch>();

  const [initialValue, setInitialValue] = useState<any>(
    userData?.id != null ? { ...userData } : {}
  );

  //

  const data: string[] = userData?.email_messages;

  const obj: { [key: string]: boolean } = {};
  data?.map((data: string) => {
    obj[data] = true;
  });

  const [checkedItems, setCheckedItems] = useState<any>(obj);

  useEffect(() => {
    setCheckedItems(obj);
  }, [userData]);

  useEffect(() => {
    setInitialValue({
      ...initialValue,
      email_messages: Object.entries(checkedItems)
        .map(([key, value]) => {
          if (value) return key || '';
        })
        .filter((i) => i),
    });
  }, [checkedItems]);

  const onMessageChange = (event: any) => {
    if (event.target.name == 'none') {
      setCheckedItems({ [event.target.name]: event.target.checked });
    } else {
      setCheckedItems({
        ...checkedItems,
        [event.target.name]: event.target.checked,
      });
    }
  };

  const onSubmit = () => {
    setInitialValue({
      ...initialValue,
      email_messages: Object.entries(checkedItems)
        .map(([key, value]) => {
          if (value == true) return key || '';
        })
        .filter((i) => i),
    });
    dispatch(updateUserDetails(initialValue));
  };

  return (
    <div>
      <h1 className="text-3xl font-large p-2">Preferences</h1>
      {/* <div className=" grid max-w-2xl mt-6 max-xxs:mx-2 xxs:mx-4 sm:grid-cols-2 p-2"> */}
      <label className="text-xl font-large p-4">LASSO email options</label>

      {userData?.id != null ? (
        <div>
          <p className="text-base font-medium px-4 my-2 pb-2">
            We periodically and infrequently sends emails to members. Select the
            topics that you are interested in receiving emails about.
          </p>
          <Grid item xs={12} className="p-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    checkedItems['communications'] == true ? true : false
                  }
                  onChange={onMessageChange}
                  name="communications"
                  color="primary"
                  disabled={checkedItems?.['none'] === true ? true : false}
                  //required={communications.required}
                  size="small"
                />
              }
              label="All communications"
            />
          </Grid>
          <Grid item xs={12} sm={12} className="p-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedItems['workshops'] == true ? true : false}
                  onChange={onMessageChange}
                  name="workshops"
                  color="primary"
                  disabled={checkedItems?.['none'] === true ? true : false}
                  //required={workshops.required}
                  size="small"
                />
              }
              label="LASSO related workshops"
            />
          </Grid>
          <Grid item xs={12} sm={12} className="p-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedItems['lasso'] == true ? true : false}
                  onChange={onMessageChange}
                  name="lasso"
                  color="primary"
                  disabled={checkedItems?.['none'] === true ? true : false}
                  //required={lasso.required}
                  size="small"
                />
              }
              label="LASSO updates"
            />
          </Grid>
          <Grid item xs={12} sm={12} className="p-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedItems['research'] == true ? true : false}
                  onChange={onMessageChange}
                  name="research"
                  color="primary"
                  disabled={checkedItems?.['none'] === true ? true : false}
                  //required={research.required}
                  size="small"
                />
              }
              label="LASSO related research"
            />
          </Grid>
          <Grid item xs={12} sm={12} className="p-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedItems['none'] == true ? true : false}
                  onChange={onMessageChange}
                  name="none"
                  color="primary"
                  //required={none.required}
                  size="small"
                />
              }
              label="None/Unsubscribed"
            />
          </Grid>
          {/* </div> */}
          <div className="flex justify-center gap-10 mt-7 mb-5">
            <Button type="submit" onClick={onSubmit} variant="contained">
              Save
            </Button>
            {/* <Button
              variant="contained"
              color="error"
              //onClick={() => navigate("/organization")}
            >
              Cancel
            </Button> */}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default Preference;
