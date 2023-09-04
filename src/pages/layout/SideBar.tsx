import React, { useState, useEffect, useMemo, useRef } from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { AiOutlineMenu } from 'react-icons/ai';
import { GrPrevious } from 'react-icons/gr';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { Link, Tooltip } from '@mui/material';
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineHistory,
  AiOutlineHome,
  AiOutlineMoneyCollect,
  AiOutlineUser,
} from 'react-icons/ai';
import {
  FaBookOpen,
  FaCog,
  FaOpencart,
  FaRegBuilding,
  FaSchool,
  FaUserShield,
} from 'react-icons/fa';
import { BsWatch, BsStopwatch, BsFlagFill } from 'react-icons/bs';
import { RiAdminFill } from 'react-icons/ri';

import { ImOffice } from 'react-icons/im';

import { MdSchool, MdOutlineHelp, MdAccountBox } from 'react-icons/md';
import { SiCoursera } from 'react-icons/si';
import TerminalIcon from '@mui/icons-material/Terminal';
import { BsFillPersonLinesFill, BsJournalBookmarkFill } from 'react-icons/bs';
import { GrUserAdmin } from 'react-icons/gr';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { VscOrganization } from 'react-icons/vsc';
import Organisation from '../organisation/Organisation';
import { BiUserCircle } from 'react-icons/bi';
import { GiOpenBook } from 'react-icons/gi';
// import { SidebarItem } from '../models/SidebarItem';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { organizationIcon } from '../../utils/icons';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { getUserById } from '../../reduxStore/reducer/registerReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../reduxStore/Store';
import { display } from '@mui/system';
import HelpIcon from '@mui/icons-material/Help';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useLocation } from 'react-router';

