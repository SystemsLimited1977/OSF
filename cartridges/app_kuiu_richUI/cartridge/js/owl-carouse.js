'use strict';
 
// Define namespace for exported properties and functions
var owlCarousel = {
	init: function () {
		$("#owl-demo").owlCarousel({		   
		       autoPlay: 3000, //Set AutoPlay to 3 seconds
		       items : 3,
		       itemsDesktop : [1170,3],
		       itemsDesktopSmall: [992,2],
		       itemsTablet : [767,2],
		       itemsTabletSmall : [480,1],
		       itemsMobile : [320,1],
		       navigation : true,
		       navigationText : ["",""]
		   });
		 $("#owl-demo1").owlCarousel({
		   
		       autoPlay: 5000, //Set AutoPlay to 3 seconds
		       items : 4,
		       itemsDesktop : [1170,4],
		       itemsDesktopSmall: [992,3],
		       itemsTablet : [767,3],
		       itemsTabletSmall : [480,1],
		       itemsMobile : [320,1],
		       navigation : true,
		       navigationText : ["",""]
		   });
		 $("#owl-demo3").owlCarousel({     
		     navigation : true, // Show next and prev buttons
	        navigationText : ["",""],
	        singleItem:true,
	        autoPlay : false
	      });
		// code fore placeholder compatible with IE9
		 $('input, textarea').placeholder({
		     customClass: 'my-placeholder'
		 });
	}
};
 
module.exports = owlCarousel;
