/**
 * Patches upload specifically to demandware server side component, allowing to upload files larger than 20 MB in multiple chunks. Therefore no serverside limit should be reached
 * Creates one request per file
 * Relies on HTML5 blob.slice() API
 */

Number.prototype.pad = function(size) {
    var s = String(this);
    if(typeof(size) !== "number"){size = 2;}

    while (s.length < size) {s = "0" + s;}
    return s;
  }

elFinder.prototype.uploads.xhr = function(data, fm) { 
			var self   = fm ? fm : this,
				dfrd   = $.Deferred()
					.fail(function(error) {
						error && self.error(error);
					})
					.done(function(data) {
						data.warning && self.error(data.warning);
						data.removed && self.remove(data);
						data.added   && self.add(data);
						data.changed && self.change(data);
	 					self.trigger('upload', data);
						data.sync && self.sync();
					})
					.always(function() {
						notifyto && clearTimeout(notifyto);
						notify && self.notify({type : 'upload', cnt : -cnt, progress : 100*cnt});
					}),
				
				files       = data.input ? data.input.files : data.files, 
				cnt         = files.length,
				loaded      = 5,
				notify      = false,
				startNotify = function() {
					return setTimeout(function() {
						notify = true;
						self.notify({type : 'upload', cnt : cnt, progress : loaded*cnt});
					}, self.options.notifyDelay);
				},
				notifyto;
			
			if (!cnt) {
				return dfrd.reject();
			}

			var formDatas = new Array();
			// gather chunks
			$.each(files, function(i, file) {


				var BYTES_PER_CHUNK = 10485760; // 10MB chunk sizes.
				
				if ('slice' in file && file.size > BYTES_PER_CHUNK) {
		                var SIZE = file.size;
		                var start = 0;
		                var i = 0;
		                
		                var end = BYTES_PER_CHUNK;
		                while( start < SIZE ) {
		                	var formData = new FormData();
		                	var chunk = file.slice(start, end);
		                    start = end;
		                    i++;
		                    end = start + BYTES_PER_CHUNK;
		                    
		                    formData.append('fullsize', file.size);

		                    
		                    formData.append('upload[]', chunk, file.name + ".chunk" + i.pad(3));
		    				formData.append('cmd', 'upload');
		    				formData.append(self.newAPI ? 'target' : 'current', self.cwd().hash);
		    				$.each(self.options.customData, function(key, val) {
		    					formData.append(key, val);
		    				});
		    				$.each(self.options.onlyMimes, function(i, mime) {
		    					formData.append('mimes['+i+']', mime);
		    				});
		                    formDatas.push(formData);
		                    
		                }
					
				} else {
					// normal upload
					var formData = new FormData();
					formData.append('upload[]', file);
					formData.append('cmd', 'upload');
    				formData.append(self.newAPI ? 'target' : 'current', self.cwd().hash);
    				$.each(self.options.customData, function(key, val) {
    					formData.append(key, val);
    				});
    				$.each(self.options.onlyMimes, function(i, mime) {
    					formData.append('mimes['+i+']', mime);
    				});
					formDatas.push(formData);
				}
			});	
			
			// counter
			var finished = 0;
			// to allow only one execution at a time, requests are batched up
			// this will ensure no pipeline timeout due to request serialisation is hit
			var xhrChain = new Array();
			$.each(formDatas, function(i, formData) {	
				var xhr = new XMLHttpRequest();
				xhr.addEventListener('error', function() {
					dfrd.reject('errConnect');
				}, false);
				
				xhr.addEventListener('abort', function() {
					dfrd.reject(['errConnect', 'errAbort']);
				}, false);
				
				xhr.addEventListener('load', function() {
					var status = xhr.status, data;
					
					if (status > 500) {
						return dfrd.reject('errResponse');
					}
					if (status != 200) {
						return dfrd.reject('errConnect');
					}
					if (xhr.readyState != 4) {
						return dfrd.reject(['errConnect', 'errTimeout']); // am i right?
					}
					if (!xhr.responseText) {
						return dfrd.reject(['errResponse', 'errDataEmpty']);
					}
	
					data = self.parseUploadData(xhr.responseText);
					finished ++;
					// file chunk has been uploaded. Update progress bar
					notify && self.notify({type : 'upload', cnt : 0, progress : finished * 100 / formDatas.length });
					var nextXhr = xhrChain.pop();
					if (nextXhr) {
						// execute next request
						nextXhr.request.send(nextXhr.form);						
					}
					if (formDatas.length == finished) {
						// finish full operation
						data.error ? dfrd.reject(data.error) : dfrd.resolve(data);
					}
			
				}, false);
				
				xhr.upload.addEventListener('progress', function(e) {
					var prev = loaded, curr;
	
					if (e.lengthComputable) {
						
						curr = parseInt(e.loaded*100 / e.total);
	
						// to avoid strange bug in safari (not in chrome) with drag&drop.
						// bug: macos finder opened in any folder,
						// reset safari cache (option+command+e), reload elfinder page,
						// drop file from finder
						// on first attempt request starts (progress callback called ones) but never ends.
						// any next drop - successfull.
						if (curr > 0 && !notifyto) {
							notifyto = startNotify();
						}
						
						if (curr - prev > 4) {
							loaded = curr;
							//notify && self.notify({type : 'upload', cnt : 0, progress : (loaded - prev)*cnt});
						}
					}
				}, false);
				
				
				xhr.open('POST', self.uploadURL, true);				
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && xhr.status == 0) {
						// ff bug while send zero sized file
						// for safari - send directory
						dfrd.reject(['errConnect', 'errAbort']);
					}
				}
				
				// batch up requests
				if (i == 0) {
					xhr.send(formData);					
				} else {
					xhrChain.push({request: xhr, form : formData})
				}
			});
			// new github version incompatible with rc1
			try {
				if (!this.UA.Safari || !data.files) {
					notifyto = startNotify();
				}				
			} catch (e) {
				
			}
			
			return dfrd;
		};