/**
 * @author @flockonus
 * @classDescription The class responsible to preload and store images
 * @param cb {function} A function to be called when all imgs are loaded
 * 
 * On the contruction should be fed with a valid canvas_id to draw on.
 * This class does not erase, it just draw, so I consider it non-ubtrusive, it is supposed to play well with other engines
 * 
 * In the future this class should split in various, but for now it is ok
*/


function ImgManager( ){
	var instance = this;
	
	// the function to evoke when all images are loaded // typical: $im.images_loaded
	this.callback = function(){ alert('Wops, ImgManager calback undefined!') };
	
	// This collection handles all images to load in the form: 'img_url_as_key' : {loaded : boolean, obj : a Image}
	this.collection = {};
	
	//This gotta hold pendencys of images to load, when all done, summon a callback
	this.waiting = 0;
	
	this.done_pool = 99999;
	
	/**
	 * Used in order to register all Imgs in a arr (for instance, from a model)
	 * @param {Object} arr A array with urls of images to preload
	 */
	function mass_register( arr, cb ){
		if(typeof cb == 'function')  instance.callback = cb;
		
		arr.each(function(i, url){
			register(url);
		});
		// Pool to callback whenever images are loaded
		instance.done_pool = setInterval( function(){
			if(instance.waiting == 0) {
				clearInterval(instance.done_pool);
//debugger
				instance.callback();
			} else
				console.log('intervall.. not yet ;P')
		}, 100 );
	}
	
	function register(url){
		instance.waiting++;
		
		// If we don't have this img yet, preload
		if( !instance.collection[url] ){
			//add the callback onload(decrement), make it load
			instance.collection[url] = new Image();
			instance.collection[url].onload = function(){
																							instance.waiting--;
																							console.log('ImgManager.resgister('+url+'): done!')
																						};
			instance.collection[url].src = url;
		} else{
			instance.waiting--; //Arg! dunno.... gotta make test with heavy remote Img =/
		}
	}
	
	/**
	 * 
	 * @param {String} url Requires the url as registered in the model.
	 * @return a Image object, if any has been preloaded
	 */
	function get( url ){
		return instance.collection[url]
	}
	
	this.register = register;
	this.mass_register = mass_register;
	this.get = get;
}
