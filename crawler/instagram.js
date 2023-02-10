const axios = require('axios');
const { timeConverter } = require('./utils/timeConverter');
const { writeToFile } = require('./utils/writeToFile');

const ig = async (browser, link) => {
  const page = await browser.newPage();
  const secondPage = await browser.newPage();
  await page.setViewport({ width: 1728, height: 1117 });
  await secondPage.setViewport({ width: 1728, height: 1117 });

  await page.setRequestInterception(true);

  let usernameString = null;
  let timestampString = null;

  page.on('request', async (interceptedRequest) => {
    if (interceptedRequest.isInterceptResolutionHandled()) return;

    const instagramGraphQLEndpoint = /https:\/\/www.instagram.com\/graphql\/query\/\?query_hash=b3055c01b4b222b8a47dc12b090e4e64.*/gm
    const url = interceptedRequest.url();
    if(url.match(instagramGraphQLEndpoint)) {
      const req = await axios.get(url);
      const { data: { data: { shortcode_media: { display_resources, owner: { username }, taken_at_timestamp } } } } = req;
      const [smallImage, mediumImage, largeImage] = display_resources;
      usernameString = username;
      timestampString = timeConverter(taken_at_timestamp);
      await secondPage.goto(largeImage.src);
      interceptedRequest.continue();
    } else {
      interceptedRequest.continue();
    }
  }); 

  secondPage.on('response', async (interceptedResponse) => {
    const faviconUrl = /favicon\.ico/
    if(!interceptedResponse.url().match(faviconUrl)) {
      const buffer = await interceptedResponse.buffer();
      writeToFile(buffer, `instagram_${usernameString || 'unknown'}_${timestampString || 0}`);
    }
  });

  await page.goto(link);
}

module.exports = {
  ig
}