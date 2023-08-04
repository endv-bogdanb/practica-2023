export function getTicketEvents(filters) {
  const queryParams = new URLSearchParams(filters).toString();
  const result = fetch(`/api/ticketEvents?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return [...data];
    });
  return result;
}
