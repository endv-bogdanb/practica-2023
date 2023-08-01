import { createEvent } from './components/createEvent';
import { getTicketEvents } from './components/api/getTicketEvents';

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
  eventsDiv.innerHTML = 'No events available';

  if (events.length) {
    eventsDiv.innerHTML = '';
    events.forEach((event) => {
      eventsDiv.appendChild(createEvent(event));
    });
  }
};


export function filterEvents(events, filters) {
  const { venue, eventType } = filters;

  if (!venue.length && !eventType.length) {
    return events;
  }
  let filteredEvents = events;
  if (venue.length) {
    filteredEvents = filteredEvents.filter((event) =>
      venue.includes(event.venue.id.toString())
    );
  }

  if (eventType.length) {
    filteredEvents = filteredEvents.filter((event) =>
      eventType.includes(event.eventType.id.toString())
    );
  }
  return filteredEvents;
}

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

export async function handleCheckboxFilter(events) {
  const filters = getFilters();
  try {
    const filteredData = await getTicketEvents(filters);
    addEvents(filteredData);
  } catch (error) {
    console.error('Error fetching filtered events:', error);
  }
}


export function addEventListenersForCheckboxes(events) {
  const venueCheckboxes = document.querySelectorAll('[id^="filter-by-venue"]');
  venueCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => handleCheckboxFilter(events));
  });

  const eventTypeCheckboxes = document.querySelectorAll('[id^="filter-by-event-type"]');
  eventTypeCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => handleCheckboxFilter(events));
  });
  handleCheckboxFilter(events);
}


export function getFilters() {
  const venueFilters = Array.from(document.querySelectorAll('[id^="filter-by-venue"]'))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const eventTypeFilters = Array.from(document.querySelectorAll('[id^="filter-by-event-type"]'))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  return {
    venue: venueFilters,
    eventType: eventTypeFilters,
  };
}



