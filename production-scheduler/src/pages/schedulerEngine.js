// Core logic for AI-based dynamic scheduler

/**
 * Sample data structure references:
 * orders = [{ orderNo, itemCode, qty, deliveryDate, nonChangeable }]
 * machines = [{ machineId, operation, capacityPerHr }]
 * bom = [{ operation, component, qtyPerUnit, minBatchQty, hrsPerBatch }]
 * schedule = [{ operation, qty, timeRequired, start, end }]
 */

function getIdleMachineSuggestions(schedule, machines) {
  const idleSuggestions = [];

  machines.forEach(machine => {
    const relatedOps = schedule.filter(s => s.operation === machine.name); // Changed to match machine.name

    if (relatedOps.length === 0) {
      idleSuggestions.push({
        machineId: machine._id, // Changed to match API response
        operation: machine.name, // Changed to match API response
        reason: `${machine.name} machine is currently idle`,
        suggestion: 'Move lower priority tasks earlier here.',
        priority: 'Medium'
      });
    }
  });

  return idleSuggestions;
}

function getOverloadSuggestions(orders, schedule, machines) {
  const suggestions = [];

  schedule.forEach(entry => {
    const matchingMachine = machines.find(m => m.name === entry.operation); // Changed to match machine.name
    if (!matchingMachine || !matchingMachine.capacity) return; // Changed to match API response

    const hoursAvailable = 8;
    const daysRequired = entry.duration / matchingMachine.capacity; // Changed to match API response

    if (daysRequired > hoursAvailable) {
      suggestions.push({
        operation: entry.operation,
        machineId: matchingMachine._id, // Changed to match API response
        reason: `Overload: Requires ${Math.ceil(daysRequired)} hours vs ${hoursAvailable} available`,
        suggestion: 'Consider outsourcing or adding shifts.',
        priority: 'High'
      });
    }
  });

  return suggestions;
}

function getUrgentOrderSuggestions(orders) {
  const suggestions = [];
  
  orders.forEach(order => {
    if (order.deliveryDate) {
      const deliveryDate = new Date(order.deliveryDate);
      const today = new Date();
      const daysUntilDelivery = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilDelivery <= 3) {
        suggestions.push({
          operation: "Urgent Order",
          orderNo: order.orderId, // Changed to match API response
          reason: `Critical: Order due in ${daysUntilDelivery} days`,
          suggestion: "Immediate attention required",
          priority: "Critical"
        });
      } else if (daysUntilDelivery <= 7) {
        suggestions.push({
          operation: "Urgent Order",
          orderNo: order.orderId, // Changed to match API response
          reason: `Order due in ${daysUntilDelivery} days`,
          suggestion: "Consider expediting this order",
          priority: "High"
        });
      }
    }
  });

  return suggestions;
}

export function generateScheduleSuggestions(orders, bom, machines, schedule) {
  // Add detailed logging
  console.log('Raw data received:', {
    orders: orders?.length,
    machines: machines?.length,
    schedule: schedule?.length
  });

  // Validate input data
  if (!orders?.length || !machines?.length || !schedule?.length) {
    console.warn('Missing or empty input data');
    return { suggestions: [] };
  }

  const idleSlots = getIdleMachineSuggestions(schedule, machines);
  const overloads = getOverloadSuggestions(orders, schedule, machines);
  const urgentOrders = getUrgentOrderSuggestions(orders);

  console.log('Generated suggestions:', {
    idle: idleSlots.length,
    overload: overloads.length,
    urgent: urgentOrders.length
  });

  const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2 };
  const allSuggestions = [...idleSlots, ...overloads, ...urgentOrders]
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return {
    suggestions: allSuggestions
  };
}