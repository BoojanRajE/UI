import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
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
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import { getUnitrolesName } from '../../reduxStore/reducer/unitrolesReducer';
import { setAriaRole } from 'ag-grid-community/dist/lib/utils/aria';
import FirstStep from '../register/activatedStepper/FirstStep';
import {
  update,
  getUserDetailsById,
  getUserDetailsByIdAffiliate,
} from '../../reduxStore/reducer/registerReducer';
import { updateUserDetails } from '../../reduxStore/reducer/registerReducer';
import { initialValues } from '../register/activatedStepper/InitialValues';
import { AnyGridOptions } from 'ag-grid-community';
import Index from './Stepper/Index';
import { setDefaultResultOrder } from 'dns/promises';
import EditIcon from '@mui/icons-material/Edit';
import {
  deleteUserOrganization,
  deleteUserUnit,
  updateDefaultOrganization,
  updateUnitRoles,
} from '../../reduxStore/reducer/userReducer';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '../../utils/Alert/Alert';

function Affiliation() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('token') || '{}');
    dispatch(getUserDetailsByIdAffiliate({ id: user }));
  }, [dispatch]);

  const userData: any = useSelector(
    (state: RootState) => state.register.getUserByIdDataAffiliate
  );

  const [open, setOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const [affiliateOpen, setAffiliateOpen] = useState(false);
  const [userUnitId, setUserUnitId] = useState('');

  const handleClickOpen = (data: any) => {
    const obj: any = {};
    data?.roles.map((data: any) => {
      obj[data?.role_name] = true;
    });

    setOpen(true);
    setUserUnitId(data?.user_unit_id);
    setCheckedItems(obj);
  };

  const handleSave = () => {
    const names = Object.entries(checkedItems)
      .map(([key, value]) => {
        if (value) return key || '';
      })
      .filter((i) => i);

    const ids = names.map((name) => {
      const found = unitRolesData.find((item: any) => item.role_name === name);
      return found ? found.id : null;
    });

    dispatch(updateUnitRoles(ids, userUnitId));

    handleClose();
  };

  const handleClose = () => {
    setCheckedItems({});
    setUserUnitId('');
    setOpen(false);
  };

  const [org, setOrg] = useState('');
  const handleClickUnitOpen = (org_id: any) => {
    setUnitOpen(true);
    setOrg(org_id);
  };
  const handleClickAffiliateOpen = () => {
    setAffiliateOpen(true);
  };
  const handleUnitClose = () => {
    setUnitOpen(false);
  };

  const handleAffiliateClose = () => {
    setAffiliateOpen(false);
  };
  //const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getUnitrolesName(setLoading));
  }, []);
  const unitRolesData: any = useSelector(
    (state: RootState) => state.unitroles.unitrolesName
  );

  const [checkedItems, setCheckedItems] = useState<any>({});
  const [role, setRole] = useState({});

  const onGenderChange = (event: any) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
    // roles_name.push(event.target.name);
    //
    // setInitialValue({
    //   ...initialValue,
    //   gender: Object.entries(checkedItems)
    //     .map(([key, value]) => {
    //       if (value) return key || "";
    //     })
    //     .filter((i) => i),
    // });
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-large p-2">Affiliations</h1>
          <div className="text-end pr-10 flex gap-x-16 justify-end items-center">
            {userData.length > 0 ? (
              <Button
                sx={{ textTransform: 'capitalize' }}
                className="text-md text-blue-600 ml-4 mb-4"
                onClick={handleClickAffiliateOpen}
              >
                Add a new staff or student institutional affiliation to my
                account
              </Button>
            ) : (
              ''
            )}

            <Dialog
              open={affiliateOpen}
              onClose={handleAffiliateClose}
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
              <DialogContent>
                <Index />
              </DialogContent>
            </Dialog>
          </div>
          {userData?.map((item: any, i: any) => {
            return (
              <>
                <section
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                  id="support"
                  className="border-2 border-black rounded-xl mt-4 mb-2 mr-10 ml-10 bg-neutral-300"
                >
                  <p className="text-xl ml-4 bg-neutral-300 font-large mt-4 mb-4">
                    {item?.organization_name}
                  </p>
                  <div style={{ display: 'flex', marginRight: '20px' }}>
                    <FormControlLabel
                      style={{
                        display: 'flex',
                        flexDirection: 'column-reverse',
                      }}
                      control={
                        <Switch
                          checked={item?.is_default}
                          disabled={item?.is_default}
                        />
                      }
                      onChange={(e: any) => {
                        dispatch(
                          updateDefaultOrganization(e.target.checked, item?.id)
                        );
                      }}
                      label="Default Organization"
                    />
                    <IconButton
                      disabled={item?.is_default}
                      onClick={() => {
                        Alert.confirm(() => {
                          dispatch(deleteUserOrganization(item?.id));
                        });
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </div>
                </section>
                <section
                  id="support"
                  className="border-2 border-slate-300 rounded-xl mt-2 mb-2 mr-10 ml-10 "
                >
                  <p className="text-md ml-4 font-large mt-2 mb-2 grid sm:max-w-4xl sm:grid-cols-2  ">
                    <div className="font-medium">Classification: </div> staff
                  </p>
                </section>
                <section
                  id="support"
                  className="border-2 border-slate-300 rounded-xl mt-2 mb-2 mr-10 ml-10 "
                >
                  <p className="text-md ml-4 font-medium mt-2">Contacts</p>
                  <hr className="bg-black h-0.5 mx-2 "></hr>
                  <div className="grid gap-x-2 max-w-lg sm:max-w-4xl ml-4 sm:grid-cols-2 justify-between mb-4 mt-2">
                    <p>Email:</p> <p>{item?.organization_email_id}</p>
                  </div>
                </section>
                <section
                  id="support"
                  className="border-2 border-slate-300 rounded-xl mt-2 mb-2 mr-10 ml-10 "
                >
                  <p className="text-md ml-4 font-medium mt-2">Units</p>
                  <hr className="bg-black h-0.5 mx-2 "></hr>

                  {/* {JSON.stringify(
                item?.organisation?.map((unit: any, index: any) => unit)
              )} */}

                  {item?.units?.map((unit: any, index: any) => {
                    return (
                      <div>
                        <section
                          id="support"
                          className=" bg-neutral-300 rounded-xl mt-4 mb-2 mr-10 ml-5 "
                        >
                          <div className="grid gap-x-2 max-w-lg sm:max-w-4xl ml-4 sm:grid-cols-3 justify-between">
                            <p
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              {unit?.unit_id == 1
                                ? 'department'
                                : unit?.unit_id == 2
                                ? 'College Or School'
                                : unit?.unit_id == 3
                                ? 'Program'
                                : unit?.unit_id == 4
                                ? 'Center/Institute'
                                : 'Administrative Office'}
                            </p>
                            <p
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              {unit?.unit?.name}
                            </p>
                            <p>
                              <IconButton
                                disabled={item?.units?.length == 1}
                                onClick={() => {
                                  Alert.confirm(() => {
                                    dispatch(
                                      deleteUserUnit(unit?.user_unit_id)
                                    );
                                  });
                                }}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            </p>
                          </div>
                        </section>
                        <div className="ml-4">
                          <p className="text-md font-medium">Roles</p>
                          <div
                            className="grid gap-x-2 max-w-lg sm:max-w-4xl sm:grid-cols-6 justify-between "
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            {unit.roles?.map((unit: any, index: any) => {
                              return (
                                <li
                                  className="list-disc list-inside"
                                  style={{ marginLeft: '10px' }}
                                >
                                  {unit.role_name}
                                </li>
                              );
                            })}
                            <IconButton
                              onClick={() => {
                                handleClickOpen(unit);
                              }}
                              disableTouchRipple
                            >
                              <EditIcon />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <hr className="bg-black h-0.5 ml-4 mb-2 "></hr>
                  <Button
                    style={{ textTransform: 'capitalize' }}
                    className="text-md text-blue-600 ml-4 mb-4"
                    onClick={(e) => {
                      handleClickUnitOpen(item?.organization_id);
                    }}
                  >
                    Add a unit affiliation at Iowa State University to my
                    account
                  </Button>
                </section>
                <p className="h-6"></p>
              </>
            );
          })}
          <Dialog
            open={unitOpen}
            onClose={handleUnitClose}
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
            <DialogContent>
              <FirstStep value="myAccount" org_id={org} setOpen={setUnitOpen} />
            </DialogContent>
          </Dialog>
          <Dialog
            open={open}
            onClose={handleClose}
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
            <DialogContent>
              <Grid item xs={12} sm={6}>
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
                          value={item?.id}
                          id={item.id}
                          size="small"
                          name={item?.role_name}
                          //defaultChecked={
                          // initialValue.role_name == item.role_name ? true : false
                          //}
                          checked={
                            checkedItems[item?.role_name] == true ? true : false
                          }
                          onChange={(e) => onGenderChange(e)}
                        />
                        {item?.role_name}
                      </label>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{ dispaly: 'flex', justifyContent: 'space-between' }}
            >
              <div>
                <Button onClick={handleClose}>Cancel</Button>
              </div>
              <div className=" flex gap-4">
                <Button variant="contained" onClick={handleSave}>
                  Ok
                </Button>
              </div>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
}
export default Affiliation;
