// Imports
import { addEvents, handleFilter, handleSearch } from './src/utils';
import { createOrderItem } from './src/components/createOrderItem.js';
import { getTicketCategories } from './src/components/api/getTicketCategories.js';
import { removeLoader, addLoader } from './src/components/loader';
import './src/mocks/handlers';

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
      <div class="filter-section">
          <div class="filter-icon" id="filterIcon">
            <button class="cursor-pointer">
              <i class="fa-solid fa-filter text-xl "></i>
            </button>
          </div>
          <div class="filters hidden">
            <form class="filter-form">
              <label for="filter-name" class="font-bold text-lg text-gray-700"></label>
              <input type="text" id="filter-name" placeholder="Filter by description" class="ml-2 w-full px-4 mt-4 mb-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              <button class="ml-2 px-4 py-2 text-white filer-btn rounded-lg" type="submit">Filter</button>
            </form>
            <img src="" alt="" />
          </div>
        </div>
      <h1>Explore events</h1>
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

function setupFilterEvents() {
  const filterIcon = document.querySelector('.filter-icon');
  const filterForm = document.querySelector('.filter-form');
  const filterWrapper = document.querySelector('.filters');
  const eventSection = document.querySelector('.events');

  if(filterIcon) {
    filterIcon.addEventListener('click', () => {
      filterWrapper.classList.toggle('hidden');
    });
  }

  if(filterForm) {
    filterForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const resultsFound = await handleFilter();

      if (!resultsFound) {
        eventSection.innerHTML = 'No results found';
      }
    });
  }
}

function setupSearchEvents() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  const eventSection = document.querySelector('.events');

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim().toLowerCase();
    const resultsFound = await handleSearch(searchTerm);
    if (!resultsFound) {
      eventSection.innerHTML = 'No results found';
    }
  });

  searchButton.addEventListener('click', () => {
    searchInput.classList.toggle('active');
  });
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

async function fetchTicketEvents() {
  const response = await fetch('/api/ticketEvents');
  const data = await response.json();
  return data;
}

async function fetchOrders() {
  const response = await fetch('/api/orders');
  const orders = await response.json();
  return orders;
}

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  setupFilterEvents();
  setupSearchEvents();
  addLoader();

  fetchTicketEvents()
    .then((data) => {
      setTimeout(() => {
        removeLoader();
      }, 200);
      addEvents(data);
    });
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

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
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
