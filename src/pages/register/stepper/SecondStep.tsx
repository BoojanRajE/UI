import React, { useCallback, useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { AppContext } from './Context';
import Select, { components, IndicatorsContainerProps } from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOrganisationData,
  getOrganizationName,
} from '../../../reduxStore/reducer/organisationReducer';
import { AppDispatch, RootState } from '../../../reduxStore/Store';
import AddOrganisation from '../../organisation/AddOrganisation';

export default function SecondStep(props: any) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [openOrg, setOpenOrg] = React.useState(false);

  const { formValues, handleChange, handleBack, handleNext, variant, margin } =
    useContext(AppContext);
  const { organization, organizationLabel } = formValues;

  const isError = useCallback(
    () =>
      Object.keys({ organization, organizationLabel }).some(
        (name) =>
          (formValues[name].required && !formValues[name].value) ||
          formValues[name].error
      ),
    [organization, organizationLabel]
  );

  const organizationData: any = useSelector((state: RootState) => {
    const data = state.organization.organizationName;
    return data.map((ele: any) => {
      return { value: ele.id, name: 'organization', label: ele.name };
    });
  });
  // const organisation = organisationData.organizations;

  useEffect(() => {
    dispatch(getOrganizationName());
  }, [dispatch]);

  if (props?.value?.value == 'invite') {
    const user = props?.value?.data;
    const { organization_id, organization: name } = user;
    organization.value = organization_id;
    organizationLabel.value = name;
  }

  const IndicatorsContainer = (props: IndicatorsContainerProps<any>) => {
    return (
      <div>
        <components.IndicatorsContainer {...props} />
      </div>
    );
  };

  const [organizationState, setOrganizationState] = React.useState({
    value: organization.value,
    label: organizationLabel.value,
  });

  const defaultValue = {
    value: organization?.value || organizationState.value,
    name: 'organization',
    label: organizationLabel?.value || organizationState.label,
  };

  const columnchange = async (e: any) => {
    organization.value = e.value;
    organizationLabel.value = e.label;
    setOrganizationState({ value: organization.value, label: e.label });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1>
            <b>Select Your Campus or Organization</b>
          </h1>

          <Select
            name="organization"
            value={defaultValue}
            className="mt-10"
            // tabSelectsValue={organization.value}
            // value={organization.value}
            // defaultInputValue={organization.value || ''}
            // defaultValue={organization.value}
            closeMenuOnSelect={true}
            components={{ IndicatorsContainer }}
            options={organizationData}
            onChange={(e) => columnchange(e)}
            isDisabled={props?.value?.value == 'invite' ? true : false}
          />
        </Grid>
      </Grid>

      <Box
        sx={
          props?.value?.value == 'invite'
            ? { mt: 3, display: 'flex', justifyContent: 'flex-end' }
            : { mt: 3, display: 'flex', justifyContent: 'space-between' }
        }
      >
        <Button
          onClick={() => setOpenOrg(true)}
          sx={{ mt: 3 }}
          style={props?.value?.value == 'invite' ? { display: 'none' } : {}}
        >
          Add Organization
        </Button>
        <Box sx={{ mt: 3 }}>
          <Button
            onClick={handleBack}
            sx={{ mr: 1 }}
            disabled={props.value == 'myAccount' ? true : false}
          >
            Back
          </Button>

          <Button
            variant="contained"
            disabled={!organizationState?.value}
            color="primary"
            onClick={!isError() ? handleNext : () => null}
          >
            Next
          </Button>
        </Box>
      </Box>

      <AddOrganisation
        open={openOrg}
        setOpen={setOpenOrg}
        setOrganizationState={setOrganizationState}
        organization={organization}
        organizationLabel={organizationLabel}
        state="signup"
      />
    </>
  );
}
