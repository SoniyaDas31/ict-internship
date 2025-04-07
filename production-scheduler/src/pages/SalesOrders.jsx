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
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const SalesOrders = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // Add formData state
  const [formData, setFormData] = useState({
    orderId: '',
    customer: '',
    item: '',
    quantity: '',
    rate: '',
    orderDate: '',
    deliveryDate: '',
    priority: ''
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
      const response = await fetch('https://kera-internship.onrender.com/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add order');
      }

      await fetchOrders();
      setFormData({
        orderId: '',
        customer: '',
        item: '',
        quantity: '',
        rate: '',
        orderDate: '',
        deliveryDate: '',
        priority: ''
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  // Add fetch function and useEffect
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://kera-internship.onrender.com/order');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // Update filteredOrders to match new data structure
  const filteredOrders = orders.filter(order =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update table structure to match API data
  return (
    <Box sx={{ flexGrow: 1, height: 'auto', overflow: 'hidden', pt: 2, pb: 5, bgcolor: 'rgba(255,255,255,0.95)', width: '90%', margin: '5% auto' }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#1a1a1a' }}>
             Orders
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
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">Loading...</TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">No orders found</TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.item}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.rate}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                    <TableCell>{order.priority}</TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Update form data structure in Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>New Sales Order</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                name="orderId"
                label="Order ID"
                required
                value={formData.orderId}
                onChange={handleInputChange}
              />
              <TextField
                name="customer"
                label="Customer"
                required
                value={formData.customer}
                onChange={handleInputChange}
              />
              <TextField
                name="item"
                label="Item"
                required
                value={formData.item}
                onChange={handleInputChange}
              />
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                required
                value={formData.quantity}
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
                name="orderDate"
                label="Order Date"
                type="date"
                required
                value={formData.orderDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
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
              <TextField
                name="priority"
                label="Priority"
                type="number"
                required
                value={formData.priority}
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

export default SalesOrders;