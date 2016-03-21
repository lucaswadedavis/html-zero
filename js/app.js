var config = require('./config.js');
var creds = require('./creds.js');
var el = require('./dom.js').el;
var append = require('./dom.js').append;
var remove = require('./dom.js').remove;
var getWidth = require('./dom.js').getWidth;
var Image = require('./image.js');
var get = require('./get.js');


var app = {images:[], v: {}, t: {}};

app.init = function () { 
  app.v.layout();
  getImages();
  getImages();
  getImages();
};

app.t.header = require('./templates/header.js');

app.t.imageCellSection = function () {
  return el('div', 'image-cell-section');
};

app.t.getImageButton = function () {
  var button = el('span', 'header-plus');
  button.textContent = '+';
  button.addEventListener('click', getImages);
  return button;
};

app.t.image = require('./templates/image.js');

app.t.imageCell = require('./templates/image-cell.js');

app.t.lightbox = require('./templates/lightbox.js');

app.t.lightboxElement = require('./templates/lightbox-element.js');

app.t.lightboxTitle = require('./templates/lightbox-title.js');

app.v.layout = function () {
  append(document.body, app.t.header(), app.t.imageCellSection());
};

app.v.addImage = function (image) {
  var imageNode = app.t.image(image.src);
  imageNode.addEventListener('click', function () {
    app.v.lightbox(app.t.image(image.src, image.id), image.title, app.images);
  });

  append(
      document.getElementsByClassName('image-cell-section')[0],
      app.t.imageCell(imageNode, image.title)
      );
};

app.v.lightbox = require('./views/lightbox.js');

// utilities

function getImages (pixelsWide) {
  var url = config.imagesURL + (pixelsWide || 500);

  var callback = function (e) {
    var images = e.target.response.images; 
    for (var i = 0; i < images.length; i++) {
      var image = new Image(images[i]);
      app.images.push(image);
      app.v.addImage(image);
    }
  };

  get(url, callback);
};


window.app = app;
