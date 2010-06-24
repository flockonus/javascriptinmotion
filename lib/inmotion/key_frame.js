/**
 * @author @flockonus
 * 
 * A list of bones responsible for storing the complete bones 
 */

function KeyFrame(){
	instance = this
	this.class_name = "KeyFrame"
	this.changed = false // for the redraw :)
	
	
	this.list = []
	
	function add_bone( bone ){
		instance.list.push( bone )
		instance.changed = true
		return true
	}
	
	function bone(i){
		if( instance.list[i] ) return instance.list[i]
		else null
	}
	
	// TASK make a small canvas preview
	function preview(){
		return 'KF'
		instance.changed = false
	}
	
	// PUBLIC METHODS
	this.add_bone = add_bone
	this.preview = preview
	this.bone = bone
}