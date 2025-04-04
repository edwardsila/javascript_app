const axios = require('axios');

/**
 * Proxy controller for M-Pesa STK Push requests
 * Forwards requests to the external M-Pesa service
 */
const proxySTKPush = async (req, res) => {
  try {
    console.log('\n======== MPESA REQUEST RECEIVED ========');
    
    // 1. Check environment variables
    if (!process.env.pay_url) {
      console.error('ERROR: pay_url environment variable is not configured');
      throw new Error('Payment URL not configured. Check environment variables.');
    }
    console.log(`✓ pay_url is configured: ${process.env.pay_url}`);
    
    // 2. Validate request format
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    if (!req.body.phoneNumber) {
      console.error('ERROR: phoneNumber is missing in request');
    }
    if (!req.body.amount) {
      console.error('ERROR: amount is missing in request');
    }
    
    // 3. Log request details
    console.log(`Target URL: ${process.env.pay_url}/stkPush`);
    console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Not present');
    
    // 4. Make the request to external service
    console.log('Sending request to external service...');
    const response = await axios.post(
      `${process.env.pay_url}/stkPush`, 
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
        },
        timeout: 30000
      }
    );
    
    // 5. Process successful response
    console.log('✓ External service responded successfully');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    console.log('========================================\n');
    
    return res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('\n======== MPESA REQUEST ERROR ========');
    console.error('Error message:', error.message);
    
    // Detailed error logging based on error type
    if (error.response) {
      // The request was made and server responded with error
      console.error('External service returned error status:', error.response.status);
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      console.error('==========================================\n');
      
      return res.status(error.response.status).json({
        success: false,
        message: 'External payment service error',
        error: error.response.data
      });
      
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from external service.');
      console.error('This could be due to:');
      console.error('- External service is down');
      console.error('- Network connectivity issues');
      console.error('- Request timeout');
      console.error('==========================================\n');
      
      return res.status(503).json({
        success: false,
        message: 'No response from payment service',
        error: 'Service unavailable'
      });
      
    } else {
      // Something else caused the error
      console.error('Error before request could be sent:');
      console.error(error);
      console.error('==========================================\n');
      
      return res.status(500).json({
        success: false,
        message: 'Failed to process payment request',
        error: error.message
      });
    }
  }
};

module.exports = { proxySTKPush };
