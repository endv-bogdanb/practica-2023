import { addPurchase, kebabCase } from '../utils';
import { addLoader, removeLoader } from './loader';
import { useStyle } from './styles';

// Create the event element based on event data
const createEventElement = (eventData, title) => {
  const { id, description, img, name, ticketCategories } = eventData;
  const eventDiv = document.createElement('div');
  const eventWrapperClasses = useStyle('eventWrapper');
  const actionsWrapperClasses = useStyle('actionsWrapper');
  const quantityClasses = useStyle('quantity');
  const inputClasses = useStyle('input');
  const quantityActionsClasses = useStyle('quantityActions');
  const increaseBtnClasses = useStyle('increaseBtn');
  const decreaseBtnClasses = useStyle('decreaseBtn');
  const addToCartBtnClasses = useStyle('addToCartBtn');

  // Set up event wrapper
  eventDiv.classList.add(...eventWrapperClasses);

  // Create the event content markup
  const contentMarkup = `
    <header>
        <h2 class="event-title text-2xl font-bold">${name}</h2>
    </header>
    <div class="content">
      <img src="${img}" alt="${name}" class="event-image w-full height-200 rounded object-cover mb-4">
      <p class="description text-gray-700">${description}</p>
    </div>
  `;
  eventDiv.innerHTML = contentMarkup;

  // Create ticket type selection and quantity input
  const actions = document.createElement('div');
  actions.classList.add(...actionsWrapperClasses);

  const categoriesOptions = ticketCategories.map(
    (ticketCategory) =>
      `<option value=${ticketCategory.id}>${ticketCategory.description}</option>`
  );

  const ticketTypeMarkup = `
    <h2 class="text-lg font-bold mb-2">Choose Ticket Type:</h2>
    <select id="ticketType" name="ticketType" class="select ${title}-ticket-type border border-gray-300 rounded py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      ${categoriesOptions.join('\n')}
    </select>
  `;
  actions.innerHTML = ticketTypeMarkup;

  const quantity = document.createElement('div');
  quantity.classList.add(...quantityClasses);

  const input = document.createElement('input');
  input.classList.add(...inputClasses);
  input.type = 'number';
  input.min = '0';
  input.value = '0';

  input.addEventListener('blur', () => {
    if (!input.value) {
      input.value = 0;
    }
  });

  input.addEventListener('input', () => {
    const currentQuantity = parseInt(input.value);
    if (currentQuantity > 0) {
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
  });

  quantity.appendChild(input);

  const quantityActions = document.createElement('div');
  quantityActions.classList.add(...quantityActionsClasses);

  const increase = document.createElement('button');
  increase.classList.add(...increaseBtnClasses);
  increase.innerText = '+';
  increase.addEventListener('click', () => {
    input.value = parseInt(input.value) + 1;
    const currentQuantity = parseInt(input.value);
    if (currentQuantity > 0) {
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
  });

  const decrease = document.createElement('button');
  decrease.classList.add(...decreaseBtnClasses);
  decrease.innerText = '-';
  decrease.addEventListener('click', () => {
    const currentValue = parseInt(input.value);
    if (currentValue > 0) {
      input.value = currentValue - 1;
    }
    const currentQuantity = parseInt(input.value);
    if (currentQuantity > 0) {
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

  // Create the event footer with "Add To Cart" button
  const eventFooter = document.createElement('footer');
  const addToCart = document.createElement('button');
  addToCart.classList.add(...addToCartBtnClasses);
  addToCart.innerText = 'Add To Cart';
  addToCart.disabled = true;

  addToCart.addEventListener('click', () => {
    handleAddToCart(title, id, input, addToCart);
  });
  eventFooter.appendChild(addToCart);
  eventDiv.appendChild(eventFooter);

  return eventDiv;
};

// Event handler for "Add To Cart" button click
const handleAddToCart = (title, id, input, addToCart) => {
  const ticketType = document.querySelector(`.${kebabCase(title)}-ticket-type`).value;
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
      })
      .finally(() => {
        removeLoader();
      });
  } else {
    // Handle the case when quantity is not a valid number
    // Maybe show an error message to the user
  }
};

// Main function to create the event element
export const createEvent = (eventData) => {
  const title = kebabCase(eventData.eventType.name);
  const eventElement = createEventElement(eventData, title);
  return eventElement;
};
