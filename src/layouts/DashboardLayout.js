import React, { useState, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import CasesService from '../services/CasesService';
import UserService from '../services/UserService';




const DashboardLayout = () => {


  const [cases, setCases] = useState([]);
  const [totalCases, setTotalCases] = useState(0);

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [allCases, setAllCases] = useState([]);

  const [socket, setSocket] = React.useState(null);
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
      console.log("event>>>",JSON.parse(event.data).action)

      const parsedObject = JSON.parse(event.data);

      // Log the object with indentation
      console.log(JSON.stringify(parsedObject, null, 2));
      setTotalCases((pre)=>{
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
        const casesResponse = await CasesService.getAllCasesByIsActive(true);
        const usersResponse = await UserService.getByIsActive(true);
        const allCasesResponse = await CasesService.getAll();
        setAllCases(allCasesResponse.data.findedCases);
        setTotalCases(casesResponse.data.findedCases.length);
        setCases(casesResponse.data.findedCases);

        setTotalUsers(usersResponse.data.findedUsers.length);
        setUsers(usersResponse.data.findedUsers);
      } catch (error) {
        console.log(error)
      }
    }

    getCases();

  }, []);
  return (
    <Grid container spacing={3}>
    {/* Chart */}
    <Grid item xs={12} md={8} lg={9}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 240,
        }}
      >
        <Chart  apiData={allCases}/>
      </Paper>
    </Grid>
    {/* Recent Deposits */}
    <Grid item xs={12} md={4} lg={3}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 100,
        }}
      >
        <Deposits count={totalCases} massage="Total Active Cases" />
      </Paper>

      <Paper
        sx={{
          p: 2,
          mt:3,
          display: 'flex',
          flexDirection: 'column',
          height: 100,
        }}
      >
        <Deposits count={totalUsers} massage="Total Active Users" />
      </Paper>
    </Grid>
    {/* Recent Orders */}
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Orders data={allCases}/>
      </Paper>
    </Grid>
  </Grid>
  )
}

export default DashboardLayout
