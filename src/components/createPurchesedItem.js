import { kebabCase } from '../utils';
import { usePutTicket } from './api/use-put-ticket';
import { useDeleteOrder } from './api/use-delete-order';
/**
 *
 * @param {import("../mocks/database").Order} order
 * @returns
 */
export const createPurchasedItem = (categories, order) => {
  const purchase = document.createElement('div');
  const title = kebabCase(order.event.name);

  purchase.classList.add(
    'bg-white',
    'px-4',
    'py-3',
    'sm:grid',
    'sm:grid-cols-3',
    'sm:gap-4',
    'sm:items-start',
    'sm:border-b',
    'sm:border-gray-200'
  );
  const purchaseTitle = document.createElement('p');
  purchaseTitle.classList.add(
    'text-lg',
    'font-medium',
    'text-gray-900',
    'sm:col-span-2'
  );
  purchaseTitle.innerText = title;

  purchase.appendChild(purchaseTitle);

  const purchaseQuantity = document.createElement('input');
  purchaseQuantity.classList.add(
    'w-[50px]',
    'text-center',
    'py-1',
    'px-2',
    'border',
    'border-emerald-500',
    'border-2',
    'disabled:border-gray-700',
    'rounded',
    'text-emerald-500',
    'text-sm',
    'leading-tight',
    'font-bold',
    'disabled:text-gray-700',
    'focus:outline-none',
    'focus:shadow-outline'
  );
  purchaseQuantity.type = 'number';
  purchaseQuantity.min = '0';
  purchaseQuantity.value = `${order.tickets.length}`;
  purchaseQuantity.disabled = true;

  const purchaseQuantityWrapper = document.createElement('div');

  purchaseQuantityWrapper.classList.add('flex', 'flex-row', 'justify-end');
  purchaseQuantityWrapper.append(purchaseQuantity);
  purchase.appendChild(purchaseQuantityWrapper);

  const purchaseType = document.createElement('select');
  purchaseType.classList.add(
    'w-fit',
    'py-1',
    'px-2',
    'border',
    'border-emerald-500',
    'border-2',
    'disabled:border-gray-700',
    'rounded',
    'leading-tight',
    'focus:outline-none',
    'focus:shadow-outline',
    'text-sm',
    'font-bold',
    'text-emerald-500',
    'sm:col-span-2',
    'disabled:text-gray-700'
  );

  const categoriesOptions = categories.map(
    (ticketCategory) =>
      `<option class="text-sm font-bold text-black" value=${
        ticketCategory.id
      } ${
        ticketCategory.id === order.tickets[0].ticketCategory.id
          ? 'selected'
          : ''
      }>${ticketCategory.description}</option>`
  );

  purchaseType.setAttribute('disabled', 'true');
  purchaseType.innerHTML = `
    ${categoriesOptions.join('\n')}
  `;

  purchase.appendChild(purchaseType);

  const actions = document.createElement('div');
  actions.classList.add('mt-4', 'sm:mt-0', 'sm:col-start-3', 'sm:text-right');

  const edit = document.createElement('button');
  edit.classList.add(
    'text-sm',
    'font-medium',
    'text-blue-600',
    'underline',
    'hover:text-blue-500'
  );
  edit.innerText = 'Edit';
  edit.addEventListener('click', editHandler);
  function editHandler() {
    if (
      save.classList.contains('hidden') &&
      cancel.classList.contains('hidden')
    ) {
      //we want to make edit action => show SAVE and CANCEL
      edit.classList.add('hidden');
      save.classList.remove('hidden');
      cancel.classList.remove('hidden');
      purchaseType.removeAttribute('disabled');
      purchaseQuantity.removeAttribute('disabled');
    }
  }

  const save = document.createElement('button');
  save.classList.add(
    'ml-2',
    'text-sm',
    'font-medium',
    'text-gray-500',
    'underline',
    'hover:text-gray-400',
    'hidden'
  );
  save.innerText = 'Save';
  save.addEventListener('click', saveHandler);
  function saveHandler() {
    // get values to use for update
    const newType = purchaseType.value;
    const newQuantity = purchaseQuantity.value;
    order.tickets;
    usePutTicket(order.id, newType, newQuantity);
  }

  const cancel = document.createElement('button');
  cancel.classList.add(
    'ml-2',
    'text-sm',
    'font-medium',
    'text-gray-500',
    'underline',
    'hover:text-gray-400',
    'hidden'
  );
  cancel.innerText = 'Cancel';
  cancel.addEventListener('click', cancelHandler);
  function cancelHandler() {
    save.classList.add('hidden');
    cancel.classList.add('hidden');
    edit.classList.remove('hidden');
    // purchaseType.value = order.tickets[0].ticketCategory.description;
    purchaseQuantity.value = order.tickets.length;
    purchaseType.setAttribute('disabled', 'true'); // remember to restore to initial value!!!
    purchaseQuantity.setAttribute('disabled', 'true'); // remember to restore to initial value!!!
  }
  // Add event listener and functionality for the cancel button

  const deleteEvent = document.createElement('button');
  deleteEvent.classList.add(
    'ml-2',
    'text-sm',
    'font-medium',
    'text-red-600',
    'underline',
    'hover:text-red-500'
  );
  deleteEvent.innerText = 'Delete';

  // Add event listener and functionality for the delete button
  deleteEvent.addEventListener('click', () => {
    useDeleteOrder(order.id);
  });

  actions.appendChild(edit);
  actions.appendChild(save);
  actions.appendChild(cancel);
  actions.appendChild(deleteEvent);
  purchase.appendChild(actions);

  return purchase;
};
