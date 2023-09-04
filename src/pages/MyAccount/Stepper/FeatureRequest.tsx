import { Box, Button, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AppDispatch, RootState } from '../../../reduxStore/Store';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUsersData,
  getUsersType,
} from '../../../reduxStore/reducer/userReducer';

interface FormState {
  title: string;
  description: string;
  module: string;
  priority: string;
  project: string;
  submodule: string;
  status: string;
  analyst: string;
  implementation_details: string;
  internal_notes: string;
}

const FeatureRequest = () => {
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();
  const userData: any = useSelector(
    (state: RootState) => state.users.usersData
  );

  // const [form, setForm] = useState<FormState>({
  //   title: "",
  //   description: "",
  //   module: "",
  //   priority: "",
  //   project: "",
  //   submodule: "",
  //   status: "",
  //   analyst: "",
  //   implementation_details: "",
  //   internal_notes: "",
  // });

  const navigate = useNavigate();

  const initialFormState = {
    title: '',
    description: '',
    module: '',
    priority: '',
    project: '',
    submodule: '',
    status: '',
    analyst: '',
    implementation_details: '',
    internal_notes: '',
  };

  const formSubmit = () => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/helpcenter/update/${location.state.id}`;

    axios({
      method: 'post',
      url,
      headers: {
        authorization: localStorage.getItem('token')
          ? `Bearer ${JSON.parse(localStorage.getItem('token') || '{}')}`
          : '',
        'Content-Type': 'application/json',
      },
      data: {
        ...form,
      },
    }).then((result: any) => {
      let message = '';

      switch (form.status) {
        case 'new':
          message = 'Your issue has been submitted as a new issue';
          break;
        case 'open':
          message = 'Your issue has been submitted and is now open';
          break;
        case 'resolved':
          message = 'Your issue has been submitted and is now resolved';
          break;
        default:
          message = 'Your issue has been submitted';
          break;
      }

      Swal.fire({
        icon: 'success',
        title: message,
        showConfirmButton: true,
        confirmButtonText: 'Ok',
        customClass: {
          container: 'swal-container',
        },
      }).then(() => {
        setForm(initialFormState);
        navigate(-1);
      });
    });
  };

  const [form, setForm] = useState<FormState>(initialFormState);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };
  const [img, setImg] = useState(null);

  useEffect(() => {
    dispatch(getUsersType('admin'));

    if (location?.state) {
      const {
        id,
        title,
        description,
        module,
        priority,
        project,
        submodule,
        status,
        analyst,
        implementation_details,
        internal_notes,
      } = location?.state;

      // const analystData = userData.length && userData.find((e)=> e.id === analyst)
      // const analystName =

      setForm({
        ...form,
        ...{
          title,
          description,
          module,
          priority,
          project,
          submodule,
          status,
          analyst,
          implementation_details,
          internal_notes,
        },
      });
      const url = `${process.env.REACT_APP_BASE_URL}/api/helpcenter/file/${id}`;

      axios({
        method: 'get',
        url,
        headers: {
          authorization: localStorage.getItem('token')
            ? `Bearer ${JSON.parse(localStorage.getItem('token') || '{}')}`
            : '',
          // "Content-Type": "application/json",
        },
      }).then((res) => {
        // Swal.fire({
        //   icon: "success",
        //   title: "Your issue has been submitted",
        //   showConfirmButton: true,
        //   confirmButtonText: "Ok",

        //   customClass: {
        //     container: "swal-container",
        //   },
        // });

        setImg(res.data.data);
      });
    }
  }, []);

  // const formSubmit = () => {
  //
  //   const url = `${process.env.REACT_APP_BASE_URL}/api/helpcenter/update/${location.state.id}`;

  //   axios({
  //     method: "post",
  //     url,
  //     headers: {
  //       authorization: localStorage.getItem("token")
  //         ? `Bearer ${JSON.parse(localStorage.getItem("token") || "{}")}`
  //         : "",
  //       "Content-Type": "application/json",
  //     },
  //     data: {
  //       ...form,
  //     },
  //   }).then((result: any) => {
  //     // Swal.fire({
  //     //   icon: "success",
  //     //   title: "Your issue has been submitted",
  //     //   showConfirmButton: true,
  //     //   confirmButtonText: "Ok",

  //     //   customClass: {
  //     //     container: "swal-container",
  //     //   },
  //     // });
  //     //
  //     let message = "";

  //     switch (form.status) {
  //       case "new":
  //         message = "Your issue has been submitted as a new issue";
  //         break;
  //       case "open":
  //         message = "Your issue has been submitted and is now open";
  //         break;
  //       case "resolved":
  //         message = "Your issue has been submitted and is now resolved";
  //         break;
  //       default:
  //         message = "Your issue has been submitted";
  //         break;
  //     }

  //     Swal.fire({
  //       icon: "success",
  //       title: message,
  //       showConfirmButton: true,
  //       confirmButtonText: "Ok",
  //       customClass: {
  //         container: "swal-container",
  //       },
  //     });
  //   });
  // };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  return (
    <div>
      <section
        id="support"
        className="border-2 bg-sky-50 border-slate-300 rounded-xl mt-4 mb-4 mr-4 "
      >
        <p className="text-3xl font-medium p-2">
          {`Feature request ref. # ${location.state.id}`}
        </p>
      </section>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* <Grid item xs={12} sm={6} md={6} lg={6} xl={4}> */}
          <Grid item xs={2} sm={2} md={1} lg={1} xl={1}>
            <label>Title</label>
          </Grid>
          <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
            <TextField
              size="small"
              fullWidth
              name="title"
              value={form.title}
              onChange={handleChange}
              label="Links for new LASSO resources"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={2} md={3} lg={3} xl={3}>
            <Button
              fullWidth
              sx={{ textTransform: 'capitalize' }}
              variant="contained"
              onClick={formSubmit}
            >
              Save Changes
            </Button>
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={4}>
                Module
              </Grid>

              <Grid item xs={8}>
                <select
                  className="Input-Box"
                  name="module"
                  value={form.module}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="support">Support</option>
                  <option value="lasso">LASSO</option>
                  <option value="lax">Lax</option>
                  <option value="undefined">Undefined</option>
                </select>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={4}>
                Priority
              </Grid>

              <Grid item xs={8}>
                <select
                  className="Input-Box"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={4}>
                Project
              </Grid>

              <Grid item xs={8}>
                <TextField
                  size="small"
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  id="outlined-basic"
                  // label="Outlined"
                  // variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            {/* <Button
              fullWidth
              sx={{ textTransform: "capitalize" }}
              variant="contained"
            >
              Reclassify
            </Button> */}
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={4}>
                Submodule
              </Grid>

              <Grid item xs={8}>
                <TextField
                  size="small"
                  name="submodule"
                  value={form.submodule}
                  onChange={handleChange}
                  // label="Outlined"
                  // variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={4}>
                Status
              </Grid>

              <Grid item xs={8}>
                <select
                  className="Input-Box"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="new">New</option>
                  <option value="open">Open</option>
                  {/* <option value="re-opened">re-opened</option> */}
                  <option value="resolved">Resolved</option>
                  {/* <option value="suspended">suspended</option> */}
                  {/* <option value="closed">closed</option> */}
                </select>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={4}>
                Analyst
              </Grid>

              <Grid item xs={8}>
                <select
                  className="Input-Box"
                  name="analyst"
                  value={form.analyst}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {userData &&
                    userData.map((user: any) => {
                      return (
                        <option
                          value={user.id}
                        >{`${user.first_name} ${user.last_name}`}</option>
                      );
                    })}
                </select>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            {/* <Item>4</Item> */}
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <span className="font-medium">
              Description of Requested Feature
            </span>
            <div className="Input-Box">
              <textarea
                className="Input-Box"
                id="w3review"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                cols={50}
              ></textarea>
              {img ? (
                <img
                  style={{ width: '100%', height: '100%' }}
                  // style={{ width: "300px", height: "200px" }}
                  src={`data:image/png;base64,${img}`}
                />
              ) : (
                ''
              )}
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <span className="font-medium">Implementation Details</span>
            <textarea
              className="Input-Box"
              id="w3review"
              name="implementation_details"
              value={form.implementation_details}
              onChange={handleChange}
              rows={4}
              cols={50}
            ></textarea>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <span className="font-medium">Internal Notes</span>
            <textarea
              className="Input-Box"
              id="w3review"
              name="internal_notes"
              value={form.internal_notes}
              onChange={handleChange}
              rows={4}
              cols={50}
            ></textarea>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default FeatureRequest;

