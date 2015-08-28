jQuery(document).ready(function(){
	
	jQuery("#cancel").click(function(e){
		e.preventDefault();
		jQuery("#emailsignup").dialog("close");
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
				debugger;
				if(jQuery(data).find('input[name="errorinform"]').length > 0){
					if(jQuery(data).find('input[name="errorinform"]').val().length > 0){
						jQuery('#emailsignup').empty().html(data);
					}
				}	
				else{
					jQuery('#emailsignup').dialog("close");
					jQuery('<div/>', {'id':'thankyou'}).appendTo('body');
					var dialogElem = jQuery('#thankyou');
					jQuery(dialogElem).css('display','none');
					jQuery(dialogElem).empty().html(data);
					jQuery(dialogElem).dialog({
					    modal: true,
					    draggable: false,
					    resizable: false,
					    width: 720,
					    dialogClass: 'ui-dialog-osx thankyou-popup'
					}); 
				}
			});
	});
});