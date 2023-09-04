import React, { useCallback, useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AppContext } from './Context';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDiscipline,
  getDisciplineDetails,
} from '../../../reduxStore/reducer/disciplineReducer';
// import { getSubDisciplineAction } from '../../../reduxStore/reducer/subDisciplineReducer';
import { AppDispatch, RootState } from '../../../reduxStore/Store';
import Select, { components, IndicatorsContainerProps } from 'react-select';
import Dialog from '@mui/material/Dialog';
import Link from '@mui/material/Link';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox, IconButton } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { GrFormClose } from 'react-icons/gr';
import { date } from 'yup';
import { getSubDisciplineDetailAction } from '../../../reduxStore/reducer/subDisciplineReducer';

export default function FirstStep(props: any) {
  const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate();
  const { formValues, handleChange, handleNext, variant, margin } =
    useContext(AppContext);
  const { firstName, lastName, discipline, middleName, email, existingFlag } =
    formValues;

  // Check if all values are not empty and if there are some errors
  const isError = useCallback(
    () =>
      Object.keys({ firstName, lastName, discipline, email }).some(
        (name) =>
          (formValues[name].required && !formValues[name].value) ||
          formValues[name].error
      ),
    [formValues, firstName, lastName, discipline, email]
  );

  const disciplineData: any = useSelector((state: RootState) => {
    const data = state.discipline.getDisciplineDetails;
    return data.map((ele: any) => {
      return { value: ele.id, name: 'discipline', label: ele.name };
    });
  });

  // disciplineData.sort((a: any, b: any) => (a.label > b.label ? 1 : -1));

  let subDisciplineData: any = useSelector(
    (state: RootState) => state.subdiscipline.getAllSubDisciplineDetail
  );

  useEffect(() => {
    dispatch(getDisciplineDetails());
    dispatch(getSubDisciplineDetailAction());
  }, [dispatch]);

  useEffect(() => {
    const hasRenderedBefore: any = localStorage.getItem(
      'hasRenderedBeforeInvite'
    );

    if (
      !hasRenderedBefore ||
      hasRenderedBefore == 'false' ||
      hasRenderedBefore == null
    ) {
      if (props?.value?.value == 'invite') {
        if (props?.value?.data?.id) {
          const user = props?.value?.data;
          const { last_name, first_name, middle_name } = user;
          firstName.value = first_name;
          lastName.value = last_name;
          middleName.value = middle_name;
          localStorage.setItem('hasRenderedBeforeInvite', 'true');
        }
      }
    }
  }, [props]);

  const IndicatorsContainer = (props: IndicatorsContainerProps<any>) => {
    return (
      <div>
        <components.IndicatorsContainer {...props} />
      </div>
    );
  };

  const [subDisciplineAlterData, setSubDisciplineAlterData] = useState<any>();

  const [val, setVal] = React.useState<any>({
    discipline: '',
    subDiscipline: '',
    data: [],
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSubDisciplineAlterData([]);
    setVal({ ...val, discipline: '', subDiscipline: '' });
    setOpen(false);
  };

  const handleAdd = () => {
    const value = { ...val };

    const isExist = value.data.findIndex(
      (o: any) =>
        o.discipline.label === val.discipline.label &&
        o.subDiscipline.label === val.subDiscipline.label
    );
    if (isExist !== -1) {
      value.data[isExist] = {
        discipline: val.discipline,
        subDiscipline: val.subDiscipline,
      };
    } else {
      value?.data?.push({
        discipline: val.discipline,
        subDiscipline: val.subDiscipline,
      });
    }
    setVal(value);
    discipline.value = val.data;
    setOpen(false);
    setVal({ ...val, discipline: '', subDiscipline: '' });
  };

  const handledelete = (index: any) => {
    let deleteval = { ...val };
    // if (deleteval.data.length <= 1) return;
    deleteval.data.splice(index, 1);
    setVal(deleteval);
  };

  const columnchange = async (e: any) => {
    const { name, value, label } = e;
    if (name == 'discipline') {
      let data = subDisciplineData.filter((x: any) => {
        return x.discipline_id == value;
      });
      data = data.map((item: any) => ({
        value: item.id,
        name: 'subDiscipline',
        label: item.name,
      }));
      setSubDisciplineAlterData(data);
    }
    setVal({ ...val, [name]: { value, label } });
  };

  const handleCheckBoxChange = (e: any) => {
    existingFlag.value = e.target.checked;
    handleChange(e);
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <h1>
            <b>Sign Up</b>
          </h1>
          <TextField
            variant={variant}
            margin={margin}
            fullWidth
            label="First Name"
            name="firstName"
            placeholder="Your first name"
            value={firstName.value}
            onChange={handleChange}
            error={!!firstName.error}
            helperText={firstName.error}
            required={firstName.required}
            // disabled={props?.value?.value == 'invite' ? true : false}
          />
        </Grid>

        <Grid item xs={12} sm={12}>
          <TextField
            variant={variant}
            margin={margin}
            fullWidth
            label="Middle Name"
            name="middleName"
            placeholder="Your last name"
            value={middleName.value}
            onChange={handleChange}
            error={!!middleName.error}
            helperText={middleName.error}
            required={middleName.required}
            // disabled={props?.value?.value == 'invite' ? true : false}
          />
        </Grid>

        <Grid item xs={12} sm={12}>
          <TextField
            variant={variant}
            margin={margin}
            fullWidth
            required={lastName.required}
            label="Last Name"
            name="lastName"
            placeholder="Your last name"
            value={lastName.value}
            onChange={handleChange}
            error={!!lastName.error}
            helperText={lastName.error}
            // disabled={props?.value?.value == 'invite' ? true : false}
          />
        </Grid>

        <Grid item xs={12} sm={12}>
          <TextField
            variant={variant}
            margin={margin}
            fullWidth
            required={email.required}
            label="Email"
            name="email"
            placeholder="Your Email"
            value={email.value}
            onChange={handleChange}
            error={!!email.error}
            helperText={email.error}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <div>
              <Checkbox
                size="small"
                checked={existingFlag.value}
                onChange={handleCheckBoxChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
            <div style={{ fontSize: '13px' }}>
              {' '}
              I have an existing account on the Learning Assistant Alliance's
              LASSO v1.0 platform and would like my data transitioned to the
              LASSO v2.0 platform.
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={12}>
          <>
            {/* <div style={{ marginTop: '30px' }} className="template_type"> */}
            <div className="flex flex-col">
              <ul>
                {discipline &&
                  discipline?.value?.map((data: any, i: any) => {
                    return (
                      <li className="list-disc list-inside">
                        {`${data.discipline?.label} ${
                          data.subDiscipline?.label ? '-' : ''
                        }${data.subDiscipline?.label || ''} `}

                        {`(`}
                        <IconButton color="error" size="small">
                          <AiFillDelete onClick={() => handledelete(i)} />
                        </IconButton>
                        {`)`}
                      </li>
                    );
                  })}
              </ul>
            </div>
            {/* </div> */}
          </>
          {/* <Dialog
            PaperProps={{
              sx: {
                width: '100%',
                maxWidth: '720px!important',

                height: '500px',
              },
            }}
            open={open}
            onClose={handleClose}
            fullWidth
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <Box display="flex" alignItems="center">
                <Box flexGrow={1}>
                  {'Pick the best fit for your discipline?'}
                </Box>
                <Box>
                  <IconButton onClick={handleClose}>
                    <GrFormClose />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                style={{ height: '80%', width: '100%' }}
              >
                <Grid item>
                  <h2>
                    <b>Pick your field:</b>
                  </h2>
                  <div style={{ width: '310px' }}>
                    <Select
                      classNamePrefix="mySelect"
                      maxMenuHeight={200}
                      menuIsOpen={true}
                      name="discipline"
                      isClearable={true}
                      closeMenuOnSelect={false}
                      components={{ IndicatorsContainer }}
                      options={disciplineData}
                      onChange={(e) => columnchange(e)}
                    />
                  </div>
                </Grid>
                <Grid item>
                  <h2>
                    <b>Add an optional specialty:</b>
                  </h2>
                  <div style={{ width: '310px', height: '400px' }}>
                    <Select
                      classNamePrefix="mySelect"
                      name="subDiscipline"
                      isClearable={true}
                      menuIsOpen={true}
                      isSearchable={true}
                      closeMenuOnSelect={false}
                      components={{ IndicatorsContainer }}
                      options={subDisciplineAlterData}
                      onChange={(e) => columnchange(e)}
                    />
                  </div>
                </Grid>
              </Grid>
              <div className="grid grid-cols-2 items-center">
                <p>
                  <b>Selected Field: </b>
                  {val?.discipline.label}
                </p>
              </div>
              <div className="grid grid-cols-2 items-center">
                <p>
                  <b>Specialty: </b>
                  {val?.subDiscipline.label}
                </p>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant="contained">
                Close
              </Button>
              <Button
                onClick={handleAdd}
                variant="contained"
                disabled={val.discipline == ''}
                autoFocus
              >
                Add
              </Button>
            </DialogActions>
          </Dialog> */}
        </Grid>
        {/* <Link
          component="button"
          onClick={() => {
            setOpen(true);
          }}
          style={{ paddingLeft: '20px' }}
        >
          Click to Add a Discipline
        </Link> */}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          sx={{ mt: 3, ml: 1 }}
          disabled={isError()}
          color="primary"
          onClick={!isError() ? handleNext : () => null}
        >
          Next
        </Button>
      </Box>
    </>
  );
}
