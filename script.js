import "./scripts/mocks.js"
import './scripts/handleFilter.js';
import { addEvents } from "./scripts/updateUI.js";
import { handleFilter } from './scripts/handleFilter.js';

const filterForm = document.querySelector('.filter-form');
const searchForm = document.querySelector('.search-form');

filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFilter()
})

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('search');
})

fetch("/api/ticketEvents").then(response=> response.json()).then(addEvents)
