import { Box, Button, Link, Typography } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import { Organization } from '../../organisation/OrganizationForm';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const navigate = useNavigate();

  const initialFormState = {
    description: '',
    fileName: '',
    file: null,
  };
  const [form, setForm] = useState<any>(initialFormState);

  const [img, setImg] = useState(null);

  const handleChange = (event: any) => {
    const { name, value, type, files } = event.target;
    if (type === 'file') {
      const file = files[0];
      setForm({ ...form, ...{ fileName: file.name, file: file } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = () => {
    if (!form.file && !form.description) {
      Swal.fire('Please choose a file and enter a description', ' ', 'info');
      return;
    }

    const { description, file, fileName } = form;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('description', description);
    const url = `${process.env.REACT_APP_BASE_URL}/api/helpcenter`;
    axios({
      method: 'post',
      url,
      data: formData,
      headers: {
        authorization: localStorage.getItem('token')
          ? `Bearer ${JSON.parse(localStorage.getItem('token') || '{}')}`
          : '',
      },
    }).then((res) => {
      setForm(initialFormState);
      navigate(-1);
      Swal.fire({
        icon: 'success',
        title: 'Your issue has been submitted',
        showConfirmButton: true,
        confirmButtonText: 'Ok',

        customClass: {
          container: 'swal-container',
        },
      });
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-large p-2">Help Center</h1>
      <section
        id="support"
        className="border-2 border-slate-300 rounded-xl mt-4 mb-4 mr-4 ml-4"
      >
        <h1 className="text-3xl font-large p-2">
          Submit a Question/Report a Problem
        </h1>
        <div style={{ margin: '20px' }}>
          <span className="font-normal text-2xl">
            Description of Requested Feature
          </span>
          <textarea
            className="Input-Box"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            cols={50}
          ></textarea>
        </div>

        <div style={{ margin: '20px' }}>
          <div>File upload(max. file size 2MB)</div>
          <div>
            <input type="file" accept=".jpg, .png" onChange={handleChange} />
          </div>
        </div>

        <div style={{ margin: '20px' }}>
          <Button
            style={{ textTransform: 'capitalize' }}
            onClick={handleSubmit}
            variant="contained"
          >
            Submit
          </Button>

          {img ? <img src={`data:image/png;base64,${img}`} /> : ''}
        </div>
      </section>
      <section
        id="support"
        className="border-2 border-slate-300 rounded-xl mt-4 mb-4 mr-4 ml-4"
      >
        <h1 className="text-3xl font-large p-2">Get Help On Your Campus</h1>

        <Box sx={{ width: '100%' }} className="p-2">
          <Typography variant="body1" gutterBottom>
            Your question may be best addressed to the LA Program on your campus
            (if applicable). Questions about which courses are hiring LAs, about
            an LA appointment, or about dates, times, and locations of local
            events, for example, can be answered by the staff of your
            institution's LA Program.
          </Typography>
        </Box>
      </section>
      <section
        id="support"
        className="border-2 border-slate-300 rounded-xl mt-4 mb-4 mr-4 ml-4"
      >
        <h1 className="text-3xl font-large p-2">Contact Us</h1>

        <Box sx={{ width: '100%' }} className="p-2">
          <Typography variant="body1" gutterBottom>
            If you need help, particularly technical-flavored help, and
            especially urgently, it is best to contact us using the
            Question/Problem form above, but use this address if you would like
            to email us.
          </Typography>
          <Link>contact@lasso.org</Link>
        </Box>
      </section>
    </div>
  );
};

export default HelpCenter;
