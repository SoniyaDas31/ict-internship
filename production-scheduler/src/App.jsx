import { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Schedules from './pages/Schedules';
import Machines from './pages/Machines';
import SalesOrders from './pages/SalesOrders';
import BillOfMaterials from './pages/BillOfMaterials';
import ProductionPriority from './pages/ProductionPriority';
import Dashboard from './pages/Dashboard';
import SchedulerFetcher from './pages/SchedulerFetcher';
import AutoScheduler from './pages/AutoScheduler';
import ScheduleTable from './pages/ScheduleTable';
import Login from './pages/Login';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Navigation component
const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ background:'rgba(0, 0, 0, 0.8)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
          Production Scheduler
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/sales-orders">Orders</Button>
          <Button color="inherit" component={Link} to="/machines">Machines</Button>
          <Button color="inherit" component={Link} to="/auto-scheduling">Auto Scheduling</Button>
          <Button color="inherit" component={Link} to="/schedule-list">Schedules</Button>
          {localStorage.getItem('token') && (
            <Button 
              color="inherit" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/machines" element={
          <ProtectedRoute>
            <Machines />
          </ProtectedRoute>
        } />
        <Route path="/sales-orders" element={
          <ProtectedRoute>
            <SalesOrders />
          </ProtectedRoute>
        } />
        <Route path="/production-priority" element={
          <ProtectedRoute>
            <ProductionPriority />
          </ProtectedRoute>
        } />
        <Route path="/auto-scheduling" element={
          <ProtectedRoute>
            <AutoScheduler />
          </ProtectedRoute>
        } />
        <Route path="/schedule-list" element={
          <ProtectedRoute>
            <Schedules />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;

