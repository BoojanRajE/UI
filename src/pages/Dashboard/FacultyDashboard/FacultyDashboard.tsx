import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import CombinationChart from './CombinationChart';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import {
  getCourseAdministrationCountBasedOnStatus,
  getFacultyCourseCardCountList,
  getFacultyDashboardList,
} from '../../../reduxStore/reducer/dashboardReducer';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../reduxStore/Store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { green } from '@mui/material/colors';
import moment from 'moment';
import { Scrollbar } from 'react-scrollbars-custom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const FacultyDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showAllCards, setShowAllCards] = React.useState(false);

  const [cardsData, setCardsData] = React.useState([]);
  const [facultyCount, setFacultyCount] = React.useState<any[]>([]);
  interface CourseCardData {
    term_name: string;
    name: string;
    // Include other properties as needed
  }
  const [courseCardsData, setCourseCardsData] = React.useState<
    CourseCardData[]
  >([]);
  const [selectedTerm, setSelectedTerm] = React.useState('');
  const [selectedName, setSelectedName] = React.useState('');
  const handleTermSelect = (term: string) => {
    setSelectedTerm(term);
    const selectedCourse = courseCardsData.find(
      (course) => course.term_name === term
    );
    if (selectedCourse) {
      setSelectedName(selectedCourse.name);
    } else {
      setSelectedName('');
    }
  };
  const uniqueTerms = [
    ...new Set(courseCardsData.map((course) => course.term_name)),
  ];
  React.useEffect(() => {
    if (uniqueTerms.length > 0 && !selectedTerm) {
      const defaultTerm = uniqueTerms[0];
      setSelectedTerm(defaultTerm);
      const selectedCourse = courseCardsData.find(
        (course) => course.term_name === defaultTerm
      );
      if (selectedCourse) {
        setSelectedName(selectedCourse.name);
      } else {
        setSelectedName('');
      }
    }
  }, [uniqueTerms, selectedTerm]);

  const visibleCards = showAllCards ? cardsData : cardsData.slice(0, 4);
  const handleMoreClick = () => {
    setShowAllCards((prevShowAllCards) => !prevShowAllCards);
  };

  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(getCourseAdministrationCountBasedOnStatus(setCardsData));
    dispatch(getFacultyDashboardList(setFacultyCount));
    dispatch(getFacultyCourseCardCountList(setCourseCardsData));
  }, [dispatch]);
  const [age, setAge] = React.useState('');
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const StyledPaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    maxWidth: 560,
    bgcolor: 'background.paper',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[3], // Adjust the shadow intensity by changing the value (0 to 24)
  }));
  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* <Grid item xs={12} sm={6} md={6} lg={12} xl={12}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <div
                  style={{ minHeight: '100px', minWidth: '100px' }}
                  className="mt-4 block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#f9b115] to-orange-300 text-white animate__animated animate__bounce"
                >
                  <h2 className="text-gray-100 title-font text-base font-bold p-4">
                    Student Count{' '}
                  </h2>
                  <p className="text-black text-2xl font-bold flex items-center justify-center ">
                    {facultyCount.length > 0
                      ? facultyCount[0].overall_course_students_count
                      : ''}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <Link to="/course">
                  <div
                    style={{ minHeight: '100px', minWidth: '100px' }}
                    className="mt-4 block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#4caf50] to-green-300 text-white animate__animated animate__bounce shadow"
                  >
                    <h2 className="text-gray-100 title-font text-base font-bold p-4">
                      Course Count
                    </h2>
                    <p className="text-black text-2xl font-bold flex items-center justify-center ">
                      {facultyCount.length > 0
                        ? facultyCount[0].overall_course_count
                        : ''}
                    </p>
                  </div>
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <div
                  style={{ minHeight: '100px', minWidth: '100px' }}
                  className="mt-4 block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#e55353] to-red-300 text-white animate__animated animate__bounce"
                >
                  <h2 className="text-gray-100 title-font text-base font-bold p-4">
                    Assessment Count
                  </h2>
                  <p className="text-black text-2xl font-bold flex items-center justify-center ">
                    {facultyCount.length > 0
                      ? facultyCount[0].overall_assessment_count
                      : ''}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <div
                  style={{ minHeight: '100px', minWidth: '100px' }}
                  className="mt-4 block relative h-32 rounded overflow-hidden bg-gradient-to-r from-blue-900 to-blue-200 text-white animate__animated animate__bounce"
                >
                  <h2 className="text-gray-100 title-font text-base font-bold p-4">
                    Administration Count
                  </h2>
                  <p className="text-black text-2xl font-bold flex items-center justify-center ">
                    {facultyCount.length > 0
                      ? facultyCount[0].overall_course_administration_count
                      : ''}
                  </p>
                </div>
              </Grid>
            </Grid>
          </Grid> */}
          <Grid item xs={12} sm={6} md={6} lg={12} xl={12}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={6} md={6} lg={2.4} xl={2.4}>
                <link
                  rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
                />
                <div
                  style={{ minHeight: '100px', minWidth: '100px' }}
                  className="mt-4 block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#f9b115] to-orange-300 text-white animate__animated animate__bounce shadow-xl"
                >
                  <h2 className="text-gray-100 title-font text-base font-bold p-4">
                    Student Count
                  </h2>
                  <p className="text-black text-2xl font-bold flex items-center justify-center">
                    {facultyCount.length > 0
                      ? facultyCount[0].overall_course_students_count
                      : ''}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={2.4} xl={2.4}>
                <Link to="/course">
                  <div
                    style={{ minHeight: '100px', minWidth: '100px' }}
                    className="mt-4 block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#4caf50] to-green-300 text-white animate__animated animate__bounce shadow-xl"
                  >
                    <h2 className="text-gray-100 title-font text-base font-bold p-4">
                      Course Count
                    </h2>
                    <p className="text-black text-2xl font-bold flex items-center justify-center">
                      {facultyCount.length > 0
                        ? facultyCount[0].overall_course_count
                        : ''}
                    </p>
                  </div>
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={2.4} xl={2.4}>
                <div
                  style={{ minHeight: '100px', minWidth: '100px' }}
                  className="mt-4 block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#e55353] to-red-300 text-white animate__animated animate__bounce shadow-xl"
                >
                  <h2 className="text-gray-100 title-font text-base font-bold p-4">
                    Assessment Count
                  </h2>
                  <p className="text-black text-2xl font-bold flex items-center justify-center">
                    {facultyCount.length > 0
                      ? facultyCount[0].overall_assessment_count
                      : ''}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={2.4} xl={2.4}>
                <Link to="/addcourse">
                  <div
                    style={{ minHeight: '100px', minWidth: '100px' }}
                    className="mt-4 block relative h-32 rounded overflow-hidden bg-gradient-to-r from-orange-500 to-orange-300 text-white animate__animated animate__bounce shadow-xl"
                  >
                    <h2 className="text-gray-100 title-font text-base font-bold p-4">
                      Add Course
                    </h2>
                    <p className="text-black text-2xl font-bold flex items-center justify-center">
                      +
                    </p>
                  </div>
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={2.4} xl={2.4}>
                <div
                  style={{ minHeight: '100px', minWidth: '100px' }}
                  className="mt-4 block relative h-32 rounded overflow-hidden bg-gradient-to-r from-blue-900 to-blue-200 text-white animate__animated animate__bounce shadow-xl"
                >
                  <h2 className="text-gray-100 title-font text-base font-bold p-4">
                    Administration Count
                  </h2>
                  <p className="text-black text-2xl font-bold flex items-center justify-center">
                    {facultyCount.length > 0
                      ? facultyCount[0].overall_course_administration_count
                      : ''}
                  </p>
                </div>
              </Grid>
            </Grid>
          </Grid>

          {/* <Grid item xs={12} sm={8} md={8} lg={8} xl={7.5}>
            <div className="chart-container">
              <CombinationChart />
            </div>
          </Grid> */}
          <Grid item xs={12} sm={4} md={4} lg={6} xl={6}>
            <StyledPaper
              elevation={0}
              sx={{
                width: '100%',
                maxWidth: '100%',
                bgcolor: 'background.paper',
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ px: 2, py: 1, textAlign: 'center' }}
              >
                Upcoming Assessment Administration Dates
              </Typography>
              <div>
                <Scrollbar style={{ width: '100%', height: 400 }}>
                  {visibleCards?.map((d: any) => (
                    <List key={d.id}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{ cursor: 'pointer' }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{ bgcolor: green[500] }}
                            variant="rounded"
                          >
                            <AssignmentIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          // primary={d.official_name}
                          children={
                            <>
                              {d.official_name}{' '}
                              {/* <Chip label={d.adm_id} size="small" /> */}
                              <div style={{ display: 'flex', gap: '20px' }}>
                                <div>
                                  <Chip label={d.course_name} size="small" />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <div>
                                    {d.ass_code} {'-'}
                                  </div>
                                  <div>{d.adm_id}</div>
                                </div>
                              </div>
                            </>
                          }
                          onClick={() =>
                            navigate(`/administration/${d.cass_id}/${d.c_id}`)
                          }
                          secondary={
                            <div
                              style={{
                                display: 'flex',
                                marginTop: '5px',
                                gap: '5px',
                              }}
                            >
                              <Typography variant="body2" color="text.primary">
                                Start Date:
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.primary"
                                style={{ marginRight: '20px' }}
                              >
                                {moment(d.start_date_time).format(
                                  'MM-DD-YYYY HH:mm'
                                )}
                              </Typography>
                              <Typography variant="body2" color="text.primary">
                                End Date:
                              </Typography>
                              {moment(d.end_date_time).format(
                                'MM-DD-YYYY HH:mm'
                              )}
                            </div>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </List>
                  ))}
                  {!showAllCards && cardsData.length > 4 && (
                    <Stack spacing={2} sx={{ p: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={handleMoreClick}
                        sx={{ width: '100%' }}
                      >
                        More
                      </Button>
                    </Stack>
                  )}
                </Scrollbar>
              </div>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={6} xl={6}>
            <div>
              <Select
                style={{ width: '60%' }}
                value={selectedTerm}
                onChange={(e) => handleTermSelect(e.target.value)}
              >
                {uniqueTerms.map((term, index) => (
                  <MenuItem key={index} value={term}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <Card
              className="mt-2 block relative  rounded overflow-hidden bg-gradient-to-r from-[#39f] to-blue-300 text-white shadow-md shadow-lg"
              sx={{ maxWidth: '60%' }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ backgroundColor: 'black' }} aria-label="recipe">
                    <AutoStoriesIcon />
                  </Avatar>
                }
                titleTypographyProps={{
                  variant: 'h6',
                  sx: { fontSize: '25px', color: 'white' },
                }}
                title="Courses"
              />

              <CardContent sx={{ padding: '0px 0px 0px 30px' }}>
                <Scrollbar style={{ height: 130 }}>
                  <Typography
                    style={{
                      marginLeft: '10px',

                      // position: 'relative',
                      // bottom: '25px',
                      // left: '60px',
                    }}
                    variant="body2"
                    color="text.secondary"
                  >
                    <Link to="/course">
                      {selectedName.split(',').map((e: any) => (
                        <div
                          style={{
                            display: 'flex',
                            fontSize: '16px',
                            fontWeight: 'bold',
                          }}
                        >
                          {e}
                        </div>
                      ))}
                    </Link>
                  </Typography>
                </Scrollbar>
              </CardContent>
            </Card>
            {/* <Grid container spacing={2}>
              {courseCardsData.map((d: any) => (
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6} key={d.id}>
                  <div className="w-full shadow-md animate__animated animate__bounce">
                    <div className="block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#39f] to-blue-300 text-white shadow-md shadow-lg">
                      <h2
                        className="text-gray-100 title-font text-xl font-bold p-4"
                        onClick={() =>
                          navigate(
                            `/administration/${d.cass_id}/${d.course_id}`
                            // `/administration/${d.course_id}/${d.assessment_id}`
                          )
                        }
                      >
                        {d.term_name}
                      </h2>
                    </div>
                    <div className="p-4 shadow-md">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <div>
                          <span
                            style={{ fontSize: '18px', fontWeight: 'bold' }}
                          >
                            Course
                          </span>
                          <br />
                          <span style={{ fontSize: '10px', display: 'flex' }}>
                            {d.name}
                          </span>
                        </div>
                        <div
                          style={{
                            borderLeft: '1px solid black',
                            height: '50px',
                          }}
                        />
                        <div>
                          <span
                            style={{ fontSize: '18px', fontWeight: 'bold' }}
                          >
                            Assessment
                          </span>
                          <br />
                          <span style={{ fontSize: '10px', display: 'flex' }}>
                            {d.official_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid> */}
          </Grid>

          {/* <Grid item xs={12} sm={8} md={8} lg={12} xl={12}>
            <div className="flex flex-nowrap">
              {courseCardsData.map((d: any) => (
                <>
                  <div className="mx-10 mt-11 w-1/5">
                    <h2 className="text-2xl font-bold">{d.name}</h2>
                    <div className="block relative h-32 rounded overflow-hidden bg-gradient-to-r from-[#39f] to-blue-300 text-white animate__animated animate__bounce shadow">
                      {' '}
                      <h2 className="text-gray-100 title-font text-3xl font-bold p-4">
                        {d.name}
                      </h2>
                    </div>

                    <div className="p-4 shadow-md ">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          alignItems: 'center', // Added to vertically align the content
                          gap: '10px', // Added to create some spacing between the text and the line
                        }}
                      >
                        <div>
                          <span
                            style={{ fontSize: '18px', fontWeight: 'bold' }}
                          >
                            Student
                          </span>{' '}
                          <br />
                          <span
                            style={{ fontSize: '18px', marginLeft: '22px' }}
                          >
                            {d.course_students_count}
                          </span>
                        </div>
                        <div
                          style={{
                            borderLeft: '1px solid black', // Added to create a vertical line
                            height: '50px', // Adjust the height of the line as needed
                          }}
                        />
                        <div>
                          <span
                            style={{ fontSize: '18px', fontWeight: 'bold' }}
                          >
                            Assessment
                          </span>{' '}
                          <br />
                          <span
                            style={{ fontSize: '18px', marginLeft: '22px' }}
                          >
                            {d.course_assessment_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </Grid> */}
        </Grid>
      </Box>
    </div>
  );
};
export default FacultyDashboard;
