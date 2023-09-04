import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Radio,
  Grid,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  OutlinedInput,
} from '@mui/material';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { RiStethoscopeLine } from 'react-icons/ri';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

var quiz: any = {
  JS: [
    {
      id: 1,
      question: 'Inside which HTML element do we put the JavaScript?',
      options: [
        { a: '&lt;script&gt;' },
        { b: '&lt;javascript&gt;' },
        { c: '&lt;scripting&gt;' },
        { d: '&lt;js&gt;' },
      ],
      answer: '&lt;script&gt;',
      score: 0,
      status: '',
    },
    {
      id: 2,
      question: 'Where is the correct place to insert a JavaScript?',
      options: [
        {
          a: 'The &lt;head&gt; section',
        },
        { b: 'The &lt;body&gt; section' },
        {
          c: 'Both the &lt;head&gt; section and the &lt;body&gt; section are correct',
        },
      ],
      answer:
        'Both the &lt;head&gt; section and the &lt;body&gt; section are correct',
      score: 0,
      status: '',
    },
    {
      id: 3,
      question:
        "What is the correct syntax for referring to an external script called 'xxx.js'?",
      options: [
        {
          a: '&ltscript href=&quot;xxx.js&quot;>',
        },
        { b: '&lt;script name=&quot;xxx.js&quot;&gt;' },
        { c: '&lt;script src=&quot;xxx.js&quot;&gt;' },
      ],
      answer: '&lt;script src=&quot;xxx.js&quot;&gt;',
      score: 0,
      status: '',
    },
    {
      id: 4,
      question:
        'The external JavaScript file must contain the &lt;script&gt; tag.',
      options: [{ a: 'True' }, { b: 'False' }],
      answer: 'False',
      score: 0,
      status: '',
    },
    {
      id: 5,
      question: 'How do you write &quot;Hello World&quot; in an alert box?',
      options: [
        {
          a: 'alertBox(&quot;Hello World&quot;);',
        },
        { b: 'msg(&quot;Hello World&quot;);' },
        { c: 'alert(&quot;Hello World&quot;);' },
        { d: 'msgBox(&quot;Hello World&quot;);' },
      ],
      answer: 'alert(&quot;Hello World&quot;);',
      score: 0,
      status: '',
    },
    {
      id: 6,
      question: 'How do you create a function in JavaScript?',
      options: [
        {
          a: 'function myFunction()',
        },
        { b: 'function:myFunction()' },
        { c: 'function = myFunction()' },
      ],
      answer: 'function myFunction()',
      score: 0,
      status: '',
    },
    {
      id: 7,
      question: 'How do you call a function named &quot;myFunction&quot;?',
      options: [
        {
          a: 'call function myFunction()',
        },
        { b: 'call myFunction()' },
        { c: 'myFunction()' },
      ],
      answer: 'myFunction()',
      score: 0,
      status: '',
    },
    {
      id: 8,
      question: 'How to write an IF statement in JavaScript?',
      options: [
        {
          a: 'if i = 5 then',
        },
        { b: 'if i == 5 then' },
        { c: 'if (i == 5)' },
        { d: ' if i = 5' },
      ],
      answer: 'if (i == 5)',
      score: 0,
      status: '',
    },
    {
      id: 9,
      question: 'Which of the following is a disadvantage of using JavaScript?',
      options: [
        {
          a: 'Client-side JavaScript does not allow the reading or writing of files.',
        },
        {
          b: 'JavaScript can not be used for Networking applications because there is no such support available.',
        },
        {
          c: "JavaScript doesn't have any multithreading or multiprocess capabilities.",
        },
        { d: 'All of the above.' },
      ],
      answer: 'All of the above.',
      score: 0,
      status: '',
    },
    {
      id: 10,
      question:
        'How to write an IF statement for executing some code if &quot;i&quot; is NOT equal to 5?',
      options: [
        {
          a: 'if (i <> 5)',
        },
        { b: 'if i <> 5' },
        { c: 'if (i != 5)' },
        { d: 'if i =! 5 then' },
      ],
      answer: 'if (i != 5)',
      score: 0,
      status: '',
    },
    {
      id: 11,
      question: 'How does a WHILE loop start?',
      options: [
        {
          a: 'while i = 1 to 10',
        },
        { b: 'while (i &lt;= 10; i++)' },
        { c: 'while (i &lt;= 10)' },
      ],
      answer: 'while (i &lt;= 10)',
      score: 0,
      status: '',
    },
    {
      id: 12,
      question: 'How does a FOR loop start?',
      options: [
        {
          a: 'for (i = 0; i &lt;= 5)',
        },
        { b: 'for (i = 0; i &lt;= 5; i++)' },
        { c: 'for i = 1 to 5' },
        { d: 'for (i &lt;= 5; i++)' },
      ],
      answer: 'for (i = 0; i &lt;= 5; i++)',
      score: 0,
      status: '',
    },
    {
      id: 13,
      question: 'How can you add a comment in a JavaScript?',
      options: [
        {
          a: '//This is a comment',
        },
        { b: '&sbquo;This is a comment' },
        { c: '&lt;!--This is a comment--&gt;' },
      ],
      answer: '//This is a comment',
      score: 0,
      status: '',
    },
    {
      id: 14,
      question: 'How to insert a comment that has more than one line?',
      options: [
        {
          a: '/*This comment has more than one line*/',
        },
        { b: '//This comment has more than one line//' },
        { c: '&lt;!--This comment has more than one line--&gt;' },
      ],
      answer: '/*This comment has more than one line*/',
      score: 0,
      status: '',
    },
    {
      id: 15,
      question: 'What is the correct way to write a JavaScript array?',
      options: [
        {
          a: 'var colors = (1:&quot;red&quot;, 2:&quot;green&quot;, 3:&quot;blue&quot;)',
        },
        {
          b: 'var colors = [&quot;red&quot;, &quot;green&quot;, &quot;blue&quot;]',
        },
        {
          c: 'var colors = 1 = (&quot;red&quot;), 2 = (&quot;green&quot;), 3 = (&quot;blue&quot;)',
        },
        {
          d: 'var colors = &quot;red&quot;, &quot;green&quot;, &quot;blue&quot;',
        },
      ],
      answer:
        'var colors = [&quot;red&quot;, &quot;green&quot;, &quot;blue&quot;]',
      score: 0,
      status: '',
    },
    {
      id: 16,
      question: 'How do you round the number 7.25, to the nearest integer?',
      options: [
        {
          a: 'rnd(7.25)',
        },
        { b: 'Math.round(7.25)' },
        { c: 'Math.rnd(7.25)' },
        { d: 'round(7.25)' },
      ],
      answer: 'Math.round(7.25)',
      score: 0,
      status: '',
    },
    {
      id: 17,
      question: 'How do you find the number with the highest value of x and y?',
      options: [
        {
          a: 'Math.max(x, y)',
        },
        { b: 'Math.ceil(x, y)' },
        { c: 'top(x, y)' },
        { d: 'ceil(x, y)' },
      ],
      answer: 'Math.max(x, y)',
      score: 0,
      status: '',
    },
    {
      id: 18,
      question:
        'What is the correct JavaScript syntax for opening a new window called &quot;w2&quot;?',
      options: [
        {
          a: 'w2 = window.new(&quot;http://www.w3schools.com&quot;);',
        },
        { b: 'w2 = window.open(&quot;http://www.w3schools.com&quot;);' },
      ],
      answer: 'w2 = window.open(&quot;http://www.w3schools.com&quot;);',
      score: 0,
      status: '',
    },
    {
      id: 19,
      question: 'JavaScript is the same as Java.',
      options: [{ a: 'true' }, { b: 'false' }],
      answer: 'false',
      score: 0,
      status: '',
    },
    {
      id: 20,
      question: 'How can you detect the client&rsquo;s browser name?',
      options: [
        { a: 'navigator.appName' },
        { b: 'browser.name' },
        { c: 'client.navName' },
      ],
      answer: 'navigator.appName',
      score: 0,
      status: '',
    },
    {
      id: 21,
      question: 'Which event occurs when the user clicks on an HTML element?',
      options: [
        { a: 'onchange' },
        { b: 'onclick' },
        { c: 'onmouseclick' },
        { d: 'onmouseover' },
      ],
      answer: 'onclick',
      score: 0,
      status: '',
    },
    {
      id: 22,
      question: 'How do you declare a JavaScript variable?',
      options: [
        { a: 'var carName;' },
        { b: 'variable carName;' },
        { c: 'v carName;' },
      ],
      answer: 'var carName;',
      score: 0,
      status: '',
    },
    {
      id: 23,
      question: 'Which operator is used to assign a value to a variable?',
      options: [{ a: '*' }, { b: '-' }, { c: '=' }, { d: 'x' }],
      answer: '=',
      score: 0,
      status: '',
    },
    {
      id: 24,
      question: 'What will the following code return: Boolean(10 &gt; 9)',
      options: [{ a: 'NaN' }, { b: 'false' }, { c: 'true' }],
      answer: 'true',
      score: 0,
      status: '',
    },
    {
      id: 25,
      question: 'Is JavaScript case-sensitive?',
      options: [{ a: 'No' }, { b: 'Yes' }],
      answer: 'Yes',
      score: 0,
      status: '',
    },
  ],
};

