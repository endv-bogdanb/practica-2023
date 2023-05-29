import { addPurchase } from "./updateUI.js";

export const createEvent = ({description, img, title}) => {
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event');

    eventDiv.innerHTML = `
        <img src="${img}" alt="${title}" class="event-image">
        <p class="description">${description}</p>
    `;

    const actions = document.createElement('div');
    actions.classList.add('actions');

    actions.innerHTML = `
        <select id="type" name="type" class="${title}-ticket-type">
            <option value="standard">Standar</option>
            <option value="VIP">VIP</option>
        </select>
    `;

    const quantity = document.createElement('div');
    quantity.classList.add('quantity');

    const input = document.createElement('input');
    input.classList.add('input')
    input.type = 'number';
    input.min = '0';
    input.value = '0';

    input.addEventListener('blur', () => {
        if(!input.value) {
            input.value = 0;
        }
    });

    input.addEventListener('input', () => {
        if (parseInt(input.value)) {
            addToCart.disabled = false;
        } else {
            addToCart.disabled = true;
        }
    })

    quantity.appendChild(input)

    const quantityActions = document.createElement('div');
    quantityActions.classList.add('quantity-actions');

    const increase = document.createElement('button');
    increase.classList.add('increase');
    increase.innerText = '+';
    increase.addEventListener('click', () => {
        input.value = parseInt(input.value) + 1;
        if (parseInt(input.value)) {
            addToCart.disabled = false;
        } else {
            addToCart.disabled = true;
        }
    })

    const decrease = document.createElement('button');
    decrease.classList.add('decrease');
    decrease.innerText = '-';
    decrease.addEventListener('click', () => {
        const currentValue = parseInt(input.value);
        if (currentValue) {
            input.value = parseInt(input.value) - 1;
        }
        if (parseInt(input.value)) {
            addToCart.disabled = false;
        } else {
            addToCart.disabled = true;
        }
    })

    quantityActions.appendChild(increase);
    quantityActions.appendChild(decrease);

    
    quantity.appendChild(quantityActions)
    actions.appendChild(quantity);
    eventDiv.appendChild(actions);

    const addToCart = document.createElement('button');
    addToCart.classList.add('add-to-cart-btn');
    addToCart.innerText = 'Add To Cart';
    addToCart.disabled = true;

    addToCart.addEventListener('click', () => {
        const ticketType = document.querySelector(`.${title}-ticket-type`).value;
        const quantity = input.value;
        // here it will be a BE call
        // the function bellow will be called with the response
        if (parseInt(quantity)) {
            addPurchase({ticketType, title, quantity});
            input.value = 0;
            addToCart.disabled = true;
        } else {
            // maybe show some message
        }
    })

    eventDiv.appendChild(addToCart);

    return eventDiv;
}