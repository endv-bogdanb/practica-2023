import { createEvent } from './components/createEvent';

/**
 *
 * @param {import("./mocks/database").TicketEvent} data
 */
export const addPurchase = (data) => {
  const purchasedEvents =
    JSON.parse(localStorage.getItem('purchasedEvents')) || [];
  purchasedEvents.push(data);
  localStorage.setItem('purchasedEvents', JSON.stringify(purchasedEvents));
};

/**
 *
 * @param {import("./mocks/database").TicketEvent[]} events
 */
export const addEvents = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = '';
  events.forEach((event) => {
    eventsDiv.appendChild(createEvent(event));
  });
};

/**
 *
 * @param {string} str
 * @returns {string}
 */
export const kebabCase = (str) => str.replaceAll(' ', '-');
/**
 *
 * @param {string} searchTerm
 */
export const handleSearch = async (searchTerm) => {
  const response = await fetch('/api/ticketEvents');
  /**
   * @type {import("../../mocks/database").TicketEvent[]}
   */
  const tickets = await response.json();

  const filteredTickets = tickets.filter((ticket) => {
    return (
      ticket.name.toLowerCase().includes(searchTerm) ||
      ticket.description.toLowerCase().includes(searchTerm)
    );
  });

  addEvents(filteredTickets);

  return filteredTickets.length > 0;
};

export const handleFilter = async () => {
  const descriptionInput = document.querySelector('#filter-name');
  const description = descriptionInput.value.trim().toLowerCase();

  const response = await fetch('/api/ticketEvents');
  /**
   * @type {import("../../mocks/database").TicketEvent[]}
   */
  const tickets = await response.json();

  if (description) {
    const filteredTickets = tickets.filter((ticket) => {
      const ticketDescription = ticket.description.toLowerCase();
      return ticketDescription.includes(description);
    });

    addEvents(filteredTickets);

    return filteredTickets.length > 0;
  } else {
    addEvents(tickets);

    return true;
  }
};
