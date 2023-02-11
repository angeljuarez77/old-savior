const fs = require('fs');
const path = require('path');

const writeToFile = (content, filename, extension) => {
  const imagePath = path.join(__dirname, '..', '..', 'images', `${filename}.${extension}`);
  fs.writeFile(imagePath, content, (e) => {
    if(e) {
      console.error(e.message);
    }
  });
}

module.exports = {
  writeToFile
}