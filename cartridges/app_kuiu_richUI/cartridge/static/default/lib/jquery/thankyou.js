jQuery(document).ready(function(){
	
	jQuery('#cancel').click(function(e){
		e.preventDefault();
		
		jQuery('#emailsignup').dialog("close");
		jQuery('#subscribeIno').dialog("close");
	});
	
	jQuery("#cancelThankYou").click(function(){
		jQuery("#thankyou").dialog("close");
	});
	
	jQuery('button[name="dwfrm_emailsignupdetails_submit"]').click(function(event) {	
		
		event.preventDefault();
		jQuery('#email-alert-address').val('');
		var form = jQuery(this).parents('form');
		var hitUrl = jQuery(form).attr('action');//"${URLUtils.continueURL()}",
		jQuery.ajax({
			  url: hitUrl,
			  type: 'POST',
			  dataType: 'html',
			  async: false,
	          cache: false, 
			  data: form.serialize() + "&"+ jQuery(this).attr("name") + "=submit",
			}).done(function ( data ) {
				
				jQuery('#emailsignup').dialog("close");
				jQuery('#subscribeIno').dialog("close");
				jQuery('<div/>', {'id':'thankyou'}).appendTo('body');
				jQuery('#thankyou').css('display','none');
				jQuery('#thankyou').empty().html(data);
				jQuery('#thankyou').dialog({
				    modal: true,
				    draggable: false,
				    resizable: false,
				    width: 720,
				    dialogClass: 'ui-dialog-osx'
				}); 
			});
	});
});