// Imports
import { addEvents, handleSearch } from './src/utils';
import { createOrderItem } from './src/components/createOrderItem.js';
import { getTicketCategories } from './src/components/api/getTicketCategories.js';
import { removeLoader, addLoader } from './src/components/loader';
import { handleSort } from './src/components/helpers/sortingMechanism'
import './src/mocks/handlers';

export let allOrders = [];
export const categories = await getTicketCategories();

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
                    <button class="flex flex-1 text-center justify-center" id="sorting-button-1">
                        <span >Name</span>
                        <i class="fa-solid fa-arrow-up-wide-short text-xl" id="sorting-icon-1"></i>     
                    </button>
                    <span class="flex-1">Nr tickets</span>
                    <span class="flex-1">Category</span>
                    <span class="flex-1 hidden md:flex">Date</span>
                    <button class="flex text-center justify-center" id="sorting-button-2">
                        <span>Price</span>
                        <i class="fa-solid fa-arrow-up-wide-short text-xl" id="sorting-icon-2"></i>                  
                    </button>
                    <span class="w-28 sm:w-8"></span>
                </div>
                <div id="purchases-content">
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
      events = data;
      setTimeout(() => {
        removeLoader();
      }, 200);
      addEvents(events);
    });
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
  const sortingButtonByName =
              document.getElementById('sorting-button-1');
          sortingButtonByName.addEventListener(
              'click',
              () => {
                  handleSort('name');
                  
              }
          );

          const sortingButtonByPrice =
              document.getElementById('sorting-button-2');
          sortingButtonByPrice.addEventListener(
              'click',
              () => {
                  handleSort('price');
              }
          ); 
  const purchasesDiv = document.querySelector('.purchases');
  const puchasesContet = document.getElementById('purchases-content');
  puchasesContet.addEventListener("delete",(e)=>{
    allOrders=allOrders.filter(order=>order.id!==e.detail.id);
  })
  puchasesContet.addEventListener("update",(e)=>{
    allOrders = allOrders.map(element => {
      if (element.id === e.detail.order.id) {
        return e.detail.order;
      }
      return element;
    });
  })
  addLoader();
  if (purchasesDiv) {
    fetchOrders()
      .then((orders) => {
        if (orders.length > 0) {
          setTimeout(() => {
            removeLoader();
          }, 200);
          allOrders = [...orders];
          orders.forEach((order) => {
              const newOrder = createOrderItem(
                  categories,
                  order
              );
              puchasesContet.appendChild(newOrder);
          });
          purchasesDiv.appendChild(puchasesContet);
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
