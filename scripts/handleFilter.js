import { addEvents } from "./updateUI.js";

export const handleFilter = async () => {
  const description = document.querySelector("#filter-name").value.trim();

  const response = await fetch(`/api/ticketEvents?description=${description}`);

  /**@type {import("./mocks.js").TicketEvent[]} */
  const tickets = await response.json();

  addEvents(tickets);
};
