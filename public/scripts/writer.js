function generateDate(){
    const [day, month, date, year]= new Date().toLocaleString('en-us', { 
         weekday: 'long', 
         month: 'long', 
         year: 'numeric', 
         day: 'numeric'
     }).split(',').join('').split(' ');
     return `${day}, ${date} ${month} ${year}`
 }
 
 document.querySelector('.date').innerText = generateDate()