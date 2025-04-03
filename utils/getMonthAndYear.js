/**
 * 
 * @param {String} dateString 
 * @returns {string}
 */
function getMonthAndYear(dateString){
    const date = new Date(dateString);

    const month =  date.getMonth();
    const year = date.getFullYear();
    
    const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthAbbr[month]}, ${year}`;
}

module.exports = getMonthAndYear;