const array = [
  { value: 1, label: '1', name: 'one' },
  { value: 2, label: '2', name: 'two' },
  { value: 3, label: '3', name: 'three' },
  { value: 4, label: '4', name: 'four' },
  { value: 5, label: '5', name: 'five' },
  { value: 6, label: '6', name: 'six' },
  { value: 7, label: '7', name: 'seven' },
  { value: 8, label: '8', name: 'eight' },
  { value: 9, label: '9', name: 'nine' },
];

const Index = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const initialValues = {
    label: '',
    confirmPassword: '',
  };

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
      .matches(/^[a-zA-z].+[^\s]$/, 'Ending letter should not be a space')
      .required('Required Field'),
  });

  const names = [
    {
      type: 'firstName',
      value: [
        'Oliver ',
        'Van ',
        'April ',
        'Ralph ',
        'Omar ',
        'Carlos ',
        'Miriam ',
        'Bradley ',
        'Virginia ',
        'Kelly ',
      ],
    },
    {
      type: 'lastName',
      value: [
        'Oliver ',
        'Van ',
        'April ',
        'Ralph ',
        'Omar ',
        'Carlos ',
        'Miriam ',
        'Bradley ',
        'Virginia ',
        'Kelly ',
      ],
    },
  ];

  const handleChangeMultiple = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { options } = event.target;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setPersonName(value);
  };

  const [personName, setPersonName] = React.useState<string[]>([]);

  return (
    <div>
      <div className="w-full "></div>
      <div></div>
      <Formik
        initialValues={initialValues}
        validationSchema={validation}
        onSubmit={(values) => {
          // dispatch(
          //   addAdministrativeData(values, setOpen, dataSource, params, '')
          // );
        }}
      >
        {({ values, isValid, handleChange, errors, touched }) => (
          <Form>
            <label>{'Enter a label (optional)'}</label>
            <Field
              style={{ width: '200px' }}
              as={OutlinedInput}
              // label="Enter a label (optional)"
              variant="standard"
              name="label"
              value={values.label}
              error={errors.label && touched.label}
              helperText={errors.label && touched.label ? errors.label : ''}
              className="capitalize"
              fullWidth
              sx={{ marginBottom: '20px', marginTop: '20px' }}
            />

            <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
              <InputLabel htmlFor="grouped-native-select"></InputLabel>
              <Select
                style={{ width: '200px' }}
                open={true}
                native
                // defaultValue=""
                id="grouped-native-select"
                // label="Grouping"
                onChange={(e) => {
                  //   personName(e.target.value);
                }}
              >
                {names.map((val) => (
                  <optgroup label={val.type}>
                    {val.value.map((data) => (
                      <option value={data}>{data}</option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </FormControl>

            <div className="flex gap-3 justify-end">
              <Button
                variant="contained"
                style={{ textTransform: 'capitalize' }}
                type="submit"
                // fullWidth
                // onClick={handleClickClose}
              >
                Create New Assessment
              </Button>
              <Button
                variant="contained"
                style={{ textTransform: 'capitalize' }}

                // fullWidth
                // disabled={!isValid}
              >
                Cancel New Assessment Setup
              </Button>
              <Button
                variant="contained"
                style={{ textTransform: 'capitalize' }}
                type="submit"
                onClick={() => setOpen(true)}
                // fullWidth
                // disabled={!isValid}
              >
                View Assessment
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <Dialog
        disableEscapeKeyDown={true}
        open={open}
        // onClose={handleClose}
      >
        <div className="popup_box">
          <div className="flex justify-between bg-sky-800 text-white p-3">
            <div>
              <CloseIcon onClick={() => setOpen(false)} />
            </div>
          </div>
          <DialogContent>
            <Box
              sx={{
                maxWidth: { xs: 320, sm: 480 },
                bgcolor: 'background.paper',
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {quiz.JS.map((data: any, i: any) => (
                  <Tab label={i + 1} {...a11yProps(i)} />
                ))}
              </Tabs>
            </Box>
            <div>
              {quiz.JS.map((data: any, i: any) => (
                <div>
                  <Grid item xs={12} sm={12}>
                    <TabPanel value={value} index={i}>
                      <h2>
                        <b>{data.question}</b>
                      </h2>
                      <FormControl style={{ paddingLeft: '21px' }}>
                        <RadioGroup>
                          {data.options.map((item: any) => (
                            <label
                              key={Object.keys(item)[0]}
                              style={
                                data.answer === item[Object.keys(item)[0]]
                                  ? { backgroundColor: 'yellow' }
                                  : {}
                              }
                            >
                              <FormControlLabel
                                // style={{data.answer === item ? backgroundColor: 'yellow'}}
                                control={<Radio size="small" readOnly />}
                                value={Object.keys(item)[0]}
                                label={`${Object.keys(item)[0]} : ${
                                  item[Object.keys(item)[0]]
                                }`}
                              />
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </TabPanel>
                  </Grid>
                </div>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <div className="flex gap-3 justify-end">
              <Button
                style={{ textTransform: 'capitalize' }}
                onClick={() => setOpen(false)}
                variant="contained"
              >
                Cancel
              </Button>
            </div>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

export default Index;
