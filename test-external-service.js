
require('dotenv').config();
const axios = require('axios');

async function testExternalService() {
  console.log('Testing direct connection to external M-Pesa service...');
  console.log(`URL: ${process.env.pay_url}/stkPush`);
  
  const testPayload = {
    phoneNumber: "254700000000", // Test phone number
    amount: 1,                   // Minimal amount
    accountReference: "TestPayment"
  };
  
  console.log('Test payload:', JSON.stringify(testPayload, null, 2));
  
  try {
    const response = await axios.post(
      `${process.env.pay_url}/stkPush`, 
      testPayload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log('SUCCESS! External service responded:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('ERROR connecting to external service:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received - service might be down or unreachable');
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Run the test
testExternalService();