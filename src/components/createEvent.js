import { addPurchase, kebabCase } from '../utils';
import { addLoader, removeLoader } from './loader';

/**
 *
 * @param {import("../mocks/database").TicketEvent} param0
 * @returns {HTMLDivElement}
 */
export const createEvent = ({
    id,
    description,
    img,
    name,
    ticketCategories,
}) => {
    const eventDiv = document.createElement('div');

    const title = kebabCase(name);

    eventDiv.classList.add(
        'event',
        'bg-white',
        'rounded',
        'shadow-md',
        'p-4',
        'flex',
        'flex-col',
        'm-6',
        'mt-8',
        'width-400'
    );

    eventDiv.innerHTML = `
   <h2 class="event-title text-2xl font-bold">${name}</h2>
    <img src="${img}" alt="${name}" class="event-image w-full height-200 rounded object-cover mb-4">
    <p class="description text-gray-700">${description}</p>
  `;

    const actions = document.createElement('div');
    actions.classList.add('actions', 'flex', 'items-center', 'mt-4');

    const categoriesOptions = ticketCategories.map(
        (ticketCategory) =>
            `<option value=${ticketCategory.id}>${ticketCategory.description}</option>`
    );

    actions.innerHTML = `
    <h2 class="text-lg font-bold mb-2">Choose Ticket Type:</h2>
    <select id="ticketType" name="ticketType" class="select ${title}-ticket-type border border-gray-300 rounded py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      ${categoriesOptions.join('\n')}
    </select>
  `;

    const quantity = document.createElement('div');
    quantity.classList.add('quantity', 'flex', 'items-center', 'ml-4');

    const input = document.createElement('input');
    input.classList.add(
        'input',
        'w-16',
        'text-center',
        'border',
        'border-gray-300',
        'rounded',
        'py-2',
        'px-3',
        'text-gray-700',
        'focus:outline-none',
        'focus:shadow-outline'
    );
    input.type = 'number';
    input.min = '0';
    input.value = '0';

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.value = 0;
        }
    });

    input.addEventListener('input', () => {
        if (parseInt(input.value)) {
            addToCart.disabled = false;
        } else {
            addToCart.disabled = true;
        }
    });

    quantity.appendChild(input);

    const quantityActions = document.createElement('div');
    quantityActions.classList.add(
        'quantity-actions',
        'flex',
        'space-x-2',
        'ml-6'
    );

    const increase = document.createElement('button');
    increase.classList.add(
        'increase',
        'px-3',
        'py-1',
        'rounded',
        'add-btn',
        'text-white',
        'hover:bg-green-300',
        'focus:outline-none',
        'focus:shadow-outline'
    );
    increase.innerText = '+';
    increase.addEventListener('click', () => {
        input.value = parseInt(input.value) + 1;
        if (parseInt(input.value)) {
            addToCart.disabled = false;
        } else {
            addToCart.disabled = true;
        }
    });

    const decrease = document.createElement('button');
    decrease.classList.add(
        'decrease',
        'px-3',
        'py-1',
        'rounded',
        'bg-red-700',
        'text-white',
        'hover:bg-red-300',
        'focus:outline-none',
        'focus:shadow-outline'
    );
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
    });

    quantityActions.appendChild(increase);
    quantityActions.appendChild(decrease);

    quantity.appendChild(quantityActions);
    actions.appendChild(quantity);
    eventDiv.appendChild(actions);

    const addToCart = document.createElement('button');
    addToCart.classList.add(
        'add-to-cart-btn',
        'px-4',
        'py-2',
        'rounded',
        'text-white',
        'font-bold',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
        'mt-4',
        'focus:outline-none',
        'focus:shadow-outline'
    );
    addToCart.innerText = 'Add To Cart';
    addToCart.disabled = true;

    addToCart.addEventListener('click', () => {
        const ticketType = document.querySelector(
            `.${title}-ticket-type`
        ).value;
        const quantity = input.value;

        if (parseInt(quantity)) {
            addLoader();
            fetch('/api/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticketType: +ticketType,
                    eventId: id,
                    quantity: +quantity,
                }),
            })
            .then((response) => {
                return response.json().then((data) => {
                  if (!response.ok) {
                    throw new Error(data.message);
                  } 
      
                  return data;
                });
            })
            .then((data) => {
                addPurchase(data); // Call the updated addPurchase function
                input.value = 0;
                addToCart.disabled = true;
                toastr.success('Success!');
            })
            .catch((error) => {
                console.error('Error saving purchased event:', error);
                toastr.error('Error!');
            }).finally(() => {
                removeLoader();
            });
        } else {
            // Handle the case when quantity is not a valid number
            // Maybe show an error message to the user
        }
    });

    eventDiv.appendChild(addToCart);

    return eventDiv;
};
