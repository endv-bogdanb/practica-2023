export function sort(items, way, arrayOfProperties) {
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
