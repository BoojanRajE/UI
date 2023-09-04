import React, { useState, useEffect, useCallback, useContext } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { AppContext } from './Context';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Radio, RadioGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxStore/Store';
import { getAllMetaDataByType } from '../../../reduxStore/reducer/metaDataReducer';
import { useLocation, useNavigate } from 'react-router';

export default function ThirdStep(props: any) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { formValues, handleChange, handleBack, handleNext, variant, margin } =
    useContext(AppContext);

  const {
    ethnicity,
    gender,
    race,
    role_in_class,
    status_in_school,
    parent,
    first_time_course,
    genderAnotherIdentity,
    ethnicityAnotherIdentity,
    raceAnotherIdentity,
    otherData,
  } = formValues;

  const genderOtherCondition: any = Object.entries(gender.value)
    .map(([key, value]) => {
      if (value) return key || '';
    })
    .filter((i) => i);

  const ethnicityOtherCondtition: any = Object.entries(ethnicity.value)
    .map(([key, value]) => {
      if (value) return key || '';
    })
    .filter((i) => i);
  const raceOtherCondition: any = Object.entries(race.value)
    .map(([key, value]) => {
      if (value) return key || '';
    })
    .filter((i) => i);
  useEffect(() => {
    dispatch(getAllMetaDataByType('gender'));
    dispatch(getAllMetaDataByType('race'));
    dispatch(getAllMetaDataByType('ethnicity'));
    dispatch(getAllMetaDataByType('parent'));
    dispatch(getAllMetaDataByType('first_time_course'));

    dispatch(getAllMetaDataByType('role_in_class'));
    dispatch(getAllMetaDataByType('status_in_school'));
  }, [dispatch]);

  const metaData: any = useSelector((state: RootState) => state.metaData);
  const isError = useCallback(
    () =>
      Object.keys({
        ethnicity,
        gender,
        race,
        role_in_class,
        status_in_school,
        parent,
        first_time_course,
        genderAnotherIdentity,
        ethnicityAnotherIdentity,
        raceAnotherIdentity,
        otherData,
      }).some(
        (name) =>
          (formValues[name].required && !formValues[name].value) ||
          formValues[name].error
      ),

    [
      ethnicity,
      gender,
      race,
      role_in_class,
      status_in_school,

      parent,
      first_time_course,
      genderAnotherIdentity,
      ethnicityAnotherIdentity,
      raceAnotherIdentity,
      otherData,
    ]
  );

  const TakeAssessmentDataTransform = (data: any) => {
    const obj: any = {};
    // data.map((d: any)=>{
    //  return obj[d] = true;
    // })
    if (data?.length > 0) {
      data?.map((d: any) => {
        return (obj[d] = true);
      });
    }
    return obj;
  };

  const [other, setOther] = useState({
    gender:
      props?.value === 'takeAssessment'
        ? location?.state?.data?.gender_another_identity
        : genderAnotherIdentity?.value,
    race:
      props.value === 'takeAssessment'
        ? location?.state?.data?.race_another_identity
        : raceAnotherIdentity?.value,
    ethnicity:
      props.value === 'takeAssessment'
        ? location?.state?.data?.ethnicity_another_identity
        : ethnicityAnotherIdentity?.value,
  });

  parent.value =
    props.value === 'takeAssessment' && location?.state?.data?.parent_degree
      ? location?.state?.data?.parent_degree
      : parent.value;
  first_time_course.value =
    props.value === 'takeAssessment' && location?.state?.data?.first_time_course
      ? location?.state?.data?.first_time_course
      : first_time_course.value;
  role_in_class.value =
    props.value === 'takeAssessment' && location?.state?.data?.role_in_class
      ? location?.state?.data?.role_in_class
      : role_in_class.value;
  status_in_school.value =
    props.value === 'takeAssessment' && location?.state?.data?.status_in_school
      ? location?.state?.data?.status_in_school
      : status_in_school.value;

  const [checkedItems, setCheckedItems] = useState<any>(
    props.value === 'takeAssessment'
      ? TakeAssessmentDataTransform(location.state.data.gender)
      : gender.value
  );
  const [raceItems, setRaceItems] = useState<any>(
    props.value === 'takeAssessment'
      ? TakeAssessmentDataTransform(location.state.data.race)
      : race.value
  );
  const [ethnicityItems, setEthnicityItems] = useState<any>(
    props.value === 'takeAssessment'
      ? TakeAssessmentDataTransform(location.state.data.ethnicity)
      : ethnicity.value
  );

  const onGenderChange = (event: any) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });

    if (
      event.target.name === 'Another identity (please state):' &&
      !event.target.checked
    ) {
      ethnicityAnotherIdentity.value = '';
      setOther((prev) => ({ ...prev, gender: '' }));
    }
  };

  const onEthnicityChange = (event: any) => {
    setEthnicityItems({
      ...ethnicityItems,
      [event.target.name]: event.target.checked,
    });

    if (
      event.target.name === 'Another Hispanic/Latinx/Spanish origin:' &&
      !event.target.checked
    ) {
      ethnicityAnotherIdentity.value = '';
      setOther((prev) => ({ ...prev, ethnicity: '' }));
    }
  };

  const onRaceChange = (event: any) => {
    setRaceItems({
      ...raceItems,

      [event.target.name]: event.target.checked,
    });

    if (
      event.target.name === 'Another race/other races:' &&
      !event.target.checked
    ) {
      ethnicityAnotherIdentity.value = '';
      setOther((prev) => ({ ...prev, race: '' }));
    }
  };

  gender.value = checkedItems;
  race.value = raceItems;
  ethnicity.value = ethnicityItems;

  const dataTransform = (data: any) => {
    return Object.entries(data)
      .map(([key, value]) => {
        if (value) return key || '';
      })
      .filter((i) => i);
  };

  const allFieldsTrue = (obj: any) => {
    // Get the names of all the properties in the object.
    const propertyNames = Object.keys(obj);

    // Iterate over the property names.
    for (const propertyName of propertyNames) {
      // Get the value of the property.
      const value = obj[propertyName];

      // If the value is not true, return false.
      if (!value) {
        return false;
      }
    }

    // All the values are true, so return true.
    return true;
  };

  const error = {
    gender:
      dataTransform(gender?.value)?.length > 0 &&
      (checkedItems['Another identity (please state):']
        ? other?.gender == ''
          ? false
          : true
        : true),
    race:
      dataTransform(race?.value)?.length > 0 &&
      (raceItems['Another race/other races:']
        ? other?.race == ''
          ? false
          : true
        : true),
    ethnicity:
      dataTransform(ethnicity?.value)?.length > 0 &&
      (ethnicityItems['Another Hispanic/Latinx/Spanish origin:']
        ? other?.ethnicity == ''
          ? false
          : true
        : true),
    parent: parent?.value ? true : false,
  };

  const assessmentError = {
    gender:
      dataTransform(gender?.value)?.length > 0 &&
      (checkedItems['Another identity (please state):']
        ? other?.gender == ''
          ? false
          : true
        : true),
    race:
      dataTransform(race?.value)?.length > 0 &&
      (raceItems['Another race/other races:']
        ? other?.race == ''
          ? false
          : true
        : true),
    ethnicity:
      dataTransform(ethnicity?.value)?.length > 0 &&
      (ethnicityItems['Another Hispanic/Latinx/Spanish origin:']
        ? other?.ethnicity == ''
          ? false
          : true
        : true),
    parent: parent?.value ? true : false,
    role_in_class: role_in_class?.value ? true : false,
    status_in_school: status_in_school?.value ? true : false,
    first_time_course: first_time_course?.value ? true : false,
  };

  const genderOnlyCondtion =
    genderOtherCondition.length > 0 &&
    (checkedItems['Another identity (please state):']
      ? other.gender == ''
        ? false
        : true
      : true);

  const ethnicityOnlyConditon =
    ethnicityOtherCondtition.length > 0 &&
    (ethnicityItems['Another Hispanic/Latinx/Spanish origin:']
      ? other.ethnicity == ''
        ? false
        : true
      : true);

  const raceOnlyConditon =
    raceOtherCondition.length > 0 &&
    (raceItems['Another race/other races:']
      ? other.race == ''
        ? false
        : true
      : true);

  const overallCond =
    genderOnlyCondtion &&
    ethnicityOnlyConditon &&
    raceOnlyConditon &&
    parent.value !== '';

  const takeAssessmentCondition =
    genderOnlyCondtion &&
    ethnicityOnlyConditon &&
    raceOnlyConditon &&
    parent.value !== '' &&
    status_in_school.value !== '' &&
    role_in_class.value !== '' &&
    first_time_course.value !== '';

  return (
    <>
      {metaData?.gender?.length > 0 &&
      metaData?.ethnicity?.length > 0 &&
      metaData?.race?.length > 0 &&
      metaData?.parent?.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <h2>
              <b>How do you describe your Gender?</b>
            </h2>
            <Grid
              container
              style={{
                // height: '260px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                flexDirection: 'column',
                margin: '8px',
              }}
            >
              {metaData.gender.map((item: any) => (
                <label key={item.value}>
                  <Checkbox
                    // disabled={gender.value['Another identity:'] == true}
                    // value={item.value}
                    id={item.value}
                    size="small"
                    name={item.value}
                    checked={checkedItems[item.value] || false}
                    onChange={onGenderChange}
                  />
                  {item.value}
                </label>
              ))}

              <Grid container item key="" style={{ display: 'flex' }}>
                <Grid xs={12} sm={4} md={6}>
                  <Checkbox
                    // value="Another identity (please state):"
                    size="small"
                    name="Another identity (please state):"
                    checked={
                      checkedItems['Another identity (please state):'] || false
                    }
                    onChange={onGenderChange}
                  />
                  {`Another identity (please state):`}
                </Grid>
                <Grid style={{ width: 'auto' }} xs={12} sm={4} md={6}>
                  <TextField
                    disabled={!checkedItems['Another identity (please state):']}
                    onChange={(e) => {
                      genderAnotherIdentity.value = e.target.value;
                      setOther((data) => ({ ...data, gender: e.target.value }));
                      // setOther({ ...other, gender: e.target.value });
                    }}
                    size="small"
                    value={other?.gender}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <h2>
              <b>What is your ethnicity?</b>
            </h2>
            <Grid
              container
              style={{
                // height: '260px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                flexDirection: 'column',
                margin: '8px',
              }}
            >
              {metaData.ethnicity.map((item: any) => (
                <label key={item.value}>
                  <Checkbox
                    // disabled={gender.value['Another identity:'] == true}
                    // value={item.value}
                    id={item.value}
                    size="small"
                    name={item.value}
                    checked={ethnicityItems[item.value] || false}
                    onChange={onEthnicityChange}
                  />
                  {item.value}
                </label>
              ))}

              <Grid container item key="" style={{ display: 'flex' }}>
                <Grid xs={12} sm={4} md={6}>
                  <Checkbox
                    // value="Another Hispanic/Latinx/Spanish origin:"
                    size="small"
                    name="Another Hispanic/Latinx/Spanish origin:"
                    checked={
                      ethnicityItems[
                        'Another Hispanic/Latinx/Spanish origin:'
                      ] || false
                    }
                    onChange={onEthnicityChange}
                  />
                  Another Hispanic/Latinx/Spanish origin:
                </Grid>
                <Grid xs={12} sm={4} md={6}>
                  <TextField
                    disabled={
                      !ethnicityItems['Another Hispanic/Latinx/Spanish origin:']
                    }
                    onChange={(e) => {
                      ethnicityAnotherIdentity.value = e.target.value;
                      setOther((data) => ({
                        ...data,
                        ethnicity: e.target.value,
                      }));
                      // setOther({ ...other, gender: e.target.value });
                    }}
                    size="small"
                    value={other?.ethnicity || ''}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <h2>
              <b>What is your race?</b>
            </h2>
            <Grid
              container
              style={{
                // height: '260px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                flexDirection: 'column',
                margin: '8px',
              }}
            >
              {metaData.race.map((item: any) => (
                <label key={item.value}>
                  <Checkbox
                    // value={item.value}
                    id={item.value}
                    size="small"
                    name={item.value}
                    checked={raceItems[item.value] || false}
                    onChange={onRaceChange}
                  />
                  {item.value}
                </label>
              ))}

              <Grid container item key="" style={{ display: 'flex' }}>
                <Grid xs={12} sm={4} md={6}>
                  <Checkbox
                    // value="Another race/other races:"
                    size="small"
                    name="Another race/other races:"
                    checked={raceItems['Another race/other races:'] || false}
                    onChange={onRaceChange}
                  />
                  Another race/other races:
                </Grid>
                <Grid xs={12} sm={4} md={6}>
                  <TextField
                    disabled={!raceItems['Another race/other races:']}
                    size="small"
                    value={other.race}
                    onChange={(e) => {
                      raceAnotherIdentity.value = e.target.value;
                      setOther((data) => ({
                        ...data,
                        race: e.target.value,
                      }));
                      // setOther({ ...other, race: e.target.value });
                    }}
                    // onChange={onRaceChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <h2>
              <b>
                Have any of your parents or guardians have received a degree
                from a 4-year college?
              </b>
            </h2>
            <FormControl style={{ paddingLeft: '21px' }}>
              <RadioGroup
                defaultValue={
                  props.value === 'takeAssessment'
                    ? location.state.data.parent_degree
                    : parent.value
                }
                name="parent"
                onClick={handleChange}
              >
                {metaData.parent.map((item: any) => (
                  <FormControlLabel
                    value={item.value}
                    control={<Radio size="small" />}
                    label={item.value}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {props.value === 'takeAssessment' && (
            <Grid item xs={12} sm={12}>
              <h2>
                <b>Is this your first time taking the course?</b>
              </h2>
              <FormControl style={{ paddingLeft: '21px' }}>
                <RadioGroup
                  defaultValue={
                    props.value === 'takeAssessment'
                      ? location.state.data.first_time_course
                      : first_time_course.value
                  }
                  // defaultValue={props.value === 'takeAssessment' ? 'dbvalue':  parent.value}
                  // defaultChecked={gender.value}
                  name="first_time_course"
                  // value={gender.value}
                  onClick={handleChange}
                  // onChange={handleChange}
                >
                  {metaData.first_time_course.map((item: any) => (
                    <FormControlLabel
                      value={item.value}
                      control={<Radio size="small" />}
                      label={item.value}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          )}
          {props.value === 'takeAssessment' && (
            <Grid item xs={12} sm={12}>
              <h2>
                <b>What is your role in this class?</b>
              </h2>
              <FormControl style={{ paddingLeft: '21px' }}>
                <RadioGroup
                  defaultValue={
                    props.value === 'takeAssessment'
                      ? location.state.data.role_in_class
                      : role_in_class.value
                  }
                  name="role_in_class"
                  onClick={handleChange}
                >
                  {metaData.role_in_class.map((item: any) => (
                    <FormControlLabel
                      value={item.value}
                      control={<Radio size="small" />}
                      label={item.value}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          )}
          {props.value === 'takeAssessment' && (
            <Grid item xs={12} sm={12}>
              <h2>
                <b>What is your status in school?</b>
              </h2>
              <FormControl style={{ paddingLeft: '21px' }}>
                <RadioGroup
                  defaultValue={
                    props.value === 'takeAssessment'
                      ? location?.state?.data?.status_in_school
                      : status_in_school.value
                  }
                  name="status_in_school"
                  onClick={handleChange}
                >
                  {metaData.status_in_school.map((item: any) => (
                    <FormControlLabel
                      value={item.value}
                      control={<Radio size="small" />}
                      label={item.value}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          )}
        </Grid>
      ) : (
        ''
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          onClick={handleBack}
          sx={{ mr: 1 }}
          style={props.value === 'takeAssessment' ? { display: 'none' } : {}}
        >
          Back
        </Button>
        <Button
          variant="contained"
          disabled={
            props.value === 'takeAssessment'
              ? !allFieldsTrue(assessmentError)
              : !allFieldsTrue(error)
          }
          color="primary"
          // onClick={!isError() ? handleNext : () => null}

          onClick={() => {
            if (props.value === 'takeAssessment') {
              otherData.value = other;
              location.state.gender = {
                race: Object.entries(race.value)
                  .map(([key, value]) => {
                    if (value) return key || '';
                  })
                  .filter((i) => i),
                ethnicity: Object.entries(ethnicity.value)
                  .map(([key, value]) => {
                    if (value) return key || '';
                  })
                  .filter((i) => i),
                gender: Object.entries(gender.value)
                  .map(([key, value]) => {
                    if (value) return key || '';
                  })

                  .filter((i) => i),
                parent: parent.value,
                first_time_course: first_time_course.value,
                role_in_class: role_in_class.value,
                status_in_school: status_in_school.value,

                other: otherData.value,
              };
              navigate('/testquestion', {
                state: location.state,
              });
            } else {
              otherData.value = other;
              handleNext();
            }
          }}
        >
          Next
        </Button>
      </Box>
    </>
  );
}
