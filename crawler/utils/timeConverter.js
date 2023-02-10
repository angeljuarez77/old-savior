const timeConverter = (UNIX_timestamp) => {
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const dateObject = new Date(UNIX_timestamp * 1000);

  const year = dateObject.getFullYear();
  const month = months[dateObject.getMonth()];
  const date = dateObject.getDate();
  const hour = dateObject.getHours();
  const min = dateObject.getMinutes();
  const sec = dateObject.getSeconds();

  // const expressedTimestamp = date + '_' + month + '_' + year + '_' + hour + ':' + min + ':' + sec ;
  const expressedTimestamp = month + '_' + date + '_' + year;
  return expressedTimestamp;
}

module.exports = {
  timeConverter
}