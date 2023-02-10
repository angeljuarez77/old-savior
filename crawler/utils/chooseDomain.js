const { domains } = require('./domains');

const chooseDomain = (link) => {
  const instagram = /instagram/

  if(link.match(instagram)) {
    return domains.ig;
  }
}

module.exports = {
  chooseDomain
}