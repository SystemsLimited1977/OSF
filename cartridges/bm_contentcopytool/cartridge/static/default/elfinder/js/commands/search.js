"use strict"
/**
 * @class  elFinder command "search"
 * Find files
 * Edited for demandware to only search in subfolders of the active folder (like windows does)
 * Timeout is sent with the response
 * 
 * @author Dmitry (dio) Levashov
 * 
 **/
elFinder.prototype.commands.search = function() {
	this.title          = 'Find files';
	this.options        = {ui : 'searchbutton'}
	this.alwaysEnabled  = true;
	this.updateOnSelect = false;
	
	/**
	 * Return command status.
	 * Search does not support old api.
	 *
	 * @return Number
	 **/
	this.getstate = function() {
		return 0;
	}
	
	/**
	 * Send search request to backend.
	 *
	 * @param  String  search string
	 * @return $.Deferred
	 **/
	this.exec = function(q) {
		var fm = this.fm;
		
		if (typeof(q) == 'string' && q) {
			fm.trigger('searchstart', {query : q});
			var lastDir = fm.lastDir();
			
			return fm.request({
				data   : {cmd : 'search', q : q, target :  lastDir},
				notify : {type : 'search', cnt : 1, hideCnt : true}
			}).done(function (data) {
				if (data.timeout) {
					var opts   = new Object();
					opts.title = "Drat!";
					opts.width = "auto";
					opts.close = function() { 
						$(this).elfinderdialog('destroy'); 
					};
					var timeoutText = "<p>The search has timed out after 30 seconds. Please search in lower level folders or work with what we already found</p>";						
	
					timeoutText += '<form><button id="jsConfirmButton" name="submit">OK</button></form>';
					var timeoutDialog = fm.dialog(timeoutText, opts);
					jQuery("#jsConfirmButton").click(function(){
						timeoutDialog.elfinderdialog('destroy');
						return false;
						
					})
				
				}
			});
		}
		fm.getUI('toolbar').find('.'+fm.res('class', 'searchbtn')+' :text').focus();
		return $.Deferred().reject();
	}

}