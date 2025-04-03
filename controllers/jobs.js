const Job = require('../models/job'); // Import your Job model
const Search = require('../models/search');

// Controller function to search for jobs and sort by createdAt
const searchJobs = async (req, res) => {
    const { query } = req.body; // Assuming the search query is sent in the request body

    try {
        const limit = 2500; // Limit the number of results to 2500

        // Use the $text operator to perform a text search and sort by createdAt
        const jobs = await Job.find(
            { $text: { $search: query } },
            { score: { $meta: 'textScore' } } // Include a relevance score
        )
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(limit);

        // Return the search results
        res.status(200).json({ jobs });
    } catch (error) {
        console.error('Error searching for jobs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchPerPage = async (query, page) => {
    try {
        const count = await Job.countDocuments({ $text: { $search: query } });
        const pages = parseInt(count / 10);
        if(page > pages){
            page = pages;
        }
        const limit = 10; // Number of jobs per page
        const skip = (page - 1) * limit; // Calculate the number of jobs to skip based on the page
        
        // Use the $text operator to perform a text search, sort by createdAt, and implement pagination
        const jobs = await Job.find(
            { $text: { $search: query } },
            { score: { $meta: 'textScore' } } // Include a relevance score
        )
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .skip(skip) // Skip the appropriate number of jobs based on the page
            .limit(limit); // Limit the results to 10 jobs per page

        // Return the search results
        return { jobs, pages, page, query, count};
        
    } catch (error) {
        return new Error(error);
    }
};

const getDefaultJobs = async (page) => {
    try {
        const count = await Job.countDocuments();
        const pages = parseInt(count / 10);
        if(page > pages){
            page = pages;
        }
        const limit = 10; // Number of jobs per page
        const skip = (page - 1) * limit; // Calculate the number of jobs to skip based on the page

        // Use the $text operator to perform a text search, sort by createdAt, and implement pagination
        const jobs = await Job.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .skip(skip) // Skip the appropriate number of jobs based on the page
            .limit(limit); // Limit the results to 10 jobs per page
        
        return {jobs, pages, page, query: null, count};
    } catch (error) {
        console.error('Error retrieving jobs by page:', error);
        throw error;
    }
};

module.exports = {
    searchJobs, searchPerPage, getDefaultJobs
};
