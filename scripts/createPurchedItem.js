export const createPurchaseItem = ({ticketType, title, quantity}) => {
    const purchase = document.createElement('div');
    purchase.classList.add('purchase');

    const purchaseTitle = document.createElement('p');
    purchaseTitle.classList.add('purchase-title');
    purchaseTitle.innerText = title;

    purchase.appendChild(purchaseTitle);

    const purchaseQuantity = document.createElement('div');
    purchaseQuantity.classList.add('purchase-quantity');
    purchaseQuantity.innerText = `${quantity} x`;

    const purchaseType = document.createElement('div');
    purchaseType.classList.add('purchase-type');
    purchaseType.innerText = `${ticketType}`;

    purchaseQuantity.appendChild(purchaseType);
    purchase.appendChild(purchaseQuantity);

    const actions = document.createElement('div');
    actions.classList.add('purchase-actions');

    const edit = document.createElement('button');
    edit.classList.add('purchase-edit-btn');
    edit.innerText = 'Edit';
    edit.addEventListener('click', () => {
        save.classList.remove('hide');
        cancel.classList.remove('hide');
        edit.classList.add('hide');
        purchaseType.innerHTML = `
        <select id="type" name="type" class="${title}-ticket-type-purchase">
            <option value="standard" ${'standard' === ticketType && 'selected'}>Standar</option>
            <option value="VIP" ${'VIP' === ticketType && 'selected'}>VIP</option>
        </select>
        `
    })

    const save = document.createElement('button');
    save.classList.add('purchase-save-btn', 'hide');
    save.innerText = 'Save';
    save.addEventListener('click', () => {
        // do some api call here and wait for response first
        save.classList.add('hide');
        cancel.classList.add('hide');
        edit.classList.remove('hide');
        // the line bellow have to be updated by API response
        purchaseType.innerText = `${document.querySelector(`.${title}-ticket-type-purchase`).value}`;
    })

    const cancel = document.createElement('button');
    cancel.classList.add('purchase-cancel-btn', 'hide');
    cancel.innerText = 'Cancel';
    cancel.addEventListener('click', () => {
        save.classList.add('hide');
        cancel.classList.add('hide');
        edit.classList.remove('hide');
        purchaseType.innerText = `${ticketType}`;
    })

    actions.appendChild(edit);
    actions.appendChild(save);
    actions.appendChild(cancel);
    purchase.appendChild(actions);

    return purchase;
}