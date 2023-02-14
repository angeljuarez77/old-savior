const express = require('express');
const bodyParser = require('body-parser');
const { crawler } = require('./crawler/puppeteer');
const { auth } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
  audience: 'tools.angeldevelops.com',
  issuerBaseURL: 'https://dev-yoyovc4d.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

const app = express();

app.use(bodyParser.json());
app.use(jwtCheck)

app.post('/save', async (req, res) => {
  const { body: { url } } = req;
  try {
    await crawler(url);
    res.json({ message: 'crawler ran, check for file' });
  } catch(e) {
    console.error(e.message);
    res.json({ message: e.message });
  }
});

module.exports = {
  app
}