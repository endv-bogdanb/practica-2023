export function usePutTicket(orderId, newType, newQuantity) {
  fetch(`/api/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventId: orderId,
      ticketType: newType,
      quantity: +newQuantity,
    }),
  }).then((res) => {
    if (res.status === 200) {
      // update UI
      toastr.success('Success!');
    } else {
      // Error message
      toastr.error('Error!');
      console.log('EROARE!!!');
    }
  });
}
