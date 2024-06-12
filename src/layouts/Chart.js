import React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';

import Title from './Title';

// Generate Data for LineChart
function generateChartData(data) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-based, so we add 1

  return data
    .filter(item => {
      const date = new Date(item.createdAt.$date);
      return date.getMonth() + 1 === currentMonth;
    })
    .map(item => {
      const time = new Date(item.createdAt.$date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { time, amount: null }; // You might want to use item.massage or other data here
    });
}

export default function Chart({ apiData=[] }) {
  const theme = useTheme();
  const chartData = generateChartData(apiData);

  return (
    <React.Fragment>
      <Title>This Month</Title>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={chartData}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'time',
              tickNumber: 2,
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: 'Cases',
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
              tickNumber: 3,
            },
          ]}
          series={[
            {
              dataKey: 'amount',
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
