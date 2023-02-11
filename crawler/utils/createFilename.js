const createFilename = (username = 'unkown_user', timestamp, number = 0, isVideo) => { 
  return `${username}-${timestamp}-${isVideo ? 'picture' : ''}-${number + 1}`;
}

module.exports = {
  createFilename
}