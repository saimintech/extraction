const Hero = require('@ulixee/hero');
const HeroCore = require('@ulixee/hero-core');
const { TransportBridge } = require('@ulixee/net');
const { ConnectionToHeroCore } = require('@ulixee/hero');

exports.getData = async (req, res) => {
  const { url, page, tag } = req.query;

  // Validate parameters
  if (!url || !tag) {
    return res.status(400).json({ error: 'Missing url, page, or tag parameter' });
  }

  // Validate the URL
  try {
    new URL(url); // Throws if URL is invalid
  } catch (_) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Validate that the page is an integer
  //const pageNumber = parseInt(page, 10);
  //if (isNaN(pageNumber)) {
    //return res.status(400).json({ error: 'Invalid page number' });
  //}

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

    // Find all articles on the page
    const articles = await hero.document.querySelectorAll('article');
    const contentArray = [];

    for (const article of articles) {
      let articleText = '';
      let hrefs = [];

      // Extract the full text content from the article
      articleText = await article.innerText;

      // Find all <a> tags inside the article and get their href values
      const anchorTags = await article.querySelectorAll('a');
      for (const anchor of anchorTags) {
        const href = await anchor.getAttribute('href');
        if (href) {
          hrefs.push(href);
        }
      }

      // Store the complete article text and all hrefs found in the article
      contentArray.push({
        articleText,  // The complete text content of the article
        hrefs         // All href links found within the article
      });
    }
    // Ensure all hrefs are unique
    hrefs = [...new Set(hrefs)];
    
    // Respond with the page title, article content, hrefs, and the page number
    res.json({
      title,
      tag,
      results: contentArray,
      //page: pageNumber
    });

    await hero.close();
  } catch (error) {
    res.status(500).send('Error occurred: ' + error.message);
  }
};
