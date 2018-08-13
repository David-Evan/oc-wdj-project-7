/**
 * htmlToElement() - Converti une balise html en Node
 * @param html - {String} Représente un element html unique
 * @return {Node}
 */
export function htmlToElement(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

/**
 * htmlToElements() - Converti plusieurs balises html en NodeList
 * @param html - {String} - Représente la liste de balise à convertir
 * @return {NodeList}
 */
export function htmlToElements(html) {
    let template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

/**
 * Transforme un text en en un slug
 * @param textToSlug - Text à transformer
 * @returns {string} - Slugged text
 */
export function slugify(textToSlug) {
    return textToSlug.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single - with a single dash (-)
}

/**
 * Format an address
 * @param address
 * @return {string} formated address
 */
export function formatAddress(address) {
    return address.replace(/,/g, ',<br>')    // Replace , with ,<br>
        .replace(/\//g, ' / ')       // add space between /
        .toLowerCase();
}

/**
 * Add space between number : 10000000 -> 10 000 000
 * @param x
 * @return {string}
 */
export function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}