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
  Stack,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

const BillOfMaterials = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Sample BOM data
  const [bomItems, setBomItems] = useState([
    {
      id: 'BOM001',
      productCode: 'KERA#050623-11',
      productName: 'Carpet Type A',
      version: '1.0',
      status: 'Active',
      components: [
        { id: 'C001', name: 'Latex', quantity: 2.5, unit: 'kg' },
        { id: 'C002', name: 'Wool Fiber', quantity: 3, unit: 'kg' },
        { id: 'C003', name: 'Backing Material', quantity: 1, unit: 'm²' },
        { id: 'C004', name: 'Dye', quantity: 0.5, unit: 'L' },
      ]
    },
    {
      id: 'BOM002',
      productCode: 'KERA#050623-12',
      productName: 'Carpet Type B',
      version: '1.0',
      status: 'Active',
      components: [
        { id: 'C001', name: 'Latex', quantity: 3, unit: 'kg' },
        { id: 'C005', name: 'Synthetic Fiber', quantity: 2.5, unit: 'kg' },
        { id: 'C003', name: 'Backing Material', quantity: 1, unit: 'm²' },
        { id: 'C006', name: 'Stain Resistant Coating', quantity: 0.3, unit: 'L' },
      ]
    }
  ]);

  const [formData, setFormData] = useState({
    productCode: '',
    productName: '',
    version: '',
    status: 'Active',
    components: []
  });

  const [componentForm, setComponentForm] = useState({
    id: '',
    name: '',
    quantity: '',
    unit: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleComponentInputChange = (e) => {
    const { name, value } = e.target;
    setComponentForm(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const addComponent = () => {
    if (componentForm.name && componentForm.quantity && componentForm.unit) {
      const newComponent = {
        id: `C${Math.floor(Math.random() * 1000)}`,
        name: componentForm.name,
        quantity: Number(componentForm.quantity),
        unit: componentForm.unit
      };
      
      setFormData(prevData => ({
        ...prevData,
        components: [...prevData.components, newComponent]
      }));
      
      setComponentForm({
        id: '',
        name: '',
        quantity: '',
        unit: ''
      });
    }
  };

  const removeComponent = (componentId) => {
    setFormData(prevData => ({
      ...prevData,
      components: prevData.components.filter(comp => comp.id !== componentId)
    }));
  };

  const handleSubmit = () => {
    const newBom = {
      id: `BOM${Math.floor(Math.random() * 1000)}`,
      productCode: formData.productCode,
      productName: formData.productName,
      version: formData.version,
      status: formData.status,
      components: formData.components
    };
    
    setBomItems(prev => [...prev, newBom]);
    setFormData({
      productCode: '',
      productName: '',
      version: '',
      status: 'Active',
      components: []
    });
    setOpen(false);
  };

  const toggleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const filteredBomItems = bomItems.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.productCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, height: 'auto', overflow: 'hidden', pt: 2, pb: 5, bgcolor: 'rgba(255,255,255,0.95)', width: '90%', margin: '5% auto' }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#1a1a1a' }}>
            Bill of Materials
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            New BOM
          </Button>
        </Box>

        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search BOM..."
          variant="outlined"
          sx={{ width: '300px', mb: 3 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>BOM ID</TableCell>
                <TableCell>Product Code</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Components</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBomItems.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton size="small" onClick={() => toggleExpand(item.id)}>
                        {expandedItem === item.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.productCode}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.version}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status} 
                        color={item.status === 'Active' ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{item.components.length}</TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {expandedItem === item.id && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 0 }}>
                        <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Components
                          </Typography>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Component ID</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Quantity</TableCell>
                                  <TableCell>Unit</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {item.components.map((component) => (
                                  <TableRow key={component.id}>
                                    <TableCell>{component.id}</TableCell>
                                    <TableCell>{component.name}</TableCell>
                                    <TableCell>{component.quantity}</TableCell>
                                    <TableCell>{component.unit}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>New Bill of Materials</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="productCode"
                    label="Product Code"
                    required
                    fullWidth
                    value={formData.productCode}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="productName"
                    label="Product Name"
                    required
                    fullWidth
                    value={formData.productName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="version"
                    label="Version"
                    required
                    fullWidth
                    value={formData.version}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="status"
                    label="Status"
                    select
                    required
                    fullWidth
                    value={formData.status}
                    onChange={handleInputChange}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Obsolete">Obsolete</option>
                  </TextField>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }}>Components</Divider>
              
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <TextField
                      name="name"
                      label="Component Name"
                      fullWidth
                      value={componentForm.name}
                      onChange={handleComponentInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      name="quantity"
                      label="Quantity"
                      type="number"
                      fullWidth
                      value={componentForm.quantity}
                      onChange={handleComponentInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      name="unit"
                      label="Unit"
                      fullWidth
                      value={componentForm.unit}
                      onChange={handleComponentInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={addComponent}
                      fullWidth
                    >
                      Add Component
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {formData.components.length > 0 && (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Component Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.components.map((component) => (
                        <TableRow key={component.id}>
                          <TableCell>{component.name}</TableCell>
                          <TableCell>{component.quantity}</TableCell>
                          <TableCell>{component.unit}</TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => removeComponent(component.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit}
              disabled={!formData.productCode || !formData.productName || !formData.version || formData.components.length === 0}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default BillOfMaterials;