const express = require('express');

const router = express.Router();
const Job = require('../models/job');
const Client = require('../models/client');

router.get('/', (req, res)=>{
    res.redirect('/jobs');
})

router.get('/id/:id', async (req, res)=>{
    const id = req.params.id;
    if(typeof(id) != 'string'){
        return res.send('error')
    }
    if(id.length != 24){
        return res.send('error')
    }
    try {
        const job = await Job.findById(req.params.id);

        if(!job){
           return res.status(404).render('error', {message: 'Job not found', status: 404})
        }

        const client = await Client.findById(job.postedBy);

        if(!client){
            return res.status(404).render('error', {message: 'Could not find the client who posted this job', status : 404})
        }

        const jobs = await Job.find(
            { $text: { $search: job.title } },
            { score: { $meta: 'textScore' } } // Include a relevance score
        )
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(6); // Limit the results to 10 jobs per page
        const clientJobs = await (await Job.find({postedBy: client._id}).limit(5)).filter(j=> j._id.toString() != job._id.toString())
        res.render('job', {client, job, jobs: jobs.filter(j=>j._id.toString() != job._id.toString()), clientJobs});

    } catch (error) {
        console.log(error);
        res.status(500).render('error', {message: 'An error occurred in our side, please try again later', status: 500})
    }
})



module.exports = router;