// import { Box, Button, Grid, TextField } from "@mui/material";
// import React from "react";
// import Paper from "@mui/material/Paper";
// import { styled } from "@mui/material/styles";

// const FeatureRequest = () => {
//   const Item = styled(Paper)(({ theme }) => ({
//     backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
//     ...theme.typography.body2,
//     padding: theme.spacing(1),
//     textAlign: "center",
//     color: theme.palette.text.secondary,
//   }));
//   return (
//     <div>
//       <section
//         id="support"
//         className="border-2 bg-sky-50 border-slate-300 rounded-xl mt-4 mb-4 mr-4 "
//       >
//         <p className="text-3xl font-medium p-2">Trouble Report ref. # 69S1SQ</p>
//       </section>
//       <Box sx={{ width: "100%" }}>
//         <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//           {/* <Grid item xs={12} sm={6} md={6} lg={6} xl={4}> */}
//           <Grid item xs={4} sm={2} md={1} lg={1} xl={1}>
//             <label>Title</label>
//           </Grid>
//           <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
//             <TextField
//               size="small"
//               fullWidth
//               id="outlined-basic"
//               label="Links for new LASSO resources"
//               variant="outlined"
//             />
//           </Grid>

//           <Grid item xs={12} sm={2} md={3} lg={3} xl={3}>
//             <Button
//               fullWidth
//               sx={{ textTransform: "capitalize" }}
//               variant="contained"
//             >
//               Save Changes
//             </Button>
//           </Grid>

