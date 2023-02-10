const fs = require('fs');
const path = require('path');

const writeToFile = (content, filename) => {
  const imagePath = path.join(__dirname, '..', '..', 'images', `${filename}.jpg`);
  fs.writeFile(imagePath, content, (e) => {
    if(e) {
      console.error(e.message);
    }
    console.log('File written!');
  });
}

module.exports = {
  writeToFile
}