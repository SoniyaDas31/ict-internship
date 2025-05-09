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
    process: '',
    batch_size: '',
    unit_material_per_product: '',
    time_per_product: '',
    startTime: '',
    endTime: '',
    shiftHoursPerDay: '',
    workingDays: '',
    assignedOrders: [],
    status: '',
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
      const url = editingId
        ? `https://kera-internship.onrender.com/schedule/edit/${editingId}`
        : 'https://kera-internship.onrender.com/schedule/add';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          machineId: formData.machineId,
          process: formData.process,
          batch_size: Number(formData.batch_size),
          unit_material_per_product: Number(formData.unit_material_per_product),
          time_per_product: Number(formData.time_per_product),
          startTime: formData.startTime,
          endTime: formData.endTime,
          shiftHoursPerDay: Number(formData.shiftHoursPerDay),
          workingDays: Number(formData.workingDays),
          assignedOrders: formData.assignedOrders,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save machine');
      }

      // Refresh the machines list
      await fetchMachines();

      // Reset form and close dialog
      setFormData({
        machineId: '',
        process: '',
        batch_size: '',
        unit_material_per_product: '',
        time_per_product: '',
        startTime: '',
        endTime: '',
        shiftHoursPerDay: '',
        workingDays: '',
        assignedOrders: [],
        status: '',
      });
      setOpen(false);
      setEditingId(null); // Reset editing ID
    } catch (error) {
      console.error('Error saving machine:', error);
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

  const handleEdit = (machine) => {
    setEditingId(machine._id);
    setFormData({
      machineId: machine.machineId,
      process: machine.process,
      batch_size: machine.batch_size,
      unit_material_per_product: machine.unit_material_per_product,
      time_per_product: machine.time_per_product,
      startTime: machine.startTime,
      endTime: machine.endTime,
      shiftHoursPerDay: machine.shiftHoursPerDay,
      workingDays: machine.workingDays,
      assignedOrders: machine.assignedOrders,
      status: machine.status,
    });
    setOpen(true);
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
      pb: 5, 
      bgcolor: 'rgba(255,255,255,0.95)', 
      width: '90%',  
      margin: '5% auto'  
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
                <TableCell>Name</TableCell>
                <TableCell>Process</TableCell>
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
                  <TableCell colSpan={5} align="center">Loading...</TableCell>
                </TableRow>
              ) : filteredMachines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No machines found</TableCell>
                </TableRow>
              ) : (
                filteredMachines.map((machine) => (
                  <TableRow key={machine._id}>
                    <TableCell>{machine.machineId}</TableCell>
                    <TableCell>{machine.process}</TableCell>
                    <TableCell>{machine.batch_size}</TableCell>
                    <TableCell>{new Date(machine.startTime).toLocaleString()}</TableCell>
                    <TableCell>{new Date(machine.endTime).toLocaleString()}</TableCell> 
                    <TableCell>
                      <Chip label={machine.status} color={machine.status === 'Active' ? 'success' : 'warning'} />
                    </TableCell>
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
          <DialogTitle>{editingId ? 'Edit Machine' : 'Add New Machine'}</DialogTitle>
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
                name="process"
                label="Process" 
                required 
                value={formData.process}
                onChange={handleInputChange}
              />
              <TextField 
                name="batch_size"
                label="Batch Size" 
                type="number" 
                required 
                value={formData.batch_size}
                onChange={handleInputChange}
              />
              <TextField 
                name="unit_material_per_product"
                label="Unit Material per Product" 
                type="number" 
                required 
                value={formData.unit_material_per_product}
                onChange={handleInputChange}
              />
              <TextField 
                name="time_per_product"
                label="Time per Product (in hours)" 
                type="number" 
                required 
                value={formData.time_per_product}
                onChange={handleInputChange}
              />
              <TextField 
                name="startTime"
                label="Start Time" 
                required 
                value={formData.startTime}
                onChange={handleInputChange}
              />
              <TextField 
                name="endTime"
                label="End Time" 
                required 
                value={formData.endTime}
                onChange={handleInputChange}
              />
              <TextField 
                name="shiftHoursPerDay"
                label="Shift Hours per Day" 
                type="number" 
                required 
                value={formData.shiftHoursPerDay}
                onChange={handleInputChange}
              />
              <TextField 
                name="workingDays"
                label="Working Days per Week" 
                type="number" 
                required 
                value={formData.workingDays}
                onChange={handleInputChange}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Offline">Idle</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Machines;
