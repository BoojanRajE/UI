import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
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
import moment from 'moment';

interface FormState {
  title: string;
  created_by: any;
  description: any;
  created_at: any;
  module: string;
  priority: string;
  project: string;
  submodule: string;
  status: string;
  analyst: string;
  implementation_details: string;
  internal_notes: string;
  name: string;
}

const NewReports = () => {
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();
  const userData: any = useSelector(
    (state: RootState) => state.users.usersData
  );

  // const [form, setForm] = useState<FormState>({
  //   title: "",
  //   created_by: "",
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
    created_by: '',
    description: '',
    created_at: '',
    module: '',
    priority: '',
    project: '',
    submodule: '',
    status: '',
    analyst: '',
    implementation_details: '',
    internal_notes: '',
    name: '',
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    // Check if the selected status is empty or "Select"
    if (!form.status || form.status === 'Select' || form.status === 'new') {
      Swal.fire({
        icon: 'info',
        title: 'Please select a valid status',
        text: '',
        confirmButtonText: 'Ok',
        customClass: {
          container: 'swal-container',
        },
      });
      return; // Exit the function if the status is invalid
    }

    const url = `${process.env.REACT_APP_BASE_URL}/api/helpcenter/update/${location.state.id}`;

    const formData: any = { ...form };

    delete formData.created_by;
    delete formData.name;

    axios({
      method: 'post',
      url,
      headers: {
        authorization: localStorage.getItem('token')
          ? `Bearer ${JSON.parse(localStorage.getItem('token') || '{}')}`
          : '',
        'Content-Type': 'application/json',
      },
      data: formData,
    }).then((result: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Issue has been transferred to an open report.',
        showConfirmButton: true,
        confirmButtonText: 'Ok',
        customClass: {
          container: 'swal-container',
        },
      });
    });
  };

  const [form, setForm] = useState<FormState>(initialFormState);

  const handleChange = (event: any) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const [img, setImg] = useState(null);

  useEffect(() => {
    dispatch(getUsersType('admin'));

    if (location?.state) {
      const {
        id,
        title,
        created_by,
        description,
        created_at,
        module,
        priority,
        project,
        submodule,
        status,
        analyst,
        implementation_details,
        internal_notes,
        name,
      } = location?.state;

      setForm({
        ...form,
        ...{
          title,
          created_by,
          description,
          created_at,
          module,
          priority,
          project,
          submodule,
          status,
          analyst,
          implementation_details,
          internal_notes,
          name,
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
        setImg(res.data.data);
      });
    }
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  return (
    // <div>
    //   <section
    //     id="support"
    //     className="border-2 bg-sky-50 border-slate-300 rounded-xl mt-4 mb-4 mr-4 "
    //   >
    //     <p className="text-3xl font-medium p-2">
    //       {`Submission Detail Ref. # ${location.state.id}`}
    //     </p>
    //   </section>

    //   <section
    //     id="support"
    //     className="border-2 bg-sky-50 border-slate-300 rounded-xl mt-4 mb-4 mr-4 "
    //   >
    //     <p className="text-3xl font-medium p-2">
    //       User message
    //       {/* {`User message. # ${location.state}`} */}
    //     </p>
    //   </section>

    //   <div className="flex gap-5 flex-row	 p-2 ">
    //     <div>
    //       <div>
    //         <label htmlFor="Discipline" className="w-56">
    //           Submitted
    //         </label>

    //         <input
    //           className="Input-Box w-28  "
    //           required
    //           type="text"
    //           name="name"
    //         />
    //       </div>
    //       <div>
    //         <label htmlFor="Discipline" className="w-56">
    //           Name
    //         </label>

    //         <input
    //           className="Input-Box w-28  "
    //           required
    //           type="text"
    //           name="name"
    //         />
    //       </div>
    //       <div>
    //         <label htmlFor="Discipline" className="w-56">
    //           University
    //         </label>

    //         <input
    //           className="Input-Box w-28  "
    //           required
    //           type="text"
    //           name="name"
    //         />
    //       </div>
    //     </div>
    //     <div>
    //       <div>
    //         <label htmlFor="Discipline" className="w-56">
    //           System
    //         </label>

    //         <input
    //           className="Input-Box w-28  "
    //           required
    //           type="text"
    //           name="name"
    //         />
    //       </div>
    //       <div>
    //         <label htmlFor="Discipline" className="w-56">
    //           Module
    //         </label>

    //         <input
    //           className="Input-Box w-28  "
    //           required
    //           type="text"
    //           name="name"
    //         />
    //       </div>
    //       <div>
    //         <label htmlFor="Discipline" className="w-56">
    //           Ref. #
    //         </label>

    //         {/* <p className="text-3xl font-medium p-2">
    //       {`Open Request ref. # ${location.state.id}`}
    //     </p> */}

    //         <input
    //           value={`#${location.state.id}`}
    //           className="Input-Box w-28  "
    //           required
    //           type="text"
    //           name="name"
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div>
    //     <label htmlFor="Discipline" className="w-56">
    //       URL{' '}
    //     </label>

    //     <input className="Input-Box w-28  " required type="text" name="name" />
    //   </div>

    //   <div>
    //     <label htmlFor="Discipline" className="w-56">
    //       Moderated created_by
    //     </label>
    //     <div className="Input-Box   ">
    //       <input
    //         className="Input-Box  "
    //         value={form.created_by}
    //         onChange={handleChange}
    //         required
    //         type="text"
    //         name="name"
    //       />
    //       {img ? (
    //         <img
    //           style={{ width: '100%', height: '100%' }}
    //           // style={{ width: "300px", height: "200px" }}
    //           src={`data:image/png;base64,${img}`}
    //         />
    //       ) : (
    //         ''
    //       )}
    //     </div>
    //   </div>

    //   <div>
    //     <label>Status</label>
    //   </div>
    //   <select
    //     style={{ width: '300px' }}
    //     className="Input-Box"
    //     name="status"
    //     value={form.status}
    //     onChange={handleChange}
    //   >
    //     <option value="">Select</option>
    //     <option value="open">Open</option>
    //   </select>
    //   <Button onClick={handleSubmit}>Save</Button>
    // </div>
    <div>
      <section
        id="support"
        className="border-2 bg-sky-50 border-slate-300 rounded-xl mt-4 mb-4 mr-4"
      >
        <p className="text-3xl font-medium p-2">
          {`Submission Detail Ref. # ${location.state.id}`}
        </p>
      </section>

      <section
        id="support"
        className="border-2 bg-sky-50 border-slate-300 rounded-xl mt-4 mb-4 mr-4"
      >
        <p className="text-3xl font-medium p-2">User message</p>
        {/* {`User message. # ${location.state}`} */}
      </section>

      <div className="flex gap-20 flex-row p-2">
        <div>
          <div className="mb-3 flex gap-10">
            <label htmlFor="Discipline" className="text-lg font-medium w-28">
              Submitted
            </label>
            <input
              value={moment(form.created_at).format('YYYY-MM-DD HH:mm:ss')}
              className="Input-Box-Support  "
              required
              type="text"
              name="name"
            />
          </div>
          <div className="mb-3 flex gap-10">
            <label htmlFor="Discipline" className="text-lg font-medium w-28">
              Name
            </label>
            <input
              readOnly
              value={form.created_by}
              className="Input-Box-Support  "
              required
              type="text"
              name="name"
            />
          </div>
          <div className="mb-3 flex gap-10">
            <label htmlFor="Discipline" className="text-lg font-medium w-28">
              University
            </label>
            <input
              value={form.name}
              readOnly
              className="Input-Box-Support  "
              required
              type="text"
              name="name"
            />
          </div>
        </div>
        <div>
          <div className="mb-3 flex gap-10">
            <label htmlFor="Discipline" className="text-lg font-medium w-28">
              System
            </label>
            <input
              className="Input-Box-Support  "
              required
              type="text"
              name="name"
            />
          </div>
          <div className="mb-3 flex gap-10">
            <label htmlFor="Discipline" className="text-lg font-medium w-28">
              Module
            </label>
            <input
              className="Input-Box-Support  "
              required
              type="text"
              name="name"
            />
          </div>
          <div className="mb-3 flex gap-10">
            <label htmlFor="Discipline" className="text-lg font-medium w-28">
              Ref. #
            </label>
            {/* <p className="text-3xl font-medium p-2">
          {`Open Request ref. # ${location.state.id}`}
        </p> */}
            <input
              value={`#${location.state.id}`}
              className="Input-Box-Support  "
              required
              type="text"
              name="name"
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="Discipline" className="text-lg font-medium">
          URL
        </label>
        <input className="Input-Box w-40" required type="text" name="name" />
      </div>

      <div className="mb-3">
        <label htmlFor="Discipline" className="text-lg font-medium">
          Moderated description
        </label>
        <div className="Input-Box">
          <input
            className="Input-Box w-full"
            value={form.description}
            onChange={handleChange}
            required
            type="text"
            name="name"
          />
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
      </div>

      <div className="mb-3">
        <label htmlFor="Discipline" className="text-lg font-medium">
          Status
        </label>
        <select
          className="Input-Box w-40"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="open">Open</option>
        </select>
      </div>

      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
};

export default NewReports;
