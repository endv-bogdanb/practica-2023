import { addLoader, removeLoader } from '../loader';

export function deleteOrder(orderId) {
  addLoader();

  fetch(`/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      removeLoader();
      const purchaseToBeRemoved = document.getElementById(`purchase-${data}`);
      purchaseToBeRemoved.remove();
      toastr.success('Success!');
    })
    .catch(() => {
      toastr.error('Error!');
    });
}
