const moment = require('moment');
moment.locale('pt');
require('dotenv').config();

const sentenceCase = function (str) {
  if (typeof str !== 'string' || !str.length) {
    return str;
  }
  str = str.replace(/-/g, ' ');
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

const humanizeDate = function (date, format = 'LL') {
  return moment(date).format(format);
};

const shareEntryOnSocialMedia = function (socialMedia, entry) {
  const { date, id, title } = entry;
  const url = `${process.env.BASE_URL}/%23${id}`;
  const text = `"${title}" (${humanizeDate(date, 'DD/MM/YYYY')})%20Relembre isso em: ${url}`;
  
  switch (socialMedia) {
    case 'bluesky':
      return `https://bsky.app/intent/compose?text=${text}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${text}`;
    case 'x':
      return `https://x.com/intent/tweet?text=${text}`;
    default:
      return "#";
  }  
}

const isWrappedInParagraphTags = function (html) {
  if (typeof html !== 'string') {
    return false;
  }
  return html.substring(0, 3) === '<p>';
};

module.exports = {
  sentenceCase,
  humanizeDate,
  isWrappedInParagraphTags,
  shareEntryOnSocialMedia
};
