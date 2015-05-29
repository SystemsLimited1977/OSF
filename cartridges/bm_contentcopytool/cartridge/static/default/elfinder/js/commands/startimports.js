"use strict";
/**
 * @class  elFinder command "startimports"
 * Copies files across folders in the same demandware root type directory or locale. I.e From Libraries/DE to Libraries/DK 
 *
 * @author Holger Nestmann
 **/
elFinder.prototype.commands.startimports = function() {
	var self  = this;
	var fm    = self.fm;
	
	this.disableOnSearch = true;
	this.updateOnSelect  = false;
	this.mime            = 'directory';
	this.exec = function(hashes) {		
		// dialog options
		var opts   = new Object();
		opts.title = this.title;
		opts.width = "auto";
		opts.close = function() { 
			$(this).elfinderdialog('destroy'); 
		};

		// create markup shown in the selection dialog
		// @todo make nicer, since html inside javascript is ugly
		var view = "<div class='test'>Please confirm the start of import of all the files visible in this module</div>";
		view += "<form>";
		view += '<button id="jsConfirm" name="submit">OK</button>';
		view += "</form>";
		
		var dialog = this.fm.dialog(view, opts);		
		
		jQuery("#jsConfirm").click(function(e){
			dialog.elfinderdialog('destroy'); 
			// submit action to server
			fm.request({
				data       : {cmd : "startimport"},
				notify     : {type : 'reload', cnt : 1},
				syncOnFail : true
			});
			return false;
		});
	}
	
	this.getstate = function(sel) {
		if (fm.option('connectorType') == "IMPORT") {
			return 1;
		} else {
			return -1;
		}
	}

}
