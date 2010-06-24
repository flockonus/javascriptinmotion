/**
 * @author @flockonus
 * 
 * A list of bones responsible for storing the complete bones 
 */

function KeyFrame(){
	instance = this
	this.changed = false
	
	this.list = []
	
	function add_bone( bone ){
		instance.list.push( bone )
		instance.changed = true
		return true
	}
	
	// TASK make a small canvas preview
	function preview(){
		return 'KF'
	}
	
	// PUBLIC METHODS
	this.add_bone = add_bone
	this.preview = preview
}