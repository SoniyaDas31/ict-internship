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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
// Remove these imports
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const SalesOrders = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [orders, setOrders] = useState([
    {
      orderNo: '1001',
      date: new Date('2025-02-01'),
      customer: 'ABC Carpets',
      itemCode: 'KERA#050623-11',
      qty: 3000,
      uom: 'Pcs',
      rate: 320,
      deliveryDate: new Date('2025-03-05')
    }
  ]);

  const [formData, setFormData] = useState({
    orderNo: '',
    date: null,
    customer: '',
    itemCode: '',
    qty: '',
    uom: '',
    rate: '',
    deliveryDate: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const newOrder = {
      orderNo: formData.orderNo,
      date: formData.date,
      customer: formData.customer,
      itemCode: formData.itemCode,
      qty: Number(formData.qty),
      uom: formData.uom,
      rate: Number(formData.rate),
      deliveryDate: formData.deliveryDate
    };
    setOrders(prev => [...prev, newOrder]);
    setFormData({
      orderNo: '',
      date: null,
      customer: '',
      itemCode: '',
      qty: '',
      uom: '',
      rate: '',
      deliveryDate: null
    });
    setOpen(false);
  };

  const filteredOrders = orders.filter(order =>
    order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, height: 'auto', overflow: 'hidden', pt: 2, pb: 5, bgcolor: 'rgba(255,255,255,0.95)', width: '90%', margin: '5% auto' }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#1a1a1a' }}>
            Sales Orders
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            New Order
          </Button>
        </Box>

        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search orders..."
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
                <TableCell>Order No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Item Code</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>UOM</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.orderNo}>
                  <TableCell>{order.orderNo}</TableCell>
                  <TableCell>{order.date.toLocaleDateString()}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.itemCode}</TableCell>
                  <TableCell>{order.qty}</TableCell>
                  <TableCell>{order.uom}</TableCell>
                  <TableCell>{order.rate}</TableCell>
                  <TableCell>{order.deliveryDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>New Sales Order</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                name="orderNo"
                label="Order No"
                required
                value={formData.orderNo}
                onChange={handleInputChange}
              />
              <TextField
                name="date"
                label="Date"
                type="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="customer"
                label="Customer"
                required
                value={formData.customer}
                onChange={handleInputChange}
              />
              <TextField
                name="itemCode"
                label="Item Code"
                required
                value={formData.itemCode}
                onChange={handleInputChange}
              />
              <TextField
                name="qty"
                label="Quantity"
                type="number"
                required
                value={formData.qty}
                onChange={handleInputChange}
              />
              <TextField
                name="uom"
                label="UOM"
                required
                value={formData.uom}
                onChange={handleInputChange}
              />
              <TextField
                name="rate"
                label="Rate"
                type="number"
                required
                value={formData.rate}
                onChange={handleInputChange}
              />
              <TextField
                name="deliveryDate"
                label="Delivery Date"
                type="date"
                required
                value={formData.deliveryDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
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

export default SalesOrders;