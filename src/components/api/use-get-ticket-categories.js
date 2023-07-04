export function useGetTicketCategories() {
  const result = fetch(`/api/ticketCategory`, {
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
