/*
 * How to save posts?
 * IG - Could have a bot account that when sent a message it'll download the video/image to a file location
 * Reddit - Could crawl through the saved posts (I already have something to do this, just saves links)
 * Twitter - Could crawl through the save
 * Could just send a link to a discord bot and it'll save it to a local file?
 * 
 * If I press the save button on a social media website
 * Then it should save the media file to a central device
 * 1) I could hijack the saved option in the website (hard)
 * 2) I could crawl through the saved items in the website (medium. Could get banned)
 * 3) I could make a browser extension and phone option that'll save it to a central location (idk) - I want this one
*/

const express = require('express');
const app = express();
const PORT = 3000;

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/save', (req, res) => {
  const { body } = req;
  console.log(body);
  res.json(body);
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
