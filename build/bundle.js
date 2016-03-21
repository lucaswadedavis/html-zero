/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(1);
	var creds = __webpack_require__(2);
	var el = __webpack_require__(3).el;
	var append = __webpack_require__(3).append;
	var remove = __webpack_require__(3).remove;
	var getWidth = __webpack_require__(3).getWidth;
	var Image = __webpack_require__(4);
	var get = __webpack_require__(5);
	
	// the app has:
	// views (v) which will actually manipulate the DOM
	// templates (t) which return DOM nodes (without touching the DOM itself)
	// and images (which I like to be able to get at through the app object)
	// it's also got an init method that fires when the body has loaded
	var app = {images:[], v: {}, t: {}};
	
	// executed on body.onload to create the initial DOM tree and fetch images
	app.init = function () { 
	  app.v.layout();
	  getImages();
	  getImages();
	  getImages();
	};
	
	// returns the header DOM node with getImage plus button
	app.t.header = __webpack_require__(6);
	
	// returns the div where all our image cells will be appended
	app.t.imageCellSection = function () {
	  return el('div', 'image-cell-section');
	};
	
	// returns the getImage plus button for the header
	app.t.getImageButton = function () {
	  var button = el('span', 'header-plus');
	  button.textContent = '+';
	  button.addEventListener('click', getImages);
	  return button;
	};
	
	// takes an src and (optional) id, and returns an img DOM node
	// worth noting: that src can be a base64 encoded image, or an image url
	app.t.image = __webpack_require__(8);
	
	// takes an image DOM node and title string
	// and returns the 'cell' or 'card' that the image will be injected into
	app.t.imageCell = __webpack_require__(9);
	
	app.t.lightbox = __webpack_require__(10);
	
	// takes a class name, text, and a callback
	// and returns a clickable div DOM node with that text and class added
	app.t.lightboxElement = __webpack_require__(11);
	
	// takes a string and returns the title paragraph tag DOM node
	app.t.lightboxTitle = __webpack_require__(12);
	
	// adds the header and image cell section to document.body - you can read
	app.v.layout = function () {
	  append(document.body, app.t.header(), app.t.imageCellSection());
	};
	
	// adds images 'cells' to the 'images section'
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
	
	app.v.lightbox = __webpack_require__(13);
	/*
	// creates the lightbox DOM nodes and appends them to document.body
	// takes advantage of JS closures to handle adding and removing events
	app.v.lightbox = function (imageNode, imageTitle, imageCollection) {
	  var shadowbox = app.t.lightboxElement('shadowbox', '', closeLightbox); 
	  var lightbox = app.t.lightbox(imageTitle, imageNode, closeLightbox);
	  var backButton = app.t.lightboxElement('lightbox-back-button', '<', regress);
	  var forwardButton = app.t.lightboxElement('lightbox-forward-button', '>', progress);
	
	  append(document.body, shadowbox, backButton, forwardButton, lightbox);
	
	  position(); 
	  window.onresize = position;
	  window.addEventListener('keydown', navigateOnKeyDown);
	
	  // repositions the lightbox and forward and back buttons
	  // needed to keep things centered and responsive
	  function position () {
	    var lightboxWidth = getWidth(lightbox);
	    var windowWidth = getWidth(document.body);
	    var backButtonWidth = getWidth(backButton);
	    var forwardButtonWidth = getWidth(forwardButton);
	    var margin = 20;
	
	    var lightboxLeft = (windowWidth - lightboxWidth) / 2;
	    lightbox.style.left = lightboxLeft;
	    backButton.style.left = lightboxLeft - backButtonWidth - 3 * margin;
	    forwardButton.style.left = lightboxLeft + lightboxWidth + margin;
	  };
	
	  // for easy keyboard naviation using the arrow keys
	  function navigateOnKeyDown (ev) {
	    var keys = {rightArrow: 39, leftArrow: 37};
	    if (ev.which === keys.rightArrow) {
	      progress();
	    } else if (ev.which === keys.leftArrow) {
	      regress();
	    }
	  };
	
	  // steps teh lightbox forwards in the collection
	  function progress  () {
	    for (var i = 0; i < imageCollection.length; i++) {
	      if (imageNode.id === imageCollection[i].id && i < imageCollection.length - 1) {
	        closeLightbox();
	        var image = imageCollection[i + 1];
	        app.v.lightbox(
	            app.t.image(image.src, image.id),
	            image.title,
	            imageCollection
	            );
	        return;
	      }
	    }
	
	    closeLightbox();
	  };
	
	  // steps the lightbox backwards in the collection
	  function regress () {
	    for (var i = 0; i < imageCollection.length; i++) {
	      if (imageNode.id === imageCollection[i].id && i > 0) {
	        closeLightbox();
	        var image = imageCollection[i - 1];
	        app.v.lightbox(app.t.image(image.src, image.id), image.title, imageCollection);
	        return;
	      }
	    }
	
	    closeLightbox();
	  };
	
	  // removes the lightbox-associated DOM nodes and removes the keydown listener
	  function closeLightbox () {
	    window.removeEventListener('keydown', navigateOnKeyDown);
	    remove(lightbox, backButton, forwardButton, shadowbox);
	  };
	};
	*/
	
	
	// takes an int to request an icon from the server of pixelsWide width
	// right now the server only returns a single image as a base64 encoded string
	// but it could be trivially changed to return image urls, and lots of them.
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	
	module.exports = {
	  imagesURL: 'http://104.131.154.14:3000/'
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	
	// credentials for the API - I built the thing
	// so I'm not too worried about what'll happen with these on Github
	var creds = {
	  appID: '1541c5a2-b78d-48d0-9b41-1be7072d7c1b',
	  jsKey: '6b0ef299-e3ce-479e-bc1d-e1b62df2c5ba'
	};
	
	module.exports = creds;


/***/ },
/* 3 */
/***/ function(module, exports) {

	
	var dom = {
	  // takes a tag and any number of classes to add as extra arguments
	  // returns a DOM node of that tag type with those classes
	  el: function (tag) {
	    var el = document.createElement(tag || 'div');
	    if (arguments.length > 1) {
	      for (var i = 1; i < arguments.length; i++) {
	        el.classList.add(arguments[i]);
	      }
	    }
	    return el;
	  },
	
	  // takes a target DOM node and any number of additional DOM nodes
	  // all DOM nodes after the first will be appended to the target
	  append: function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      target.appendChild(arguments[i]);
	    }
	  },
	
	  // removes all DOM nodes passed as arguments
	  remove: function () {
	    if (!arguments.length) return;
	    for (var i = 0; i < arguments.length; i++) {
	      var node = arguments[i];
	      node.parentNode.removeChild(node);
	    }
	  },
	
	  // takes a DOM node and returns it's width in pixels
	  getWidth: function (node) {
	    return parseInt(window.getComputedStyle(node).width, 10);
	  }
	
	};
	
	module.exports = dom;


