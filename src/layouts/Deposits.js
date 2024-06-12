import React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';

export default function Deposits({massage='', count='0'}) {


  return (
    <React.Fragment>
      <Title>{massage}</Title>
      <Typography component="p" variant="h4">
        {count}
      </Typography>
      <div>
      </div>
    </React.Fragment>
  );
}