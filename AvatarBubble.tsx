{
  "name": "breakfree-server",
  "version": "1.0.0",
  "description": "BreakFree backend — PayPal subscription + webhook handler",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node server/index.js",
    "start": "node server/index.js"
  },
  "dependencies": {
    "@paypal/checkout-server-sdk": "^1.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  }
}