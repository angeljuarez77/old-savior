const axios = require('axios');
const { createFilename } = require('./utils/createFilename');
const { timeConverter } = require('./utils/timeConverter');
const { writeToFile } = require('./utils/writeToFile');

let sources = null;
let usernameString = null;
let timestampString = null;
let isVideo = false;

const ig = async (browser, link) => {
  await initiateImageCrawl(browser, link);
  await Promise.all(sources.map(async (url, i) => {
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
  const sourceType = {
    video: 'GraphVideo',
    multipleImages: 'GraphSidecar',
    singleImage: 'GraphImage'
  }

  try {
    if (interceptedRequest.isInterceptResolutionHandled()) return;
    // match GraphQL endpoint that has file sources
    const instagramGraphQLEndpoint = /https:\/\/www.instagram.com\/graphql\/query\/\?query_hash=b3055c01b4b222b8a47dc12b090e4e64.*/gm
    const url = interceptedRequest.url();
    if(url.match(instagramGraphQLEndpoint)) {
      const req = await axios.get(url);
      const { data: { data: { shortcode_media } } } = req;
      const { __typename } = shortcode_media;
      gatherMetadata(shortcode_media);
      switch(__typename) {
        case sourceType.singleImage:
          getSingleImageSource(shortcode_media);
          break;
        case sourceType.multipleImages:
          getMultipleImageSources(shortcode_media);
          break;
        case sourceType.video:
          getVideoSource(shortcode_media);
          break;
        default:
          throw new Error('Unknown IG source type');
      }
      interceptedRequest.continue();
    } else {
      interceptedRequest.continue();
    }
  } catch(e) {
    console.trace();
    console.error(e.message);
  }
}

const gatherMetadata = (shortcode_media) => {
  const { taken_at_timestamp, owner: { username } } = shortcode_media;
  usernameString = username;
  timestampString = timeConverter(taken_at_timestamp);
}

const getSingleImageSource = (shortcode_media) => {
  try {
    sources = [shortcode_media.display_resources[2].src];
  } catch(e) {
    console.trace();
    console.error(e.message);
  }
}

const getMultipleImageSources = (shortcode_media) => {
  try {
    const edges  = shortcode_media.edge_sidecar_to_children.edges;
    sources = edges.map(item => {
      return item.node.display_resources[2].src;
    }); 
  } catch(e) {
    console.trace();
    console.error(e.message);
  }
}

const getVideoSource = (shortcode_media) => {
  isVideo = true;
  try {
    const { video_url } = shortcode_media;
    sources = [video_url];
  } catch(e) {
    console.trace();
    console.error(e.message);
  }
}

const downloadImage = async (browser, src, idx = 0) => {
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1728, height: 1117 });
    page.on('response', async (interceptedResponse) => {
      try {
        const jpgUrl = /\.jpg/
        const videoUrl = /\.mp4/
        if(interceptedResponse.url().match(videoUrl)) {
          const buffer = await interceptedResponse.buffer();
          writeToFile(
            buffer,
            createFilename(usernameString, timestampString, idx, isVideo),
            'mp4'
          )
        }
        if(interceptedResponse.url().match(jpgUrl)) {
          const buffer = await interceptedResponse.buffer();
          writeToFile(
            buffer,
            createFilename(usernameString, timestampString, idx, isVideo),
            'jpg'
          );
        }
      } catch(e) {
        console.trace();
        console.error(e.message);
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