const express = require('express');
const bodyParser = require('body-parser');
const { crawler } = require('./crawler/puppeteer');

const app = express();

app.use(bodyParser.json());

app.post('/save', async (req, res) => {
  const { body: { url } } = req;
  try {
    await crawler(url);
    res.json({ message: 'crawler ran, check for file' });
  } catch(e) {
    console.error(e.message);
    res.json({ message: e.message });
  }
})

module.exports = {
  app
}