import './src/mocks/handlers';
import { addEvents } from './src/utils';
import { handleFilter } from './src/components/filters/handleFilter';
import { handleSearch } from './src/components/filters/handleSearch';
import { createPurchasedItem } from './src/components/createPurchesedItem';
import { useGetTicketCategories } from '/src/components/api/use-get-ticket-categories';
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const href = link.getAttribute('href');
    navigateTo(href);
  });
});
const categories = await useGetTicketCategories();
// Handle navigation
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}

function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');

  if (url === '/') {
    mainContentDiv.innerHTML = `
    <img src="./src/assets/cover.png" alt="summer">
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
    <div class="events flex items-center justify-center flex-wrap ">
    </div>
    <div class="cart"></div>
  `;
    const filterIcon = document.querySelector('.filter-icon');
    const filterForm = document.querySelector('.filter-form');
    const filterWrapper = document.querySelector('.filters');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    filterIcon.addEventListener('click', () => {
      filterWrapper.classList.toggle('hidden');
    });

    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFilter();
    });

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim().toLowerCase();
      handleSearch(searchTerm);
    });

    searchButton.addEventListener('click', () => {
      searchInput.classList.toggle('active');
    });

    fetch('/api/ticketEvents')
      .then((response) => response.json())
      .then((data) => {
        addEvents(data);
      });
  } else if (url === '/orders') {
    mainContentDiv.innerHTML = `
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    <div class="purchases"></div>
    `;
    const purchasesDiv = document.querySelector('.purchases');

    if (purchasesDiv) {
      fetch('/api/orders')
        .then((r) => r.json())
        .then(
          (
            /**
             * @type {import("./src/mocks/database").Order[]}
             */
            orders
          ) => {
            if (orders.length > 0) {
              orders.forEach((order) => {
                const newOrder = createPurchasedItem(categories, order);
                purchasesDiv.appendChild(newOrder);
              });
            }
          }
        );
    }
  }
}

// Listen for popstate event to handle browser back/forward navigation
window.addEventListener('popstate', () => {
  const currentUrl = window.location.pathname;
  renderContent(currentUrl);
});

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Initialize the page content
const initialUrl = window.location.pathname;
renderContent(initialUrl);
