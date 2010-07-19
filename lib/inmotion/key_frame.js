/**
 * @author @flockonus
 * 
 * A list of bones responsible for storing the complete bones 
 */

function KeyFrame( model ){
	var instance = this
	instance.class_name = "KeyFrame"
	instance.changed = false // for the redraw :)
	instance.list = []
	
	// That pretty much means this is not the first kf, so copy all existing sb
	
	if( model != null && typeof( model ) == 'object' ){
    for (var i=0; i<model.list.length; i++) {
			var sb = model.list[i]
      instance.list.push(new SuperBone(sb.p1x, sb.p1y, sb.p2x, sb.p2y, sb.p1x, 
																					{ name:sb.name, visible:sb.visible, moved:false} 
																			))
    }
	}
	
	function add_bone( bone ){
		instance.list.push( bone )
		instance.changed = true
		return true
	}
	
	function bone(i){
		if( instance.list[i] ) return instance.list[i]
		else null
	}
	
	function bone_named( name ){
		for (var i=0; i<instance.list.length; i++) {
			if (instance.list[i].name == name) return(instance.list[i] )
		};
		return null
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
	this.bone_named = bone_named
}