const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'The server is up and running!' });
});

app.get('/process', (req, res) => {
  const { url, number } = req.query;

  // Validate parameters
  if (!url || !number) {
    return res.status(400).json({ error: 'Missing url or number parameter' });
  }

  // Validate the URL
  try {
    new URL(url); // Throws if URL is invalid
  } catch (_) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Validate that the number is an integer
  const integer = parseInt(number, 10);
  if (isNaN(integer)) {
    return res.status(400).json({ error: 'Invalid number' });
  }

  // Process the URL and number
  res.json({ message: 'Processing complete', url, number: integer });
});

router.post('/data', (req, res) => {
  const { data } = req.body;
  res.json({ received: data });
});


module.exports = router;
