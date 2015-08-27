/* global Countries */

'use strict';

var _ = require('lodash');

var util = {
	/**
	 * @function
	 * @description appends the parameter with the given name and value to the given url and returns the changed url
	 * @param {String} url the url to which the parameter will be added
	 * @param {String} name the name of the parameter
	 * @param {String} value the value of the parameter
	 */
	appendParamToURL: function (url, name, value) {
		// quit if the param already exists
		if (url.indexOf(name + '=') !== -1) {
			return url;
		}
		var separator = url.indexOf('?') !== -1 ? '&' : '?';
		return url + separator + name + '=' + encodeURIComponent(value);
	},
	/**
	 * @function
	 * @description appends the parameters to the given url and returns the changed url
	 * @param {String} url the url to which the parameters will be added
	 * @param {Object} params
	 */
	appendParamsToUrl: function (url, params) {
		var _url = url;
		_.each(params, function (value, name) {
			_url = this.appendParamToURL(_url, name, value);
		}.bind(this));
		return _url;
	},
	/**
	 * @function
	 * @description extract the query string from URL
	 * @param {String} url the url to extra query string from
	 **/
	getQueryString: function (url) {
		var qs;
		if (!_.isString(url)) { return; }
		var a = document.createElement('a');
		a.href = url;
		if (a.search) {
			qs = a.search.substr(1); // remove the leading ?
		}
		return qs;
	},
	/**
	 * @function
	 * @description
	 * @param {String}
	 * @param {String}
	 */
	elementInViewport: function (el, offsetToTop) {
		var top = el.offsetTop,
			left = el.offsetLeft,
			width = el.offsetWidth,
			height = el.offsetHeight;

		while (el.offsetParent) {
			el = el.offsetParent;
			top += el.offsetTop;
			left += el.offsetLeft;
		}

		if (typeof(offsetToTop) !== 'undefined') {
			top -= offsetToTop;
		}

		if (window.pageXOffset !== null) {
			return (
				top < (window.pageYOffset + window.innerHeight) &&
				left < (window.pageXOffset + window.innerWidth) &&
				(top + height) > window.pageYOffset &&
				(left + width) > window.pageXOffset
			);
		}

		if (document.compatMode === 'CSS1Compat') {
			return (
				top < (window.document.documentElement.scrollTop + window.document.documentElement.clientHeight) &&
				left < (window.document.documentElement.scrollLeft + window.document.documentElement.clientWidth) &&
				(top + height) > window.document.documentElement.scrollTop &&
				(left + width) > window.document.documentElement.scrollLeft
			);
		}
	},

	/**
	 * @function
	 * @description Appends the parameter 'format=ajax' to a given path
	 * @param {String} path the relative path
	 */
	ajaxUrl: function (path) {
		return this.appendParamToURL(path, 'format', 'ajax');
	},

	/**
	 * @function
	 * @description
	 * @param {String} url
	 */
	toAbsoluteUrl: function (url) {
		if (url.indexOf('http') !== 0 && url.charAt(0) !== '/') {
			url = '/' + url;
		}
		return url;
	},
	/**
	 * @function
	 * @description Loads css dynamically from given urls
	 * @param {Array} urls Array of urls from which css will be dynamically loaded.
	 */
	loadDynamicCss: function (urls) {
		var i, len = urls.length;
		for (i = 0; i < len; i++) {
			this.loadedCssFiles.push(this.loadCssFile(urls[i]));
		}
	},

	/**
	 * @function
	 * @description Loads css file dynamically from given url
	 * @param {String} url The url from which css file will be dynamically loaded.
	 */
	loadCssFile: function (url) {
		return $('<link/>').appendTo($('head')).attr({
			type: 'text/css',
			rel: 'stylesheet'
		}).attr('href', url); // for i.e. <9, href must be added after link has been appended to head
	},
	// array to keep track of the dynamically loaded CSS files
	loadedCssFiles: [],

	/**
	 * @function
	 * @description Removes all css files which were dynamically loaded
	 */
	clearDynamicCss: function () {
		var i = this.loadedCssFiles.length;
		while (0 > i--) {
			$(this.loadedCssFiles[i]).remove();
		}
		this.loadedCssFiles = [];
	},
	/**
	 * @function
	 * @description Extracts all parameters from a given query string into an object
	 * @param {String} qs The query string from which the parameters will be extracted
	 */
	getQueryStringParams: function (qs) {
		if (!qs || qs.length === 0) { return {}; }
		var params = {},
			unescapedQS = decodeURIComponent(qs);
		// Use the String::replace method to iterate over each
		// name-value pair in the string.
		unescapedQS.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
			function ($0, $1, $2, $3) {
				params[$1] = $3;
			}
		);
		return params;
	},

	fillAddressFields: function (address, $form) {
		for (var field in address) {
			if (field === 'ID' || field === 'UUID' || field === 'key') {
				continue;
			}
			// if the key in address object ends with 'Code', remove that suffix
			// keys that ends with 'Code' are postalCode, stateCode and countryCode
			$form.find('[name$="' + field.replace('Code', '') + '"]').val(address[field]);
			// update the state fields
			if (field === 'countryCode') {
				$form.find('[name$="country"]').trigger('change');
				// retrigger state selection after country has changed
				// this results in duplication of the state code, but is a necessary evil
				// for now because sometimes countryCode comes after stateCode
				$form.find('[name$="state"]').val(address.stateCode);
			}
		}
	},
	/**
	 * @function
	 * @description Updates the states options to a given country
	 * @param {String} countrySelect The selected country
	 */
