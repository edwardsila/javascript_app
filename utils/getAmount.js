function offerAvailable(dateString){
    const date = new Date(dateString);
    const day = date.getUTCDay();

    if([1, 2, 3, 4].includes(day)){
        return false;
    }

    if([6, 0].includes(day)){
        return true;
    }

    const hour = date.getUTCHours();

    // friday

    if(hour < 12 ){
        return false;
    }

    if(hour >= 12){
        return true;
    }

    return false;    
}

function getAmount(){

    const amount = 499;
    const offer = 399;

    const date =  new Date();
    const day = date.getUTCDay();

    if([1, 2, 3, 4].includes(day)){
        return amount;
    }

    if([1, 0].includes(day)){
        return offer;
    }

    const hour = date.getUTCHours();

    // friday

    if(hour < 12 ){
        return amount;
    }

    if(hour >= 12){
        return offer;
    }

    return amount;
}

module.exports = {getAmount,  offerAvailable};