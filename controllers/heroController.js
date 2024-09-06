const Hero = require('@ulixee/hero');
const HeroCore = require('@ulixee/hero-core');
const { TransportBridge } = require('@ulixee/net');
const { ConnectionToHeroCore } = require('@ulixee/hero');

exports.getData = async (req, res) => {
  try {
    const { url, number } = req.query;

    // Validate URL and number
    if (!url || !number) {
      return res.status(400).json({ error: 'Missing url or number parameter' });
    }

    let integer;
    try {
      integer = parseInt(number, 10);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid number' });
    }

    if (isNaN(integer)) {
      return res.status(400).json({ error: 'Number must be an integer' });
    }

    // Initialize Ulixee Hero
    const bridge = new TransportBridge();
    const connectionToCore = new ConnectionToHeroCore(bridge.transportToCore);

    const heroCore = new HeroCore();
    heroCore.addConnection(bridge.transportToClient);

    const hero = new Hero({ connectionToCore });

    // Navigate to the provided URL
    await hero.goto(url);

    // Get title and content from the webpage
    const title = await hero.document.title;
    const intro = await hero.document.querySelector('p').textContent;

    res.json({
      title,
      intro,
      number: integer
    });

    await hero.close();
  } catch (error) {
    res.status(500).json({ error: 'Error occurred: ' + error.message });
  }
};
