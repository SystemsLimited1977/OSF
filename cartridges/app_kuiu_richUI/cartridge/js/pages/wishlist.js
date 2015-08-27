'use strict';

var addProductToCart = require('./product/addToCart'),
	page = require('../page'),
	sendToFriend = require('../send-to-friend'),
	util = require('../util'),
	dialog = require('../dialog'),
	validator = require('../validator');

exports.init = function () {
	addProductToCart();
	sendToFriend.initializeDialog('.list-share');
	$('#editAddress').on('change', function () {
		page.redirect(util.appendParamToURL(Urls.wishlistAddress, 'AddressID', $(this).val()));
	});

	//add js logic to remove the , from the qty feild to pass regex expression on client side
	$('.option-quantity-desired input').on('focusout', function () {
		$(this).val($(this).val().replace(',', ''));
	});
	
	//password reset link when user is not logged in and tries to add some item to wish list
	$('#password-reset').on('click', function (e) {
		e.preventDefault();
		dialog.open({
			url: $(e.target).attr('href'),
			options: {
				open: function () {
					validator.init();
					var $requestPasswordForm = $('[name$="_requestpassword"]'),
						$submit = $requestPasswordForm.find('[name$="_requestpassword_send"]');
					$($submit).on('click', function (e) {
						if (!$requestPasswordForm.valid()) {
							return;
						}
						e.preventDefault();
						dialog.submit($submit.attr('name'));
					});
				}
			}
		});
		$('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable').addClass('password-forget');
		$('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable .ui-dialog-titlebar.ui-widget-header.ui-corner-all.ui-helper-clearfix.ui-draggable-handle span#ui-id-1').html('<h1>Forgot Password?</h1>');
	});
};
