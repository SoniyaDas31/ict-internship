export function generateScheduleSuggestions(orders, bom, machines, schedule) {
  console.log('Generating suggestions with:', { orders, bom, machines, schedule });
  
  const suggestions = {
    suggestions: []
  };

  // Check for machine utilization
  machines.forEach(machine => {
    const machineSchedules = schedule.filter(s => s.operation === machine.operation);
    if (machineSchedules.length === 0) {
      suggestions.suggestions.push({
        operation: machine.operation,
        machineId: machine.machineId,
        reason: `${machine.operation} machine is currently idle`,
        suggestion: "Consider assigning work to this machine"
      });
    }
  });

  // Check for urgent orders
  orders.forEach(order => {
    if (order.deliveryDate) {
      const deliveryDate = new Date(order.deliveryDate);
      const today = new Date();
      const daysUntilDelivery = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilDelivery <= 7) {
        suggestions.suggestions.push({
          operation: "Urgent Order",
          orderNo: order.orderNo,
          machineId: order.machines,
          reason: `Order due in ${daysUntilDelivery} days`,
          suggestion: "Prioritize this order in the schedule"
        });
      }
    }
  });

  console.log('Generated suggestions:', suggestions);
  return suggestions;
}