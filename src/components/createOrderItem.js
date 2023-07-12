import { kebabCase } from '../utils';
import { updateOrder } from './api/updateOrder.js';
import { deleteOrder } from './api/deleteOrder.js';
import { useStyle } from './styles';
import { addLoader, removeLoader } from './loader';

export const createOrderItem = (categories, order) => {
  const purchase = document.createElement('div');
  purchase.id = `purchase-${order.id}`;
  purchase.classList.add(...useStyle('purchase'));
  const purchaseTitle = createParagraph(...useStyle('purchaseTitle'));
  purchaseTitle.innerText = kebabCase(order.event.name);
  purchase.appendChild(purchaseTitle);

  const purchaseQuantity = createInput(...useStyle('purchaseQuantity'));
  purchaseQuantity.type = 'number';
  purchaseQuantity.min = '1';
  purchaseQuantity.value = `${order.tickets.length}`;
  purchaseQuantity.disabled = true;

  const purchaseQuantityWrapper = createDiv(...useStyle('purchaseQuantityWrapper'));
  purchaseQuantityWrapper.append(purchaseQuantity);
  purchase.appendChild(purchaseQuantityWrapper);

  const purchaseType = createSelect(...useStyle('purchaseType'));
  purchaseType.setAttribute('disabled', 'true');

  const categoriesOptions = categories.map(
    (ticketCategory) =>
      `<option class="text-sm font-bold text-black" value=${ticketCategory.id} ${
        ticketCategory.id === order.tickets[0].ticketCategory.id ? 'selected' : ''
      }>${ticketCategory.description}</option>`
  ).join('\n');

  purchaseType.innerHTML = categoriesOptions;
  const purchaseTypeWrapper = createDiv(...useStyle('purchaseTypeWrapper'));
  purchaseTypeWrapper.append(purchaseType);
  purchase.appendChild(purchaseTypeWrapper);
  const purchaseDate = createDiv(...useStyle('purchaseDate'));
  purchaseDate.innerText = new Date(order.orderDate).toLocaleDateString();
  purchase.appendChild(purchaseDate);
  const purchasePrice = createDiv(...useStyle('purchasePrice'));
  purchasePrice.innerText = order.totalPrice;
  purchase.appendChild(purchasePrice);
  const actions = createDiv(...useStyle('actions'));

  const editButton = createButton([...useStyle(['actionButton', 'editButton'])], '<i class="fa-solid fa-pencil"></i>', editHandler);
  actions.appendChild(editButton);

  const saveButton = createButton([...useStyle(['actionButton', 'hiddenButton', 'saveButton'])], '<i class="fa-solid fa-check"></i>', saveHandler);
  actions.appendChild(saveButton);

  const cancelButton = createButton([...useStyle(['actionButton', 'hiddenButton', 'cancelButton'])], '<i class="fa-solid fa-xmark"></i>', cancelHandler);
  actions.appendChild(cancelButton);

  const deleteButton = createButton([...useStyle(['actionButton', 'deleteButton'])], '<i class="fa-solid fa-trash-can"></i>', deleteHandler);
  actions.appendChild(deleteButton);

  purchase.appendChild(actions);

  function createDiv(...classes) {
    const div = document.createElement('div');
    div.classList.add(...classes);
    return div;
  }

  function createParagraph(...classes) {
    const p = document.createElement('p');
    p.classList.add(...classes);
    return p;
  }

  function createInput(...classes) {
    const input = document.createElement('input');
    input.classList.add(...classes);
    return input;
  }

  function createSelect(...classes) {
    const select = document.createElement('select');
    select.classList.add(...classes);
    return select;
  }

  function createButton(classes, innerHTML, handler) {
    const button = document.createElement('button');
    button.classList.add(...classes);
    button.innerHTML = innerHTML;
    button.addEventListener('click', handler);
    return button;
  }

  function editHandler() {
    if (saveButton.classList.contains('hidden') && cancelButton.classList.contains('hidden')) {
      editButton.classList.add('hidden');
      saveButton.classList.remove('hidden');
      cancelButton.classList.remove('hidden');
      purchaseType.removeAttribute('disabled');
      purchaseQuantity.removeAttribute('disabled');
    }
  }

  function saveHandler() {
    const newType = purchaseType.value;
    const newQuantity = purchaseQuantity.value;
    if (newType != order.tickets[0].ticketCategory.id || newQuantity != order.tickets.length) {
      addLoader();
      updateOrder(order.id, newType, newQuantity)
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              order = data;
              purchasePrice.innerText = order.totalPrice;
              purchaseDate.innerText = new Date(order.orderDate).toLocaleDateString();
            });
          }
        })
        .finally(() => {
          setTimeout(() => {
            removeLoader();
          }, 200);
        });
    }

    saveButton.classList.add('hidden');
    cancelButton.classList.add('hidden');
    editButton.classList.remove('hidden');
    purchaseType.setAttribute('disabled', 'true');
    purchaseQuantity.setAttribute('disabled', 'true');
  }

  function cancelHandler() {
    saveButton.classList.add('hidden');
    cancelButton.classList.add('hidden');
    editButton.classList.remove('hidden');
    Array.from(purchaseType.options).forEach(function (element, index) {
      if (element.value == order.tickets[0].ticketCategory.id) {
        purchaseType.options.selectedIndex = index;
        return;
      }
    });
    purchaseQuantity.value = order.tickets.length;
    purchaseType.setAttribute('disabled', 'true');
    purchaseQuantity.setAttribute('disabled', 'true');
  }

  function deleteHandler() {
    deleteOrder(order.id);
  }

  return purchase;
};
