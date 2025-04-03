
const { default: mongoose } = require('mongoose');
const Account = require('../models/account');
const Proposal = require('../models/proposal')
const Job = require('../models/job');
const Payment = require('../models/payment');
const Registration = require("../models/registration");
const Verification = require('../models/verification');

/**
 * 
 * @param {mongoose.Schema.Types.ObjectId} uid 
 * @returns 
 */
async function makeTableData(uid) {
    try {
        const account = await Account.findById(uid);

        const proposals = await Proposal.find({ proposer: account._id });

        const proposalCount = proposals.length;
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const newProposals = proposalCount < 1 ? [] : proposals.filter(d => new Date(d.createdAt) > lastMonth);
        const newProposalsCount = newProposals.length;
        const jobs = proposalCount < 1 ? [] : proposals.filter(d => d.status == 'accepted');

        const jobCount = jobs.length;
        const newJobs = jobCount < 1 ? [] : jobs.filter(d => new Date(d.createdAt) > lastMonth);
        const newJobCount = newJobs.length;
        const jobFreq = monthFreq(jobs.map(job => job.createdAt));
        const proposalFreq = monthFreq(proposals.map(d => d.createdAt));
        const thisYear = new Date(lastMonth.setMonth(0));
        thisYear.setDate(1);

        const _jobs = [];
        for (let job of jobs) {
            _jobs.push(await Job.findById(job.job));
        }

        const yearJobs = jobs.filter(d => new Date(d.createdAt) > thisYear).length;
        const yearProposals = jobs.filter(d => new Date(d.createdAt) > thisYear).length;

        const payments = await Payment.find({
            account: uid,
            status: 'completed',
        });

        const referrals = await Registration.find({referral: account.referral});
        const referralMoney = referrals.reduce((accumulator, ref)=>{
            if(ref.verified){
                return accumulator + 100;
            }else{
                return accumulator + 0;
            }
        }, 0);
        // Calculate the total amount of completed payments
        const totalAmount = payments.reduce(
            (accumulator, payment) => accumulator + payment.amount,
            0
        );

        return {
            ...account.toObject(), proposals, proposalCount, newProposals, newProposalsCount, jobs: _jobs, jobCount, newJobs, newJobCount, jobFreq, proposalFreq,
            yearJobs, yearProposals, totalAmount, referralMoney, registrations: referrals.length
        }
            ;
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
}

function nMonthsAgo(n) {
    const today = new Date();
    today.setDate(1);

    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const mn = n % 12;
    let monthsBack = thisMonth - mn;
    let yearsBack = thisYear - ((n - mn) / 12)

    if (monthsBack < 0) {
        monthsBack += 12;
        yearsBack -= 1;
    }
    today.setYear(yearsBack);
    today.setMonth(monthsBack);
    return today;
}


function lastNMonths(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        let m = nMonthsAgo(i);
        let month = m.getMonth();
        let year = m.getFullYear();
        let name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
        arr.push({ month, year, name, monthsPast: i });
    }
    return arr;
}

function monthFreq(dates, monthsAgo = 9) {
    let arr = lastNMonths(monthsAgo);

    const d = dates.map(e => { let f = new Date(e); return { month: f.getMonth(), year: f.getFullYear() } });
    arr.forEach((element) => {
        let { year, month } = element;
        element.count = d.filter((o) => o.month == month & o.year == year).length;
    })
    return arr.map(({ year, name, count }) => { return { year, month: name, count } }).reverse();
}

async function getReferrals(accountId){
    try {
        const account = await Account.findById(accountId);

        if(!account){
            throw new Error("Account not found");
        }
        const accountVerification = await Verification.findOne({account: account._id})
        let isVerified = false;
        if(accountVerification){
            isVerified = true;
        }
        const referral = account.referral;

        const all  = await Registration.find({referral});
        const {name, _id, createdAt} = account;
        return {
            all, verification:isVerified, name, _id, createdAt, referral: account.referral
        };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    makeTableData, getReferrals
}