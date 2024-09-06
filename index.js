const express = require('express');
const Hero = require('@ulixee/hero');
const HeroCore = require('@ulixee/hero-core');
const { TransportBridge } = require('@ulixee/net');
const { ConnectionToHeroCore } = require('@ulixee/hero');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Import and use routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
