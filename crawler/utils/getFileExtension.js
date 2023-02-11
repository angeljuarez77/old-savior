const getFileExtension = (contentType) => {
  return {
    'video/mp4': 'mp4',
    'image/jpeg': 'jpg',
  }[contentType];
}

module.exports = {
  getFileExtension
}