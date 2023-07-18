import { createOrderItem } from '../createOrderItem';
import {categories,allOrders} from '../../../main';

export function handleSort(property) {
    switch (property) {
        case 'name': {
            const icon = document.getElementById('sorting-icon-1');
            switchItems(icon, ['event', 'name']);
            break;
        }
        case 'price': {
            const icon = document.getElementById('sorting-icon-2');
            switchItems(icon, ['totalPrice']);
            break;
        }
        default:
            console.log(`No property provided`);
    }
}

function switchItems(icon, properties) {
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
        const newOrder = createOrderItem(categories, order);
        puchasesContet.appendChild(newOrder);
    });
}

function sort(items, way, arrayOfProperties) {
    const newItems = items.sort(function (firstElement, secondElement) {
        let copyOfProperties = [...arrayOfProperties];
        while (copyOfProperties.length) {
            firstElement = firstElement[copyOfProperties[0]];
            secondElement = secondElement[copyOfProperties[0]];
            copyOfProperties = copyOfProperties.slice(1);
        }
        if (typeof firstElement === String)
            return compareStrings(
                firstElement.toLowerCase(),
                secondElement.toLowerCase(),
                way
            );
        else return compareNumbers(firstElement, secondElement, way);
    });
    return newItems;
}

function compareNumbers(firstNumber, secondNumber, way) {
    return firstNumber > secondNumber
        ? way === 'ascending'
            ? 1
            : -1
        : firstNumber < secondNumber
        ? way === 'ascending'
            ? -1
            : 1
        : 0;
}

function compareStrings(firstString, secondString) {
    return firstString.localeCompare(secondString);
}
