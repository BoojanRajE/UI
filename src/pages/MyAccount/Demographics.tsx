import React, { useState, useEffect, useCallback, useContext } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { AppContext } from '../register/activatedStepper/Context';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { CircularProgress, Radio, RadioGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import { getAllMetaDataByType } from '../../reduxStore/reducer/metaDataReducer';
import { getUsersData } from '../../reduxStore/reducer/userReducer';
import { useNavigate, useParams } from 'react-router-dom';
import {
  update,
  getUserDetailsById,
} from '../../reduxStore/reducer/registerReducer';
import { updateUserDetails } from '../../reduxStore/reducer/registerReducer';
import { initialValues } from '../register/activatedStepper/InitialValues';

export default function Demographics({ userData }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch(getAllMetaDataByType('gender', setLoading));
    dispatch(getAllMetaDataByType('race'));
    dispatch(getAllMetaDataByType('ethnicity'));
    dispatch(getAllMetaDataByType('parent'));
  }, [dispatch]);

  // useEffect(() => {
  //   if (userData?.id != null) {
  //     setInitialValue({
  //       ...initialValue,
  //       id: userData?.id,
  //       email: userData?.email,
  //       first_name: userData?.first_name,
  //       last_name: userData?.last_name,
  //       middle_name: userData?.middle_name,
  //       other_name: userData?.other_name,
  //       ethnicity: userData?.ethnicity,
  //       parent_degree: userData?.parent_degree,
  //       gender: userData?.gender,
  //       race: userData?.race,
  //       email_messages: userData?.email_messages,
  //       gender_another_identity: userData?.gender_another_identity,
  //       ethnicity_another_identity: userData?.ethnicity_another_identity,
  //       race_another_identity: userData?.race_another_identity,
  //     });
  //   }
  // }, [userData]);

  const { formValues, handleChange, handleBack, handleNext, variant, margin } =
    useContext(AppContext);
  const {
    ethnicity,
    gender,
    race,
    parent,
    genderAnotherIdentity,
    ethnicityAnotherIdentity,
    raceAnotherIdentity,
    otherData,
  } = formValues;

  const [initialValue, setInitialValue] = useState<any>(
    userData?.id != null ? { ...userData } : {}
  );

  const genderData: string[] = userData?.gender;

  const genderObj: { [key: string]: boolean } = {};
  genderData?.map((data: string) => {
    genderObj[data] = true;
  });

  const ethnicityData: string[] = userData?.ethnicity;

  const ethnicityObj: { [key: string]: boolean } = {};
  ethnicityData?.map((data: string) => {
    ethnicityObj[data] = true;
  });

  const raceData: string[] = userData?.race;

  const raceObj: { [key: string]: boolean } = {};
  raceData?.map((data: string) => {
    raceObj[data] = true;
  });

  //

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
  const metaData: any = useSelector((state: RootState) => state.metaData);

  const [other, setOther] = useState({
    gender: initialValue?.gender_another_identity,
    race: initialValue?.race_another_identity,
    ethnicity: initialValue?.ethnicity_another_identity,
  });

  const [checkedItems, setCheckedItems] = useState<any>(genderObj);
  const [raceItems, setRaceItems] = useState<any>(raceObj);
  const [ethnicityItems, setEthnicityItems] = useState<any>(ethnicityObj);

  gender.value = checkedItems;
  race.value = raceItems;
  ethnicity.value = ethnicityItems;

  const onGenderChange = (event: any) => {
    setCheckedItems((prev: any) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));

    if (
      event.target.name === 'Another identity (please state):' &&
      !event.target.checked
    ) {
      genderAnotherIdentity.value = '';
      setOther((prev) => ({ ...prev, gender: '' }));
    }
  };

  useEffect(() => {
    setInitialValue((prev: any) => ({
      ...prev,
      gender: Object.entries(checkedItems)
        .map(([key, value]) => {
          if (value == true) return key || '';
        })
        .filter((i) => i),
      gender_another_identity: other.gender,
    }));
  }, [checkedItems]);

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
    // setInitialValue({
    //   ...initialValue,
    //   ethnicity: Object.entries(ethnicityItems)
    //     .map(([key, value]) => {
    //       if (value) return key || '';
    //     })
    //     .filter((i) => i),
    //   ethnicity_another_identity: other.ethnicity,
    // });
  };

  useEffect(() => {
    setInitialValue({
      ...initialValue,
      ethnicity: Object.entries(ethnicityItems)
        .map(([key, value]) => {
          if (value == true) return key || '';
        })
        .filter((i) => i),
      ethnicity_another_identity: other.ethnicity,
    });
  }, [ethnicityItems]);

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

  useEffect(() => {
    setInitialValue({
      ...initialValue,
      race: Object.entries(raceItems)
        .map(([key, value]) => {
          if (value) return key || '';
        })
        .filter((i) => i),
      race_another_identity: other.race,
    });
  }, [raceItems]);

  const onParentChange = (e: any) => {
    setInitialValue({ ...initialValue, parent_degree: e.target.value });
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

  //
  //

  const onSubmit = () => {
    dispatch(updateUserDetails(initialValue));
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={2}>
          <h1 className="text-3xl font-large p-3 m-2">Demographics</h1>
          {userData?.id != null ? (
            <>
              <Grid item xs={12} sm={12}>
                <h2 className="m-2">
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
                        checked={
                          checkedItems[item.value] == true ? true : false
                        }
                        onChange={onGenderChange}
                      />
                      {item.value}
                    </label>
                  ))}
                  <label key="">
                    <Checkbox
                      // value="Another identity (please state):"
                      size="small"
                      name="Another identity (please state):"
                      checked={
                        checkedItems['Another identity (please state):'] ||
                        false
                      }
                      onChange={onGenderChange}
                    />
                    {`Another identity (please state):`}
                    <TextField
                      disabled={
                        !checkedItems['Another identity (please state):']
                      }
                      onChange={(e) => {
                        setInitialValue({
                          ...initialValue,
                          gender_another_identity: e.target.value,
                        });
                      }}
                      size="small"
                      value={initialValue.gender_another_identity}
                    />
                  </label>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12}>
                <h2 className="m-2">
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
                        checked={
                          ethnicityItems[item.value] == true ? true : false
                        }
                        onChange={onEthnicityChange}
                      />
                      {item.value}
                    </label>
                  ))}
                  <label key="">
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
                    <TextField
                      disabled={
                        !ethnicityItems[
                          'Another Hispanic/Latinx/Spanish origin:'
                        ]
                      }
                      onChange={(e) => {
                        setInitialValue({
                          ...initialValue,
                          ethnicity_another_identity: e.target.value,
                        });
                      }}
                      size="small"
                      value={initialValue.ethnicity_another_identity || ''}
                    />
                  </label>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12}>
                <h2 className="m-2">
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
                        checked={raceItems[item.value] == true ? true : false}
                        onChange={onRaceChange}
                      />
                      {item.value}
                    </label>
                  ))}
                  <label key="">
                    <Checkbox
                      // value="Another race/other races:"
                      size="small"
                      name="Another race/other races:"
                      checked={raceItems['Another race/other races:'] || false}
                      onChange={onRaceChange}
                    />
                    Another race/other races:
                    <TextField
                      disabled={!raceItems['Another race/other races:']}
                      size="small"
                      value={initialValue?.race_another_identity}
                      onChange={(e) => {
                        setInitialValue({
                          ...initialValue,
                          race_another_identity: e.target.value,
                        });
                        // setOther({ ...other, race: e.target.value });
                      }}
                      // onChange={onRaceChange}
                    />
                  </label>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12}>
                <h2 className="m-2">
                  <b>
                    Have any of your parents or guardians have received a degree
                    from a 4-year college?
                  </b>
                </h2>
                <FormControl style={{ paddingLeft: '21px' }}>
                  <RadioGroup
                    defaultValue={initialValue.parent_degree}
                    // defaultChecked={gender.value}
                    name="parent"
                    // value={gender.value}
                    onClick={onParentChange}
                    // onChange={handleChange}
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
            </>
          ) : (
            ''
          )}
        </Grid>
      )}
      {userData?.id != null && !loading ? (
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
      ) : (
        ''
      )}
    </>
  );
  // const userData: any = useSelector(
  //   (state: RootState) => state.register.userDetail
  // );

  // const [other, setOther] = useState({
  //   gender: "",
  //   race: "",
  //   ethnicity: "",
  // });

  // const [initialValue, setInitialValue] = useState({
  //   id: userData?.data?.id,
  //   first_name: userData?.data?.first_name,
  //   last_name: userData?.data?.last_name,
  //   middle_name: userData?.data?.middle_name ? userData?.data?.middle_name : "",
  //   other_name: userData?.data?.other_name,
  //   gender: userData?.data?.gender ? userData?.data?.gender : {},
  //   ethnicity: userData?.data?.ethnicity ? userData?.data?.ethnicity : "",
  //   parent_degree: userData?.data?.parent_degree
  //     ? userData?.data?.parent_degree
  //     : "",
  //   race: userData?.data?.race ? userData?.data?.race : {},
  // });

  //
  // const {
  //   formValues,
  //   handleChange,
  //   handleBack,
  //   handleNext,
  //   variant,
  //   margin,
  // } = useContext(AppContext);
  // const { ethnicity, gender, race, parent } = formValues;

  // const isError = useCallback(
  //   () =>
  //     Object.keys({
  //       ethnicity,
  //       gender,
  //       race,
  //       parent,
  //     }).some(
  //       (name) =>
  //         (formValues[name].required && !formValues[name].value) ||
  //         formValues[name].error
  //     ),
  //   [ethnicity, gender, race, parent]
  // );

  // const [checkedItems, setCheckedItems] = useState<any>(gender.value);
  // const [raceItems, setRaceItems] = useState<any>(race.value);
  // const [ethnicityChange, setEthnicityChange] = useState("");
  // // const genderCondition =

  // const onGenderChange = (event: any) => {
  //   setCheckedItems({
  //     ...checkedItems,
  //     [event.target.name]: event.target.checked,
  //   });
  //   //const a = event.target.name;
  //   // enum Gender {

  //   // }
  //   setInitialValue({
  //     ...initialValue,
  //     gender: Object.entries(checkedItems)
  //       .map(([key, value]) => {
  //         if (value) return key || "";
  //       })
  //       .filter((i) => i),
  //   });
  //   //dispatch(updateUserDetails(initialValue));
  // };

  // const onEthnicityChanged = (event: any) => {
  //
  //   setEthnicityChange(event.target.value);
  //   setInitialValue({ ...initialValue, ethnicity: event.target.value });
  // };

  // const onParentChanged = (event: any) => {
  //
  //   //setEthnicityChange(event.target.value);
  //   setInitialValue({ ...initialValue, parent_degree: event.target.value });
  // };

  //

  // const onRaceChange = (event: any) => {
  //   setRaceItems({
  //     ...raceItems,
  //     [event.target.name]: event.target.checked,
  //   });
  //   setInitialValue({
  //     ...initialValue,
  //     race: Object.entries(raceItems)
  //       .map(([key, value]) => {
  //         if (value) return key || "";
  //       })
  //       .filter((i) => i),
  //   });
  // };

  // const onSubmit = () => {
  //   dispatch(updateUserDetails(initialValue));
  // };
  // gender.value = checkedItems;
  // race.value = raceItems;

  // return (
  //   <div>
  //     <h1 className="text-3xl font-large p-2">Demographics</h1>
  //     <Grid container spacing={2} className="p-2">
  //       <Grid item xs={12} sm={12}>
  //         <h2>
  //           <b>How do you describe your Gender?</b>
  //         </h2>
  //         <Grid
  //           container
  //           style={{
  //             // height: '260px',
  //             display: "flex",
  //             flexWrap: "wrap",
  //             gap: "6px",
  //             flexDirection: "column",
  //             margin: "8px",
  //           }}
  //         >
  //           {metaData.gender.map((item: any) => (
  //             <label key={item.value}>
  //               <Checkbox
  //                 // disabled={gender.value['Another identity:'] == true}
  //                 value={item.value}
  //                 id={item.value}
  //                 size="small"
  //                 name={item.value}
  //                 checked={
  //                   checkedItems[item?.value] != undefined ? true : false
  //                 }
  //                 defaultChecked={initialValue?.gender[item]}
  //                 onChange={onGenderChange}
  //               />
  //               {item.value}
  //             </label>
  //           ))}
  //           <label key="">
  //             <Checkbox
  //               value="Another identity:"
  //               size="small"
  //               name="Another identity:"
  //               // checked={checkedItems[item] || false}
  //               onChange={onGenderChange}
  //             />
  //             Another identity:
  //             <TextField
  //               size="small"
  //               value={other.gender}
  //               onChange={(e) => setOther({ ...other, gender: e.target.value })}
  //             />
  //           </label>
  //         </Grid>
  //       </Grid>
  //       <Grid item xs={12} sm={6}>
  //         <h2>
  //           <b>What is your ethnicity?</b>
  //         </h2>
  //         <Grid
  //           container
  //           style={{
  //             // height: '260px',
  //             display: "flex",
  //             flexWrap: "wrap",
  //             gap: "6px",
  //             flexDirection: "column",
  //             margin: "8px",
  //           }}
  //         >
  //           <FormControl>
  //             <RadioGroup
  //               aria-labelledby="demo-radio-buttons-group-label"
  //               defaultValue={initialValue?.ethnicity}
  //               defaultChecked={initialValue?.ethnicity}
  //               name="ethnicity"
  //               value={initialValue?.ethnicity}
  //               onClick={onEthnicityChanged}
  //               // onChange={handleChange}
  //             >
  //               {metaData.ethnicity.map((item: any) => (
  //                 <FormControlLabel
  //                   value={item.value}
  //                   control={<Radio size="small" />}
  //                   label={item.value}
  //                 />
  //               ))}
  //               <FormControlLabel
  //                 value="Another Hispanic/Latinx/Spanish origin:"
  //                 control={<Radio size="small" />}
  //                 label=" Another Hispanic/Latinx/Spanish origin: "
  //               />
  //               <TextField
  //                 size="small"
  //                 value={other.gender}
  //                 // onChange={(e) =>
  //                 //   seteCheckedItems({ ...other, gender: e.target.value })
  //                 // }
  //                 // onChange={onCheckBoxeChange}
  //               />
  //             </RadioGroup>
  //           </FormControl>
  //         </Grid>
  //       </Grid>
  //       <Grid item xs={12} sm={12}>
  //         <h2>
  //           <b>What is your race?</b>
  //         </h2>
  //         <Grid
  //           container
  //           style={{
  //             // height: '260px',
  //             display: "flex",
  //             flexWrap: "wrap",
  //             gap: "6px",
  //             flexDirection: "column",
  //             margin: "8px",
  //           }}
  //         >
  //           {metaData.race.map((item: any) => (
  //             <label key={item.value}>
  //               <Checkbox
  //                 value={item.value}
  //                 id={item.value}
  //                 size="small"
  //                 name={item.value}
  //                 checked={raceItems[item.value] || false}
  //                 onChange={onRaceChange}
  //               />
  //               {item.value}
  //             </label>
  //           ))}
  //           <label key="">
  //             <Checkbox
  //               value=""
  //               size="small"
  //               name="Another race/other races: "
  //               // checked={checkedItems[item] || false}
  //               onChange={onRaceChange}
  //             />
  //             Another race/other races:
  //             <TextField
  //               size="small"
  //               value={other.gender}
  //               // onChange={(e) =>
  //               //   seteCheckedItems({ ...other, gender: e.target.value })
  //               // }
  //               onChange={onRaceChange}
  //             />
  //           </label>
  //         </Grid>
  //       </Grid>
  //       <Grid item xs={12} sm={12}>
  //         <h2>
  //           <b>
  //             Have any of your parents or guardians have received a degree from
  //             a 4-year college?
  //           </b>
  //         </h2>
  //         <FormControl>
  //           <RadioGroup
  //             aria-labelledby="demo-radio-buttons-group-label"
  //             defaultValue={initialValue?.parent_degree}
  //             defaultChecked={initialValue?.parent_degree}
  //             name="parent_degree"
  //             value={initialValue?.parent_degree}
  //             onClick={onParentChanged}
  //             // onChange={handleChange}
  //           >
  //             {metaData.parent.map((item: any) => (
  //               <FormControlLabel
  //                 value={item.value}
  //                 control={<Radio size="small" />}
  //                 label={item.value}
  //               />
  //             ))}
  //           </RadioGroup>
  //         </FormControl>
  //       </Grid>
  //     </Grid>

  //     <div className="flex justify-center gap-10 mt-7 mb-5">
  //       <Button type="submit" onClick={onSubmit} variant="contained">
  //         Save
  //       </Button>
  //       <Button
  //         variant="contained"
  //         color="error"
  //         //onClick={() => navigate("/organization")}
  //       >
  //         Cancel
  //       </Button>
  //     </div>
  //   </div>
  // );
}
