import './src/mocks/handlers';
import { addEvents, handleFilter, handleSearch } from './src/utils';
import { createPurchasedItem } from './src/components/createPurchesedItem';
import { useGetTicketCategories } from '/src/components/api/use-get-ticket-categories';
import { removeLoader, addLoader } from './src/components/loader';
import { sort } from './src/components/helpers/sort';
const navLinks = document.querySelectorAll('nav a');
let allOrders = [];
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
    <div id="content" class="hidden">
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
      <div class="events flex items-center justify-center flex-wrap">
      </div>
      <div class="cart"></div>
    </div>
  `;
        const filterIcon = document.querySelector('.filter-icon');
        const filterForm = document.querySelector('.filter-form');
        const filterWrapper = document.querySelector('.filters');
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.querySelector('.search-input');
        const searchButton = document.querySelector('.search-button');
        const eventSection = document.querySelector('.events');

        filterIcon.addEventListener('click', () => {
            filterWrapper.classList.toggle('hidden');
        });

        filterForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const resultsFound = await handleFilter();

            if (!resultsFound) {
                eventSection.innerHTML = 'No results found';
            }
        });

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
        addLoader();

        fetch('/api/ticketEvents')
            .then((response) => response.json())
            .then((data) => {
                setTimeout(() => {
                    removeLoader();
                }, 200);
                addEvents(data);
            });
    } else if (url === '/orders') {
        mainContentDiv.innerHTML = `
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
        const purchasesDiv = document.querySelector('.purchases');
        const puchasesContet = document.getElementById('purchases-content');
        addLoader();

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
                            setTimeout(() => {
                                removeLoader();
                            }, 200);
                            allOrders = [...orders];
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
                            orders.forEach((order) => {
                                const newOrder = createPurchasedItem(
                                    allOrders,
                                    categories,
                                    order
                                );
                                puchasesContet.appendChild(newOrder);
                            });
                            purchasesDiv.appendChild(puchasesContet);
                        } else {
                            removeLoader();
                        }
                    }
                );
        }
    }
}

function handleSort(property) {
    switch (property) {
        case 'name': {
            const icon = document.getElementById('sorting-icon-1');
            switchSortingIcon(icon, ['event', 'name']);
            break;
        }
        case 'price': {
            const icon = document.getElementById('sorting-icon-2');
            switchSortingIcon(icon, ['totalPrice']);
            break;
        }
        default:
            console.log(`No property provided`);
    }
}

function switchSortingIcon(icon, properties) {
    if (icon.classList.contains('fa-arrow-up-wide-short')) {
        icon.classList.remove('fa-arrow-up-wide-short');
        icon.classList.add('fa-arrow-down-wide-short');
        reorderItems('descending', properties);
    } else {
        icon.classList.remove('fa-arrow-down-wide-short');
        icon.classList.add('fa-arrow-up-wide-short');
        reorderItems('ascending', properties);
    }
}

function reorderItems(way, arrayOfProperties) {
    const newOrders = sort(allOrders, way, arrayOfProperties);
    const puchasesContet = document.getElementById('purchases-content');
    while (puchasesContet.firstChild) {
        puchasesContet.removeChild(puchasesContet.firstChild);
    }
    newOrders.forEach((order) => {
        const newOrder = createPurchasedItem(allOrders, categories, order);
        puchasesContet.appendChild(newOrder);
    });
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
