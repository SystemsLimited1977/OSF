'use strict';

var imagesLoaded = require('imagesloaded'),
	quickview = require('./quickview');

function initQuickViewButtons() {
	$('.tiles-container .product-tile').each(function () {
		if($(this).find('.quickview-container').length === 0){
			var $qvContainer = $('<div class="quickview-container"></div>');
			$qvContainer.appendTo(this);
			var $qvButton = $('<a class="quickviewbtn">' + Resources.QUICK_VIEW + '</a>');
			var $link = $(this).find('.thumb-link');
			$qvButton.attr({
				'href': $link.attr('href'),
				'title': $link.attr('title')
			}).appendTo($(this).find('.quickview-container'));
			$qvButton.on('click', function (e) {
				e.preventDefault();
				quickview.show({
					url: $(this).attr('href'),
					source: 'quickview'
				});
				return false;
			});
		}
		
	});
	/*$('.tiles-container .product-image').on('mouseenter', function () {
		var $qvButton = $('#quickviewbutton');
		if ($qvButton.length === 0) {
			$qvButton = $('<a id="quickviewbutton" class="quickview">' + Resources.QUICK_VIEW + '<i class="fa fa-arrows-alt"></i></a>');
		}
		var $link = $(this).find('.thumb-link');
		$qvButton.attr({
			'href': $link.attr('href'),
			'title': $link.attr('title')
		}).appendTo(this);
		$qvButton.on('click', function (e) {
			e.preventDefault();
			quickview.show({
				url: $(this).attr('href'),
				source: 'quickview'
			});
		});
	});*/
}

function gridViewToggle() {
	$('.toggle-grid').on('click', function () {
		$('.search-result-content').toggleClass('wide-tiles');
		$(this).toggleClass('wide');
	});
}

/**
 * @private
 * @function
 * @description Initializes events on the product-tile for the following elements:
 * - swatches
 * - thumbnails
 */
function initializeEvents() {
	initQuickViewButtons();
	gridViewToggle();
	$('.swatch-list').on('mouseleave', function () {
		// Restore current thumb image
		var $tile = $(this).closest('.product-tile'),
			$thumb = $tile.find('.product-image .thumb-link img').eq(0),
			data = $thumb.data('current');

		$thumb.attr({
			src: data.src,
			alt: data.alt,
			title: data.title
		});
	});
	$('.swatch-list .swatch').on('click', function (e) {
		e.preventDefault();
		if ($(this).hasClass('selected')) { return; }

		var $tile = $(this).closest('.product-tile');
		$(this).closest('.swatch-list').find('.swatch.selected').removeClass('selected');
		$(this).addClass('selected');
		$tile.find('.thumb-link').attr('href', $(this).attr('href'));
		$tile.find('name-link').attr('href', $(this).attr('href'));

		var data = $(this).children('img').filter(':first').data('thumb');
		var $thumb = $tile.find('.product-image .thumb-link img').eq(0);
		var currentAttrs = {
			src: data.src,
			alt: data.alt,
			title: data.title
		};
		$thumb.attr(currentAttrs);
		$thumb.data('current', currentAttrs);
	}).on('mouseenter', function () {
		// get current thumb details
		var $tile = $(this).closest('.product-tile'),
			$thumb = $tile.find('.product-image .thumb-link img').eq(0),
			data = $(this).children('img').filter(':first').data('thumb'),
			current = $thumb.data('current');

		// If this is the first time, then record the current img
		if (!current) {
			$thumb.data('current', {
				src: $thumb[0].src,
				alt: $thumb[0].alt,
				title: $thumb[0].title
			});
		}

		// Set the tile image to the values provided on the swatch data attributes
		$thumb.attr({
			src: data.src,
			alt: data.alt,
			title: data.title
		});
	});
	//Toggle slide of refinements
	$("#refineby").unbind('click').bind('click', function () {
	   $('#secondary').slideToggle();
	});
	$('#closeslider').click(function(e){
		e.preventDefault();
		$('#secondary').slideUp();
	});
}

exports.init = function () {
	var $tiles = $('.tiles-container .product-tile');
	if ($tiles.length === 0) { return; }
	imagesLoaded('.tiles-container').on('done', function () {
		$tiles.syncHeight()
			.each(function (idx) {
				$(this).data('idx', idx);
			});
	});
	initializeEvents();
};
