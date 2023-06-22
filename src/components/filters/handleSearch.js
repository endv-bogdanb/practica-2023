import { addEvents } from "../../utils";

export const handleSearch = async (searchTerm) => {
  const response = await fetch("/api/ticketEvents");
  const tickets = await response.json();

  const filteredTickets = tickets.filter((ticket) => {
    return (
      ticket.title.toLowerCase().includes(searchTerm) ||
      ticket.description.toLowerCase().includes(searchTerm)
    );
  });

  addEvents(filteredTickets);
};
