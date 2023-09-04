import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { getOrganizationName } from '../../reduxStore/reducer/organisationReducer';
import { AiOutlineClose } from 'react-icons/ai';
import {
  addCoursePrefixData,
  getCoursePrefixName,
} from '../../reduxStore/reducer/coursePrefixReducer';
import { CoursePrefix } from '../coursePrefix/CoursePrefix';
import { getCoursePrefix } from '../../reduxStore/route/coursePrefixRoute';
import { SettingsInputAntenna } from '@mui/icons-material';
import { getUserById } from '../../reduxStore/reducer/registerReducer';

export function AddCoursePrefix({
  openDialog,
  setOpenForm,
  setInitialValuePrefix,
  initialValuesPrefix,
  setInitialValues,
  initialValues,
  organization,
  course_prefix,
}: any) {
  const dispatch = useDispatch<AppDispatch>();

  const [isEdit, setIsEdit] = useState(false);
  const [dataSource, setDataSource] = useState();
  //for delete call
  const [params, setParams] = useState();

  const getUserDataAndType = useSelector(
    (state: any) => state.register.getUserById
  );

  const data = {
    // define your properties here
  };
  useEffect(() => {
    dispatch(
      getUserById({
        id: `${JSON.parse(localStorage.getItem('token') || '{}')}`,
      })
    );
    // pass the `data` object as an argument
    // dispatch(getSubDisciplineAction());
  }, [dispatch]);

  useEffect(() => {
    // dispatch(getOrganizationName());
  }, [dispatch]);

  const organizationData = useSelector(
    (state: RootState) => state.organization.organizationName
  );

  // const [initialValues, setInitialValue] = useState<CoursePrefix>({
  //   id: "",
  //   organization_name: "",
  //   name: "",
  //   is_active: true,
  //   created_by: "",
  // });

  const handleClickClose = () => {
    setOpenForm({ ...openDialog, open: false });
    setInitialValuePrefix({
      id: '',
      organization_name: '',
      name: '',

      is_active: true,
      created_by: '',
    });
  };

  const validation = Yup.object({
    // organization_name: Yup.object({
    //   id: Yup.string(),
    //   value: Yup.string(),
    // })
    //   .nullable()
    //   .required("Required Field"),
    name: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
  });

  return (
    <Dialog open={openDialog.open}>
      <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
        <div className="flex justify-between items-center">
          <div>{isEdit ? 'Update Course Prefix ' : 'Add Course Prefix '}</div>
          <div>
            <AiOutlineClose onClick={handleClickClose} />
          </div>
        </div>
      </DialogTitle>

      <Formik
        initialValues={initialValuesPrefix}
        validationSchema={validation}
        onSubmit={(values) => {
          values.organization = organization;
          values.course_prefix = course_prefix;
          if (!isEdit) {
            dispatch(
              addCoursePrefixData(
                values,
                setOpenForm,
                '',
                (data: any) => {
                  openDialog.callback('course_prefix_id', {
                    id: data.id,
                    name: data.name,
                  });

                  dispatch(getCoursePrefixName(data.organization_id));
                },
                setInitialValues,
                initialValues
              )
            );
          }
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
              {/* {getUserDataAndType?.data?.type === "admin" && (
                <Field
                  name="organization_name"
                  component={Autocomplete}
                  value={values?.organization_name}
                  options={organizationData}
                  fullWidth
                  isOptionEqualToValue={(option: any, value: any) =>
                    option?.id === value
                  }
                  getOptionLabel={(org: any) =>
                    org?.name === undefined ? "" : org?.name
                  }
                  onChange={(_: any, name: any) => {
                    setFieldValue("organization_name", name);
                  }}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      name="organization_name"
                      label="Select Organization"
                      variant="standard"
                      value={values?.organization_name}
                    />
                  )}
                />
              )} */}
              <Field
                as={TextField}
                id="coursePrefixName"
                label="Course Prefix Name"
                variant="standard"
                name="name"
                value={values?.name}
                error={errors?.name && touched?.name}
                helperText={errors?.name && touched?.name ? errors?.name : ''}
                className="capitalize"
                fullWidth
                sx={{ marginBottom: '20px', marginTop: '20px' }}
              />
              <div className="flex gap-3 justify-end">
                <Button
                  variant="contained"
                  style={{ textTransform: 'capitalize' }}
                  // fullWidth
                  onClick={handleClickClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ textTransform: 'capitalize' }}
                  type="submit"
                >
                  {isEdit ? 'Update' : 'Add'}
                </Button>
              </div>
              {/* <br></br>
            <br></br>
            values
            <pre>{JSON.stringify(values, null, 2)}</pre>
            errors
            <pre>{JSON.stringify(errors, null, 2)}</pre>
            touched
            <pre>{JSON.stringify(touched, null, 2)}</pre> */}
            </Form>
          </DialogContent>
        )}
      </Formik>
    </Dialog>
  );
}
