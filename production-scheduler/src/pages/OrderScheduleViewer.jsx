import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import axios from 'axios';

const statusColors = {
  'Scheduled': 'success',
  'Pending Approval': 'warning',
  'Outsourced': 'info',
  'Failed': 'error',
};

const OrderScheduleViewer = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);
    setSchedules([]);

    try {
      const response = await axios.get(`http://localhost:5000/schedule/${orderId}`);
      setSchedules(response.data.schedules);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve schedule. Please check the Order ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        View Schedule by Order ID
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Order ID"
          variant="outlined"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <Button variant="contained" onClick={fetchSchedule} disabled={loading || !orderId}>
          {loading ? <CircularProgress size={24} /> : 'Fetch Schedule'}
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {schedules.length > 0 && (
        <>
          <Typography variant="h6">Schedule for Order: {orderId}</Typography>
          <List>
            {schedules.map((schedule, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight="bold">
                          Stage: {schedule.stageName}
                        </Typography>
                        <Chip
                          label={schedule.status}
                          color={statusColors[schedule.status] || 'default'}
                          size="small"
                        />
                        {schedule.isManualApprovalRequired && (
                          <Chip label="Needs Approval" color="warning" size="small" />
                        )}
                      </Stack>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Machine ID: {schedule.machineID || 'N/A'}
                        </Typography>
                        <br />
                        Quantity: {schedule.quantity}
                        <br />
                        Start: {new Date(schedule.scheduledStart).toLocaleString()}
                        <br />
                        End: {new Date(schedule.scheduledEnd).toLocaleString()}
                        <br />
                        {schedule.recommendation?.type && (
                          <>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                              <strong>Recommendation:</strong> {schedule.recommendation.type} – {schedule.recommendation.reason}
                            </Typography>
                          </>
                        )}
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default OrderScheduleViewer;
