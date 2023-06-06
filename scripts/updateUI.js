import { createEvent } from "./createEvent.js";
import { createPurchaseItem } from "./createPurchedItem.js";

/**
 *
 * @param {import("./mocks.js").TicketEvent} data
 */
export const addPurchase = (data) => {
  const purchases = document.querySelector(".purchases");
  const newPurchase = createPurchaseItem(data);

  purchases.appendChild(newPurchase);
};

/**
 *
 * @param {import("./mocks.js").TicketEvent[]} events
 */
export const addEvents = (events) => {
  const eventsDiv = document.querySelector(".events");
  eventsDiv.innerHTML = "";
  events.forEach((event) => {
    eventsDiv.appendChild(createEvent(event));
  });
};
