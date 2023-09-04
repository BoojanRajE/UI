import React, { useState, useCallback, useContext, useEffect } from 'react';
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Checkbox,
  IconButton,
  Link,
  Typography,
  TextField,
} from '@mui/material';
import { GrFormClose } from 'react-icons/gr';

import Select, { components, IndicatorsContainerProps } from 'react-select';
import { AiFillDelete } from 'react-icons/ai';
import { MdModeEditOutline } from 'react-icons/md';

import { AppContext } from './Context';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../reduxStore/Store';
import {
  addCollegeData,
  getCollegeName,
} from '../../../reduxStore/reducer/collegeReducer';
import {
  getDepartmentData,
  getDepartmentName,
} from '../../../reduxStore/reducer/departmentReducer';
import { getAdministrativeName } from '../../../reduxStore/reducer/administrativeReducer';
import { getUnitrolesName } from '../../../reduxStore/reducer/unitrolesReducer';
import {
  addCenterAction,
  // getCenterAction,
  getCenterIdAndNameAction,
} from '../../../reduxStore/reducer/centerReducer';
import {
  addProgramData,
  getProgramName,
} from '../../../reduxStore/reducer/programReducer';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AiOutlineClose } from 'react-icons/ai';
import * as Yup from 'yup';
import { addDepartmentData } from '../../../reduxStore/reducer/departmentReducer';
import Autocomplete, {
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import { getDisciplineDetails } from '../../../reduxStore/reducer/disciplineReducer';
import { getSubDisciplineDetailAction } from '../../../reduxStore/reducer/subDisciplineReducer';
import { getOrganizationName } from '../../../reduxStore/reducer/organisationReducer';
import {
  update,
  updateAffiliate,
  updateUnit,
  getUserById,
} from '../../../reduxStore/reducer/registerReducer';
import { useParams, useNavigate } from 'react-router-dom';

import { addAdministrativeData } from '../../../reduxStore/reducer/administrativeReducer';
const FirstStep = (props: any) => {
  const { formValues, handleBack, handleNext } = useContext(AppContext);

  const { units, unit, unitLabel, unitsState, rolesId } = formValues;
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<any>({});
  const [val, setVal] = useState<any>({
    unit: '',
    unitLabel: '',
    unitName: '',
    roles: [],
    data: unitsState.value,
  });
  const [DialogBox, setDialogBox] = useState({
    title: '',
    units: [],
    roles: [],
    open: false,
    isRoleInput: false,
    method: 'save',
    index: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getCollegeName());
    dispatch(getProgramName());
    dispatch(getCenterIdAndNameAction());
    dispatch(getDepartmentName());
    dispatch(getAdministrativeName());
    dispatch(getUnitrolesName());

    dispatch(getDisciplineDetails());
    dispatch(getSubDisciplineDetailAction());
    dispatch(getOrganizationName());
  }, []);

  const collegeData: any = useSelector((state: RootState) => {
    const data = state.college.collegeName;
    return data.map((ele: any) => {
      return { value: ele.id, name: 'unit', label: ele.name };
    });
  });

  const centerData: any = useSelector((state: RootState) => {
    const data = state.center.getAllIdAndName;
    return data.map((ele: any) => {
      return { value: ele.id, name: 'unit', label: ele.name };
    });
  });

  const programData: any = useSelector((state: RootState) => {
    const data = state.program.programName;
    return data.map((ele: any) => {
      return { value: ele.id, name: 'unit', label: ele.name };
    });
  });

  const departmentData: any = useSelector((state: RootState) => {
    const data = state.department.departmentName;
    return data.map((ele: any) => {
      return { value: ele.id, name: 'unit', label: ele.name };
    });
  });

  const administrativeData: any = useSelector((state: RootState) => {
    const data = state.administrative.administrativeName;
    return data.map((ele: any) => {
      return { value: ele.id, name: 'unit', label: ele.name };
    });
  });

  const unitRolesData: any = useSelector(
    (state: RootState) => state.unitroles.unitrolesName
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [add, setAdd] = useState({
    Department: false,
    'College Or School': false,
    'Administrative Office': false,
    Center: false,
    Program: false,
  });

  const handleNewDeptClickOpen = (data: string) => {
    setDialogBox({ ...DialogBox, open: true });
    switch (data) {
      case 'Department':
        setAdd({ ...add, Department: true });
        break;

      case 'College Or School':
        setAdd({ ...add, 'College Or School': true });
        break;

      case 'Administrative Office':
        setAdd({ ...add, 'Administrative Office': true });
        break;

      case 'Center':
        setAdd({ ...add, Center: true });
        break;

      case 'Program':
        setAdd({ ...add, Program: true });
        break;

      default:
        break;
    }
  };

  const handleDialogBoxClose = () => {
    setDialogBox({
      ...DialogBox,
      title: '',
      open: false,
      method: 'save',
    });
    unit.value = '';
    unitLabel.value = '';
    defaultValue.value = '';
    defaultValue.label = '';
    setVal({ ...val, ...{ unitLabel: '', unitName: '' } });
    setCheckedItems({});
  };

  const handleAddDialogBox = () => {
    setDialogBox({ ...DialogBox, isRoleInput: true });
    if (DialogBox.isRoleInput === true) {
      const names = Object.entries(checkedItems)
        .map(([key, value]) => {
          if (value) return key || '';
        })
        .filter((i) => i);

      const ids = names.map((name) => {
        const found = unitRolesData.find(
          (item: any) => item.role_name === name
        );
        return found ? found.id : null;
      });

      if (DialogBox.method === 'save') {
        const value = { ...val };
        const isExist = value.data.findIndex(
          (o: any) => o.unitLabel === unitLabel.value
        );
        if (isExist !== -1) {
          value.data[isExist] = {
            unit: val.unit,
            unitLabel: val.unitLabel,
            unitName: DialogBox.title,
            roles: checkedItems,
          };
        } else {
          value?.data?.push({
            unit: val.unit,
            unitLabel: val.unitLabel,
            unitName: DialogBox.title,
            roles: checkedItems,
            rolesData: ids,
          });
        }
        units.value = value.data;
        value.roles = [];
        setVal(value);
        setRoleOpen(false);
        setCheckedItems({});
        handleDialogBoxClose();
        unit.value = '';
        unitLabel.value = '';
      } else {
        const value = { ...val };
        value.data[DialogBox.index] = {
          unit: unit.value,
          unitLabel: unitLabel.value,
          unitName: DialogBox.title,
          roles: checkedItems,
          rolesData: ids,
        };
        setVal(value);
        setCheckedItems({});
        handleDialogBoxClose();
        unit.value = '';
        unitLabel.value = '';
      }
    }
  };

  const handleOpenChildDialogBox = (name: any, method: any, index: any) => {
    setOpen(false);
    const dialogBoxInputs = {
      title: '',
      units: [],
      roles: [],
      open: false,
      method: method,
      isRoleInput: false,
      index: index,
    };
    switch (name) {
      case 'Department':
        dialogBoxInputs.title = name;
        dialogBoxInputs.units = departmentData;
        dialogBoxInputs.open = true;
        break;

      case 'College Or School':
        dialogBoxInputs.title = name;
        dialogBoxInputs.units = collegeData;
        dialogBoxInputs.open = true;
        break;

      case 'Administrative Office':
        dialogBoxInputs.title = name;
        dialogBoxInputs.units = administrativeData;
        dialogBoxInputs.open = true;
        break;

      case 'Center':
        dialogBoxInputs.title = name;
        dialogBoxInputs.units = centerData;
        dialogBoxInputs.open = true;
        break;

      case 'Program':
        dialogBoxInputs.title = name;
        dialogBoxInputs.units = programData;
        dialogBoxInputs.open = true;
        break;

      default:
        break;
    }

    setDialogBox(dialogBoxInputs);
  };

  const columnchange = async (e: any) => {
    const { label, value, name } = e;
    unit.value = e.value;
    unitLabel.value = e.label;
    setVal({ ...val, [name]: value, unitLabel: label });
  };

  let defaultValue = {
    value: unit.value || val.value,
    name: 'unit',
    label: unitLabel.value || val.unitLabel,
  };
  const handleEdit = (index: any) => {
    unit.value = val.data[index].unit;
    unitLabel.value = val.data[index].unitLabel;
    defaultValue = {
      value: val.data[index].unit,
      name: 'unit',
      label: val.data[index].unitLabel,
    };
    setCheckedItems(val.data[index].roles);
    handleOpenChildDialogBox(val.data[index].unitName, 'edit', index);
  };

  const handleDelete = (index: any) => {
    let deleteval = { ...val };
    // if (deleteval.data.length <= 1) return;
    deleteval.data.splice(index, 1);
    setVal(deleteval);
  };

  const IndicatorsContainer = (props: IndicatorsContainerProps<any>) => {
    return (
      <div>
        <components.IndicatorsContainer {...props} />
      </div>
    );
  };

  const onCheckBoxChange = (event: any) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
    if (event.target.checked === true) {
      rolesId.value.push(event.target.value);
    } else {
      const condition = rolesId.value.findIndex(
        (o: any) => o === event.target.value
      );

      if (condition !== -1) {
        rolesId.value.splice(condition, 1);
      }
    }
  };

  const condition = units.value.length === 0;

  const handleClickClose = () => {};

  let [SubDisciplineNames, setSubDisciplineNames] = useState([
    { id: '', name: '', discipline_id: '' },
  ]);
  interface Department {
    id: string;
    organization_name: any; //object when submit over form, string when fetched from db
    name: string;
    short_name: string;
    discipline_name: any; //object when submit over form, string when fetched from db
    sub_discipline_name: any; //object when submit over form, string when fetched from db
    is_active: boolean;
    created_by: string;
  }

  const [departmentInitialValues, setDepartmentInitialValue] =
    useState<Department>({
      id: '',
      organization_name: '',
      name: '',
      short_name: '',
      discipline_name: '',
      sub_discipline_name: '',
      is_active: true,
      created_by: '',
    });

  interface Administrative {
    id: string;
    organization_name: any;
    name: string;
    short_name: string;
    is_active: boolean;
    created_by: string;
  }

  const [administrativeInitialValues, setAdministrativeInitialValue] =
    useState<Administrative>({
      id: '',
      organization_name: '',
      name: '',
      short_name: '',
      is_active: true,
      created_by: '',
    });

  const validation = Yup.object({
    organization_name: Yup.object({
      id: Yup.string(),
      value: Yup.string(),
    })
      .nullable()
      .required('Required Field'),
    name: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
    discipline_name: Yup.object({
      id: Yup.string(),
      value: Yup.string(),
    })
      .nullable()
      .required('Required Field'),
  });

  const organizationName: any = useSelector(
    (state: RootState) => state.organization.organizationName
  );

  const disciplineName: any = useSelector(
    (state: RootState) => state.discipline.getDisciplineDetails
  );

  let SubDisciplineName: any = useSelector(
    (state: RootState) => state.subdiscipline.getAllSubDisciplineDetail
  );

  const disciplineColumnChange = async (e: any) => {
    const { id } = e;
    setSubDisciplineNames(
      SubDisciplineName.filter((x: any) => {
        return x.discipline_id == id;
      })
    );
  };

  const organizationData = useSelector(
    (state: RootState) => state.organization.organizationName
  );

  interface CollegeType {
    id: string;
    organization_name: any;
    name: string;
    short_name: string;
    is_active: boolean;
    created_by: string;
  }

  const [collegeInitialValues, setCollegeInitialValue] = useState<CollegeType>({
    id: '',
    organization_name: null,
    name: '',
    short_name: '',
    is_active: true,
    created_by: '',
  });

  interface Program {
    id: string;
    organization_name: any;
    name: string;
    short_name: string;
    is_active: boolean;
    created_by: string;
  }

  const [programInitialValues, setProgramInitialValue] = useState<Program>({
    id: '',
    organization_name: '',
    name: '',
    short_name: '',
    is_active: true,
    created_by: '',
  });

  const handleClick = () => {
    units.value.map((ele: any) => {
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

    let unitArr: any = [];

    const unitsData = units.value.map((data: any) => {
      const ids = data.roles.map((name: any) => {
        const found = unitRolesData.find(
          (item: any) => item.role_name === name
        );
        return found ? found.id : null;
      });

      unitArr.push({ ...data, rolesData: ids });
    });

    const data = {
      id: props.org_id,
      units: unitArr,
    };
    unitsState.value = [];
    units.value = [];
    setVal({
      unit: '',
      unitLabel: '',
      unitName: '',
      roles: [],
      data: [],
    });
    dispatch(updateUnit(data, handleNext, props.setOpen));
  };

  const disciplineNames = disciplineName.map((o: any) => ({
    id: o.id,
    name: o.name,
  }));

  const init_input_state = {
    id: '',
    sub_discipline_id: '',
    organization_id: '',
    discipline_id: '',
    name: '',
    short_name: '',
    website: '',
  };

  const [inputForm, setInputForm] = React.useState(init_input_state);

  const handleCenterChange = (event: any) => {
    const { name, value } = event.target;
    setInputForm({ ...inputForm, [name]: value });
  };

  const [autoComplete, setAutoComplete] = useState({
    value: {},
    input: '',
  });

  const getSubDisciplineByDiscipline = useCallback(
    (discipline_id: any) => {
      let data = [];
      data = SubDisciplineName?.length
        ? SubDisciplineName.filter((item: any) => {
            return item.discipline_id === discipline_id;
          })
        : [];
      return data;
    },
    [inputForm.discipline_id]
  );

  const [subAutoComplete, setSubAutoComplete] = useState({
    value: {},
    input: '',
  });

  const [orgAutoComplete, setOrgAutoComplete] = useState({
    value: {},
    input: '',
  });

  const handleSave = async () => {
    const subdisciplineData = SubDisciplineName.find(
      (item: any) => item.id === inputForm?.sub_discipline_id
    );

    // const organizationName = organizationName.find(
    //   (item: any) => item.id === inputForm?.organization_id
    // );

    const getDisciplineDetails = disciplineName.find(
      (item: any) => item.id === inputForm?.discipline_id
    );

    const data = {
      ...inputForm,
      sub_discipline_name: subdisciplineData?.name || '',
      organization_name: organizationName?.name || '',
      discipline_name: getDisciplineDetails?.name || '',
    };

    dispatch(addCenterAction(data, id, setAdd, null, setVal));

    // dispatch(getCenterAction());
    // dispatch(getCenterAction());

    setOpen(false);
    setInputForm(init_input_state);

    setOrgAutoComplete({
      value: {},
      input: '',
    });
    setSubAutoComplete({
      value: {},
      input: '',
    });

    setAutoComplete({
      value: {},
      input: '',
    });
  };

  return (
    <div>
      {/* <div className="w-full"> */}
      {/* <div className="relative"> */}
      <div className=" bg-gray-100 rounded-lg p-8 flex flex-col  w-full mt-4 md:mt-8">
        {/* <div className="relative mb-4"></div> */}
        <div>
          {condition ? (
            <div>
              <b>No units added</b>
            </div>
          ) : (
            <div style={{ marginTop: '30px' }} className="template_type">
              <div className="flex flex-col">
                <table
                  style={{
                    borderCollapse: 'separate',
                    borderSpacing: '0 10px',
                  }}
                >
                  <tbody>
                    <tr style={{ marginLeft: 'auto' }}>
                      <th>Unit Name</th>
                      <th>{`Role(s)`}</th>
                      <th>Actions</th>
                    </tr>
                    {units &&
                      units?.value?.map((data: any, i: any) => {
                        return (
                          <tr key={data?.unitLabel}>
                            <td style={{ maxWidth: '125px' }}>
                              {data?.unitLabel}
                            </td>
                            <td style={{ minWidth: '145px' }}>
                              <div>
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
                            <td>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(i)}
                              >
                                <AiFillDelete />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(i)}
                              >
                                <MdModeEditOutline />
                              </IconButton>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <a
          onClick={handleClickOpen}
          className="no-underline hover:underline  text-link cursor-pointer"
        >
          Click to add a unit
        </a>
      </div>

      <Dialog
        open={DialogBox.open}
        onClose={handleDialogBoxClose}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              height: '60%',
              maxWidth: '800px',
            },
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Select {DialogBox.title}</Box>
            <Box>
              <IconButton onClick={handleDialogBoxClose}>
                <GrFormClose />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid item xs={12} sm={6}>
            {!DialogBox.isRoleInput ? (
              <div>
                <Select
                  name="unit"
                  value={defaultValue}
                  // value={'apollo'}
                  closeMenuOnSelect={true}
                  components={{ IndicatorsContainer }}
                  options={DialogBox.units}
                  onChange={(e) => columnchange(e)}
                />
              </div>
            ) : (
              <Grid item xs={12} sm={12}>
                <h2>
                  <b>Roles</b>
                </h2>
                <Grid
                  container
                  style={{
                    height: '260px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    flexDirection: 'column',
                    margin: '8px',
                  }}
                >
                  {unitRolesData.map((item: any) => (
                    <label key={item.id}>
                      <Checkbox
                        value={item.id}
                        id={item.id}
                        size="small"
                        name={item.role_name}
                        checked={checkedItems[item?.role_name] || false}
                        onChange={onCheckBoxChange}
                      />
                      {item.role_name}
                    </label>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{ dispaly: 'flex', justifyContent: 'space-between' }}
        >
          <div>
            <Button onClick={handleDialogBoxClose}>Cancel</Button>
          </div>
          <div className=" flex gap-4">
            <Button
              variant="contained"
              onClick={handleAddDialogBox}
              // disabled={
              //   DialogBox.isRoleInput == false
              //     ? unit.value == ""
              //     : Object.entries(checkedItems)
              //         .map(([key, value]) => {
              //           if (value) return key || "";
              //         })
              //         .filter((i) => i).length == 0
              // }
            >
              Ok
            </Button>
            <Button
              variant="contained"
              onClick={() => handleNewDeptClickOpen(DialogBox.title)}
              style={DialogBox.isRoleInput ? { display: 'none' } : {}}
            >
              Add
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      <Dialog open={add.Department}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>Add Department</div>
            <div>
              <AiOutlineClose
                onClick={() => setAdd({ ...add, Department: false })}
              />
            </div>
          </div>
        </DialogTitle>

        <Formik
          initialValues={departmentInitialValues}
          validationSchema={validation}
          onSubmit={(values, { setFieldValue }) => {
            dispatch(addDepartmentData(values, setAdd, id, null, setVal));
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            isValid,
          }) => (
            <DialogContent
              sx={{ width: '600px', height: 'fitContent', overflowX: 'hidden' }}
            >
              <Form>
                <h2>
                  <Typography variant="subtitle1" gutterBottom component="p">
                    Please add your Department name
                  </Typography>
                </h2>

                <Field
                  name="organization_name"
                  openOnFocus={true}
                  component={Autocomplete}
                  required
                  value={values.organization_name} //organization object not name
                  options={organizationName}
                  ListboxProps={{ style: { maxHeight: 250 } }}
                  fullWidth
                  getOptionLabel={(option: { id: string; name: string }) =>
                    option.name === undefined ? '' : option.name
                  }
                  isOptionEqualToValue={(
                    option: { id: string; name: string },
                    current: { id: string; name: string }
                  ) => option.id === current.id}
                  onChange={(
                    event: React.SyntheticEvent,
                    organization_name: { id: string; name: string }
                  ) => {
                    setFieldValue('organization_name', organization_name);
                  }}
                  onBlur={() => setFieldTouched('organization_name', true)}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      name="organization_name"
                      variant="standard"
                      label="Organization"
                      error={
                        errors.organization_name && touched.organization_name
                          ? true
                          : false
                      }
                      helperText={
                        errors.organization_name && touched.organization_name
                          ? 'Required Field'
                          : ''
                      }
                      required
                    />
                  )}
                  sx={{ marginBottom: '15px' }}
                />

                <Field
                  as={TextField}
                  label="Department Name"
                  variant="standard"
                  required
                  name="name"
                  value={values.name}
                  helperText={errors.name && touched.name ? errors.name : ''}
                  fullWidth
                  error={errors.name && touched.name}
                  sx={{ marginBottom: '15px' }}
                />

                <Field
                  as={TextField}
                  label="Short Name"
                  variant="standard"
                  name="short_name"
                  fullWidth
                  sx={{ marginBottom: '15px' }}
                />

                <Field
                  name="discipline_name"
                  required
                  component={Autocomplete}
                  value={values.discipline_name} //discipline object not name
                  options={disciplineName}
                  // ListboxProps={{ style: { maxHeight: 250 } }}
                  fullWidth
                  getOptionLabel={(option: { id: string; name: string }) =>
                    option.name === undefined ? '' : option.name
                  }
                  isOptionEqualToValue={(
                    option: { id: string; name: string },
                    current: { id: string; name: string }
                  ) => option.id === current.id}
                  onChange={(
                    event: React.SyntheticEvent,
                    discipline_name: { id: string; name: string }
                  ) => {
                    disciplineColumnChange(discipline_name);
                    setFieldValue('discipline_name', discipline_name);
                    setFieldValue('sub_discipline_name', null);
                  }}
                  onBlur={() => setFieldTouched('discipline_name', true)}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      name="discipline_name"
                      variant="standard"
                      label="Discipline"
                      error={
                        errors.discipline_name && touched.discipline_name
                          ? true
                          : false
                      }
                      helperText={
                        errors.discipline_name && touched.discipline_name
                          ? 'Required Field'
                          : ''
                      }
                      required
                    />
                  )}
                  sx={{ marginBottom: '15px' }}
                />

                <Field
                  name="sub_discipline_name"
                  component={Autocomplete}
                  value={values.sub_discipline_name} //sub discipline object not name
                  options={SubDisciplineNames}
                  fullWidth
                  getOptionLabel={(option: { id: string; name: string }) =>
                    option.name === undefined ? '' : option.name
                  }
                  isOptionEqualToValue={(
                    option: { id: string; name: string },
                    current: { id: string; name: string }
                  ) => option.id === current.id}
                  onChange={(
                    event: React.SyntheticEvent,
                    sub_discipline_name: { id: string; name: string }
                  ) => {
                    setFieldValue('sub_discipline_name', sub_discipline_name);
                  }}
                  onBlur={() => setFieldTouched('sub_discipline_name', true)}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      name="sub_discipline_name"
                      variant="standard"
                      label="Sub Discipline"
                      // error={
                      //   errors.sub_discipline_name &&
                      //   touched.sub_discipline_name
                      //     ? true
                      //     : false
                      // }
                      // helperText={
                      //   errors.sub_discipline_name &&
                      //   touched.sub_discipline_name
                      //     ? "Required Field"
                      //     : ""
                      // }
                    />
                  )}
                  sx={{ marginBottom: '50px' }}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '55px',
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setAdd({ ...add, Department: false })}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    disabled={!isValid}
                  >
                    {'Save'}
                  </Button>
                </div>
              </Form>
            </DialogContent>
          )}
        </Formik>
      </Dialog>

      <Dialog open={add['Administrative Office']}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          {'Add Administrative'}
        </DialogTitle>

        <Formik
          initialValues={administrativeInitialValues}
          // validationSchema={validation}
          onSubmit={(values) => {
            dispatch(addAdministrativeData(values, setAdd, id, null, setVal));
          }}
        >
          {({
            values,
            isValid,
            handleChange,
            errors,
            touched,
            setFieldValue,
          }) => (
            <DialogContent
              sx={{
                width: '600px',
                height: 'fitContent',
                overflowX: 'hidden',
              }}
            >
              <Form>
                {/* <h2>
                  <Typography variant="subtitle1" gutterBottom component="p">
                    Please add your Administrative name
                  </Typography>
                </h2> */}

                <Field
                  name="organization_name"
                  component={Autocomplete}
                  value={values.organization_name}
                  options={organizationData}
                  fullWidth
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.id === value
                  }
                  getOptionLabel={(org: any) =>
                    org.name === undefined ? '' : org.name
                  }
                  onChange={(_: any, name: any) => {
                    setFieldValue('organization_name', name);
                  }}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      name="organization_name"
                      label="Select Organization"
                      variant="standard"
                      value={values.organization_name}
                    />
                  )}
                />

                <Field
                  as={TextField}
                  id="administrativeName"
                  label="Administrative Name"
                  variant="standard"
                  name="name"
                  value={values.name}
                  error={errors.name && touched.name}
                  helperText={errors.name && touched.name ? errors.name : ''}
                  className="capitalize"
                  fullWidth
                  sx={{ marginBottom: '20px', marginTop: '20px' }}
                />

                <Field
                  as={TextField}
                  id="shortName"
                  label="Short Name"
                  variant="standard"
                  name="short_name"
                  value={values.short_name}
                  className="capitalize"
                  fullWidth
                  sx={{ marginBottom: '20px', marginTop: '20px' }}
                />

                <div
                  style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '55px',
                  }}
                >
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() =>
                      setAdd({ ...add, ['Administrative Office']: false })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    type="submit"
                    fullWidth
                    // disabled={!isValid}
                  >
                    {'Save'}
                  </Button>
                </div>
              </Form>
            </DialogContent>
          )}
        </Formik>
      </Dialog>

      <Dialog open={add['College Or School']}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>{'Add College'}</div>
            <div>
              <AiOutlineClose onClick={handleClickClose} />
            </div>
          </div>
        </DialogTitle>

        <Formik
          initialValues={collegeInitialValues}
          validationSchema={validation}
          onSubmit={(values, { setFieldValue }) => {
            dispatch(addCollegeData(values, setAdd, id, null, setVal));
          }}
        >
          {({
            values,
            isValid,
            handleChange,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
          }) => (
            <DialogContent
              sx={{ width: '600px', height: 'fitContent', overflowX: 'hidden' }}
            >
              <Form>
                <h2>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    component="p"
                    sx={{ marginTop: '14px' }}
                  >
                    Please add your college name
                  </Typography>
                </h2>

                <Field
                  name="organization_name"
                  component={Autocomplete}
                  value={values.organization_name}
                  options={organizationName}
                  ListboxProps={{ style: { maxHeight: 250 } }}
                  fullWidth
                  getOptionLabel={(option: { id: string; name: string }) =>
                    option.name === undefined ? '' : option.name
                  }
                  isOptionEqualToValue={(
                    option: { id: string; name: string },
                    current: { id: string; name: string }
                  ) => option.id === current.id}
                  onChange={(
                    event: React.SyntheticEvent,
                    organization_name: { id: string; name: string }
                  ) => {
                    setFieldValue('organization_name', organization_name);
                  }}
                  onBlur={() => setFieldTouched('organization_name', true)}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      name="organization_name"
                      variant="standard"
                      label="Organization"
                      error={
                        errors.organization_name && touched.organization_name
                          ? true
                          : false
                      }
                      helperText={
                        errors.organization_name && touched.organization_name
                          ? 'Required Field'
                          : ''
                      }
                      required
                    />
                  )}
                />

                <Field
                  as={TextField}
                  label="College Name"
                  required
                  variant="standard"
                  name="name"
                  value={values.name}
                  helperText={errors.name && touched.name ? errors.name : ''}
                  fullWidth
                  error={errors.name && touched.name ? true : false}
                  sx={{ marginBottom: '20px', marginTop: '20px' }}
                />

                <Field
                  as={TextField}
                  id="shortName"
                  label="Short Name"
                  variant="standard"
                  name="short_name"
                  value={values.short_name}
                  fullWidth
                  sx={{ marginBottom: '20px', marginTop: '20px' }}
                />

                <div
                  style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '55px',
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() =>
                      setAdd({ ...add, ['College Or School']: false })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    // disabled={!isValid}
                  >
                    {'Save'}
                  </Button>
                </div>
              </Form>
            </DialogContent>
          )}
        </Formik>
      </Dialog>

      <Dialog open={add.Program}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          {'Add Program'}
        </DialogTitle>

        <Formik
          initialValues={programInitialValues}
          // validationSchema={validation}
          onSubmit={(values) => {
            dispatch(addProgramData(values, setAdd, id, null, setVal));
          }}
        >
          {({
            values,
            isValid,
            handleChange,
            errors,
            touched,
            setFieldValue,
          }) => (
            <DialogContent
              sx={{
                width: '600px',
                height: 'fitContent',
                overflowX: 'hidden',
              }}
            >
              <Form>
                {/* <h2>
                  <Typography variant="subtitle1" gutterBottom component="p">
                    Please add your Program name
                  </Typography>
                </h2> */}

                <Field
                  name="organization_name"
                  component={Autocomplete}
                  value={values.organization_name}
                  options={organizationData}
                  fullWidth
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.id === value
                  }
                  getOptionLabel={(org: any) =>
                    org.name === undefined ? '' : org.name
                  }
                  onChange={(_: any, name: any) => {
                    setFieldValue('organization_name', name);
                  }}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      name="organization_name"
                      label="Select Organization"
                      variant="standard"
                      value={values.organization_name}
                    />
                  )}
                />

                <Field
                  as={TextField}
                  id="programName"
                  label="Program Name"
                  variant="standard"
                  name="name"
                  value={values.name}
                  error={errors.name && touched.name}
                  helperText={errors.name && touched.name ? errors.name : ''}
                  className="capitalize"
                  fullWidth
                  sx={{ marginBottom: '20px', marginTop: '20px' }}
                />

                <Field
                  as={TextField}
                  id="shortName"
                  label="Short Name"
                  variant="standard"
                  name="short_name"
                  value={values.short_name}
                  className="capitalize"
                  fullWidth
                  sx={{ marginBottom: '20px', marginTop: '20px' }}
                />

                <div
                  style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '55px',
                  }}
                >
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setAdd({ ...add, Program: false })}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    type="submit"
                    fullWidth
                    // disabled={!isValid}
                  >
                    {'Save'}
                  </Button>
                </div>
              </Form>
            </DialogContent>
          )}
        </Formik>
      </Dialog>

      <Dialog open={add.Center}>
        <div className="popup_box">
          <DialogTitle className=" flex justify-between bg-sky-800 text-white p-3">
            {/* {props.edit ? "Update" : "Add"} */}
            <div>{'Add Center'}</div>
            <div>
              <AiOutlineClose
                onClick={() => setAdd({ ...add, Center: false })}
              />
            </div>

            {/* Centers */}
            {/* <Divider /> */}
          </DialogTitle>
          <DialogContent>
            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Discipline Name
              </label>
              <Autocomplete
                disablePortal
                disableClearable={true}
                options={disciplineNames.length ? disciplineNames : []}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.name === value
                }
                getOptionLabel={(sub: any) =>
                  sub.name === undefined ? '' : sub.name
                }
                sx={{ width: '100%' }}
                value={autoComplete.value}
                onChange={(_: any, newValue: any) => {
                  setAutoComplete({
                    ...autoComplete,
                    value: {
                      discipline_id: newValue?.id || '',
                      name: newValue.name,
                    },
                  });
                  // setOrgAutoComplete({
                  //   value: {},
                  //   input: "",
                  // });
                  setSubAutoComplete({
                    value: {},
                    input: '',
                  });
                  setInputForm({
                    ...inputForm,
                    discipline_id: newValue?.id || '',
                  });
                }}
                inputValue={autoComplete.input}
                onInputChange={(event, newInputValue) => {
                  setAutoComplete({ ...autoComplete, input: newInputValue });
                }}
                renderInput={(params: any) => {
                  return <TextField {...params} size={'small'} />;
                }}
              />
            </div>
            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Sub Discipline Name
              </label>
              <Autocomplete
                disableClearable={true}
                disablePortal
                options={getSubDisciplineByDiscipline(
                  inputForm?.discipline_id || ''
                )}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.name === value
                }
                getOptionLabel={(sub: any) =>
                  sub.name === undefined ? '' : sub.name
                }
                sx={{ width: '100%' }}
                value={subAutoComplete.value}
                onChange={(_: any, newValue: any) => {
                  setSubAutoComplete({
                    ...subAutoComplete,
                    value: {
                      sub_discipline_id: newValue?.id || '',
                      name: newValue.name,
                    },
                  });
                  setInputForm({
                    ...inputForm,
                    sub_discipline_id: newValue.id,
                  });
                }}
                inputValue={subAutoComplete.input}
                onInputChange={(event, newInputValue) => {
                  setSubAutoComplete({
                    ...subAutoComplete,
                    input: newInputValue,
                  });
                }}
                renderInput={(params: any) => {
                  return <TextField {...params} size={'small'} />;
                }}
              />
            </div>

            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Organization Name
              </label>

              <Autocomplete
                disablePortal
                disableClearable={true}
                options={organizationName?.length ? organizationName : []}
                getOptionLabel={(org: any) =>
                  org.name === undefined ? '' : org.name
                }
                sx={{ width: '100%' }}
                value={orgAutoComplete.value}
                onChange={(_: any, newValue: any) => {
                  setOrgAutoComplete({
                    ...orgAutoComplete,
                    value: {
                      organization_id: newValue.id,
                      name: newValue.name,
                    },
                  });
                  setInputForm({
                    ...inputForm,
                    organization_id: newValue.id,
                  });
                }}
                inputValue={orgAutoComplete.input}
                onInputChange={(event, newInputValue) => {
                  setOrgAutoComplete({
                    ...orgAutoComplete,
                    input: newInputValue,
                  });
                }}
                renderInput={(params: any) => {
                  return <TextField {...params} size={'small'} />;
                }}
              />
            </div>
            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Center Name
              </label>

              <input
                className="Input-Box"
                type="text"
                placeholder="Enter Center Name"
                name="name"
                value={inputForm.name}
                onChange={handleCenterChange}
              />
            </div>
            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Short Name
              </label>

              <input
                className="Input-Box"
                type="text"
                placeholder="Enter Short Name"
                name="short_name"
                value={inputForm.short_name}
                onChange={handleCenterChange}
              />
            </div>
            <div className="flex gap-5 justify-start	items-center p-2 ">
              <label htmlFor="Discipline" className="w-72">
                Website
              </label>

              <input
                className="Input-Box"
                type="text"
                placeholder="Enter Website"
                name="website"
                value={inputForm.website}
                onChange={handleCenterChange}
              />
            </div>

            <label style={{ color: 'red' }}>{/* {errorLabel} */}</label>
          </DialogContent>

          <DialogActions>
            <div className="flex gap-3">
              <Button
                style={{ textTransform: 'capitalize' }}
                onClick={() => setAdd({ ...add, Center: false })}
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  inputForm.name.trim() === '' ||
                  inputForm.organization_id.trim() === ''
                }
                style={{ textTransform: 'capitalize' }}
                // onClick={() => {
                //

                //   addSubDiscipline(inputForm);
                // }}
                onClick={handleSave}
                variant="contained"
              >
                {'Save'}
              </Button>
            </div>
          </DialogActions>
        </div>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Select Your Unit</Box>
            <Box>
              <IconButton onClick={handleClose}>
                <GrFormClose />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            What type of unit are you affiliated with?
          </DialogContentText>
          <div className="p-2 mt-10">
            <div className="flex justify-center gap-5 ">
              <Button
                onClick={() =>
                  handleOpenChildDialogBox('Department', 'save', '')
                }
                variant="outlined"
              >
                Department
              </Button>
              <Button
                onClick={() =>
                  handleOpenChildDialogBox('College Or School', 'save', '')
                }
                variant="outlined"
              >
                College Or School
              </Button>
            </div>
            <div className="flex gap-5 mt-5">
              <Button
                onClick={() => handleOpenChildDialogBox('Program', 'save', '')}
                variant="outlined"
              >
                Program
              </Button>
              <Button
                onClick={() => handleOpenChildDialogBox('Center', 'save', '')}
                variant="outlined"
              >
                Center/Institute
              </Button>
              <Button
                onClick={() =>
                  handleOpenChildDialogBox('Administrative Office', 'save', '')
                }
                variant="outlined"
              >
                Administrative
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {props.value == 'myAccount' ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              disabled={condition}
              color="primary"
              onClick={handleClick}
            >
              Add
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              disabled={condition}
              color="primary"
              onClick={!condition ? handleNext : () => null}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default FirstStep;
