"use strict";
/**
 * @class  elFinder command "libcopy"
 * Copies files across folders in the same demandware root type directory or locale. I.e From Libraries/DE to Libraries/DK 
 *
 * @author Holger Nestmann
 **/
elFinder.prototype.commands.libcopy = function() {
	var self  = this;
	var fm    = self.fm;
	
	this.disableOnSearch = true;
	this.updateOnSelect  = false;
	this.mime            = 'directory';
	this.exec = function(hashes) {
		var execScope = this;
		var files  = this.files(hashes);
		
		// initialise list of 'relative' folders 
		var relatives = fm.option('relatives');
		var relativesGrouped = new Object();

		var relativeGroupLength = 0;
		for (var i = 0; i < relatives.length; i++) {
			var volume = this.files(relatives[i].phash)[0];
			if (!relativesGrouped[volume.name]) {
				relativesGrouped[volume.name] = new Array();
				relativeGroupLength++;
			}
			relativesGrouped[volume.name].push(relatives[i]);
		}
		
		// dialog options
		var opts   = new Object();
		opts.title = this.title;
		opts.width = "auto";
		opts.close = function() { 
			$(this).elfinderdialog('destroy'); 
		};

		// create markup shown in the selection dialog
		// @todo make nicer, since html inside javascript is ugly
		var view = "<div class='test'>Copy selected files to different Libraries. It will use the same folder structure as the selected library</div>";
		view += "<form>";
		view += "<br/><br/><table>";
		
		if (relativeGroupLength > 1) {
			view += '<tr>';
			view += '<td>&nbsp;</td><td><a href="/" class="jsSwapColumn" data-column="0">swap all</a></td><td><a href="/" class="jsSwapColumn" data-column="1">swap all</td>';
		}
		// a group per volume
		for (var relativeGroup in relativesGrouped) {
			if (typeof(relativesGrouped[relativeGroup]) != 'function') { 
				view += "<tr>";
				view += "<td><h3>" + relativeGroup + "</h3></td>";
				// a sorting function to make sure locales start with default and are followed by te sites locale
				var sorter = function (a,b) {
					if (a.name == "default") {
						return -1;
					} else if (b.name == "default") {
						return 1;
					} else if (a.name == a.standardLocale) {
						return -1;
					} else if (b.name == b.standardLocale) {
						return 1;
					} else {
						return 0;
					}					
				}
				var relativesSorted = relativesGrouped[relativeGroup];
				relativesSorted.sort(sorter);
				// show actual "relative"
				for (var i = 0; i < relativesSorted.length; i++) {
					// check where we are to not allow copying in the same directory
					// relies on serverside base32 encoding
					var fileObject = relativesSorted[i];
					var trailedTargetHash = files[0].hash.replace(new RegExp('0','g'),'');
					var trailedLibHash = fileObject.hash.replace(new RegExp('0','g'),'');
					var isDisabled = "";
					if (trailedTargetHash.indexOf(trailedLibHash) != -1) {
						isDisabled = 'disabled="disabled"';						
					}
					
					// render a selection checkbox 
					view += '<td><input name="locales" class="jsLibCopyCheckbox" data-column="' + i + '" id="jsLibCopy-' + fileObject.hash + '" data-lib-hash="' + fileObject.hash + '" type="checkbox"' + isDisabled +'>' + fileObject.name + '</input></td>';
				}
				view += "</tr>";
			}
		}
		view += "</table>";

		view += '<button id="jsLibCopySubmit" name="submit">Apply</button>';
		view += "</form>";
		
		var dialog = this.fm.dialog(view, opts);
		
		// click handler for submission
		jQuery(".jsSwapColumn").click(function(e){
			var column = jQuery(this).attr('data-column');
			var boxes = jQuery('.jsLibCopyCheckbox[data-column="' + column +  '"]');
			for (var i=0; i < boxes.length; i++) {
				jQuery(boxes[i]).click();
			}
			
			return false;
			
		});
		
		jQuery("#jsLibCopySubmit").click(function(e){
			
			
			var libraryHashes = new Array();
			var checkBoxes = jQuery('input.jsLibCopyCheckbox:checked');
			// get checkboxes and memorize hashes
			for (var i = 0; i < checkBoxes.length; i++) {
				var box = jQuery(checkBoxes[i]);
				libraryHashes.push(box.attr('data-lib-hash'));
				
			}
			
			var commandname = "filecopy";
			if (fm.option('connectorType') == "ASSET") {
				commandname = "assetcopy";
			} else if (fm.option('connectorType') == "SLOT") {
				commandname = "slotcopy";
			}
			dialog.elfinderdialog('close');
			
			// submit action to server
			if (libraryHashes.length != 0) {			
				fm.request({
					options    : {type : 'post'},
					data       : {cmd : commandname, targets : execScope.hashes(hashes), libs : libraryHashes},
					notify     : {type : 'reload', cnt : 1},
					syncOnFail : true
				}).done(function(data) {
					
					//dialog.elfinderdialog('close');
					// dialog options
					var opts   = new Object();
					opts.title = "Thank you";
					opts.width = "auto";
					opts.close = function() { 
						$(this).elfinderdialog('destroy'); 
					};
					var confirmationText = "";
					if (commandname == "filecopy") {
						confirmationText += "<p>The selected items are copied directly to their desitinations</p>";						
					} else {
						confirmationText += "<p>The selected items will be synced with the next syncronisation</p>";						
					}
					confirmationText += '<form><button id="jsConfirmButton" name="submit">OK</button></form>';
					var confirmationDialog = execScope.fm.dialog(confirmationText, opts);
					jQuery("#jsConfirmButton").click(function(){
						confirmationDialog.elfinderdialog('destroy');
						return false;
						
					})
					
				});
			} else {
				// dialog options
				var opts   = new Object();
				opts.title = "Thank you";
				opts.width = "auto";
				opts.close = function() { 
					$(this).elfinderdialog('destroy'); 
				};
				var confirmationText = "";
				confirmationText += "<p>Please select a destination</p>";						
				confirmationText += '<form><button id="jsConfirmButton" name="submit">OK</button></form>';
				var confirmationDialog = execScope.fm.dialog(confirmationText, opts);
				jQuery("#jsConfirmButton").click(function(){
					confirmationDialog.elfinderdialog('destroy'); 
				})
				
				
			}
			
			return false;
		});
		
		
	}

	
	this.getstate = function(sel) {
		var allowLibCopy = 0;
		var sel = this.files(sel);
		for (var i = 0; i < sel.length; i++) {
			if (sel[i].mime == 'directory') {
				allowLibCopy = -1;
			}
		}
		return allowLibCopy;
	}

}
