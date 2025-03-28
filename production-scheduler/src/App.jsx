import { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Container, Paper, Grid, ButtonGroup } from '@mui/material'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Schedules from './pages/Schedules';
import Machines from './pages/Machines';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SalesOrders from './pages/SalesOrders';
import BillOfMaterials from './pages/BillOfMaterials';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <AppBar position="fixed" sx={{ background:'rgba(0, 0, 0, 0.8)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
            Production Scheduler
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/">Dashboard</Button>
            <Button color="inherit" component={Link} to="/sales-orders">Sales Orders</Button>
            <Button color="inherit" component={Link} to="/schedules">Backward Schedule</Button>
            <Button color="inherit" component={Link} to="/machines">Machines</Button>
            <Button color="inherit" component={Link} to="/bom">BOM</Button>
           
            {/* <Button color="inherit" component={Link} to="/reports">Reports</Button> */}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Routes>
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/sales-orders" element={<SalesOrders />} />
        <Route path="/bom" element={<BillOfMaterials />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/" element={
          <Container maxWidth={false} sx={{ mt: 10, px: '20%' }}>
            <Paper elevation={3} sx={{ p: 4, mb:2, width:'94%', background:'rgba(255, 255, 255, 0.2);' }}>
              <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 'normal', textAlign: 'left' }}>
                Welcome to the Dynamic Production Scheduler
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 3, textAlign: 'left', color: '#fff' }}>
                Optimize your manufacturing workflow with intelligent, capacity-aware scheduling.
                Our system is designed to enhance production efficiency while keeping you in control. With real-time insights and smart recommendations, you can adapt quickly to changing demands without compromising operational integrity.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="secondary" size="large" component={Link} to="/machines">
                  View Machine
                </Button>
                <Button variant="contained" color="secondary" size="large" component={Link} to="/schedules">
                  Manage Schedule
                </Button>
                <Button variant="contained" color="secondary" size="large" component={Link} to="/sales-order">
                  Manage Orders
                </Button>
                <Button variant="contained" color="secondary" size="large" component={Link} to="/sales-order">
                  Manage BOM
                </Button>
              </Box>
            </Paper>
            <Grid container spacing={2} lg={12} md={12}>
              {/* Production Trends Widget */}
              <Grid item xs={12} lg={12}>
                <Paper elevation={3} sx={{ p: 3, width: '90%' }}>
                  <Typography variant="h6" gutterBottom>Production Trends</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={productionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
                      <Line type="monotone" dataKey="planned" stroke="#82ca9d" name="Planned" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Machine Utilization Widget */}
              <Grid item xs={12} lg={12} md={12}>
                <Paper elevation={3} sx={{ p: 3 , width: '90%' }}>
                  <Typography variant="h6" gutterBottom>Machine Utilization</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={machineUtilization}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      />
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Weekly Performance Widget */}
              <Grid item xs={12} lg={12}>
                <Paper elevation={3} sx={{ p: 3 , width: '90%' }}>
                  <Typography variant="h6" gutterBottom>Weekly Performance</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="actual" fill="#8884d8" name="Actual Production" />
                      <Bar dataKey="planned" fill="#82ca9d" name="Planned Production" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        } />
      </Routes>
    </Router>
  );
}

export default App

// Add this mock data after your imports
const productionData = [
  { name: 'Mon', actual: 4000, planned: 2400 },
  { name: 'Tue', actual: 3000, planned: 1398 },
  { name: 'Wed', actual: 2000, planned: 9800 },
  { name: 'Thu', actual: 2780, planned: 3908 },
  { name: 'Fri', actual: 1890, planned: 4800 },
];

const machineUtilization = [
  { name: 'CNC-01', value: 85 },
  { name: 'CNC-02', value: 65 },
  { name: 'CNC-03', value: 92 },
  { name: 'CNC-04', value: 78 },
];

