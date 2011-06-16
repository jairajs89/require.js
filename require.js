require = (function(dir, ext){
	dir = dir || '';
	ext = ext || '';
	var cache = {},
	 	require = function(script_name, callback){
			// Multiple requires
			if( typeof(script_name) != 'string' ) {
				var num_done = 0,
					num_scripts = script_name.length;
				for(var i=0; i<num_scripts; ++i) {
					require(script_name[i], function(){
						if( ++num_done == num_scripts )
							callback && callback();
					});
				}
				return;
			}
			
			// Script already loaded
			if( cache[script_name] === true ) {
				callback && callback();
			
			// Script is loading
			} else if( cache[script_name] === false ) {
				setTimeout(function(){
					require(script_name, callback);
				}, 50);
			
			// Script is not loading yet
			} else {
				cache[script_name] = false;
				var done = false,
					head = document.getElementsByTagName('head')[0],
					script = document.createElement('script');
				script.src = dir+script_name+ext;
				script.onload = script.onreadystatechange = function(){
					if(done)
						return;
					if (!this.readyState || this.readyState == 'loaded'
											|| this.readyState == 'complete') {
						done = true;
						cache[script_name] = true;
						callback && callback();
						script.onload = script.onreadystatechange = null;
						head.removeChild(script);
					}
				};
				head.appendChild(script);
			}
		};
	return require;
})();
