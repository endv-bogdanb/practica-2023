import { eventsList } from "./data.js";
import { addEvents } from "./updateUI.js";

export const handleFilter = () => {
    const query = document.querySelector('#filter-name').value.trim();
    if (query) {
        const eventsFiltered = eventsList.filter(event => event.title.toLowerCase().includes(query))
        addEvents(eventsFiltered);
    } else {
        addEvents(eventsList);
    }
}