/***/ },
/* 4 */
/***/ function(module, exports) {

	
	// like underscore's sample, takes an array or string
	// and returns a randomly selected element from the collection
	function sample (arrayOrString) {
	  return arrayOrString[Math.floor(Math.random() * arrayOrString.length)];
	};
	
	// returns a uuid string
	// taken from stackoverflow (http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript) 
	function uuid () {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	  }); 
	};
	
	// returns a fake title for our images
	function fakeTitle () {
	  var consonants = 'bcdfghjklmnpqrstvwxyz';
	  var vowels = 'aeiou';
	  var patterns = 'CVC VC CV CVVCV CVCV VCVVC CVCCVC';
	
	  var n = 1 + Math.floor(Math.random() * 3);
	  var words = [];
	  for (var i = 0; i < n; i++) {
	    words.push(sample(patterns.split(' ')));
	  }
	
	  return words.join(' ').replace(/[CV]/g, function(x) {
	    return x === 'C' ? sample(consonants) : sample(vowels);
	  });
	};
	
	// Constructor for image instances
	function Image (src) {
	  this.src = src;
	  this.id = uuid();
	  this.title = fakeTitle();
	};
	
	
	module.exports = Image;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var creds = __webpack_require__(2);
	
	// xhr GET with authorization set to our credentials
	function get (url, callback) {
	  var req = new XMLHttpRequest();
	  req.onload = callback; 
	  req.open('GET', url, true);
	  req.responseType = 'json';
	  req.setRequestHeader(
	      'Authorization',
	      'Basic ' + btoa(creds.appID + ':' + creds.jsKey)
	      );
	  req.send();    
	};
	
	module.exports = get;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var el = __webpack_require__(3).el;
	var getImageButton = __webpack_require__(7);
	
	module.exports = function () {
	  var header = el('div', 'header');
	  header.textContent = 'HTML Zero';
	  header.appendChild(app.t.getImageButton());
	  return header;
	};
	


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var el = __webpack_require__(3).el;
	// returns the getImage plus button for the header
	


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var el = __webpack_require__(3).el;
	
	module.exports = function (src, id) {
	  var img = el('img');
	  img.setAttribute('id', id);
	  img.setAttribute('src', src);
	  return img;
	};
	


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var el = __webpack_require__(3).el;
	
	module.exports = function (imageNode, imageTitle) {
	  var cell = el('div', 'image-cell');
	  cell.appendChild(imageNode);
	
	  var title = el('p', 'image-title');
	  title.textContent = imageTitle || 'Lightbox Demo Title';
	  cell.appendChild(title);
	  return cell;
	};
	


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var append = __webpack_require__(3).append;
	var el = __webpack_require__(3).el;
	
	var t = {
	  lightboxElement: __webpack_require__(11),
	  lightboxTitle: __webpack_require__(12)
	};
	
	module.exports = function (imageTitle, imageNode, closeCallback) {
	  var lightbox = el('div', 'lightbox');
	  var close = t.lightboxElement('lightbox-close', 'X', closeCallback);
	  var title = t.lightboxTitle(imageTitle);
	  append(lightbox, close, imageNode, title);
	  return lightbox;
	};
	


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var el = __webpack_require__(3).el;
	
	module.exports = function(className, textContent, callback) {
	  var button = el('div', className);
	  button.textContent = textContent;
	  button.addEventListener('click', callback);
	  return button;
	};
	


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var el = __webpack_require__(3).el;
	
	module.exports = function (imageTitle) {
	  var title = el('p');
	  title.textContent = imageTitle || 'Lightbox Demo Title';
	  return title;
	};
	


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var domTools = __webpack_require__(3);
	var append = domTools.append;
	var remove = domTools.remove;
	var getWidth = domTools.getWidth;
	
	
	var t = {
	  lightboxElement: __webpack_require__(11),
	  lightbox: __webpack_require__(10),
	  image: __webpack_require__(8)
	};
	
	
	// creates the lightbox DOM nodes and appends them to document.body
	// takes advantage of JS closures to handle adding and removing events
	var lightboxView = function (imageNode, imageTitle, imageCollection) {
	  var shadowbox = t.lightboxElement('shadowbox', '', closeLightbox); 
	  var lightbox = t.lightbox(imageTitle, imageNode, closeLightbox);
	  var backButton = t.lightboxElement('lightbox-back-button', '<', regress);
	  var forwardButton = t.lightboxElement('lightbox-forward-button', '>', progress);
	
	  append(document.body, shadowbox, backButton, forwardButton, lightbox);
	
	  position(); 
	  window.onresize = position;
	  window.addEventListener('keydown', navigateOnKeyDown);
	
	  // repositions the lightbox and forward and back buttons
	  // needed to keep things centered and responsive
	  function position () {
	    var lightboxWidth = getWidth(lightbox);
	    var windowWidth = getWidth(document.body);
	    var backButtonWidth = getWidth(backButton);
	    var forwardButtonWidth = getWidth(forwardButton);
	    var margin = 20;
	
	    var lightboxLeft = (windowWidth - lightboxWidth) / 2;
	    lightbox.style.left = lightboxLeft;
	    backButton.style.left = lightboxLeft - backButtonWidth - 3 * margin;
	    forwardButton.style.left = lightboxLeft + lightboxWidth + margin;
	  };
	
	  // for easy keyboard naviation using the arrow keys
	  function navigateOnKeyDown (ev) {
	    var keys = {rightArrow: 39, leftArrow: 37};
	    if (ev.which === keys.rightArrow) {
	      progress();
	    } else if (ev.which === keys.leftArrow) {
	      regress();
	    }
	  };
	
	  // steps teh lightbox forwards in the collection
	  function progress  () {
	    for (var i = 0; i < imageCollection.length; i++) {
	      if (imageNode.id === imageCollection[i].id && i < imageCollection.length - 1) {
	        closeLightbox();
	        var image = imageCollection[i + 1];
	        lightboxView(
	            t.image(image.src, image.id),
	            image.title,
	            imageCollection
	            );
	        return;
	      }
	    }
	
	    closeLightbox();
	  };
	
	  // steps the lightbox backwards in the collection
	  function regress () {
	    for (var i = 0; i < imageCollection.length; i++) {
	      if (imageNode.id === imageCollection[i].id && i > 0) {
	        closeLightbox();
	        var image = imageCollection[i - 1];
	        lightboxView(t.image(image.src, image.id), image.title, imageCollection);
	        return;
	      }
	    }
	
	    closeLightbox();
	  };
	
	  // removes the lightbox-associated DOM nodes and removes the keydown listener
	  function closeLightbox () {
	    window.removeEventListener('keydown', navigateOnKeyDown);
	    remove(lightbox, backButton, forwardButton, shadowbox);
	  };
	};
	
	module.exports = lightboxView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map