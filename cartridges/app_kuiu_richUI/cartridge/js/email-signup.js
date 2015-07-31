'use strict';
 
// Define namespace for exported properties and functions
var emailSignUp = {
	init: function () {
		$('#email-alert-address').keypress(function(ev) {
		    if(ev.which == 13) {
		    	emailSignUp.openEmailSignUpDialog();
		    	return false;
		    }
		});
		
		$('#footer-email').click(function(e){
			e.preventDefault();
			emailSignUp.openEmailSignUpDialog();
		});
	},
	openEmailSignUpDialog: function(){
		//var url = jQuery(this).parents('form').attr('action');
		var url = $('#email-alert-signup').attr('action');
		if (!url) { return; }

		var form = $(this).parents('form');
		var method = form.attr("method")||"POST";
		
		if (method && method.toUpperCase() == "POST")
		{
	         var postData = form.serialize() + "&"+ $(this).attr("name") + "=submit";
	    }
		
		jQuery.ajax({
			dataType : "html",
			type : "POST",
			url : url,
			data : {"emailAddress" : $("#email-alert-address").val()}
		})
		.done(function (response) {
			$('<div/>', {'id':'emailsignup','class':'emailsignupclass'}).appendTo('body');
			$('#emailsignup').css('display','none');
			$('#emailsignup').empty().html(response);
			
			jQuery('#emailsignup').dialog({
			    modal: true,
			    draggable: false,
			    resizable: false,
			    width: 720,
			    dialogClass: 'ui-dialog-osx'
			});
			
		})
		.fail(function (xhr, textStatus) {
			alert('Failed in Signing up');
		})
		.always(function () {
			
		});
	}
};
 
module.exports = emailSignUp;
