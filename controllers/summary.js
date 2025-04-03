const Summary = require('../models/summary.js');



function getDateData(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return {
        year,
        month,
        day,
        monthString: `${year}/${month}`,
        dayString: `${year}/${month}/${day}`
    };
}

/**
 * @typedef {'day' | 'month' | 'year' | 'lifetime'} TimeInterval
 * @typedef {'registrations' | 'logins' | 'referrals' | 'verifications' | 'visits' | 'visitors' | 'paymentCount' | 'income' | 'incomeCount' | 'expenditure' | 'expenditureCount' | 'profit' | 'searches' | 'jobs' | 'proposals' | 'feedbacks' | 'readFeedbacks'} SummaryField
 */

/**
 * Update a numeric field in the Summary model for a specific interval and date.
 *
 * @param {TimeInterval} interval - The time interval ('day', 'month', 'year', 'lifetime').
 * @param {string} date - The date in the format 'YYYY' or 'YYYY/MM' or 'YYYY/MM/DD' or 'lifetime'.
 * @param {SummaryField} fieldToUpdate - The name of the field to update in the Summary model.
 * @param {number} increaseValue - The value by which to increase the specified field.
 * @returns {Promise<object>} - The updated or newly created Summary record.
 * @throws {Error} - If the specified field is not a numeric field.
 */
async function updateSummaryField(interval, date, fieldToUpdate, increaseValue) {
    try {
        // Validate the interval against the enum
        if (!['day', 'month', 'year', 'lifetime'].includes(interval)) {
            throw new Error(`Invalid interval: '${interval}'.`);
        }

        // Validate the fieldToUpdate against the enum
        if (!['registrations' ,'logins' ,'referrals' ,'verifications' ,'visits' ,'visitors' ,'paymentCount' ,'income' ,'incomeCount' ,'expenditure' ,'expenditureCount' ,'profit' ,'searches' ,'jobs' ,'proposals' ,'feedbacks' ,'readFeedbacks'].includes(fieldToUpdate)) {
            throw new Error(`Invalid field to update: '${fieldToUpdate}'.`);
        }

        // Find the summary record based on interval and date
        let summary = await Summary.findOne({ interval, date });

        // If the summary record doesn't exist, create a new one
        if (!summary) {
            summary = new Summary({
                interval,
                date,
            });
        }

        // Update the specified field with the increase value
        if (typeof summary[fieldToUpdate] === 'number') {
            summary[fieldToUpdate] += increaseValue;
        } else {
            throw new Error(`Field '${fieldToUpdate}' is not a numeric field.`);
        }

        // Save the updated summary
        await summary.save();

        return summary;
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {string} date - A date string
 * @param {SummaryField} fieldToUpdate - The name of the field to update in the Summary model.
 * @param {number} increaseValue - The value by which to increase the specified field.
 * @returns {Promise<object>} - The updated or newly created Summary record.
 * @throws {Error} - If the specified field is not a numeric field.
 */
async function crossUpdate(date, fieldToUpdate, increaseValue){
    try {
        const dateData = getDateData(date);

        // Update overall summary
        updateSummaryField('lifetime', 'lifetime', fieldToUpdate, increaseValue);

        // Update year summary
        updateSummaryField('year', dateData.year, fieldToUpdate, increaseValue);

        // Update month summary
        updateSummaryField('month', dateData.monthString, fieldToUpdate, increaseValue);

        // Update day summary
        updateSummaryField('day', dateData.dayString, fieldToUpdate, increaseValue);


    } catch (error) {
        throw error;
    }
}


async function newWriter(signUpDate = new Date().toDateString()) {
    try {
        await crossUpdate(signUpDate, 'registrations', 1);
    } catch (error) {
        throw error;
    }
}

async function newLogin(date= new Date().toDateString()){
    try {
        await crossUpdate(date, 'logins', 1);
    } catch (error) {
        throw error;
    }
}

async function newReferral(date = new Date().toDateString()){
    try {
        await crossUpdate(date, 'referrals', 1);
    } catch (error) {
        throw error;
    }
}

async function newVerification(date = new Date().toDateString()){
    try {
        await crossUpdate(date, 'verifications', 1);
    } catch (error) {
        throw error;
    }
}

async function newLog(date =  new Date().toDateString()){
    try {
        await crossUpdate(date, 'visits', 1);
    } catch (error) {
        throw error;
    }
}

async function newIp(date =  new Date().toDateString()){
    try {
        await crossUpdate(date, 'visitors', 1);
    } catch (error) {
        throw error;
    }
}

async function newIncome(date = new Date().toDateString(), amount){
    try {
        await crossUpdate(date, 'income', amount);
        await crossUpdate(date, 'incomeCount', 1);
        await crossUpdate(date, 'paymentCount', 1);
        await crossUpdate(date, 'profit', amount);
    } catch (error) {
        throw error;
    }
}

async function newExpenditure(date = new Date().toDateString(), amount){
    try {
        await crossUpdate(date, 'expenditure', amount);
        await crossUpdate(date, 'expenditureCount', 1);
        await crossUpdate(date, 'paymentCount', 1);
        await crossUpdate(date, 'profit', -amount);
    } catch (error) {
        throw error;
    }
}

async function newSearch(date = new Date().toDateString()){
    try {
        await crossUpdate(date, 'searches', 1);
    } catch (error) {
        throw error;
    }
}

async function newJob(date =  new Date().toDateString()){
    try {
        await crossUpdate(date, 'jobs', 1);
    } catch (error) {
        throw error;
    }
}

async function newProposal(date){
    try {
        await crossUpdate(date, 'proposals', 1);
    } catch (error) {
        throw error;
    }
}

async function newFeedback(date = new Date().toDateString()){
    try {
        await crossUpdate(date, 'feedbacks', 1);
    } catch (error) {
        throw error;
    }
}

async function readFeedback(date = new Date().toDateString()){
    try {
        await crossUpdate(date, 'readFeedbacks', 1);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    newExpenditure,
    newFeedback,
    newIncome,
    newIp,
    newJob,
    newSearch,
    newLog,
    newLogin,
    newProposal,
    newReferral,
    newVerification,
    newWriter,
    readFeedback
}