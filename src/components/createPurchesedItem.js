import { kebabCase } from '../utils';
import { usePutTicket } from './api/use-put-ticket';
import { useDeleteOrder } from './api/use-delete-order';
import { useStyle } from './styles';
import { addLoader, removeLoader } from './loader';
/**
 *
 * @param {import("../mocks/database").Order} order
 * @returns
 */
export const createPurchasedItem = (categories, order) => {
    const purchase = document.createElement('div');
    purchase.id = `purchase-${order.id}`;
    purchase.classList.add(...useStyle('purchase'));

    const purchaseTitle = document.createElement('p');
    const title = kebabCase(order.event.name);
    purchaseTitle.classList.add(...useStyle('purchaseTitle'));
    purchaseTitle.innerText = title;

    purchase.appendChild(purchaseTitle);

    const purchaseQuantity = document.createElement('input');
    purchaseQuantity.classList.add(...useStyle('purchaseQuantity'));
    purchaseQuantity.type = 'number';
    purchaseQuantity.min = '1';
    purchaseQuantity.value = `${order.tickets.length}`;
    purchaseQuantity.disabled = true;

    const purchaseQuantityWrapper = document.createElement('div');

    purchaseQuantityWrapper.classList.add(
        ...useStyle('purchaseQuantityWrapper')
    );
    purchaseQuantityWrapper.append(purchaseQuantity);
    purchase.appendChild(purchaseQuantityWrapper);

    const purchaseType = document.createElement('select');
    purchaseType.classList.add(...useStyle('purchaseType'));

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
  
  const purchaseTypeWrapper = document.createElement('div');
  purchaseTypeWrapper.classList.add(...useStyle('purchaseTypeWrapper'));
  purchaseTypeWrapper.append(purchaseType);

  purchase.appendChild(purchaseTypeWrapper);

  const purchaseDate = document.createElement('div');
  purchaseDate.classList.add(...useStyle('purchaseDate'));
  purchaseDate.innerText = new Date(order.orderDate).toLocaleDateString();;
  
  purchase.appendChild(purchaseDate);


  const purchasePrice = document.createElement('div');
  purchasePrice.classList.add(...useStyle('purchasePrice'));
  purchasePrice.innerText = order.totalPrice;
  
  purchase.appendChild(purchasePrice);


    const actions = document.createElement('div');
    actions.classList.add(...useStyle('actions'));

    const editButton = document.createElement('button');
    editButton.classList.add(...useStyle(['actionButton', 'editButton']));
    editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`;

    editButton.addEventListener('click', editHandler);
    function editHandler() {
        if (
            saveButton.classList.contains('hidden') &&
            cancelButton.classList.contains('hidden')
        ) {
            //we want to make edit action => show SAVE and CANCEL
            editButton.classList.add('hidden');
            saveButton.classList.remove('hidden');
            cancelButton.classList.remove('hidden');
            purchaseType.removeAttribute('disabled');
            purchaseQuantity.removeAttribute('disabled');
        }
    }

    const saveButton = document.createElement('button');
    saveButton.classList.add(
        ...useStyle(['actionButton', 'hiddenButton', 'saveButton'])
    );
    saveButton.classList.a;
    saveButton.innerHTML = `<i class="fa-solid fa-check"></i>`;

    saveButton.addEventListener('click', saveHandler);
    function saveHandler() {
        const newType = purchaseType.value;
        const newQuantity = purchaseQuantity.value;
        if (newType != order.tickets[0].ticketCategory.id || newQuantity != order.tickets.length) {
            addLoader();
            usePutTicket(order.id, newType, newQuantity).then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        order = data;
                        purchasePrice.innerText = order.totalPrice;
                        purchaseDate.innerText = new Date(order.orderDate).toLocaleDateString();
                    })
                }
            }).finally(() => {
                setTimeout(() => {
                    removeLoader();
                }, 200);
            });;
        }

        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');
        editButton.classList.remove('hidden');
        purchaseType.setAttribute('disabled', 'true');
        purchaseQuantity.setAttribute('disabled', 'true');
    }

    const cancelButton = document.createElement('button');
    cancelButton.classList.add(
        ...useStyle(['actionButton', 'hiddenButton', 'cancelButton'])
    );
    cancelButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;

    cancelButton.addEventListener('click', cancelHandler);
    function cancelHandler() {
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');
        editButton.classList.remove('hidden');
        Array.from(purchaseType.options).forEach(function(element, index) { // reset purchaseType to initial value
            if (element.value == order.tickets[0].ticketCategory.id) {
                purchaseType.options.selectedIndex = index;
                return;
            }
        });
        purchaseQuantity.value = order.tickets.length;
        purchaseType.setAttribute('disabled', 'true'); // remember to restore to initial value!!!
        purchaseQuantity.setAttribute('disabled', 'true'); // remember to restore to initial value!!!
    }

    const deleteButton = document.createElement('button');
    deleteButton.classList.add(...useStyle(['actionButton', 'deleteButton']));
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    deleteButton.addEventListener('click', deleteHandler);
    function deleteHandler() {
        useDeleteOrder(order.id); //api call to delete order
    }
    actions.appendChild(editButton);
    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);
    actions.appendChild(deleteButton);
    purchase.appendChild(actions);

    return purchase;
};
