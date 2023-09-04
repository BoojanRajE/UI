import React, { useCallback, useMemo, useRef, useState } from 'react';

import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import AGGrid from '../../utils/MasterGrid/MasterGrid';
import StudentMail from './StudentMail';
import { ColDef, ColGroupDef, GridOptions } from 'ag-grid-community';

const AddStudent = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    // textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const [file, setFile] = React.useState<File>();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    // 👇 We redirect the click event onto the hidden input element
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setFile(e.target.files[0]);
  };
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: 'make' },
    { field: 'model' },
    { field: 'price' },
    { headerName: 'Test', cellRenderer: StudentMail },
    { headerName: 'Test', cellRenderer: StudentMail },
  ]);
  const rowData = [
    { make: 'Porsche', model: 'Boxter', price: 72000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Toyota', model: 'Celica', price: 35000 },
  ];

  return (
    <div>
      <div className="header">Add Student</div>
      <div className="bg-[#eaf5ff] border-2 rounded-xl p-1">
        <h1 className=" flex items-center text-3xl h-10">Course Manager</h1>{' '}
        <span className="text-2xl ">EDUC EDUC</span>-
        <span className="text-2xl ">Fall 2022</span>
      </div>
      <div>
        <Link href="#">Course Questionnaire</Link>
      </div>
      <div className="flex gap-4">
        <div>Sections :</div> <Link href="#">001</Link>{' '}
        <Link href="#">002</Link> <Link href="#">003</Link>{' '}
      </div>
      <hr className="bg-gray-500"></hr>
      <div className="flex  justify-between	 gap-4">
        <div>Sections :</div>
        <Link href="#">Add Assessment</Link>{' '}
      </div>
      <Link href="#">FCMI :</Link>{' '}
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={6} lg={8}>
              <Item style={{ height: '500px' }}>
                <div className="bg-gray-200 p-1 font-bold text-lg">
                  Assessment Roster
                </div>
                <div className="">Roster Count : 0</div>

                <div>
                  <AGGrid
                    paginationPageSize={17}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    pagination={true}
                    cacheQuickFilter={true}
                    domLayout={'autoHeight'}
                  />
                </div>
                <div className="text-lg font-bold">
                  Add Students to Assessment
                </div>

                <input
                  type="file"
                  id="myFile"
                  name="filename"
                  ref={inputRef}
                  onChange={handleFileChange}
                />
                <Button
                  onClick={(event: any) => {
                    handleUploadClick();
                  }}
                >
                  upload
                </Button>
              </Item>
            </Grid>
            <Grid
              style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}
              item
              xs={6}
              md={4}
            >
              <Item style={{ height: '175px' }}>
                <div className="bg-gray-200 font-bold text-lg p-1">
                  PRE Assessment{' '}
                </div>
                <div className="flex ">
                  <label className="w-28">Response</label>
                  <span>:</span>
                  <div>-</div>
                </div>
                <div className="flex ">
                  <label className="w-28">Average Score</label>
                  <span>:</span>
                  <div>-</div>
                </div>
                <div className="flex ">
                  <label className="w-28">Started</label>
                  <span>:</span>
                  <div className="text-yellow-500 font-semibold">
                    Not Started
                  </div>
                </div>
                <div className="flex ">
                  <label className="w-28">Last reminder</label>
                  <span>:</span>
                  <div>-</div>
                </div>
                <div className="flex ">
                  <label className="w-28">Deadline</label>
                  <span>:</span>
                  <div>
                    <input type="date" />
                  </div>
                </div>
                <div>
                  <Button style={{ textTransform: 'capitalize' }}>
                    Email Remainder
                  </Button>
                  <Button style={{ textTransform: 'capitalize' }}>
                    Download Data
                  </Button>
                </div>
              </Item>
              <Item style={{ height: '175px' }}>
                <div className="bg-gray-200 font-bold text-lg p-1">
                  POST Assessment{' '}
                </div>
                <div className="flex ">
                  <label className="w-28">Response</label>
                  <span>:</span>
                  <div>-</div>
                </div>
                <div className="flex ">
                  <label className="w-28">Average Score</label>
                  <span>:</span>
                  <div>-</div>
                </div>
                <div className="flex ">
                  <label className="w-28">Started</label>
                  <span>:</span>
                  <div className="text-yellow-500 font-semibold">
                    Not Started
                  </div>
                </div>
                <div className="flex ">
                  <label className="w-28">Last reminder</label>
                  <span>:</span>
                  <div>-</div>
                </div>
                <div className="flex ">
                  <label className="w-28">Deadline</label>
                  <span>:</span>
                  <div>
                    <input type="date" />
                  </div>
                </div>
                <div>
                  <Button style={{ textTransform: 'capitalize' }}>
                    Start Assessment Now{' '}
                  </Button>
                </div>
              </Item>

              <Item style={{ height: '100px' }}>
                <div className="bg-gray-200 font-bold text-lg p-1">Output </div>
                <div className="float-left">
                  This assessment is still in progress. Reporting is not
                  available until the end date of the POST assessment has
                  passed.
                </div>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default AddStudent;
