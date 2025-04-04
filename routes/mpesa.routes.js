const express = require('express');
const router = express.Router();
const mpesaProxyController = require('../controllers/mpesaProxy.controller');

// Ensure you have a route defined for '/start' 
router.post('/start', (req, res) => {
  try {
    // Log the incoming request
    console.log('Received request to /mpesa/start:', req.body);
    
    // Forward to your proxy controller
    return mpesaProxyController.proxySTKPush(req, res);
  } catch (error) {
    console.error('Error in /mpesa/start route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error in mpesa route',
      error: error.message
    });
  }
});

// Route for initiating M-Pesa STK Push - proxies to external service
router.post('/stkPush', mpesaProxyController.proxySTKPush);

// Add this near your other routes
router.post('/test', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    env: {
      payUrl: process.env.pay_url ? 'configured' : 'missing',
      callbackUrl: process.env.mpesa_callback_url ? 'configured' : 'missing'
    },
    receivedBody: req.body
  });
});

// Add a simple local test endpoint that doesn't call external services
router.post('/local-test', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Local test endpoint working - no external calls made',
    receivedData: {
      body: req.body,
      headers: req.headers.authorization ? 'Auth header present' : 'No auth header'
    }
  });
});

// Add a connection test endpoint - FIXED SYNTAX ERROR HERE
router.get('/check-connection', async (req, res) => {
  try {
    const axios = require('axios');
    const url = process.env.pay_url;
    
    console.log(`Testing connection to ${url}...`);
    
    try {
      const checkResponse = await axios.get(url, { timeout: 5000 });
      return res.status(200).json({
        success: true,
        message: 'External service is reachable',
        status: checkResponse.status,
        externalService: url
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'External service connection failed',
        error: error.message,
        externalService: url
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Connection test failed',
      error: error.message
    });
  }
});

// Add a simple health check endpoint
router.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      pay_url_configured: !!process.env.pay_url
    }
  });
});

module.exports = router;
