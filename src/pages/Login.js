import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import AuthService from '../services/AuthService';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Fade from '@mui/material/Fade';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';

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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {

  const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });

      const [rememberMe, setRememberMe] = useState(false);

      const [errors, setErrors] = useState({
        email: false,
        password: false,
      });

      const [isValid,setIsValid] = useState(false)


      useEffect(() => {
       const isUserAuthenticated = AuthService.isUserAuthenticated();
       if(isUserAuthenticated){
        navigate('/', { state: { previous_route: '/' }})
       }
        if(localStorage.getItem('remember_data')!=null && localStorage.getItem('remember_data')!=undefined){
          const remember_data = JSON.parse(localStorage.getItem('remember_data'));
          setFormData((prevData) => ({ ...prevData, password: remember_data.password }));
          setFormData((prevData) => ({ ...prevData, email: remember_data.email }));
          setRememberMe(remember_data.rememberMe);
          setIsValid(true);
        }
  }, []);

      const checkValidation = ()=>{
        setIsValid(true);
        if(formData.email === '' || formData.password === ''){
            setIsValid(false);
        }else{
            setIsValid(true);
        }
          if (formData.email === '') {
            //setErrors((prevErrors) => ({ ...prevErrors, email: true }));
          }
          if (formData.password === '') {
            //setErrors((prevErrors) => ({ ...prevErrors, password: true }));
             setIsValid(false);
          }
      }

      const showError=()=>{
          if (formData.email === '') {
            setErrors((prevErrors) => ({ ...prevErrors, email: true }));
          }
          if (formData.password === '') {
            setErrors((prevErrors) => ({ ...prevErrors, password: true }));
          }
      }
      const handleChange = (e) => {
        const { name, value } = e.target;
        if(name=='remember'){
          console.log("value>>>",rememberMe)
 // Update the Remember Form Data
  setRememberMe(!rememberMe);
        }else{

          checkValidation();
    
          // Reset the corresponding error when the user types
          setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
      
          // Update the form data
          setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
      };


const setRemember =()=>{
  if(rememberMe){

    const remember_data = {
      rememberMe,
      email:formData.email,
      password:formData.password
    }

    localStorage.setItem('remember_data',JSON.stringify(remember_data))
  }else{
    localStorage.removeItem('remember_data')
  }
}

  const handleSubmit = async(event) => {
    try {
        event.preventDefault();
        //checkValidation()
            // Simple validation example (you can add more complex validation logic)
            if(isValid){
                setLoading(true);
                const { success, data, error } = await AuthService.login(formData);
                if(success){
                  setRemember();
                  navigate('/', { state: { previous_route: location.pathname }})
                }else{
                  
                  setLoading(false);
                }
                // console.log("success, data, error>>>",success, data, error)
                // navigate('/', { state: { previous_route: location.pathname }})
                }else{
                    showError()
                } 
    } catch (error) {
        console.log("error")
    }

  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                error={errors.email}
                helperText={errors.email ? 'Email is required' : ''}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
               error={errors.password}
               helperText={errors.password ? 'Password is required' : ''}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox checked={rememberMe} value={rememberMe} color="primary" />}
                label="Remember me"
                name="remember"
                onChange={handleChange}
              />
                          <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
      disabled={loading}
    >
      <Fade
        in={loading}
        style={{
          transitionDelay: loading ? '800ms' : '0ms',
          
        }}
        unmountOnExit
      >
        <Stack sx={{ width: '100%', color: 'grey.500', justifyContent: 'center', alignItems: 'center' }} spacing={2}>
          <CircularProgress color="secondary" />
        </Stack>
      </Fade>
      {!loading && 'Log In'}
    </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                <Link
  component="button"
  variant="body2"
  onClick={() => {
    navigate("/signup");
  }}
>
Don't have an account? Sign Up
</Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}