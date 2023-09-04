import React, { useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { AppContext } from './Context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxStore/Store';
import { useNavigate, useParams } from 'react-router-dom';
import { activate } from '../../../reduxStore/reducer/registerReducer';
import {
  update,
  updateAffiliate,
  getUserById,
} from '../../../reduxStore/reducer/registerReducer';

export default function Confirm(props: any) {
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate: any = useNavigate();
  const { formValues, handleBack, handleNext } = useContext(AppContext);
  const {
    communications,
    lasso,
    organization,
    workshops,
    research,
    program,
    parent,
    gender,
    ethnicity,
    race,
    units,
    rolesId,
    otherData,
  } = formValues;
  let form: any = {};
  Object.keys(formValues).map((name) => {
    form = {
      ...form,
      [name]: formValues[name].value,
    };
    return form;
  });
  let messages: any = [];
  if (form.program == true) {
    messages.push('program');
  }
  if (form.none == true) {
    messages.push('none');
  }
  if (form.research == true) {
    messages.push('research');
  }
  if (form.workshops == true) {
    messages.push('workshops');
  }
  if (form.lasso == true) {
    messages.push('lasso');
  }
  if (form.communications == true) {
    messages.push('communications');
  }
  const handleSubmit = () => {
    // Remove unwanted properties from formValue object
    // Do whatever with the values

    form.units.map((ele: any) => {
      ele.roles = Object.keys(ele.roles);
      if (ele.unitName == 'Department') {
        ele.unitName = 1;
      }
      if (ele.unitName == 'College Or School') {
        ele.unitName = 2;
      }
      if (ele.unitName == 'Program') {
        ele.unitName = 3;
      }
      if (ele.unitName == 'Center') {
        ele.unitName = 4;
      }
      if (ele.unitName == 'Administrative Office') {
        ele.unitName = 5;
      }
    });

    const data = {
      id: id,
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
      parent: form.parent,
      email_messages: messages,
      password: form.password,
      units: form.units,
      other: form.otherData,
      // password: Joi.string().required() //need to work on pattern
    };
    form.id = id;

    if (props.value == 'myAccount') {
      dispatch(updateAffiliate(data, handleNext));
    } else {
      dispatch(update(data, handleNext));
    }

    // Show last component or success message
  };

  // const LoginResponseData = useSelector(
  //   (state: RootState) => state.register.data
  // );

  //
  // useEffect(() => {
  //   dispatch(getUserById({ id: id }));
  // }, [dispatch]);

  if (props.value != 'myAccount') {
    return (
      <>
        <List disablePadding>
          <ListItem>
            <ListItemText
              primary="Units"
              secondary={
                <div className="flex flex-col">
                  <table>
                    <tbody
                      style={{
                        borderCollapse: 'separate',
                        borderSpacing: '0 25px',
                      }}
                    >
                      <tr>
                        <th>Unit Name</th>
                        <th className="pr-9">{`Role(s)`}</th>
                      </tr>
                      {units &&
                        units?.value?.map((data: any, i: any) => {
                          return (
                            <tr
                              key={data?.unitLabel}
                              style={{ padding: '50px' }}
                            >
                              <td>{data?.unitLabel}</td>
                              <td>
                                <div className="space-between">
                                  <ul>
                                    {Object.entries(data.roles)
                                      .map(([key, value]) => {
                                        if (value)
                                          return (
                                            (
                                              <li className="list-disc list-inside">
                                                {key}
                                              </li>
                                            ) || ''
                                          );
                                      })
                                      .filter((i) => i)}
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              }
            />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="LASSO Messages"
              secondary={messages.map((data: string) => {
                return <li className="list-disc list-inside">{data}</li>;
              })}
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText
              primary="Gender"
              secondary={
                Object.entries(gender.value)
                  .map(([key, value]) => {
                    if (value) return key || '';
                  })
                  .filter((i) => i)
                  .map((data) => {
                    if (data === 'Another identity (please state):')
                      otherData?.value?.gender
                        ? (data = `${data} ${otherData.value.gender}`)
                        : (data = data);
                    return <li className="list-disc list-inside">{data}</li>;
                  }) || 'Not Provided'
              }
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText
              primary="Ethnicity"
              // secondary={
              //   `${ethnicity.value} ${
              //     otherData?.value?.ethnicity ? otherData?.value?.ethnicity : ''
              //   }` || 'Not Provided'
              // }
              secondary={
                Object.entries(ethnicity.value)
                  .map(([key, value]) => {
                    if (value) return key || '';
                  })
                  .filter((i) => i)
                  .map((data) => {
                    if (data === 'Another Hispanic/Latinx/Spanish origin:')
                      otherData?.value?.ethnicity
                        ? (data = `${data} ${otherData.value.ethnicity}`)
                        : (data = data);
                    return <li className="list-disc list-inside">{data}</li>;
                  }) || 'Not Provided'
              }
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText
              primary="Race"
              secondary={
                Object.entries(race.value)
                  .map(([key, value]) => {
                    if (value) return key || '';
                  })
                  .filter((i) => i)
                  .map((data) => {
                    if (data === 'Another race/other races:')
                      otherData?.value?.gender
                        ? (data = `${data} ${otherData.value.race}`)
                        : (data = data);
                    return <li className="list-disc list-inside">{data}</li>;
                  }) || 'Not Provided'
              }
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText
              primary="Parent Received a Degree"
              secondary={parent?.value ? parent?.value : 'Not Provided'}
            />
          </ListItem>

          {/* <ListItem>
          <ListItemText
            primary="Units"
            secondary={units.value || 'Not Provided'}
          />
        </ListItem> */}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button sx={{ mr: 1 }} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Confirm & Continue
          </Button>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <List disablePadding>
          <ListItem>
            <ListItemText primary="Affiliation Type" secondary="Staff" />
          </ListItem>

          <Divider />
          <ListItem>
            <ListItemText
              primary="Affiliations"
              secondary={
                <div className="flex flex-col">
                  <table>
                    <tbody
                      style={{
                        borderCollapse: 'separate',
                        borderSpacing: '0 25px',
                      }}
                    >
                      <tr>
                        <th>Unit Name</th>
                        <th className="pr-9">{`Role(s)`}</th>
                      </tr>
                      {units &&
                        units?.value?.map((data: any, i: any) => {
                          return (
                            <tr
                              key={data?.unitLabel}
                              style={{ padding: '50px' }}
                            >
                              <td>{data?.unitLabel}</td>
                              <td>
                                <div className="space-between">
                                  <ul>
                                    {Object.entries(data.roles)
                                      .map(([key, value]) => {
                                        if (value)
                                          return (
                                            (
                                              <li className="list-disc list-inside">
                                                {key}
                                              </li>
                                            ) || ''
                                          );
                                      })
                                      .filter((i) => i)}
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              }
            />
          </ListItem>
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button sx={{ mr: 1 }} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Confirm & Continue
          </Button>
        </Box>
      </>
    );
  }
}
