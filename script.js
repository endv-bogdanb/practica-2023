import './scripts/handleFilter.js';
import { eventsList } from "./scripts/data.js";
import { addEvents } from "./scripts/updateUI.js";
import { handleFilter } from './scripts/handleFilter.js';

const filterForm = document.querySelector('.filter-form');
const searchForm = document.querySelector('.search-form');
const cart = document.querySelector('.cart');

// export function test(event){
//     console.log("test here")
//     event.preventDefault()
// }

filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFilter()
})

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('search');
})

const testClick = () => {
    console.log('test')
}

addEvents(eventsList);