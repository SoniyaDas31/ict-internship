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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchStageName, setSearchStageName] = useState('');
  const [searchMachineId, setSearchMachineId] = useState('');

  useEffect(() => {
    fetchAllSchedules();
  }, []);

  const fetchAllSchedules = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://production-scheduler-backend-7qgb.onrender.com/scheduling/schedule');
      setSchedules(response.data);
      setFilteredSchedules(response.data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to fetch schedules.');
      setSchedules([]);
      setFilteredSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchOrderId && !searchStageName && !searchMachineId) {
      setError('Please enter at least one search term.');
      return;
    }
  
    const filtered = schedules.filter(schedule => {
      const matchOrderId = searchOrderId
        ? schedule.orderNumber?.toLowerCase().includes(searchOrderId.trim().toLowerCase())
        : true;
  
      const matchStageName = searchStageName
        ? schedule.stageName?.toLowerCase().includes(searchStageName.trim().toLowerCase())
        : true;
  
      const matchMachineId = searchMachineId
        ? schedule.machineName?.toLowerCase().includes(searchMachineId.trim().toLowerCase())
        : true;
  
      return matchOrderId && matchStageName && matchMachineId;
    });
  
    if (filtered.length === 0) {
      setError('No schedules found matching your criteria.');
    } else {
      setError('');
    }
  
    setFilteredSchedules(filtered);
  };
  const handleResetSearch = () => {
    setSearchOrderId('');
    setSearchStageName('');
    setSearchMachineId('');
    setFilteredSchedules(schedules);
    setError('');
  };
  return (
    <Container>
      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.95)', margin: '5% auto' }}>
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
              sx={{ '& .MuiInputBase-root': { backgroundColor: 'white' } }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search by Stage Name..."
      value={searchStageName}
      onChange={(e) => setSearchStageName(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ '& .MuiInputBase-root': { backgroundColor: 'white' } }}
      onKeyPress={(e) => {
        if (e.key === 'Enter') handleSearch();
      }}
    />
  </Grid>
  <Grid item xs={12} md={4}>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search by Machine ID..."
      value={searchMachineId}
      onChange={(e) => setSearchMachineId(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ '& .MuiInputBase-root': { backgroundColor: 'white' } }}
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Stage Name</TableCell>
                    <TableCell>Machine ID</TableCell>
                    <TableCell>Scheduled Start(utc)</TableCell>
                    <TableCell>Scheduled End(utc)</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSchedules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No schedules found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSchedules.map((schedule, index) => (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{schedule.orderNumber || 'N/A'}</TableCell>
                          <TableCell>{schedule.stageName || 'N/A'}</TableCell>
                          <TableCell>{schedule.machineName || 'N/A'}</TableCell>
                          <TableCell>{new Date(schedule.scheduledStart).toUTCString()}</TableCell>
                          <TableCell>{new Date(schedule.scheduledEnd).toUTCString()}</TableCell>
                          <TableCell>{schedule.status || 'N/A'}</TableCell>
                          <TableCell>{schedule.quantity || 'N/A'}</TableCell>
                        </TableRow>

                        {schedule.scheduleChunks && schedule.scheduleChunks.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={7} sx={{ padding: 0 }}>
                              <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                  <Typography variant="subtitle2">View Chunks</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Chunk Start(utc) </TableCell>
                                        <TableCell>Chunk End(utc) </TableCell>
                                        <TableCell>Chunk Quantity</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {schedule.scheduleChunks.map((chunk, idx) => (
                                        <TableRow key={idx}>
                                          <TableCell>{new Date(chunk.startTime).toUTCString()}</TableCell>
                                          <TableCell>{new Date(chunk.endTime).toUTCString()}</TableCell>
                                          <TableCell>{chunk.quantity}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </AccordionDetails>
                              </Accordion>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
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
