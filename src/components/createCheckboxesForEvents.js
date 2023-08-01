import { handleCheckboxFilter } from "../utils";

export function createCheckboxesForEvents(events) {
  const venueSet = new Set(events.map((event) => event.venue.location));
  const eventTypeSet = new Set(events.map((event) => event.eventType.name));
  const filtersContainer = document.querySelector('.filters');
	const allFiltersContainer = document.createElement('div');
  allFiltersContainer.classList.add('all-filters-container');
  const venueFilterDiv = document.createElement('div');
  venueFilterDiv.classList.add('filter-container');
  const venueTitle = document.createElement('h3');
  venueTitle.textContent = 'Filter by Venue:';
  venueFilterDiv.appendChild(venueTitle);
  filtersContainer.appendChild(venueFilterDiv);
  venueSet.forEach((venue) => {
		const checkboxContainer = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `filter-by-venue-${venue}`;
    checkbox.value = venue;
		checkbox.addEventListener('change', () => handleCheckboxFilter());
    const label = document.createElement('label');
    label.setAttribute('for', `filter-by-venue-${venue}`);
    label.textContent = venue;
		checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
		venueFilterDiv.appendChild(checkboxContainer);
  });

  const eventTypeFilterDiv = document.createElement('div');
  eventTypeFilterDiv.classList.add('filter-container');
  const eventTypeTitle = document.createElement('h3');
  eventTypeTitle.textContent = 'Filter by Event Type:';
  eventTypeFilterDiv.appendChild(eventTypeTitle);
  filtersContainer.appendChild(eventTypeFilterDiv);
  eventTypeSet.forEach((eventType) => {
		const checkboxContainer = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `filter-by-event-type-${eventType}`;
    checkbox.value = eventType;
		checkbox.addEventListener('change', () => handleCheckboxFilter());
    const label = document.createElement('label');
    label.setAttribute('for', `filter-by-event-type-${eventType}`);
    label.textContent = eventType;
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    eventTypeFilterDiv.appendChild(checkboxContainer);
  });


	allFiltersContainer.appendChild(venueFilterDiv);
	allFiltersContainer.appendChild(eventTypeFilterDiv);
  filtersContainer.appendChild(allFiltersContainer);

}

