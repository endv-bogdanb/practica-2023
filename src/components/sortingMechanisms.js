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
