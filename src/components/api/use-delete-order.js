export function useDeleteOrder(orderId) {
  fetch(`/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const purchaseToBeRemoved = document.getElementById(`purchase-${data}`);
      purchaseToBeRemoved.remove();
      toastr.success('Success!');
    })
    .catch(() => {
      toastr.error('Error!');
    });
}
