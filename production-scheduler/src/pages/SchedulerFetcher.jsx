// SchedulerFetcher.jsx
import React, { useEffect, useState } from 'react';
import SchedulerUI from './schedulerui';
import { generateScheduleSuggestions } from './schedulerEngine';  // Add this import

const SchedulerFetcher = () => {
  const [suggestionsData, setSuggestionsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, machinesRes, scheduleRes] = await Promise.all([
          fetch('https://kera-internship.onrender.com/order'),
          fetch('https://kera-internship.onrender.com/machine'),
          fetch('https://kera-internship.onrender.com/schedule')
        ]);

        const ordersRaw = await ordersRes.json();
        const machinesRaw = await machinesRes.json();
        const scheduleRaw = await scheduleRes.json();

        console.log('Raw Order:', ordersRaw);
        console.log('Raw Machines:', machinesRaw);
        console.log('Raw Schedule:', scheduleRaw);

        const orders = ordersRaw.map(order => ({
          orderNo: order.orderId,
          itemCode: order.item,
          qty: order.quantity,
          deliveryDate: order.deliveryDate,
          nonChangeable: order.fixed === true,
          orderNumber: order.orderId,
          machines: order.machines ? order.machines.join(', ') : '-'
        }));

        const machines = machinesRaw.map(m => ({
          machineId: m._id,
          operation: m.name,
          capacityPerHr: m.capacity || 1
        }));

        const schedule = scheduleRaw.map(s => ({
          operation: s.operation,
          qty: s.quantity,
          timeRequired: s.duration,
          start: s.start_time,
          end: s.end_time
        }));

        console.log('Transformed Orders:', orders);
        console.log('Transformed Machines:', machines);
        console.log('Transformed Schedule:', schedule);

        // Static BOM example for now, can be pulled from API later
        const bom = [
          { operation: 'COMPOUND MIXING', component: 'COMPOUND', qtyPerUnit: 2000 / 200, minBatchQty: 35, hrsPerBatch: 0.75 },
          { operation: 'TUFTING', component: 'COMPOUND', qtyPerUnit: 1, minBatchQty: 1, hrsPerBatch: 0.5 },
        ];

        // Replace require with the imported function
        const suggestions = generateScheduleSuggestions(orders, bom, machines, schedule);
        // Add this console log before setting the state
        console.log('Generated Suggestions:', suggestions);
        setSuggestionsData(suggestions);
      } catch (error) {
        console.error('Failed to fetch scheduling data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Production Schedule Suggestions</h1>
      {suggestionsData ? (
        <SchedulerUI suggestionsData={suggestionsData} />
      ) : (
        <p>Loading suggestions...</p>
      )}
    </div>
  );
};

export default SchedulerFetcher;
