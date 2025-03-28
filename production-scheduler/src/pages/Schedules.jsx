import React, { useState } from 'react';
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

  // Mock data for demonstration
  const metrics = [
    { title: 'Total Orders', value: '45' },
    { title: 'Idle Capacity', value: '15%' },
    { title: 'Orders at Risk', value: '3' },
    { title: 'Pending Approvals', value: '5' },
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
      bgcolor: 'rgba(255,255,255,0.95)', // Add this line to set white background
      width:'90%', margin:'5% auto'
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Date Range"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={2}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newValue) => setViewMode(newValue)}
              fullWidth
            >
              <ToggleButton value="table">
                <ListIcon />
              </ToggleButton>
              <ToggleButton value="gantt">
                <CalendarIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>

        {/* Metrics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {metrics.map((metric) => (
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
                  <TableCell>Order ID</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Machine</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tag</TableCell>
                  <TableCell>Suggestions</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{
                      backgroundColor: order.tag === 'NC' ? '#fff3e0' : 'inherit',
                    }}
                  >
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{order.machine}</TableCell>
                    <TableCell>{order.start}</TableCell>
                    <TableCell>{order.end}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.tag}</TableCell>
                    <TableCell>{order.suggestions}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <CancelIcon />
                      </IconButton>
                      {order.tag === 'NC' && (
                        <IconButton size="small" disabled>
                          <LockIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Footer Actions */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined">Export Schedule</Button>
          <Button variant="outlined">Sync with ERP</Button>
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