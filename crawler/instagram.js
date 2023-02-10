const axios = require('axios');
const { timeConverter } = require('./utils/timeConverter');
const { writeToFile } = require('./utils/writeToFile');

let imagesSrc = null;
let usernameString = null;
let timestampString = null;

const ig = async (browser, link) => {
  await initiateImageCrawl(browser, link);
  await Promise.all(imagesSrc.map(async (url, i) => {
    await downloadImage(browser, url, i);
  }));
}

const initiateImageCrawl = async (browser, link) => {
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', gatherImageLinks); 
    await page.goto(link);
    await page.waitForNetworkIdle();
  } catch(e) {
    console.trace();
    console.error(e.message);
  }
}

const gatherImageLinks = async (interceptedRequest) => {
  try {
    if (interceptedRequest.isInterceptResolutionHandled()) return;
    // match GraphQL endpoint that has image sources
    const instagramGraphQLEndpoint = /https:\/\/www.instagram.com\/graphql\/query\/\?query_hash=b3055c01b4b222b8a47dc12b090e4e64.*/gm
    const url = interceptedRequest.url();
    // if domain matches make request to the endpoint - will return needed info to get images src
    if(url.match(instagramGraphQLEndpoint)) {
      const req = await axios.get(url); // an intermediate point. GraphQL endpoint will give us cdn link
      const { data: { data: { shortcode_media } } } = req;
      // metadata
      const { taken_at_timestamp, owner: { username } } = shortcode_media;
      usernameString = username;
      timestampString = timeConverter(taken_at_timestamp);
      // check if link has 1 or more images
      const isSingleImage = shortcode_media.edge_sidecar_to_children === undefined;
      if(isSingleImage) {
        imagesSrc = [shortcode_media.display_resources[2].src]; // grab single link
      } else {
        // loop through links/slideshows to gather images src
        const { edge_sidecar_to_children: { edges } } = shortcode_media;
        imagesSrc = edges.map(item => {
          return item.node.display_resources[2].src;
        });
      }
      interceptedRequest.continue();
    } else {
      interceptedRequest.continue();
    }
  } catch(e) {
    console.error(e.messsage);
  }
}

const downloadImage = async (browser, src, idx = 0) => {
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1728, height: 1117 });

    page.on('response', async (interceptedResponse) => {
      const faviconUrl = /favicon\.ico/
      if(!interceptedResponse.url().match(faviconUrl)) {
        const buffer = await interceptedResponse.buffer();
        writeToFile(buffer, `instagram_${usernameString || 'unknown'}_${timestampString || 0}_picture_${idx + 1}`);
      }
    });

    await page.goto(src);
    await page.waitForNetworkIdle();
  } catch(e) {
    console.trace();
    console.error(e.message);
  }
}

module.exports = {
  ig
}