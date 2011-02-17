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


function ImgManager( cb ){
	var instance = this;
	
	// the function to evoke when all images are loaded // typical: $im.images_loaded
	var callback = cb
	
	// This collection handles all images to load in the form: 'img_url_as_key' : {loaded : boolean, obj : a Image}
	this.collection = {};
	
	//This gotta hold pendencys of images to load, when all done, summon a callback
	this.waiting = 0;
	
	function mass_register( arr ){
		arr.each(function(i, url){
			debugger;
			register(url);
		});
	}
	
	function register(url){
		instance.waiting++;
		
		if( !instance.collection[url] ){
			//add the callback onload(decrement), make it load
			instance.collection[url] = new Image();
			instance.collection[url].onload = function(){
																							instance.waiting--;
																							alert('onload!');
																						};
			instance.collection[url].src = url;
		} else{
			instance.waiting--; //Arg! dunno.... gotta make test with heavy remote Img =/
		}
	}
	
	this.register = register;
	this.mass_register = mass_register;
}
