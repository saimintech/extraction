const Hero = require('@ulixee/hero');
const HeroCore = require('@ulixee/hero-core');
const { TransportBridge } = require('@ulixee/net');
const { ConnectionToHeroCore } = require('@ulixee/hero');

exports.getData = async (req, res) => {
  const { url, number, tag } = req.query;

  // Validate parameters
  if (!url || !number || !tag) {
    return res.status(400).json({ error: 'Missing url, number, or tag parameter' });
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

  try {
    const bridge = new TransportBridge();
    const connectionToCore = new ConnectionToHeroCore(bridge.transportToCore);

    const heroCore = new HeroCore();
    heroCore.addConnection(bridge.transportToClient);

    const hero = new Hero({ connectionToCore });

    // Navigate to the URL
    await hero.goto(url);

    // Get the title of the page
    const title = await hero.document.title;

    // Find all elements matching the specified tag
    const elements = await hero.document.querySelectorAll(tag);
    const contentArray = [];
    for (const element of elements) {
      contentArray.push(await element.textContent);
    }

    // Respond with the page title, the content of the matched tags, and the integer
    res.json({
      title,
      tag,
      matchingElements: contentArray,
      number: integer
    });

    await hero.close();
  } catch (error) {
    res.status(500).send('Error occurred: ' + error.message);
  }
};