//           <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//             <Grid
//               container
//               rowSpacing={1}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             >
//               <Grid item xs={4}>
//                 Module
//               </Grid>

//               <Grid item xs={8}>
//                 <select className="Input-Box" name="cars" id="cars">
//                   <option value="volvo">Volvo</option>
//                   <option value="saab">Saab</option>
//                   <option value="mercedes">Mercedes</option>
//                   <option value="audi">Audi</option>
//                 </select>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//             <Grid
//               container
//               rowSpacing={1}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             >
//               <Grid item xs={4}>
//                 Priority
//               </Grid>

//               <Grid item xs={8}>
//                 <select className="Input-Box" name="cars" id="cars">
//                   <option value="audi">Select</option>
//                   <option value="volvo">Low</option>
//                   <option value="saab">Medium</option>
//                   <option value="mercedes">High</option>
//                 </select>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//             <Grid
//               container
//               rowSpacing={1}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             >
//               <Grid item xs={4}>
//                 Project
//               </Grid>

//               <Grid item xs={8}>
//                 <TextField
//                   size="small"
//                   id="outlined-basic"
//                   label="Outlined"
//                   variant="outlined"
//                 />
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
//             <Button
//               fullWidth
//               sx={{ textTransform: "capitalize" }}
//               variant="contained"
//             >
//               Reclassify
//             </Button>
//           </Grid>
//           <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//             <Grid
//               container
//               rowSpacing={1}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             >
//               <Grid item xs={4}>
//                 Submodule
//               </Grid>

//               <Grid item xs={8}>
//                 <TextField
//                   size="small"
//                   id="outlined-basic"
//                   label="Outlined"
//                   variant="outlined"
//                 />
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//             <Grid
//               container
//               rowSpacing={1}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             >
//               <Grid item xs={4}>
//                 Status
//               </Grid>

//               <Grid item xs={8}>
//                 <select className="Input-Box" name="cars" id="cars">
//                   <option value="volvo">Select...</option>
//                   <option value="saab">open</option>
//                   <option value="mercedes">re-opened</option>
//                   <option value="audi">resolved</option>
//                   <option value="audi">suspended</option>
//                   <option value="audi">closed</option>
//                 </select>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//             <Grid
//               container
//               rowSpacing={1}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             >
//               <Grid item xs={4}>
//                 Analyst
//               </Grid>

//               <Grid item xs={8}>
//                 <select className="Input-Box" name="cars" id="cars">
//                   <option value="volvo">Select...</option>
//                   <option value="saab">Michael Barlow </option>
//                   <option value="mercedes">Mercedes</option>
//                   <option value="audi">Audi</option>
//                 </select>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//             {/* <Item>4</Item> */}
//           </Grid>
//           <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//             <span className="font-medium">Description of Issue</span>
//             <textarea
//               className="Input-Box"
//               id="w3review"
//               name="w3review"
//               rows={4}
//               cols={50}
//             ></textarea>
//           </Grid>
//           <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//             <span className="font-medium">Internal Notes</span>
//             <textarea
//               className="Input-Box"
//               id="w3review"
//               name="w3review"
//               rows={4}
//               cols={50}
//             ></textarea>
//           </Grid>
//           <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//             <span className="font-medium">Description of Resolution</span>
//             <textarea
//               className="Input-Box"
//               id="w3review"
//               name="w3review"
//               rows={4}
//               cols={50}
//             ></textarea>
//           </Grid>
//         </Grid>
//       </Box>
//     </div>
//   );
// };

// export default FeatureRequest;
