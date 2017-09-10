// Elements
var bannerEl = document.querySelector(".banner");
var sliderEl = document.querySelectorAll(".slider");
var previousEl = document.querySelector(".previous");
var nextEl = document.querySelector(".next");
var linksEl = document.querySelector(".links");
var imgLinks = linksEl.getElementsByTagName("a");

// Data attributes
var height = bannerEl.getAttribute("data-height"); 
var width = bannerEl.getAttribute("data-width");
var slideSpeed = bannerEl.getAttribute("data-slide-speed");
var autoSlide = bannerEl.getAttribute("data-autoslide");
var nextCursor = nextEl.getAttribute("data-next-cursor");
var previousCursor = previousEl.getAttribute("data-previous-cursor");

// Slider variables
var totalImgs = imgLinks.length;
var currentImgNumber = 1;
var nextImgNumber = currentImgNumber + 1;
var previousImgNumber = totalImgs;
var randomImgNumber = 3;
var currentImg = bannerEl.querySelector('img:nth-of-type(' + currentImgNumber + ')');
var nextImg = bannerEl.querySelector('img:nth-of-type(' + nextImgNumber + ')');
var previousImg = bannerEl.querySelector('img:nth-of-type(' + previousImgNumber + ')');
var randomImg = bannerEl.querySelector('img:nth-of-type(' + randomImgNumber + ')');

// Set CSS to element or elements
function setCSS(styles, elements) {
	if (elements.length > 1) {
		for (var i = 0; i < elements.length; i++) {
	    Object.assign(elements[i].style, styles);
		}
	} else {
		Object.assign(elements.style, styles)
	}
}

// Set CSS before elements appear
document.body.style.margin = '0';

setCSS({'width': width, 
	'height': height + 'px', 
	'margin': '0 auto'
}, bannerEl);

setCSS({'margin': '0 auto', 
	'position': 'relative', 
	'width': '50%', 
	'height': height + 'px'
}, [previousEl, nextEl]);

setCSS({'cursor': (totalImgs <= 1) ? 'default' : previousCursor ? 'url(' + previousCursor + '), auto' : 'w-resize', 
	'float': 'left', 
	'margin': '0 auto', 
	'position': 'relative', 
	'width': '50%'
}, previousEl);

setCSS({'cursor': (totalImgs <= 1) ? 'default' : nextCursor ? 'url(' + nextCursor + '), auto' : 'e-resize', 
	'float': 'right'
}, nextEl);

setCSS({'text-align': 'center', 
	'position': 'absolute', 
	'top': height - 50 + 'px', 
	'left': '0', 'right': '0', 
	'margin': 'auto', 
	'cursor': 'default'
}, linksEl);

// For multiple elements of same class
// Iterate over and set individual element's CSS
for (var i = 0; i < sliderEl.length; i++) {
	setCSS({'width': width, 'height': 
		height + 'px', 'margin': '0 auto'
	}, sliderEl[i]);

	setCSS({'position': 'absolute', 
		'opacity': '0', 'object-fit': 'cover'
	}, sliderEl[i]);
}

for (var i = 0; i < imgLinks.length; i++) {
	setCSS({'color': '#000',
	  'display': 'inline-block',
	  'text-decoration': 'none',
	  'background': '#FFF',
	  'border-radius': '50%',
	  'height': '15px',
	  'width': '15px',
	  'margin': '10px 5px',
	  'transition': 'all 0.5s'
	}, imgLinks[i]);
}

(function() {

	function fadeTo(element, speed, opacity) {
		setCSS({'transition': 'none',
			'transition': 'opacity ' + speed + 'ms',
			'opacity': opacity
		}, element);
	}
   
	function loadImg() {
		fadeTo(currentImg, slideSpeed, 1);
	}
   
	function nextImgFade() {
		fadeTo(currentImg, slideSpeed, 0);
		fadeTo(nextImg, slideSpeed, 1);
	}
   
	function previousImgFade() {
		fadeTo(currentImg, slideSpeed, 0);
		fadeTo(previousImg, slideSpeed, 1);
	}
   
	function randomImgFade() {
		fadeTo(currentImg, slideSpeed, 0);
		fadeTo(randomImg, slideSpeed, 1);
	}
   
	function boldText() {
		for (var i = 0; i < imgLinks.length; i++) {
			var currentHref = imgLinks[i].getAttribute('href');
			if (currentImgNumber == currentHref) {
				setCSS({'opacity': '0.8'}, imgLinks[i]);
			} else {
				setCSS({'opacity': '0.4'}, imgLinks[i]);
			}
		}
	}
   
	function imgLoop() {
		if (currentImgNumber == 1) {
			nextImgNumber = currentImgNumber + 1;
			previousImgNumber = totalImgs;
		} else if (currentImgNumber == totalImgs) {
			nextImgNumber = 1;
			previousImgNumber = currentImgNumber - 1;
		} else {
			nextImgNumber = currentImgNumber + 1;
			previousImgNumber = currentImgNumber - 1;
		}
	}
   
	function refreshImgs() {
		currentImg = bannerEl.querySelector('img:nth-of-type(' + currentImgNumber + ')');
		nextImg = bannerEl.querySelector('img:nth-of-type(' + nextImgNumber + ')');
		previousImg = bannerEl.querySelector('img:nth-of-type(' + previousImgNumber + ')');
		randomImg = bannerEl.querySelector('img:nth-of-type(' + randomImgNumber + ')');
	}
   
	function callFunctions() {
		boldText();
		imgLoop();
		refreshImgs();
	}

	function restartInterval() {
		clearInterval(interval);
		interval = setInterval(loopImages, autoSlide);
	}

	function loopImages() {
		var event = document.createEvent('HTMLEvents');
		event.initEvent('click', true, false);
		nextEl.dispatchEvent(event);
	}

	// Iterate over all links
	// On link click, restart interval, and fade in that image
	for (var i = 0; i < imgLinks.length; i++) { 
		imgLinks[i].onclick = function(){ 
	  	restartInterval();
			randomImgNumber = parseInt(this.getAttribute('href'));
			randomImg = bannerEl.querySelector('img:nth-of-type(' + randomImgNumber + ')');
			randomImgFade();
			currentImgNumber = randomImgNumber;
			callFunctions();
			return false;
		} 
	}

	// Iterate over previous and next elements
	// On click, check direction, fade next image in and assign current image number
	var previousAndNext = [previousEl, nextEl];
	for (var i = 0; i < previousAndNext.length; i++) { 
		if (totalImgs > 1) {
			previousAndNext[i].onclick = function(e) { 
		  	var direction = e.target.getAttribute('class');
				if (direction == "next") {
					nextImgFade();
					currentImgNumber = nextImgNumber;
				} else {
					previousImgFade();
					currentImgNumber = previousImgNumber;
				}
				restartInterval();
				callFunctions();
			} 
		}
	}

	boldText();
	loadImg();

	// Only set interval if there is more than 1 image
	if (totalImgs > 1) {
		var interval = setInterval(loopImages, autoSlide);
	}
	
})();