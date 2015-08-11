"use strict";
	function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}
	r(function(){
	    if(!document.getElementsByClassName) {
	        // IE8 support
	        var getElementsByClassName = function(node, classname) {
	            var a = [];
	            var re = new RegExp('(^| )'+classname+'( |$)');
	            var els = node.getElementsByTagName("*");
	            for(var i=0,j=els.length; i<j; i++)
	                if(re.test(els[i].className))a.push(els[i]);
	            return a;
	        }
	        var videos = getElementsByClassName(document.body,"youtubevideo");
	    }
	    else {
	        var videos = document.getElementsByClassName("youtubevideo");
	    }
	    var nb_videos = videos.length;
	    for (var i=0; i<nb_videos; i++) {
	        // Based on the YouTube ID, we can easily find the thumbnail image
	        var reg = new RegExp('(?:https?://)?(?:www\\.)?(?:youtu\\.be/|youtube\\.com(?:/embed/|/v/|/watch\\?v=))([\\w-]{10,12})', 'g');
	        var thumbid = reg.exec($(videos[i]).attr('thumb-id'))[1];
	        //videos[i].style.backgroundImage = 'url(http://i.ytimg.com/vi/' + videos[i].id + '/sddefault.jpg)';
	        videos[i].style.backgroundImage = 'url(http://i.ytimg.com/vi/' + thumbid + '/sddefault.jpg)';
	        $(videos[i]).attr('id', thumbid);

	        // Overlay the Play icon to make it look like a video player
	        var play = document.createElement("div");
	        play.setAttribute("class","play");
	        videos[i].appendChild(play);

	        videos[i].onclick = function() {
	        	$("body").append('<div id="youtube-video-container" style="display:none;"></div>');
	            // Create an iFrame with autoplay set to true
	            var iframe = $("<iframe></iframe>");//document.createElement("iframe");
	            var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
	            if (this.getAttribute("data-params")) iframe_url+='&'+this.getAttribute("data-params");
	            $(iframe).attr("src",iframe_url);
	            $(iframe).attr("frameborder",'0');
	            $(iframe).attr("allowfullscreen",'1');
	            $(iframe).attr("webkitallowfullscreen","");
	            $(iframe).attr("mozallowfullscreen","");
	            
	            // The height and width of the iFrame should be the same as parent
	            $(iframe).width(630);
        		$(iframe).height(460);

	            // Replace the YouTube thumbnail with YouTube Player
	            //this.parentNode.replaceChild(iframe, this);
	            $('#youtube-video-container').html(iframe);
	            $('#youtube-video-container').dialog({
	                modal: true,
	                draggable: false,
	                resizable: false,
	                //position: ['center', 'center'],
	                width: 700,
	                height:547,
	                dialogClass: 'ui-dialog-osx',
	                close: function(event, ui){
	                	$('#youtube-video-container').dialog('close');
	                	$('#youtube-video-container').remove();
	                }
	            });
	        }
	    }
	});