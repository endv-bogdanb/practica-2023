import { createPurchasedItem } from '../createPurchesedItem';
import { useGetTicketCategories } from './use-get-ticket-categories';

const categories = await useGetTicketCategories();

export function useDeleteOrder(orderId) {
  fetch(`/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const divWrapper = document.querySelector('.purchases');
      divWrapper.innerHTML = '';
      data.forEach((order) => {
        const newOrder = createPurchasedItem(categories, order);
        divWrapper.appendChild(newOrder);
      });
      toastr.success('Success!');
    })
    .catch(() => {
      toastr.error('Error!');
    });
}
