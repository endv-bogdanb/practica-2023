import { addEvents } from "../../utils";

export const handleFilter = async () => {
  const descriptionInput = document.querySelector("#filter-name");
  const description = descriptionInput.value.trim().toLowerCase();

  const response = await fetch("/api/ticketEvents");
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
  } else {
    addEvents(tickets);
  }
};
