import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const Schedules = () => {
  // State for schedules, loading, and error messaging
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchOrderId, setSearchOrderId] = useState('');

  // On mount, fetch all schedules
  useEffect(() => {
    fetchAllSchedules();
  }, []);

  // Function to fetch all schedules from internal schedule API
  const fetchAllSchedules = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://production-scheduler-backend-7qgb.onrender.com/scheduling/schedule');
      setSchedules(response.data);
      setFilteredSchedules(response.data); // Initially, show all schedules
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to fetch schedules.');
      setSchedules([]);
      setFilteredSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to filter schedules based on orderNumber
  const handleSearch = () => {
    if (!searchOrderId.trim()) {
      setError('Please enter a valid Order ID.');
      return;
    }

    // Filter schedules by orderNumber
    const filtered = schedules.filter(schedule => schedule.orderNumber && schedule.orderNumber.includes(searchOrderId));
    setFilteredSchedules(filtered);

    if (filtered.length === 0) {
      setError('No schedules found for that Order ID.');
    } else {
      setError('');
    }
  };

  // Handler for when the search input is empty
  const handleResetSearch = () => {
    setSearchOrderId('');
    setError('');
    setFilteredSchedules(schedules); // Reset to show all schedules
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#1a1a1a' }}>
            Manage Production Schedule
          </Typography>
        </Box>

        {/* Search Area */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by Order ID..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              // Set background color of the TextField to white
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'white',
                },
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Button variant="contained" fullWidth onClick={handleSearch} disabled={loading}>
              Search
            </Button>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button variant="outlined" fullWidth onClick={handleResetSearch} disabled={loading}>
              <RefreshIcon />
              Reset
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
        </Grid>

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Schedule Table */}
        {!loading && (
          <Paper>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {/* Added Order ID as a column */}
                    <TableCell>Order ID</TableCell>
                    <TableCell>Stage Name</TableCell>
                    <TableCell>Machine ID</TableCell>
                    <TableCell>Scheduled Start</TableCell>
                    <TableCell>Scheduled End</TableCell>
                    <TableCell>Status</TableCell>
                    {/* <TableCell>Batch #</TableCell> */}
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSchedules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No schedules found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSchedules.map((schedule, index) => (
                      <TableRow key={index}>
                        <TableCell>{schedule.orderNumber || 'N/A'}</TableCell>
                        <TableCell>{schedule.stageName || 'N/A'}</TableCell>
                        <TableCell>{schedule.machineName || 'N/A'}</TableCell>
                        <TableCell>{new Date(schedule.scheduledStart).toLocaleString()}</TableCell>
                        <TableCell>{new Date(schedule.scheduledEnd).toLocaleString()}</TableCell>
                        <TableCell>{schedule.status || 'N/A'}</TableCell>
                        <TableCell>{schedule.quantity || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Schedules;
