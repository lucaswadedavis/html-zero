var el = require('../dom.js').el;
var getImageButton = require('./get-image-button');

module.exports = function () {
  var header = el('div', 'header');
  header.textContent = 'HTML Zero';
  header.appendChild(app.t.getImageButton());
  return header;
};

