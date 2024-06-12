import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate  } from "react-router-dom";
import { useState } from 'react';
import AuthService from '../services/AuthService';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Fade from '@mui/material/Fade';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

export default function Signup() {


  useEffect(() => {
    const isUserAuthenticated = AuthService.isUserAuthenticated();
       if(isUserAuthenticated){
        navigate('/login', { state: { previous_route: '/' }})
       }
}, []);

    const navigate = useNavigate();
    const location = useLocation();
    //const history = useHistory();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName:'',
        lastName:'',
        dob:'',
        gender:'',
        mobileNo:'',
        email: '',
        rePassword:'',
        organizationName:'',
        password: '',
      });

      const [isValid, setIsValid] = useState(false);

      const [errors, setErrors] = useState({
        firstName:false,
        lastName:false,
        dob:false,
        gender:false,
        mobileNo:false,
        email: false,
        password: false,
        rePassword:false,
        organizationName:false
      });



      const handleChange = (e) => {
        e.preventDefault();
            checkValidation();
        const { name, value } = e.target;
    
        // Reset the corresponding error when the user types
        setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    
        // Update the form data
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      };

      const checkValidation = ()=>{
        if (formData.firstName == '' || formData.lastName === '' || formData.dob === '' || formData.gender === '' || formData.mobileNo === '' || formData.email === '' || formData.password === '' || formData.rePassword === '' || formData.organizationName === '') {
            setIsValid(false);
          }else{
            if(formData.password==formData.rePassword){
              setIsValid(true);
            }else{
              setIsValid(false);
            }
          }
      }

      const showError=()=>{
        if (formData.firstName == '') {
            setErrors((prevErrors) => ({ ...prevErrors, firstName: true }));
          }
          if (formData.lastName === '') {
            setErrors((prevErrors) => ({ ...prevErrors, lastName: true }));
          }
          if (formData.dob === '') {
            setErrors((prevErrors) => ({ ...prevErrors, dob: true }));
          }
          if (formData.gender === '') {
            setErrors((prevErrors) => ({ ...prevErrors, gender: true }));
          }
          if (formData.mobileNo === '') {
            setErrors((prevErrors) => ({ ...prevErrors, mobileNo: true }));
          }
          if (formData.email === '') {
            setErrors((prevErrors) => ({ ...prevErrors, email: true }));
          }
          if (formData.password === '') {
            setErrors((prevErrors) => ({ ...prevErrors, password: true }));
          }
          if (formData.organizationName === '') {
            setErrors((prevErrors) => ({ ...prevErrors, organizationName: true }));
          }
          if (formData.rePassword === '') {
            setErrors((prevErrors) => ({ ...prevErrors, rePassword: true }));
          }

          if (formData.password != formData.rePassword) {
            setErrors((prevErrors) => ({ ...prevErrors, rePassword: true }));
          }
      }

  

  const handleSubmit = async(event) => {
      event.preventDefault();
      try {
    if(isValid){
        setLoading(true);
        const { success, data, error } = await AuthService.createNewAdmin(formData);
        if(success){
            navigate('/login', { state: { previous_route: location.pathname }})
        }else{
            setLoading(false);
        }
    }else{
        showError()
    }  
    } catch (error) {
        console.log(error)
    }
   
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                error={errors.firstName}
                helperText={errors.firstName ? 'FirstName is required' : ''}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                error={errors.lastName}
                helperText={errors.lastName ? 'LastName is required' : ''}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField
                  required
                  fullWidth
                  error={errors.dob}
                  helperText={errors.dob ? 'Date of Birth is required' : ''}
                  id="dob"
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField
                  required
                  fullWidth
                  error={errors.gender}
                  helperText={errors.gender ? 'Gender is required' : ''}
                  id="gender"
                  label="Gender"
                  select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                    <option value="" disabled>
                    
                  </option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                error={errors.mobileNo}
                helperText={errors.mobileNo ? 'Mobile No. is required' : ''}
                  required
                  fullWidth
                  type="number"
                  id="mobileNo"
                  label="Mobile No."
                  name="mobileNo"
                  autoComplete="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                error={errors.email}
                helperText={errors.email ? 'Email is required' : ''}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                error={errors.organizationName}
                helperText={errors.organizationName ? 'Organization Name is required' : ''}
                  required
                  fullWidth
                  id="organizationName"
                  label="Organization Name"
                  name="organizationName"
                  autoComplete="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                error={errors.password}
                helperText={errors.password ? 'Password is required' : ''}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                error={errors.rePassword}
                helperText={errors.rePassword ? ' RePassword Must be same as Password' : ''}
                  required
                  fullWidth
                  name="rePassword"
                  label="Re Password"
                  type="password"
                  id="rePassword"
                  value={formData.rePassword}
                  onChange={handleChange}
                  autoComplete="new-re-password"
                />
              </Grid>
              
            </Grid>
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
      {!loading && 'Submit'}
    </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
              <Link
  component="button"
  variant="body2"
  onClick={() => {
    navigate("/login");
  }}
>
Already have an account? Sign in
</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}