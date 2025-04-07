import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';

const SchedulerUI = ({ suggestionsData }) => {
  console.log('SchedulerUI received:', suggestionsData);
  const [pendingSuggestions, setPendingSuggestions] = useState([]);

  useEffect(() => {
    if (suggestionsData && suggestionsData.suggestions) {
      setPendingSuggestions(suggestionsData.suggestions);
    }
  }, [suggestionsData]);

  // Add this to check what's being rendered
  console.log('Current pending suggestions:', pendingSuggestions);

  return (
    <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', margin: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Schedule Optimization Suggestions ({pendingSuggestions.length} items)
      </h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Operation</TableCell>
              {/* <TableCell>Order No</TableCell> */}
              <TableCell>Machine ID</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Suggestion</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingSuggestions && pendingSuggestions.length > 0 ? (
              pendingSuggestions.map((suggestion, index) => (
                <TableRow key={index}>
                  <TableCell>{suggestion.operation || '-'}</TableCell>
                  {/* l */}
                  <TableCell>{suggestion.machineId || '-'}</TableCell>
                  <TableCell>{suggestion.reason || '-'}</TableCell>
                  <TableCell>{suggestion.suggestion || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleAccept(suggestion)}
                      sx={{ mr: 1 }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleReject(suggestion)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No suggestions available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SchedulerUI;
