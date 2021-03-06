'use strict';

var addThis = require('./addThis'),
	addToCart = require('./addToCart'),
	ajax = require('../../ajax'),
	image = require('./image'),
	progress = require('../../progress'),
	productStoreInventory = require('../../storeinventory/product'),
	tooltip = require('../../tooltip'),
	util = require('../../util'),
	youtube = require('../../youtube'),
	owlCarousel = require('../../owl-carouse');


/**
 * @description update product content with new variant from href, load new content to #product-content panel
 * @param {String} href - url of the new product variant
 **/
var updateContent = function (href) {
	var $pdpForm = $('.pdpForm'),
		qty = $pdpForm.find('input[name="Quantity"]').first().val(),
		params = {
			Quantity: isNaN(qty) ? '1' : qty,
			format: 'ajax',
			productlistid: $pdpForm.find('input[name="productlistid"]').first().val()
		};

	progress.show($('#pdpMain'));

	ajax.load({
		url: util.appendParamsToUrl(href, params),
		target: $('#product-content'),
		callback: function () {
			$('.swatches.color .selected-value').parent().parent().parent().find('span').after('<span class="value-color">' + $('.swatches.color .selected-value').text() + '</span>');
			$('.swatches.color .selected-value').remove();
			$('.swatches.size .selected-value').parent().parent().parent().find('span').after('<span class="value-size">' + $('.swatches.size .selected-value').text() + '</span>');
			$('.swatches.size .selected-value').remove();
			addThis();
			addToCart();
			if (SitePreferences.STORE_PICKUP) {
				productStoreInventory.init();
			}
			image.replaceImages();
			tooltip.init();
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
				$("#owl-demo3").owlCarousel({     
					navigation : true, // Show next and prev buttons
					navigationText : ["",""],
					singleItem:true,
					autoPlay : false
				});
			}
			$('a.z1').magnifik({
				classPrefix: 'm-',
				ratio: 1,
				seekImage: false,
				clickCloses: true,
				activationEvent: "click"
			});
			
			//Update Youtube video contents
			youtube.init();
			
			//More Button Scroll function
			  $('#product-overview-link').on('click', function(event) {
				  var target = $('#product-overview');			
				  if( target.length ) {
		          event.preventDefault();
		          $('html, body').animate({
		              scrollTop: target.offset().top
		          }, 1000);
		      }
		  });
		}
	});
};

module.exports = function () {
	var $pdpMain = $('#pdpMain');
	// hover on swatch - should update main image with swatch image
	$pdpMain.on('mouseenter mouseleave', '.swatchanchor', function () {
		var largeImg = $(this).data('lgimg'),
			$imgZoom = $pdpMain.find('.main-image'),
			$mainImage = $pdpMain.find('.primary-image');

		if (!largeImg) { return; }
		// store the old data from main image for mouseleave handler
		$(this).data('lgimg', {
			hires: $imgZoom.attr('href'),
			url: $mainImage.attr('src'),
			alt: $mainImage.attr('alt'),
			title: $mainImage.attr('title')
		});
		// set the main image
		image.setMainImage(largeImg);
	});

	// click on swatch - should replace product content with new variant
	$pdpMain.on('click', '.product-detail .swatchanchor', function (e) {
		e.preventDefault();
		//if ($(this).parents('li').hasClass('unselectable')) { return; }
		updateContent(this.href);
	});

	// change drop down variation attribute - should replace product content with new variant
	$pdpMain.on('change', '.variation-select', function () {
		if ($(this).val().length === 0) { return; }
		updateContent($(this).val());
	});
	
	// product overview and technology content accordion for mobile devices
	$(function() {
		$( "#accordion" ).accordion();
	});
	//More Button Scroll function
	 $('#product-overview-link').on('click', function(event) {
	 
	     var target = $('#product-overview');
	 
	     if( target.length ) {
	         event.preventDefault();
	         $('html, body').animate({
	             scrollTop: target.offset().top
	         }, 1000);
	     }
	 
	 });
	//initialize Fieldshoot and Recomendations carousel on PDP
	owlCarousel.init();
	
	//Initialize magnifik Zoom
    $('a.z1, a.z2, a.z3').magnifik({
	  classPrefix: 'm-',
	  ratio: 1,
	  seekImage: false,
	  clickCloses: true,
	  activationEvent: "click"
	});
    
  //Update Youtube video contents
	youtube.init();
    
};
