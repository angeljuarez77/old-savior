const puppeteer = require('puppeteer');

const { ig } = require('./instagram');
const { domains } = require('./utils/domains');
const { chooseDomain } = require('./utils/chooseDomain');

const crawler = async (link) => {
  const browser = await puppeteer.launch();

  const domain = chooseDomain(link);

  switch(domain) {
    case domains.ig:
      await ig(browser, link);
      break;
    default:
      console.error(`Domain not known. Received url: ${link}`);
  }

  await browser.close();
}

module.exports = {
  crawler
}