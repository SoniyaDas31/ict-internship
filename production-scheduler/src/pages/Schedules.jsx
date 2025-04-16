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
 import {
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
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
      const response = await fetch('https://production-scheduler-backend-7qgb.onrender.com/scheduling/schedule/67d1db90a8e768e199bdc947');
      const data = await response.json();
      
      // Transform the data to match the expected format
      const transformedData = data.schedules.map(item => ({
        _id: item._id,
        orderId: item.orderID.orderId,
        customer: item.orderID.customer,
        item: item.orderID.item,
        machineId: item.machineID,
        process: item.stageName,
        start_time: item.scheduledStart,
        end_time: item.scheduledEnd,
        status: item.status,
        quantity: item.quantity,
        isManualApprovalRequired: item.isManualApprovalRequired,
        isApproved: item.isApproved,
        priority: item.orderID.priority,
        isNonChangeable: item.orderID.isNonChangeable
      }));
      
      setSchedules(transformedData);
      
      // Calculate metrics
      const totalOrders = transformedData.length;
      const now = new Date();
      const ordersAtRisk = transformedData.filter(schedule => {
        const endTime = new Date(schedule.end_time);
        const timeLeft = endTime - now;
        return timeLeft <= 24 * 60 * 60 * 1000 && timeLeft > 0;
      }).length;

      setMetrics({
        totalOrders,
        ordersAtRisk,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setLoading(false);
    }
  };

  // Update the table structure
  <TableContainer sx={{ maxHeight: 440 }}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Order ID</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell>Item</TableCell>
          <TableCell>Process</TableCell>
          <TableCell>Machine ID</TableCell>
          <TableCell>Start Time</TableCell>
          <TableCell>End Time</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Priority</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={11} align="center">
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Loading schedules...
            </TableCell>
          </TableRow>
        ) : schedules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={11} align="center">No schedules found</TableCell>
          </TableRow>
        ) : (
          schedules.map((schedule) => (
            <TableRow 
              key={schedule._id}
              sx={{
                bgcolor: schedule.isNonChangeable ? 'rgba(255, 224, 224, 0.4)' : 'inherit'
              }}
            >
              <TableCell>{schedule.orderId}</TableCell>
              <TableCell>{schedule.customer}</TableCell>
              <TableCell>{schedule.item}</TableCell>
              <TableCell>{schedule.process}</TableCell>
              <TableCell>{schedule.machineId}</TableCell>
              <TableCell>
                {new Date(schedule.start_time).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </TableCell>
              <TableCell>
                {new Date(schedule.end_time).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </TableCell>
              <TableCell>{schedule.quantity}</TableCell>
              <TableCell>
                <Chip
                  label={schedule.status}
                  color={
                    schedule.status === 'Completed' ? 'success' :
                    schedule.status === 'Scheduled' ? 'primary' :
                    schedule.status === 'In Progress' ? 'info' :
                    'default'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={`P${schedule.priority}`}
                  color={
                    schedule.priority === 1 ? 'error' :
                    schedule.priority === 2 ? 'warning' :
                    'default'
                  }
                  size="small"
                />
                {schedule.isNonChangeable && (
                  <Tooltip title="Non-changeable">
                    <LockIcon fontSize="small" color="error" sx={{ ml: 1 }} />
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => setDrawerOpen(true)}
                  disabled={schedule.isNonChangeable}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
  
  // Update the metrics rendering
  const metricsData = [
    { title: 'Total Schedules', value: metrics.totalOrders },
    // { title: 'Machine Capacity', value: metrics.idleCapacity },
    { title: 'Schedules at Risk', value: metrics.ordersAtRisk },
    // { title: 'Pending Approvals', value: metrics.pendingApprovals },
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