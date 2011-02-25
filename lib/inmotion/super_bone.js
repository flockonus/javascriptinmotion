/**
 * @author @flockonus
 * 
 * attr(Hash):
 *   name : the name of the bone, must be unique! (default (an unsafe) random)
 *   visible : ... (default true)
 *   moved : that means that the bone was already existent and has been moved (default false)
 */

function SuperBone(p1x, p1y, p2x, p2y, attr){
	var instance = this;
	this.class_name = "SuperBone";
	
	if( typeof( attr ) != "object" ) attr = {};
	this.name = attr.name ?  attr.name : Math.floor( Math.random() * 1000000 ) + 'sb';
	this.visible = typeof( attr.visible ) == "boolean" ?  attr.visible : true;
	this.img_url = (typeof( attr.img_url ) == "string" && attr.img_url.length > 1 ) ?  attr.img_url : false;
	//this.moved = typeof( attr.moved ) == "boolean" ?  attr.moved : false;
	
	
	this.p1x = p1x;
	this.p1y = p1y;
	this.p2x = p2x;
	this.p2y = p2y;
	this.shape = 'linear';
	this.animation = 'default';
	this.duration = 0.5;
	
	
	// Only 1 or 2 allowed!
	function get_dot( number ){
		if( number == 1) return { x : p1x, y : p1y}
		if( number == 2) return { x : p2x, y : p2y}
		return {}
	}
	
	function set_dot(number, x, y){
		if( number == 1){
			instance.p1x = x;
			instance.p1y = y;
		}
		if( number == 2){
			instance.p2x = x;
			instance.p2y = y;
		} 
	}
	
	function get_attr(){
	  return( {name : instance.name, visible: instance.visible, img_url: instance.img_url } ) 
	}

	
	function export(){
	  //return "{name: '"+instance.name+"', p1x:"+instance.p1x+", p1y:"+instance.p1y+", p2x:"+instance.p2x+", p2y:"+instance.p2y+", shape:'"+instance.shape+"', animation: '"+instance.animation+"', duration:"+instance.duration+"}"
		return "{ visible: "+instance.visible+", p1x:"+instance.p1x+", p1y:"+instance.p1y+
		", p2x:"+instance.p2x+", p2y:"+instance.p2y+", shape:'"+instance.shape+
		"', animation: '"+instance.animation+"', duration:"+instance.duration+
		( instance.img_url ? ", img_url: '"+instance.img_url+"'" : "" ) + "}"
	}
	
	function clone(){
		return new SuperBone(instance.p1x, instance.p1y, instance.p2x, instance.p2y,
						{name : instance.name, shape : instance.shape, duration: instance.duration,
							animation: instance.animation, img_url : instance.img_url, visible : instance.visible }  );
	}
	
	this.export = export;
	this.get_dot = get_dot;
	this.set_dot = set_dot;
	this.clone = clone;
	this.get_attr = get_attr;
}
