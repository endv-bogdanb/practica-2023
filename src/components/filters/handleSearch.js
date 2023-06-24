import { addEvents } from "../../utils";

/**
 * 
 * @param {string} searchTerm 
 */
export const handleSearch = async (searchTerm) => {
  const response = await fetch("/api/ticketEvents");
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
};
