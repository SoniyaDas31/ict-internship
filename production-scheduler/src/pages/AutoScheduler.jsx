import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Stack,
} from '@mui/material';
import axios from 'axios';

const AutoScheduler = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const handleAutoSchedule = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://production-scheduler-backend-7qgb.onrender.com/scheduling/auto-schedule'
      );
      console.log('API Response:', response.data);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Auto-scheduling failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Action Handlers
  const handleOutsource = (rec) => {
    alert(`Outsource selected for:\n${rec.reason}`);
  };

  const handleExtraShift = (rec) => {
    alert(`Extra Shift selected for:\n${rec.reason}`);
  };

  const handleReschedule = (rec) => {
    alert(`Reschedule selected for:\n${rec.reason}`);
  };

  const handleManualApproval = (rec) => {
    alert(`Manual Approval selected for:\n${rec.reason}`);
  };

  return (
    <div style={{ background: '#ffffff' }}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#000' }}>
          Auto Scheduler
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAutoSchedule}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Run Auto-Schedule'}
        </Button>

        {recommendations.length > 0 ? (
          <>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            <List>
              {recommendations.map((rec, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{ fontWeight: 'bold' }}
                          color={rec.type === 'Outsource' ? 'error' : 'warning.main'}
                        >
                          {rec.type}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Reason:</strong> {rec.reason}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Suggested By:</strong> {rec.suggestedBy}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Created At:</strong>{' '}
                            {new Date(rec.createdAt).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                    <Stack direction="row" spacing={2} mt={1}>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleManualApproval(rec)}
                      >
                        Manual Approval
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleOutsource(rec)}
                      >
                        Outsource
                      </Button>
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => handleExtraShift(rec)}
                      >
                        Extra Shift
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleReschedule(rec)}
                      >
                        Reschedule
                      </Button>
                    </Stack>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </>
        ) : (
          !loading && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No recommendations yet. Click "Run Auto-Schedule" to begin.
            </Alert>
          )
        )}
      </Box>
    </div>
  );
};

export default AutoScheduler;
