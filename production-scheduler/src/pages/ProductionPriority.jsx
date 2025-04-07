import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Badge,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  Build as BuildIcon,
  Visibility as VisibilityIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';

const ProductionPriority = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [machines, setMachines] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [optimizationRun, setOptimizationRun] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Remove the mock data useEffect completely (the one with mockScheduleData)
  
  // Update the fetchAllData function to log the data
  const fetchAllData = async () => {
    try {
      const [ordersRes, schedulesRes, machinesRes] = await Promise.all([
        fetch('https://kera-internship.onrender.com/order'),
        fetch('https://kera-internship.onrender.com/schedule'),
        fetch('https://kera-internship.onrender.com/machine')
      ]);
  
      const [ordersData, schedulesData, machinesData] = await Promise.all([
        ordersRes.json(),
        schedulesRes.json(),
        machinesRes.json()
      ]);
  
      console.log('Orders:', ordersData);
      console.log('Schedules:', schedulesData);
      console.log('Machines:', machinesData);
  
      setOrders(ordersData);
      setScheduleData(schedulesData);
      setMachines(machinesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  
  // Update the table mapping
  scheduleData.map((schedule) => {
    const order = orders.find(o => o.orderId === schedule.orderId);
    const machine = machines.find(m => m.machineId === schedule.machineId);
    return (
      <TableRow key={schedule._id}>
        <TableCell>{schedule.orderId}</TableCell>
        <TableCell>{order?.customer || '-'}</TableCell>
        <TableCell>{order?.item || '-'}</TableCell>
        <TableCell>{order?.quantity || '-'}</TableCell>
        <TableCell>{machine?.name || schedule.machineId}</TableCell>
        <TableCell>{new Date(schedule.start_time).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(schedule.end_time).toLocaleDateString()}</TableCell>
        <TableCell>{order?.priority || '-'}</TableCell>
        <TableCell>
          <Chip 
            label={schedule.status || 'Scheduled'} 
            color={schedule.status === 'In Progress' ? 'primary' : 'default'} 
            size="small" 
          />
        </TableCell>
      </TableRow>
    );
  })
  
  // Mock data for production schedule
  useEffect(() => {
    const mockScheduleData = [
      {
        id: 'ORD-1001',
        product: 'Carpet Type A',
        quantity: 500,
        machine: 'Loom-01',
        startDate: '2023-06-10',
        endDate: '2023-06-15',
        priority: 1,
        status: 'In Progress',
        isNonChangeable: true,
        utilization: 85
      },
      {
        id: 'ORD-1002',
        product: 'Carpet Type B',
        quantity: 300,
        machine: 'Loom-02',
        startDate: '2023-06-12',
        endDate: '2023-06-18',
        priority: 2,
        status: 'Scheduled',
        isNonChangeable: false,
        utilization: 65
      },
      {
        id: 'ORD-1003',
        product: 'Carpet Type C',
        quantity: 800,
        machine: 'Loom-01',
        startDate: '2023-06-16',
        endDate: '2023-06-25',
        priority: 3,
        status: 'Scheduled',
        isNonChangeable: false,
        utilization: 90
      },
      {
        id: 'ORD-1004',
        product: 'Carpet Type A',
        quantity: 450,
        machine: 'Loom-03',
        startDate: '2023-06-14',
        endDate: '2023-06-20',
        priority: 4,
        status: 'Scheduled',
        isNonChangeable: false,
        utilization: 75
      },
      {
        id: 'ORD-1005',
        product: 'Carpet Type D',
        quantity: 600,
        machine: 'Loom-02',
        startDate: '2023-06-19',
        endDate: '2023-06-28',
        priority: 5,
        status: 'Scheduled',
        isNonChangeable: false,
        utilization: 95
      }
    ];

    setScheduleData(mockScheduleData);
  }, []);

  // Generate optimization recommendations
  const generateRecommendations = () => {
    // Simulate optimization algorithm
    const mockRecommendations = [
      {
        id: 'REC-001',
        type: 'reschedule',
        orderId: 'ORD-1003',
        currentMachine: 'Loom-01',
        currentStartDate: '2023-06-16',
        currentEndDate: '2023-06-25',
        suggestedMachine: 'Loom-01',
        suggestedStartDate: '2023-06-18',
        suggestedEndDate: '2023-06-27',
        reason: 'Capacity overlap with ORD-1001',
        impact: 'Delay by 2 days, no impact on other orders',
        priority: 'Medium'
      },
      {
        id: 'REC-002',
        type: 'outsource',
        orderId: 'ORD-1005',
        currentMachine: 'Loom-02',
        currentStartDate: '2023-06-19',
        currentEndDate: '2023-06-28',
        suggestedVendor: 'External Vendor A',
        suggestedStartDate: '2023-06-19',
        suggestedEndDate: '2023-06-26',
        reason: 'High machine utilization (95%)',
        impact: 'Complete 2 days earlier, cost increase of 8%',
        priority: 'High'
      },
      {
        id: 'REC-003',
        type: 'extra-shift',
        orderId: 'ORD-1004',
        currentMachine: 'Loom-03',
        currentStartDate: '2023-06-14',
        currentEndDate: '2023-06-20',
        suggestedShift: 'Evening',
        suggestedEndDate: '2023-06-17',
        reason: 'Opportunity to complete earlier',
        impact: 'Complete 3 days earlier, additional labor cost',
        priority: 'Low'
      },
      {
        id: 'REC-004',
        type: 'early-capacity',
        orderId: 'ORD-1002',
        currentMachine: 'Loom-02',
        currentStartDate: '2023-06-12',
        currentEndDate: '2023-06-18',
        suggestedMachine: 'Loom-04',
        suggestedStartDate: '2023-06-10',
        suggestedEndDate: '2023-06-15',
        reason: 'Loom-04 has idle capacity',
        impact: 'Complete 3 days earlier, better machine utilization',
        priority: 'High'
      }
    ];

    setRecommendations(mockRecommendations);
    setOptimizationRun(true);
    setShowRecommendations(true);
  };

  const handleRecommendationClick = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setOpenDialog(true);
  };

  const handleAcceptRecommendation = () => {
    // Implement the changes to the schedule
    if (selectedRecommendation) {
      // Update the schedule based on recommendation type
      const updatedSchedule = scheduleData.map(item => {
        if (item.id === selectedRecommendation.orderId) {
          const updatedItem = { ...item };
          
          switch (selectedRecommendation.type) {
            case 'reschedule':
              updatedItem.startDate = selectedRecommendation.suggestedStartDate;
              updatedItem.endDate = selectedRecommendation.suggestedEndDate;
              break;
            case 'outsource':
              updatedItem.machine = `Outsourced: ${selectedRecommendation.suggestedVendor}`;
              updatedItem.endDate = selectedRecommendation.suggestedEndDate;
              break;
            case 'extra-shift':
              updatedItem.endDate = selectedRecommendation.suggestedEndDate;
              break;
            case 'early-capacity':
              updatedItem.machine = selectedRecommendation.suggestedMachine;
              updatedItem.startDate = selectedRecommendation.suggestedStartDate;
              updatedItem.endDate = selectedRecommendation.suggestedEndDate;
              break;
            default:
              break;
          }
          
          return updatedItem;
        }
        return item;
      });
      
      setScheduleData(updatedSchedule);
      
      // Remove the accepted recommendation
      const updatedRecommendations = recommendations.filter(
        rec => rec.id !== selectedRecommendation.id
      );
      setRecommendations(updatedRecommendations);
    }
    
    setOpenDialog(false);
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'reschedule':
        return <TimelineIcon />;
      case 'outsource':
        return <BuildIcon />;
      case 'extra-shift':
        return <NotificationsActiveIcon />;
      case 'early-capacity':
        return <RefreshIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const getRecommendationColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, height: 'auto', overflow: 'hidden', pt: 2, pb: 5, bgcolor: 'rgba(255,255,255,0.95)', width: '95%', margin: '5% auto' }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#1a1a1a' }}>
            Production Schedule Priority
          </Typography>
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<RefreshIcon />}
              onClick={generateRecommendations}
              sx={{ mr: 2 }}
            >
              Run Optimization
            </Button>
            {/* {optimizationRun && (
              <FormControlLabel
                control={
                  <Switch 
                    checked={showRecommendations} 
                    onChange={(e) => setShowRecommendations(e.target.checked)} 
                  />
                }
                label="Show Recommendations"
              />
            )} */}
          </Box>
        </Box>

        <Grid container spacing={3}>
            
         
          <Grid item xs={12} md={showRecommendations ? 4 : 12}>
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Current Production Schedule</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Machine</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">Loading...</TableCell>
                      </TableRow>
                    ) : scheduleData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">No schedule data found</TableCell>
                      </TableRow>
                    ) : (
                      scheduleData.map((schedule) => {
                        // Find the matching order using the correct orderId from schedule
                        const order = orders.find(o => o._id === schedule.orderId);
                        const machine = machines.find(m => m._id === schedule.machineId);
                        return (
                          <TableRow key={schedule._id}>
                            <TableCell>{order?.orderId || '-'}</TableCell>
                            <TableCell>{order?.customer || '-'}</TableCell>
                            <TableCell>{order?.item || '-'}</TableCell>
                            <TableCell>{order?.quantity || '-'}</TableCell>
                            <TableCell>{machine?.name || schedule.machineId}</TableCell>
                            <TableCell>{new Date(schedule.start_time).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(schedule.end_time).toLocaleDateString()}</TableCell>
                            <TableCell>{order?.priority || '-'}</TableCell>
                            <TableCell>
                              <Chip 
                                label={schedule.status || 'Scheduled'} 
                                color={schedule.status === 'In Progress' ? 'primary' : 'default'} 
                                size="small" 
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {showRecommendations && (
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    <Badge badgeContent={recommendations.length} color="error" sx={{ mr: 1 }}>
                      Optimization Recommendations
                    </Badge>
                  </Typography>
                </Box>
                
                {recommendations.length === 0 ? (
                  <Alert severity="success">No recommendations needed. Schedule is optimized!</Alert>
                ) : (
                  <Stack spacing={2}>
                    {recommendations.map((rec) => (
                      <Card 
                        key={rec.id} 
                        variant="outlined" 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { boxShadow: 3 },
                          textAlign:'left'
                        }}
                        onClick={() => handleRecommendationClick(rec)}
                      >
                        <CardHeader
                          avatar={getRecommendationIcon(rec.type)}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', textAlign:'left' }}>
                              <Typography variant="subtitle1">
                                {rec.type === 'reschedule' && 'Reschedule Order'}
                                {rec.type === 'outsource' && 'Outsource Order'}
                                {rec.type === 'extra-shift' && 'Add Extra Shift'}
                                {rec.type === 'early-capacity' && 'Utilize Early Capacity'}
                              </Typography>
                              <Chip 
                                label={rec.priority} 
                                color={getRecommendationColor(rec.priority)} 
                                size="small" 
                                sx={{ ml: 1 }} 
                              />
                            </Box>
                          }
                          subheader={`Order: ${rec.orderId}`}
                        />
                        <CardContent>
                          <Typography variant="body2" color="text.primary">
                            {rec.reason}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2">
                            <strong>Impact:</strong> {rec.impact}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md">
          <DialogTitle>
            Recommendation Details
          </DialogTitle>
          <DialogContent>
            {selectedRecommendation && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', width: '100%' }}>
                  <Typography variant="h6" sx={{width: '100%'}}>
                    {selectedRecommendation.type === 'reschedule' && 'Reschedule Order'}
                    {selectedRecommendation.type === 'outsource' && 'Outsource Order'}
                    {selectedRecommendation.type === 'extra-shift' && 'Add Extra Shift'}
                    {selectedRecommendation.type === 'early-capacity' && 'Utilize Early Capacity'}
                  </Typography>
                  <Chip 
                    label={selectedRecommendation.priority} 
                    color={getRecommendationColor(selectedRecommendation.priority)} 
                    size="small" 
                    sx={{ ml: 1 }} 
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Current Schedule</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Order ID</Typography>
                        <Typography variant="body1">{selectedRecommendation.orderId}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Machine</Typography>
                        <Typography variant="body1">{selectedRecommendation.currentMachine}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Start Date</Typography>
                        <Typography variant="body1">{selectedRecommendation.currentStartDate}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">End Date</Typography>
                        <Typography variant="body1">{selectedRecommendation.currentEndDate}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa' }}>
                    <Typography variant="subtitle1" gutterBottom>Recommended Change</Typography>
                    <Grid container spacing={2}>
                      {selectedRecommendation.type === 'outsource' ? (
                        <>
                          <Grid item xs={6} md={4}>
                            <Typography variant="body2" color="text.secondary">Vendor</Typography>
                            <Typography variant="body1">{selectedRecommendation.suggestedVendor}</Typography>
                          </Grid>
                        </>
                      ) : selectedRecommendation.type === 'extra-shift' ? (
                        <>
                          <Grid item xs={6} md={4}>
                            <Typography variant="body2" color="text.secondary">Additional Shift</Typography>
                            <Typography variant="body1">{selectedRecommendation.suggestedShift}</Typography>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item xs={6} md={4}>
                            <Typography variant="body2" color="text.secondary">Machine</Typography>
                            <Typography variant="body1">{selectedRecommendation.suggestedMachine}</Typography>
                          </Grid>
                        </>
                      )}
                      
                      <Grid item xs={6} md={4}>
                        <Typography variant="body2" color="text.secondary">Start Date</Typography>
                        <Typography variant="body1">
                          {selectedRecommendation.suggestedStartDate || selectedRecommendation.currentStartDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography variant="body2" color="text.secondary">End Date</Typography>
                        <Typography variant="body1">{selectedRecommendation.suggestedEndDate}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} gap={3} sx={{ display: 'flex', width: '100%' }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Reason:</Typography>
                    {selectedRecommendation.reason}
                  </Alert>
                  
                  <Alert severity="warning">
                    <Typography variant="subtitle2">Impact:</Typography>
                    {selectedRecommendation.impact}
                  </Alert>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAcceptRecommendation}
              startIcon={<CheckCircleIcon />}
            >
              Accept Recommendation
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ProductionPriority;