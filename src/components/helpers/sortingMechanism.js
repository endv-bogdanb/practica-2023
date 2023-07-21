import { createOrderItem } from '../createOrderItem';
import {categories,allOrders} from '../../../main';

export function handleSort(property) {
    switch (property) {
        case 'name': {
            const icon = document.getElementById('sorting-icon-1');
            sortElements(icon, ['event', 'name']);
            break;
        }
        case 'price': {
            const icon = document.getElementById('sorting-icon-2');
            sortElements(icon, ['totalPrice']);
            break;
        }
        default:
            console.log(`No property provided`);
    }
}

function sortElements(icon, properties) {
    if (icon.classList.contains('fa-arrow-up-wide-short')) {
        icon.classList.remove('fa-arrow-up-wide-short');
        icon.classList.add('fa-arrow-down-wide-short');
        sortOrders('descending', properties);
    } else {
        icon.classList.remove('fa-arrow-down-wide-short');
        icon.classList.add('fa-arrow-up-wide-short');
        sortOrders('ascending', properties);
    }
}

function sortOrders(way, arrayOfProperties) {
    const newOrders = arrangeOrders(allOrders, way, arrayOfProperties);
    const puchasesContet = document.getElementById('purchases-content');
    while (puchasesContet.firstChild) {
        puchasesContet.removeChild(puchasesContet.firstChild);
    }
    newOrders.forEach((order) => {
        const newOrder = createOrderItem(categories, order);
        puchasesContet.appendChild(newOrder);
    });
}

function arrangeOrders(items, way, arrayOfProperties) {
    const newItems = items.sort(function (firstElement, secondElement) {
        let copyOfProperties = [...arrayOfProperties];
        while (copyOfProperties.length) {
            firstElement = firstElement[copyOfProperties[0]];
            secondElement = secondElement[copyOfProperties[0]];
            copyOfProperties = copyOfProperties.slice(1);
        }
        if (typeof firstElement === 'string')
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
    if(way === "ascending"){
        return firstNumber - secondNumber;
    } else {
        return secondNumber - firstNumber; 
    };
}

function compareStrings(firstString, secondString,way) {
    if(way === "ascending"){
        return firstString.localeCompare(secondString);
    } else {
        return -firstString.localeCompare(secondString);; 
    };
}
