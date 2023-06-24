import { createEvent } from "./components/createEvent";

/**
 *
 * @param {import("./mocks/database").TicketEvent} data
 */
export const addPurchase = (data) => {
  const purchasedEvents =
    JSON.parse(localStorage.getItem("purchasedEvents")) || [];
  purchasedEvents.push(data);
  localStorage.setItem("purchasedEvents", JSON.stringify(purchasedEvents));
};

/**
 *
 * @param {import("./mocks/database").TicketEvent[]} events
 */
export const addEvents = (events) => {
  const eventsDiv = document.querySelector(".events");
  eventsDiv.innerHTML = "";
  events.forEach((event) => {
    eventsDiv.appendChild(createEvent(event));
  });
};

/**
 *
 * @param {string} str
 * @returns {string}
 */
export const kebabCase = (str) => str.replaceAll(" ", "-");
