'use strict';

var account = require('./account'),
	bonusProductsView = require('../bonus-products-view'),
	quickview = require('../quickview'),
	cartStoreInventory = require('../storeinventory/cart');

/**
 * @private
 * @function
 * @description Binds events to the cart page (edit item's details, bonus item's actions, coupon code entry)
 */
function initializeEvents() {
	$('#cart-table').on('click', '.item-edit-details a', function (e) {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
			window.location.href = e.target.href;
		}
		else{
			e.preventDefault();
			quickview.show({
				url: e.target.href,
				source: 'cart'
			});
		}
	})
	.on('click', '.bonus-item-actions a, .item-details .bonusproducts a', function (e) {
		e.preventDefault();
		bonusProductsView.show(this.href);
	});

	// override enter key for coupon code entry
	$('form input[name$="_couponCode"]').on('keydown', function (e) {
		if (e.which === 13 && $(this).val().length === 0) { return false; }
	});
	
	 //Last Visted Product Carousel
	 $("#owl-last-visted-products").owlCarousel({     
	        autoPlay: false, 
	        items : 4,
	        itemsDesktop : [1170,4],
	        itemsDesktopSmall: [992,3],
	        itemsTablet : [767,3],
	        itemsTabletSmall : [480,1],
	        itemsMobile : [320,1],
	        navigation : true,
	        navigationText : ["",""]
	    });
	 //Featured Product Carousel
	 $("#owl-featured-products").owlCarousel({     
	        autoPlay: false, 
	        items : 4,
	        itemsDesktop : [1170,4],
	        itemsDesktopSmall: [992,3],
	        itemsTablet : [767,3],
	        itemsTabletSmall : [480,1],
	        itemsMobile : [320,1],
	        navigation : true,
	        navigationText : ["",""]
	    });
}

exports.init = function () {
	initializeEvents();
	if (SitePreferences.STORE_PICKUP) {
		cartStoreInventory.init();
	}
	account.initCartLogin();
};
