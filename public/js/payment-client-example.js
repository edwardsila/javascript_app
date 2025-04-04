
// Example client code to properly send M-Pesa payment data

function initiatePayment(phoneNumber, amount) {
  // Ensure the phone number is formatted correctly (should start with 254)
  if (phoneNumber.startsWith("0")) {
    phoneNumber = "254" + phoneNumber.substring(1);
  }
  
  // Prepare the payload with required fields
  const paymentData = {
    phoneNumber: phoneNumber,  // e.g., "254712345678"
    amount: amount,            // e.g., 10
    accountReference: "Invoice" + Math.floor(Math.random() * 10000) // Random invoice number
  };
  
  console.log("Sending payment request:", paymentData);
  
  // Send the request to your server
  fetch('/mpesa/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Payment initiated:', data);
    // Handle successful response
    if (data.success) {
      alert('Payment request sent! Check your phone for the STK push.');
    } else {
      alert('Payment failed: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Payment error:', error);
    alert('Error: ' + (error.message || 'Service unavailable'));
  });
}

// Usage:
// initiatePayment("0712345678", 10);