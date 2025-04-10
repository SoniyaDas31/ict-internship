import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Drawer,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  ViewList as ListIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

const Schedules = () => {
  const [viewMode, setViewMode] = useState('table');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
      totalOrders: 0,
      idleCapacity: '0%',
      ordersAtRisk: 0,
      pendingApprovals: 0
    });
  
  useEffect(() => {
    fetchSchedules();
  }, []);
  
  const fetchSchedules = async () => {
    try {
      const response = await fetch('https://kera-internship.onrender.com/schedule');
      const data = await response.json();
      setSchedules(data);
      
      // Calculate metrics from schedule data
      const totalOrders = data.length;
      
      // Calculate orders at risk (orders ending within 24 hours)
      const now = new Date();
      const ordersAtRisk = data.filter(schedule => {
        const endTime = new Date(schedule.end_time);
        const timeLeft = endTime - now;
        return timeLeft <= 24 * 60 * 60 * 1000 && timeLeft > 0;
      }).length;
  
      // Calculate pending approvals (schedules with pending status)
      const pendingApprovals = data.filter(schedule => 
        schedule.status === 'pending' || schedule.status === 'Pending'
      ).length;
  
      // Calculate idle capacity
      const totalMachines = new Set(data.map(s => s.machineId)).size;
      const activeMachines = new Set(data.filter(s => 
        new Date(s.end_time) > now
      ).map(s => s.machineId)).size;
      const idleCapacity = totalMachines ? 
        Math.round(((totalMachines - activeMachines) / totalMachines) * 100) : 0;
  
      setMetrics({
        totalOrders,
        idleCapacity: `${idleCapacity}%`,
        ordersAtRisk,
        pendingApprovals
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setLoading(false);
    }
  };

  // Update the metrics rendering
  const metricsData = [
    { title: 'Total Orders', value: metrics.totalOrders },
    { title: 'Idle Capacity', value: metrics.idleCapacity },
    { title: 'Orders at Risk', value: metrics.ordersAtRisk },
    { title: 'Pending Approvals', value: metrics.pendingApprovals },
  ];

  const orders = [
    {
      id: 'ORD123',
      product: 'WidgetA',
      machine: 'CNC-01',
      start: 'Mar 28',
      end: 'Mar 30',
      status: 'Scheduled',
      tag: 'NC',
      suggestions: '—',
    },
    // Add more orders as needed
  ];

  return (
    <Box sx={{ 
      flexGrow: 1, 
      height: 'auto', 
      overflow: 'hidden',
      pt: 2,
      pb: 5,
      bgcolor: 'rgba(255,255,255,0.95)',
      width:'90%', 
      margin:'5% auto'
    }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#1a1a1a' }}>
            Manage Production Schedule
          </Typography>
          <Button variant="contained" color="primary" startIcon={<CalendarIcon />}>
            Create New Schedule
          </Button>
        </Box>

        {/* Controls */}
        <Grid container spacing={3} sx={{ mb: 3, pt: 5, width: '100%', mx: 0 }}>
          
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by Order ID, Product, Machine..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
        </Grid>

        {/* Metrics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {metricsData.map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.title}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {metric.title}
                  </Typography>
                  <Typography variant="h4">{metric.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Schedule Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Machine ID</TableCell>
                  <TableCell>Process</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Loading...</TableCell>
                  </TableRow>
                ) : schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No schedules found</TableCell>
                  </TableRow>
                ) : (
                  schedules.map((schedule) => (
                    <TableRow key={schedule._id}>
                      <TableCell>{schedule.machineId}</TableCell>
                      <TableCell>{schedule.process}</TableCell>
                      <TableCell>{new Date(schedule.start_time).toLocaleString()}</TableCell>
                      <TableCell>{new Date(schedule.end_time).toLocaleString()}</TableCell>
                      <TableCell>{schedule.status}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Footer Actions */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {/* <Button variant="outlined">Export Schedule</Button>
          <Button variant="outlined">Sync with ERP</Button> */}
        </Box>

        {/* Suggestion Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ width: 320 }}
        >
          <Box sx={{ width: 320, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Suggestions
            </Typography>
            {/* Add suggestion content here */}
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};

export default Schedules;