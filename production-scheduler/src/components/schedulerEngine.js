// schedulerEngine.js

// Core logic for AI-based dynamic scheduler

/**
 * Sample data structure references:
 * orders = [{ orderNo, itemCode, qty, deliveryDate, nonChangeable }]
 * machines = [{ machineId, operation, capacityPerHr }]
 * bom = [{ operation, component, qtyPerUnit, minBatchQty, hrsPerBatch }]
 * schedule = [{ operation, qty, timeRequired, start, end }]
 */

function getIdleMachineSuggestions(schedule, machines) {
    // Find idle slots based on capacity and schedule gaps
    const idleSuggestions = [];
  
    machines.forEach(machine => {
      const relatedOps = schedule.filter(s => s.operation === machine.operation);
  
      if (relatedOps.length === 0) {
        idleSuggestions.push({
          machineId: machine.machineId,
          operation: machine.operation,
          reason: 'No tasks scheduled. Machine is idle.',
          suggestion: 'Move lower priority tasks earlier here.'
        });
      }
    });
  
    return idleSuggestions;
  }
  
  function getOverloadSuggestions(orders, schedule, machines) {
    // If load > capacity, suggest outsourcing or extra shifts
    const suggestions = [];
  
    schedule.forEach(entry => {
      const matchingMachine = machines.find(m => m.operation === entry.operation);
      if (!matchingMachine || !matchingMachine.capacityPerHr) return;
  
      const hoursAvailable = 8; // Assume 8 hrs per day
      const daysRequired = entry.timeRequired / matchingMachine.capacityPerHr;
  
      if (daysRequired > hoursAvailable) {
        suggestions.push({
          operation: entry.operation,
          reason: 'Overload on internal machine',
          suggestion: 'Consider outsourcing or adding shifts.'
        });
      }
    });
  
    return suggestions;
  }
  
  function generateScheduleSuggestions(orders, bom, machines, schedule) {
    const nonChangeableOrders = orders.filter(o => o.nonChangeable);
    const flexibleOrders = orders.filter(o => !o.nonChangeable);
  
    const idleSlots = getIdleMachineSuggestions(schedule, machines);
    const overloads = getOverloadSuggestions(orders, schedule, machines);
  
    return {
      nonChangeableOrders,
      suggestions: [
        ...idleSlots,
        ...overloads,
        // More suggestion types can be added here
      ]
    };
  }
  
  // Exported for use in UI or backend
  module.exports = {
    generateScheduleSuggestions
  };
  