const drawerWidth = 245;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function SideBar() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const getUserDataAndType = useSelector(
    (state: any) => state.register.getUserById
  );

  useEffect(() => {
    dispatch(
      getUserById({
        id: `${JSON.parse(localStorage.getItem('token') || '{}')}`,
      })
    );
    // pass the `data` object as an argument
    // dispatch(getSubDisciplineAction());
  }, [dispatch]);

  let sidebarData: any;
  if (getUserDataAndType?.data?.type == 'admin') {
    sidebarData = [
      // {getUserDataAndType.data.type === "admin" &&(""

      // )}
      {
        title: 'Dashboard',
        path: '/home',
        icon: <DashboardIcon />,
      },

      {
        title: 'Discipline',
        path: '/discipline',
        icon: <SchoolIcon />,
      },

      {
        title: 'Sub Discipline',
        path: '/subdiscipline',
        icon: <MenuBookIcon />,
      },
      {
        title: 'Organization',
        path: '/organization',
        icon: organizationIcon,
      },
      {
        title: 'Users',
        path: '/users',
        icon: <PersonAddAlt1Icon />,
      },

      {
        title: 'Unit',
        path: '/department',
        icon: <Diversity3Icon />,
        child: [
          {
            title: 'Department',
            path: '/department',
            icon: <LocationCityIcon />,
          },
          {
            title: 'Program',
            path: '/program',
            icon: <TerminalIcon />,
          },
          {
            title: 'College',
            path: '/college',
            icon: <ApartmentIcon />,
          },
          {
            title: 'Center',
            path: 'centers',
            icon: <LocationOnIcon />,
          },

          {
            title: 'Administrative Office',
            path: '/administrative',
            icon: <AdminPanelSettingsIcon />,
          },
          {
            title: 'Unit Roles',
            path: '/unitroles',
            icon: <ManageAccountsIcon />,
          },
        ],
      },
      {
        title: 'Course',
        path: '/course',
        icon: <DynamicFeedIcon />,
      },

      {
        title: 'Assessment',
        path: '/assessment',
        icon: <AssessmentIcon />,
      },
    ];
  } else {
    sidebarData = [
      {
        title: 'Dashboard',
        path: '/home',
        icon: <DashboardIcon />,
      },
      {
        title: 'Course',
        path: '/course',
        icon: <DynamicFeedIcon />,
      },
    ];
  }

  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [openSubMenu, setOpenSubMenu] = React.useState<any>({
    Discipline: false,
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenSubMenu({ Discipline: false });
  };

  return (
    <>
      <CssBaseline />
      {/* <Drawer variant="permanent" open={open}> */}
      <Drawer
        variant="permanent"
        open={open}
        style={
          location?.pathname == '/login' ? { display: 'none' } : { zIndex: 0 }
        }
      >
        <DrawerHeader>
          {open ? (
            <IconButton onClick={handleDrawerClose} size="small">
              <GrPrevious />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                margin: 'auto',
                display: open ? 'none' : 'block',
              }}
            >
              <AiOutlineMenu />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {sidebarData?.map((data: any, index: any) => (
            <>
              <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                <Tooltip
                  arrow
                  placement="right"
                  title={!open ? data.title : ''}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={() => {
                      navigate(data.path);
                      if (open) {
                        let state = openSubMenu[data?.title];
                        setOpenSubMenu({ ...state, [data?.title]: !state });
                      }
                      if (data?.child?.length) {
                        handleDrawerOpen();
                        let state = openSubMenu[data?.title];
                        setOpenSubMenu({ ...state, [data?.title]: !state });
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {data.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={data.title}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                    {data?.child?.length ? (
                      openSubMenu[data?.title] ? (
                        <MdExpandLess style={{ color: 'black' }} />
                      ) : (
                        <MdExpandMore style={{ color: 'black' }} />
                      )
                    ) : (
                      ''
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>

              {data?.child?.length &&
                data.child.map((child: any) => (
                  <Collapse
                    in={openSubMenu[data?.title]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() => {
                          navigate(child.path);
                          // setOpen(false)
                        }}
                      >
                        <ListItemIcon style={{ minWidth: '40px' }}>
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText primary={child.title} />
                      </ListItemButton>
                    </List>
                  </Collapse>
                ))}
            </>
          ))}
          {/* {getUserDataAndType?.data?.type === "faculty" && (
            <List style={{ position: "relative", bottom: "10px" }}>
              {["FAQ", "LASSO instruments page"].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    target="_blank"
                    href={
                      index % 2 === 0
                        ? "https://learningassistantalliance.org/lasso/LASSO-FAQ.php"
                        : "https://sites.google.com/view/laa-resources/assessment-research-and-results/lasso-available-instruments"
                    }
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {index % 2 === 0 ? <HelpIcon /> : <EventAvailableIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{ style: { fontSize: "14px" } }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )} */}
        </List>
        {/* <Divider /> */}

        {getUserDataAndType?.data?.type === 'admin' && (
          <div
            style={{
              display: 'flex',
              gap: '20px',
              position: 'relative',
              left: '20px',
              height: '100%',
              alignItems: 'flex-end',
            }}
          >
            <Link
              style={{ fontSize: '14px' }}
              href="https://lassoeducation.org/faq/"
            >
              FAQ
            </Link>
            <Link
              style={{ fontSize: '14px' }}
              href="https://lassoeducation.org/instruments/"
            >
              LASSO instruments page
            </Link>
          </div>
        )}
        {getUserDataAndType?.data?.type === 'faculty' && (
          <div
            style={{
              display: 'flex',
              gap: '15px',
              position: 'relative',
              left: '65px',
              // height: "100%",
              // alignItems: "flex-end",
              flexDirection: 'column',
            }}
          >
            <Link
              style={{ fontSize: '14px' }}
              href="https://lassoeducation.org/faq/"
            >
              FAQ
            </Link>
            <Link
              style={{ fontSize: '14px' }}
              href="https://lassoeducation.org/instruments/"
            >
              LASSO instruments page
            </Link>
          </div>
        )}
      </Drawer>
    </>
  );
}
