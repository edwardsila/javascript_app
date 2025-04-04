const express = require('express');
const Search = require('../models/search');
const { searchPerPage, getDefaultJobs } = require('../controllers/jobs')
const deviceInfo = require('../utils/deviceInfo');

const router = express.Router();

router.get('/', async (req, res) => {
    let page = req.query.page;
    let query = req.query.query;
    if (!page) {
        page = 1;
    }
    let user = req.session.user ? req.session.user._id : null;
    let url = '/jobs' + req.url;
    let sessionId = req.session.id;
    let resultsCount = 0;
    const ipAddress = req.ip;
    const agent = req.get('User-Agent');

    const { os, device, client } = deviceInfo(agent);


    if (!query) {
        const jobs = await getDefaultJobs(page);
        resultsCount = jobs.count;
        res.render('jobs', { ...jobs });
    } else {
        const jobs = await searchPerPage(query, page);
        resultsCount = jobs.count;
        res.render('jobs', { ...jobs })
    }

    const searchData = {
        query: query || '', // Ensure query is never undefined
        page,
        url,
        sessionId,
        resultsCount,
        ipAddress,
        os,
        device,
        client,
        method: 'GET'
    };

    if (user) {
        searchData['user'] = user;
    }

    const search = new Search(searchData);
    search.save();
})

router.post('/', async (req, res) => {
    const query = req.body.query;
    const page = 1;
    const jobs = await searchPerPage(query, page);
    res.render('jobs', { ...jobs })

    let user = req.session.user ? req.session.user._id : null;
    let url = '/jobs' + req.url;
    let sessionId = req.session.id;
    let resultsCount = jobs.count;
    const ipAddress = req.ip;
    const agent = req.get('User-Agent');

    const { os, device, client } = deviceInfo(agent);
    const searchData = {
        query: query || '', // Ensure query is never undefined
        page,
        url,
        sessionId,
        resultsCount,
        ipAddress,
        os,
        device,
        client,
        method: 'POST'
    };

    if (user) {
        searchData['user'] = user;
    }

    const search = new Search(searchData);
    search.save();
})


module.exports = router;