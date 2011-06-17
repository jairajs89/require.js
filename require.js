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
				script.async = true;
				script.onload = script.onreadystatechange = function(){
					if(done)
						return;
					if (!this.readyState || this.readyState == 'loaded'
											|| this.readyState == 'complete') {
						done = true;
						
						if( typeof(cache[script_name]) != 'boolean' ) {
							cache[script_name].push(callback);
						} else {
							cache[script_name] = true;
							callback && callback();
						}
						
						script.onload = script.onreadystatechange = null;
						head.removeChild(script);
					}
				};
				head.appendChild(script);
			}
		};
	
	require.start = function(script_name){
		cache[script_name] = [];
	};
	
	require.end = function(script_name){
		var scripts = cache[script_name];
		cache[script_name] = true;
		for(var i=0, l=scripts.length; i<l; ++i)
			scripts[i] && scripts[i]();
	};
	
	return require;
})();
