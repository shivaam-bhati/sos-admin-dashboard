import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";

import GroupIcon from '@mui/icons-material/Group';
import SecuritySharpIcon from '@mui/icons-material/SecuritySharp';
import FamilyRestroomSharpIcon from '@mui/icons-material/FamilyRestroomSharp';
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import { useEffect } from 'react';
import AuthService from '../services/AuthService';
import CasesService from '../services/CasesService';

import Avatar from '@mui/material/Avatar';

import { useTheme } from '@mui/material/styles';

import DashboardLayout from '../layouts/DashboardLayout';
import SettingsLayout from '../layouts/SettingsLayout';
import UsersLayout from '../layouts/UsersLayout';
import GuardiansLayout from '../layouts/GuardiansLayout';
import GuardsLayout from '../layouts/GuardsLayout';
import ProfileLayout from '../layouts/ProfileLayout';
import ReportsLayout from '../layouts/ReportsLayout';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { red } from '@mui/material/colors';
import CasesLayout from '../layouts/CasesLayout'
import { LibraryBooksOutlined } from '@mui/icons-material';


import Map from '../components/Map'


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
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

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();





export default function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const [openNotificationModel, setOpenNotificationModel] = React.useState(false);
  const [activeComponent, setActiveComponent] = React.useState('Dashboard'); 
  const [notifications,setNotifications]= React.useState([]);
  const [notificationsCount,setNotificationsCount] = React.useState(0);
  const [socket, setSocket] = React.useState(null);
  const [selectUser, setSelectUser] = React.useState(null);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  

  const showCase=(user)=>{
    setSelectUser(user)
    setActiveComponent('Case');
    console.log("selected user>>>",user)
  }

  const getNotifications = ()=>{



   return notifications.map((notification)=>{

      return(
        <MenuItem onClick={()=>{showCase(notification)}}>
          
          <Card sx={{ width: 250 }}>
      <CardHeader
        avatar={
          <Avatar alt={notification.userName} sx={{ bgcolor: red[500] }} src={notification.image} />
        }
        title={notification.userName}
        subheader={notification.message}
      />
    </Card>
        </MenuItem>
      )
    })
  }

  useEffect(() => {
    // Replace with your WebSocket API endpoint
    const endpoint = 'wss://6onkmincki.execute-api.ap-south-1.amazonaws.com/production';

    // Create a new WebSocket connection
    const newSocket = new WebSocket(endpoint);
    
    // Event handler for when the connection is open
    newSocket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    // Event handler for incoming messages
    newSocket.onmessage = (event) => {
      console.log("event>>>",event)

      const response = JSON.parse(event.data.replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"'));
      console.log("response>>>",response)
      setNotifications((pre)=>{
        return [...pre,{id:response.createdCase.createdCase._id,userName:response.createdCase.createdCase.user.firstName,message:response.createdCase.createdCase.message,image:response.createdCase.createdCase.user.image,user:response.createdCase.createdCase.user,case:response.createdCase.createdCase}]
      })


      setNotificationsCount((pre)=>{
        return Number(pre) +1
      });
    };

    // Event handler for errors
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Event handler for when the connection is closed
    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Set the socket in the component state
    setSocket(newSocket);

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {

    const getCases=async()=>{
      try {
        const allCasesResponse = await CasesService.getAll();
        console.log("allCasesResponse>>>",allCasesResponse);
        const totalUnReadedCases = allCasesResponse.data.findedCases.filter(item=>!item.isReaded);
        setNotificationsCount(totalUnReadedCases.length)
        totalUnReadedCases.map(item=>{
          console.log("item>>>",item);
          setNotifications((pre)=>{
            return [...pre,{id:item._id,userName:item.user?.firstName,message:item.massage,image:item.user?.image,user:item?.user,case:item}]
          })
         });
         //console.log("allUnReadedCases>>>",allUnReadedCases);
      } catch (error) {
        console.log(error)
      }
    }
    getCases()

}, []);




  useEffect(() => {

    const isUserAuthenticated = AuthService.isUserAuthenticated();
    if(!isUserAuthenticated){
     navigate('/login', { state: { previous_route: 'Dashboard' }})
    }

  }, []);


  const handleItemClick = (itemName) => {
    

    switch(itemName){
        case 'Logout':
          AuthService.logout()
            navigate('/login', { state: { previous_route: 'Dashboard' }})
            //navigate("/login");
            break;
            case 'Settings':
              setActiveComponent('Settings'); // Change to 'settings' component
              break;
              case 'Dashboard':
                setActiveComponent('Dashboard'); // Change to 'settings' component
                break;
                case 'Profile':
                  setActiveComponent('Profile'); // Change to 'settings' component
                  break;
                  case 'Reports':
                    setActiveComponent('Reports'); // Change to 'settings' component
                    break;
                    case 'Guardians':
                      setActiveComponent('Guardians'); // Change to 'settings' component
                      break;
                      case 'Guards':
                        setActiveComponent('Guards'); // Change to 'settings' component
                        break;
                        case 'Users':
                          setActiveComponent('Users'); // Change to 'settings' component
                          break;
                        case 'Cases':
                          setActiveComponent('Cases'); // Change to 'settings' component
                          break;  
            // Add more cases for other menu items if needed
            default:
              break;
    }
  };

  const toggleNotificationModel= ()=>{
    setOpenNotificationModel(!openNotificationModel);
    console.log(openNotificationModel);
    //socket.emit('message',{id:4,userName:'sanwar',message:'please help me again!'});
  }


  const handleModalClose = () => {
    setOpenNotificationModel(false);
  };


  return (
    <ThemeProvider theme={defaultTheme}>
            <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openNotificationModel}
        onClose={handleModalClose}
        onClick={toggleNotificationModel}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            height: '400px', // Set a specific height for the Paper
            overflowY: 'auto', // Enable vertical scrolling
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 5,
            mr:5,
            pl:2,
            pr:3,
            pb:1,
            pt:1,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
{getNotifications()}
        
      </Menu>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            //  bgcolor: 'red',
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {activeComponent}
            </Typography>
            <IconButton color="inherit"  onClick={toggleNotificationModel}
>
              <Badge badgeContent={notificationsCount} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
          <React.Fragment>
    <ListItemButton onClick={() => handleItemClick('Dashboard')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton onClick={() => handleItemClick('Users')}>
      <ListItemIcon>
        <GroupIcon />
      </ListItemIcon>
      <ListItemText primary="Users" />
    </ListItemButton>
    <ListItemButton onClick={() => handleItemClick('Cases')}>
      <ListItemIcon>
        <LibraryBooksOutlined />
      </ListItemIcon>
      <ListItemText primary="Cases" />
    </ListItemButton>
    <ListItemButton onClick={() => handleItemClick('Guards')}>
      <ListItemIcon>
        <SecuritySharpIcon />
      </ListItemIcon>
      <ListItemText primary="Guards" />
    </ListItemButton>
    <ListItemButton onClick={() => handleItemClick('Guardians')}>
      <ListItemIcon>
        <FamilyRestroomSharpIcon />
      </ListItemIcon>
      <ListItemText primary="Guardians" />
    </ListItemButton>
  </React.Fragment>
            <Divider sx={{ my: 1 }} />
            <React.Fragment>
    <ListSubheader component="div" inset>
    Configurations
    </ListSubheader>
    <ListItemButton onClick={() => handleItemClick('Profile')}>
      <ListItemIcon>
        <AssignmentIndSharpIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemButton>
    <ListItemButton onClick={() => handleItemClick('Settings')}>
      <ListItemIcon>
        <SettingsSharpIcon />
      </ListItemIcon>
      <ListItemText primary="Setting" />
    </ListItemButton>
    <ListItemButton onClick={() => handleItemClick('Logout')}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  </React.Fragment>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>


          {activeComponent === 'Dashboard' && <DashboardLayout/>}
{activeComponent === 'Settings' && <SettingsLayout />}
{activeComponent === 'Reports' && <ReportsLayout/>}
{activeComponent === 'Profile' && <ProfileLayout />}
{activeComponent === 'Guards' && <GuardsLayout/>}
{activeComponent === 'Guardians' && <GuardiansLayout />}
{activeComponent === 'Users' && <UsersLayout/>}
{activeComponent === 'Cases' && <CasesLayout/>}
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
