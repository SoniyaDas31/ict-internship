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
} from '@mui/material';
import axios from 'axios';

const AutoScheduler = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const handleAutoSchedule = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://production-scheduler-backend-7qgb.onrender.com/scheduling/auto-schedule');
      console.log('API Response:', response.data);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Auto-scheduling failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{background: '#ffffff'}}>
      <Box sx={{ padding: 2, background:  '#ffffff' }}>
        <Typography variant="h5" gutterBottom sx={{color:'#000'}}>
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
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography color={rec.type === 'Outsource' ? 'error' : 'warning.main'}>
                          {rec.type}
                        </Typography>
                      }
                      secondary={rec.reason}
                    />
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
