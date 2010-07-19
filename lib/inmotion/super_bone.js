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
	this.class_name = "SuperBone"
	
	if( typeof( attr ) == "undefined" ) attr = {}
	
	this.name = attr.name ?  attr.name : Math.floor( Math.random() * 1000000 ) + 'sb'
	this.visible = typeof( attr.visible ) == "boolean" ?  attr.visible : true
	this.moved = typeof( attr.moved ) == "boolean" ?  attr.moved : false
	
	this.p1x = p1x
	this.p1y = p1y
	this.p2x = p2x
	this.p2y = p2y
	this.shape = 'linear'
	this.animation = 'default'
	this.duration = 0.5
	
	
	// Only 1 or 2 allowed!
	function get_dot( number ){
		if( number == 1) return { x : p1x, y : p1y}
		if( number == 2) return { x : p2x, y : p2y}
		return {}
	}
	
	function set_dot(number, x, y){
		if( number == 1){
			instance.p1x = x
			instance.p1y = y
		}
		if( number == 2){
			instance.p2x = x
			instance.p2y = y
		} 
	}
	
	
	this.get_dot = get_dot
	this.set_dot = set_dot
}
