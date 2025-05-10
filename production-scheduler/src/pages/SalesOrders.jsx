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

  const [formData, setFormData] = useState({
    orderId: '',
    customer: '',
    item: '',
    quantity: '',
    rate: '',
    orderDate: '',
    deliveryDate: '',
    priority: '',
    isNonChangeable: '',
    status: 'Pending',
  });

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `https://kera-internship.onrender.com/order/edit/${editingId}`
        : 'https://kera-internship.onrender.com/order/add';

      // Convert isNonChangeable to boolean
      const bodyData = {
        ...formData,
        isNonChangeable: formData.isNonChangeable === 'true',
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
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
        priority: '',
        isNonChangeable: '',
        status: 'Pending',
      });
      setEditingId(null);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const handleEdit = (order) => {
    setFormData({
      orderId: order.orderId,
      customer: order.customer,
      item: order.item,
      quantity: order.quantity,
      rate: order.rate,
      orderDate: order.orderDate?.slice(0, 10) || '',
      deliveryDate: order.deliveryDate?.slice(0, 10) || '',
      priority: order.priority,
      isNonChangeable: order.isNonChangeable?.toString() || '',
      status: order.status,
    });
    setEditingId(order._id);
    setOpen(true);
  };

  const filteredOrders = orders.filter((order) =>
    order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        pt: 2,
        pb: 5,
        bgcolor: 'rgba(255,255,255,0.95)',
        width: '90%',
        margin: '5% auto',
      }}
    >
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Orders</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingId(null);
              setFormData({
                orderId: '',
                customer: '',
                item: '',
                quantity: '',
                rate: '',
                orderDate: '',
                deliveryDate: '',
                priority: '',
                isNonChangeable: '',
                status: 'Pending',
              });
              setOpen(true);
            }}
          >
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
                <TableCell>Status</TableCell>
                <TableCell>Non-Changeable</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">Loading...</TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">No orders found</TableCell>
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
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.isNonChangeable ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small" onClick={() => handleEdit(order)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingId ? 'Edit Order' : 'New Order'}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField name="orderId" label="Order ID" value={formData.orderId} onChange={handleInputChange} required />
              <TextField name="customer" label="Customer" value={formData.customer} onChange={handleInputChange} required />
              <TextField name="item" label="Item" value={formData.item} onChange={handleInputChange} required />
              <TextField name="quantity" label="Quantity" type="number" value={formData.quantity} onChange={handleInputChange} required />
              <TextField name="rate" label="Rate" type="number" value={formData.rate} onChange={handleInputChange} required />
              <TextField name="orderDate" label="Order Date" type="date" value={formData.orderDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} required />
              <TextField name="deliveryDate" label="Delivery Date" type="date" value={formData.deliveryDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} required />
              <TextField name="priority" label="Priority" type="number" value={formData.priority} onChange={handleInputChange} required />
              <TextField name="status" label="Status" value={formData.status} onChange={handleInputChange} required />

              {/* Updated isNonChangeable field */}
              <TextField
                name="isNonChangeable"
                select
                label="Non-Changeable"
                value={formData.isNonChangeable}
                onChange={handleInputChange}
                SelectProps={{ native: true }}
                required
              >
                <option value="">Select</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SalesOrders;
