/**
 * @author @flockonus
 * @classDescription The class responsible for animation itself
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
	
	function register(url){
		waiting++;
		if( !instance.collection[url] ){
			//add the callback onload(decrement), make it load
		} else{
			waiting--; //Arg! dunno.... gotta make test with heavy remote Img =/
		}
	}
	
	this.register = register;
}
