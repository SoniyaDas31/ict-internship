import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const Machines = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    machineId: '',
    name: '',
    type: '',
    operations: '',
    capacityPerHr: '',
    mainOperator: '',
    asstOperators: '',
    helpers: '',
    totalCostPerHr: '',
    powerAndFuel: '',
    repairMaintenance: '',
    depreciationCost: '',
    status: '',
    location: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://kera-internship.onrender.com/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          process: formData.type,
          unit: formData.unit || 'KGS',
          batch_size: Number(formData.batch_size),
          time: Number(formData.time),
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add machine');
      }

      // Refresh the machines list
      await fetchMachines();
      
      // Reset form and close dialog
      setFormData({
        machineId: '',
        name: '',
        type: '',
        operations: '',
        capacityPerHr: '',
        mainOperator: '',
        asstOperators: '',
        helpers: '',
        totalCostPerHr: '',
        powerAndFuel: '',
        repairMaintenance: '',
        depreciationCost: '',
        status: '',
        location: '',
        notes: ''
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding machine:', error);
      // You might want to show an error message to the user here
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const response = await fetch('https://kera-internship.onrender.com/schedule');
      const data = await response.json();
      setMachines(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching machines:', error);
      setLoading(false);
    }
  };

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.machineId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || machine.process === filterType;
    const matchesStatus = !filterStatus || machine.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Box sx={{ 
      flexGrow: 1, 
      height: 'auto', 
      overflow: 'hidden', 
      pt: 2,
      pb: 5,  // Adjusted to account for AppBar
      bgcolor: 'rgba(255,255,255,0.95)',  // Changed background color
      width: '90%',  // Changed width
      margin: '5% auto'  // Adjusted margin
    }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#1a1a1a' }}>
            Machines
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add Machine
          </Button>
        </Box>

        {/* Search and Filters */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search machines..."
            variant="outlined"
            sx={{ width: '300px' }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select 
              label="Type" 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="COMPOUND MIXING">COMPOUND MIXING</MenuItem>
              <MenuItem value="TUFTING">TUFTING</MenuItem>
              <MenuItem value="CUTTING">CUTTING</MenuItem>
              <MenuItem value="LABELLING & PACKING">LABELLING & PACKING</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select 
              label="Status" 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
              <MenuItem value="Offline">Idle</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Machines Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {/* Remove the ID column from header */}
                <TableCell>Name</TableCell>
                <TableCell>Process</TableCell>
                {/* <TableCell>Unit</TableCell> */}
                <TableCell>Batch Size</TableCell>
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
              ) : filteredMachines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No machines found</TableCell>
                </TableRow>
              ) : (
                filteredMachines.map((machine) => (
                  <TableRow key={machine._id}>
                    {/* Remove the ID cell from row */}
                    <TableCell>{machine.machineId}</TableCell>
                    <TableCell>{machine.process}</TableCell>
                    <TableCell>{machine.unit_material_per_product}</TableCell>
                    <TableCell>{machine.batch_size}</TableCell>
                    <TableCell>{machine.time_per_product}</TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small" onClick={() => handleEdit(machine)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Machine Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Machine</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField 
                name="machineId"
                label="Machine ID" 
                required 
                value={formData.machineId}
                onChange={handleInputChange}
              />
              <TextField 
                name="name"
                label="Name" 
                required 
                value={formData.name}
                onChange={handleInputChange}
              />
              <FormControl required>
                <InputLabel>Type</InputLabel>
                <Select 
                  name="type"
                  label="Type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <MenuItem value="COMPOUND MIXING">COMPOUND MIXING</MenuItem>
                  <MenuItem value="TUFTING">TUFTING</MenuItem>
                  <MenuItem value="CUTTING">CUTTING</MenuItem>
                  <MenuItem value="LABELLING & PACKING">LABELLING & PACKING</MenuItem>
                </Select>
              </FormControl>
              <FormControl required>
                <InputLabel>Status</InputLabel>
                <Select 
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Offline">Idle</MenuItem>
                </Select>
              </FormControl>
              <TextField 
                name="capacity"
                label="Capacity (Units/Hr)" 
                type="number" 
                required 
                value={formData.capacity}
                onChange={handleInputChange}
              />
              <TextField 
                name="location"
                label="Location" 
                required 
                value={formData.location}
                onChange={handleInputChange}
              />
              <TextField 
                name="notes"
                label="Notes" 
                multiline 
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Machines;