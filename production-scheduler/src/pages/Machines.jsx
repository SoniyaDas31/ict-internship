import React, { useState } from 'react';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  const [machines, setMachines] = useState([
    {
      id: 'KFT/MACH/LTXM-1',
      name: 'Latex Mixing Machine 1',
      type: 'COMPOUND MIXING',
      capacityPerHr: 100,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/LTXM-2',
      name: 'Latex Mixing Machine 2',
      type: 'COMPOUND MIXING',
      capacityPerHr: 100,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/TFG-1',
      name: 'Tufting Machine 1',
      type: 'TUFTING',
      capacityPerHr: 80,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/TFG-2',
      name: 'Tufting Machine 2',
      type: 'TUFTING',
      capacityPerHr: 80,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/TFG-3',
      name: 'Tufting Machine 3',
      type: 'TUFTING',
      capacityPerHr: 80,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/TFG-4',
      name: 'Tufting Machine 4',
      type: 'TUFTING',
      capacityPerHr: 80,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/TFG-5',
      name: 'Tufting Machine 5',
      type: 'TUFTING',
      capacityPerHr: 80,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/TFG-6',
      name: 'Tufting Machine 6',
      type: 'TUFTING',
      capacityPerHr: 80,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/TFG-7',
      name: 'Tufting Machine 7',
      type: 'TUFTING',
      capacityPerHr: 80,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/TFG-8',
      name: 'Tufting Machine 8',
      type: 'TUFTING',
      capacityPerHr: 80,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/CT-1',
      name: 'Cutting Machine 1',
      type: 'CUTTING',
      capacityPerHr: 90,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/CT-2',
      name: 'Cutting Machine 2',
      type: 'CUTTING',
      capacityPerHr: 90,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/CT-3',
      name: 'Cutting Machine 3',
      type: 'CUTTING',
      capacityPerHr: 90,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/CT-4',
      name: 'Cutting Machine 4',
      type: 'CUTTING',
      capacityPerHr: 90,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/CT-5',
      name: 'Cutting Machine 5',
      type: 'CUTTING',
      capacityPerHr: 90,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/CT-6',
      name: 'Cutting Machine 6',
      type: 'CUTTING',
      capacityPerHr: 90,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/CT-7',
      name: 'Cutting Machine 7',
      type: 'CUTTING',
      capacityPerHr: 90,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/PKG-1',
      name: 'Packaging Machine 1',
      type: 'LABELLING & PACKING',
      capacityPerHr: 70,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/PKG-2',
      name: 'Packaging Machine 2',
      type: 'LABELLING & PACKING',
      capacityPerHr: 70,
      status: 'Active',
      location: 'Plant 1',
    },
    {
      id: 'KFT/MACH/PKG-3',
      name: 'Packaging Machine 3',
      type: 'LABELLING & PACKING',
      capacityPerHr: 70,
      status: 'Active',
      location: 'Plant 1',
    }
  ]);

  // Keep only this formData declaration with all fields
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

  // Update handleSubmit function
  const handleSubmit = () => {
    const newMachine = {
      id: formData.machineId,
      name: formData.name,
      type: formData.type,
      operations: formData.operations,
      capacityPerHr: Number(formData.capacityPerHr),
      mainOperator: formData.mainOperator,
      asstOperators: Number(formData.asstOperators),
      helpers: Number(formData.helpers),
      totalCostPerHr: Number(formData.totalCostPerHr),
      powerAndFuel: Number(formData.powerAndFuel),
      repairMaintenance: Number(formData.repairMaintenance),
      depreciationCost: Number(formData.depreciationCost),
      status: formData.status,
      location: formData.location
    };
    setMachines(prev => [...prev, newMachine]);
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
  };

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         machine.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || machine.type === filterType;
    const matchesStatus = !filterStatus || machine.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (machine) => {
    setFormData({
      machineId: machine.id,
      name: machine.name,
      type: machine.type,
      status: machine.status,
      capacity: machine.capacity,
      location: machine.location,
      notes: machine.notes || ''
    });
    setEditingId(machine.id);
    setOpen(true);
  };

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
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Machines Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Machine ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Operations</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Capacity (Units/Hr)</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMachines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.id}</TableCell>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>{machine.type}</TableCell>
                  <TableCell>
                    <Chip 
                      label={machine.status} 
                      color={getStatusColor(machine.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{machine.capacity}</TableCell>
                  <TableCell>{machine.location}</TableCell>
                  <TableCell>
                    <IconButton color="primary" size="small" onClick={() => handleEdit(machine)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
                  <MenuItem value="Offline">Offline</MenuItem>
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