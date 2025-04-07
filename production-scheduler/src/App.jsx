import { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Schedules from './pages/Schedules';
import Machines from './pages/Machines';
import SalesOrders from './pages/SalesOrders';
import BillOfMaterials from './pages/BillOfMaterials';
import ProductionPriority from './pages/ProductionPriority';
import Dashboard from './pages/Dashboard';
import SchedulerFetcher from './pages/SchedulerFetcher';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <AppBar position="fixed" sx={{ background:'rgba(0, 0, 0, 0.8)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
            Production Scheduler
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/sales-orders"> Orders</Button>
            <Button color="inherit" component={Link} to="/machines">Machines</Button>
            <Button color="inherit" component={Link} to="/schedules">Schedules</Button>
            {/* <Button color="inherit" component={Link} to="/production-priority">Production Priority</Button> */}
            <Button color="inherit" component={Link} to="/scheduler">Scheduler Analytics</Button>
           
            {/* <Button color="inherit" component={Link} to="/bom">BOM</Button> */}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Routes>
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/sales-orders" element={<SalesOrders />} />
        <Route path="/bom" element={<BillOfMaterials />} />
        <Route path="/production-priority" element={<ProductionPriority />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/scheduler" element={<SchedulerFetcher />} />
      </Routes>
    </Router>
  );
}

export default App