updateStateOptions: function (form) {
		var $form = $(form),
			$country = $form.find('select[id$="_country"]'),
			country = Countries[$country.val()];
		if ($country.length === 0 || !country) {
			return;
		}
		var arrHtml = [],
			$stateField = $country.data('stateField') ? $country.data('stateField') : $form.find('select[name$="_state"]'),
			$postalField = $country.data('postalField') ? $country.data('postalField') : $form.find('input[name$="_postal"]'),
			$stateLabel = ($stateField.length > 0) ? $form.find('label[for="' + $stateField[0].id + '"] span').not('.required-indicator') : undefined,
			$postalLabel = ($postalField.length > 0) ? $form.find('label[for="' + $postalField[0].id + '"] span').not('.required-indicator') : undefined,
			prevStateValue = $stateField.val();
		// set the label text
		if ($postalLabel) {
			$postalLabel.html(country.postalLabel);
		}
		if ($stateLabel) {
			$stateLabel.html(country.regionLabel);
		} else {
			return;
		}
		
		var s;
		//select countries for international shipping
		if($country.val() == "CA" || $country.val() == "US")
			{
				$stateLabel.first().show();
				$stateLabel.last().hide();
				$("select[name$='_state']").parent().show();
				$("input[name$='_state']").parent().hide();
				
				for (s in country.regions) {
					arrHtml.push('<option value="' + s + '">' + country.regions[s] + '</option>');
				}
				// clone the empty option item and add to stateSelect
				var o1 = $stateField.children().first().clone();
				$stateField.html(arrHtml.join('')).removeAttr('disabled').children().first().before(o1);
			}
		else
			{
				$stateLabel.first().hide();
				$stateLabel.last().show();
				$("select[name$='_state']").parent().hide();
				$("select[name$='_state']").attr("disabled","disabled");
				$("input[name$='_state']").parent().show();
				$("span[id$='_state-error']").hide();
			}
		// if a state was selected previously, save that selection
		if (prevStateValue && $.inArray(prevStateValue, country.regions)) {
			$stateField.val(prevStateValue);
		} else {
			$stateField[0].selectedIndex = 0;
		}
	},
	
	/**
	 * @function
	 * @description Update stetes label for international shipping
	 */
	
	updateStateLabel: function()
	{
		//select countries for international shipping
		var selectedCountry = $("select[name$='_country']").val();
		if(selectedCountry == "US" || selectedCountry == "CA")
			{
				$("select[name$='_state']").parent().show();
				$("input[name$='_state']").parent().hide();
			}
		else
			{
				$("select[name$='_state']").parent().hide();
				$("select[name$='_state']").attr("disabled","disabled");
				$("input[name$='_state']").parent().show();
			}
	},
	/**
	 * @function
	 * @description Updates the number of the remaining character
	 * based on the character limit in a text area
	 */
	limitCharacters: function () {
		$('form').find('textarea[data-character-limit]').each(function () {
			var characterLimit = $(this).data('character-limit');
			var charCountHtml = String.format(Resources.CHAR_LIMIT_MSG,
				'<span class="char-remain-count">' + characterLimit + '</span>',
				'<span class="char-allowed-count">' + characterLimit + '</span>');
			var charCountContainer = $(this).next('div.char-count');
			if (charCountContainer.length === 0) {
				charCountContainer = $('<div class="char-count"/>').insertAfter($(this));
			}
			charCountContainer.html(charCountHtml);
			// trigger the keydown event so that any existing character data is calculated
			$(this).change();
		});
	},
	/**
	 * @function
	 * @description Binds the onclick-event to a delete button on a given container,
	 * which opens a confirmation box with a given message
	 * @param {String} container The name of element to which the function will be bind
	 * @param {String} message The message the will be shown upon a click
	 */
	setDeleteConfirmation: function (container, message) {
		$(container).on('click', '.delete', function () {
			return window.confirm(message);
		});
	},
	/**
	 * @function
	 * @description Scrolls a browser window to a given x point
	 * @param {String} The x coordinate
	 */
	scrollBrowser: function (xLocation) {
		$('html, body').animate({scrollTop: xLocation}, 500);
	},

	isMobile: function () {
		var mobileAgentHash = ['mobile', 'tablet', 'phone', 'ipad', 'ipod', 'android', 'blackberry', 'windows ce', 'opera mini', 'palm'];
		var	idx = 0;
		var isMobile = false;
		var userAgent = (navigator.userAgent).toLowerCase();

		while (mobileAgentHash[idx] && !isMobile) {
			isMobile = (userAgent.indexOf(mobileAgentHash[idx]) >= 0);
			idx++;
		}
		return isMobile;
	}
};

module.exports = util;
