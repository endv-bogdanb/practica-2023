// Imports
import { addEvents, handleSearch, addEventListenersForCheckboxes} from './src/utils';
import { createOrderItem } from './src/components/createOrderItem.js';
import { getTicketCategories } from './src/components/api/getTicketCategories.js';
import { removeLoader, addLoader } from './src/components/loader';
import { getTicketEvents } from './src/components/api/getTicketEvents.js';
import { createCheckboxesForEvents } from './src/components/createCheckboxesForEvents';

import './src/mocks/handlers';

let events = null;

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" class="hidden">
      <img src="./src/assets/Endava.png" alt="summer">
      <div class="flex flex-col items-center">
        <div class="w-80">
          <h1>Explore Events</h1>
          <div class="filters flex flex-col">
            <input type="text" id="filter-name" placeholder="Filter by name" class="px-4 mt-4 mb-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            <button id="filter-button" class="px-4 py-2 text-white filter-btn rounded-lg">Filter</button>
          </div>
        </div>
      </div>
      <div class="events flex items-center justify-center flex-wrap">
      </div>
      <div class="cart"></div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
      <div id="content" class="hidden">
        <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
        <div class="purchases ml-6 mr-6">
          <div class="bg-white px-4 py-3 gap-x-4 flex font-bold">
            <span class="flex-1">Name</span>
            <span class="flex-1 flex justify-end">Nr tickets</span>
            <span class="flex-1">Category</span>
            <span class="flex-1 hidden md:flex">Date</span>
            <span class="w-12 text-center hidden md:flex">Price</span>
            <span class="w-28 sm:w-8"></span>
          </div>
        </div>
      </div>
  `;
}

function liveSearch() {
  const filterInput = document.querySelector('#filter-name');

  if(filterInput) {
    const searchValue = filterInput.value;
    
    if(searchValue) {
      const filteredEvents = events.filter(event => event.name.toLowerCase().includes(searchValue.toLowerCase()));
    
      addEvents(filteredEvents);
    }
  }

}

function setupFilterEvents() {
  const nameFilterInput = document.querySelector('#filter-name');

  if(nameFilterInput) {
    const filterInterval = 500;

    nameFilterInput.addEventListener('keyup', () => {
      setTimeout(liveSearch, filterInterval);
    });
  }
}

function setupSearchEvents() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  const eventSection = document.querySelector('.events');

  
  if(searchForm) {
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim().toLowerCase();
      const resultsFound = await handleSearch(searchTerm);
      if (!resultsFound) {
        eventSection.innerHTML = 'No results found';
      }
    });
  }

  if(searchButton) {
    searchButton.addEventListener('click', () => {
      searchInput.classList.toggle('active');
    });
  }
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

async function fetchOrders() {
  const response = await fetch('/api/orders');
  const orders = await response.json();
  return orders;
}

async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  setupFilterEvents();
  setupSearchEvents();
  addLoader();
  const filters = {}; 
  try {
    const eventsData = await getTicketEvents(filters);
    events = Array.isArray(eventsData) ? eventsData : []; 

    setTimeout(() => {
      removeLoader();
    }, 200);

    createCheckboxesForEvents(events);
    addEventListenersForCheckboxes(events);
    addEvents(events, filters);
  } catch (error) {
    console.error('Error fetching events data:', error);
  }
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  const purchasesDiv = document.querySelector('.purchases');
  addLoader();

  if (purchasesDiv) {
    fetchOrders()
      .then((orders) => {
        if (orders.length > 0) {
          setTimeout(() => {
            removeLoader();
          }, 200);
          orders.forEach((order) => {
            const newOrder = createOrderItem(categories, order);
            purchasesDiv.appendChild(newOrder);
          });
        } else {
          removeLoader();
        }
      });
  }
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/practica-2023' || url === '/practica-2023/') {
    renderHomePage();
  } else if (url === '/practica-2023/orders') {
    getTicketCategories()
      .then((categories) => {
        renderOrdersPage(categories);
      })
      .catch((error) => {
        console.error('Error fetching ticket categories:', error);
      });
  }
}


// Call the setup functions
setupFilterEvents();
setupSearchEvents();
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
