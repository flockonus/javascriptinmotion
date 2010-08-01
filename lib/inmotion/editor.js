/**
 * @author laptop
 */

 // TODO: add Shortcuts Draw Move Add kf and Action!
 
function Editor(){
	var instance = this;
	
	this.key_frames = [] // a list of key frames
	this.dt = new DrawingTable('drawingtable', this)
	this.dt.reset()
	this.mode = false
	//this.kf = null // FIXME major change: now, all kf becomes the number instead of the Object
	this.kfi = -1
	this.last_click = { x:0, y:0 }
	this.near_limit = 4 // the limit (on px) to detect a click from a bone
	this.move_bone_dot = [ null, 1]
	
	resize()
	
	// Aplico a Altura 
	function resize(){
		var h_header = jQuery('#header').css('height')
		var h_body = jQuery('body').css('height')
		
		var h_timeline = parseInt(h_body) - parseInt(h_header)
		j('#timeline').css('height', h_timeline + 'px' )
	}
	
	function set_mode(state){
		switch(state){
			case 'draw0' :
				activate_button('draw_bt')
				set_stage_header('DRAW')
				break
			case 'draw1' :
				set_stage_header("DRAW'n")
				break;
			case 'move0' :
				set_stage_header('MOVE')
				activate_button('move_bt')
				break;
			case 'move1' :
				set_stage_header("MOVE'n")
				break;
			default: 
				alert( "MODO NAO IMPLEMENTADO: set_mode('"+state+"')" )
		}
		instance.mode = state
	}
	
	function activate_button(id){
		var bt = j("#"+id)
		if( !bt.hasClass('active') ){
			j(".button.active").removeClass('active')
			bt.addClass('active')
		}
	}
	
	function set_stage_header( text ){
		j('#mode').html(text)
	}
	
	function bind_keys(){
		/*
		j(document).bind('keydown', 'd', function(){
			set_mode('draw')
		});
		*/
	}
	
	function add_key_frame(){
//debugger
	  instance.key_frames.push( new KeyFrame( instance.kf() ) )
	  instance.kfi = instance.kfi + 1
		//var kf = new KeyFrame( instance.kf )
		//instance.kf = kf // This sets the current kf as this
		//instance.key_frames.push(kf)
		j('#keyframes').append('<dd>'+(this.key_frames.length-1)+'.'+instance.kf().preview()+'</dd>')
		instance.scroll_down()
		focus_key_frame( j('#keyframes').children(':eq('+(this.key_frames.length-1)+')'  ) ) // this sucks!
		instance.redraw_kf()
	}
	
	function kf(){
	  return instance.key_frames[instance.kfi]
	}
	
	function focus_key_frame(frame_node){
		j('.selected').removeClass('selected')
		var j_node = j(frame_node)
		j_node.addClass('selected')
		//instance.kf = instance.key_frames[parseInt( j_node.html().split('.')[0] )]
		instance.kfi = parseInt( j_node.html().split('.')[0])
		
		//if(instance.mode == 'draw1' ) set_mode('draw0')
		if(instance.mode == 'move1') instance.move_bone_dot = [null, 1]
		set_mode('move0')
		instance.redraw_kf()
	}
	
	// Use only for DrawingTable to communicate a click {x, y}. Behavior is defined by the current mode
	function notice_click(click){
		switch( instance.mode ){
			
			case 'draw0' : 
				instance.last_click = click
				instance.set_mode('draw1')
				break
				
			case 'draw1' :
				var bone = new SuperBone(instance.last_click.x, instance.last_click.y, click.x, click.y)
				// FIXME this should add bone to all key_frames according to specific logic.. tenso
					instance.kf().add_bone( bone )  
				instance.redraw_kf()
				instance.set_mode('draw0')
				break;
				
			case 'move0' :
				instance.move_bone_dot = find_near_bone( click )
				if(instance.move_bone_dot){
					//alert('got '+instance.move_bone_dot[0]+instance.move_bone_dot[1])
					instance.dt.highlight_bone_dot(instance.move_bone_dot[0], instance.move_bone_dot[1] )
					instance.set_mode('move1')
				}//else just continue
				break;
				
			case 'move1' :
				var bone = instance.kf().bone_named( instance.move_bone_dot[0].name )
				if( bone ){// all ok, should always be ok
					bone.set_dot( instance.move_bone_dot[1], click.x, click.y )
				}else alert("WHYYYY I suffer THAT much?! x'<")
				instance.redraw_kf()
				
				instance.set_mode('move0')
				break;
				
			default: 
				alert( "CLICK NAO IMPLEMENTADO: notice_click('"+ instance.mode +"')" )
		}
	}
	
	// Draws the 3 bones, the current and past 2
	function redraw_kf(){
	  instance.dt.reset()
		//if( instance.kfi > 1 ) instance.dt.draw_bone_list( instance.key_frames[ instance.kfi - 2 ].list, 3 ) //finding 3 layers useless
		if( instance.kfi > 0 ) instance.dt.draw_bone_list( instance.key_frames[ instance.kfi - 1 ].list, 2 )
		instance.dt.draw_bone_list( instance.kf().list, 1);
	}
	
	function find_near_bone( click ){
		for (var i=0; i<instance.kf().list.length; i++) {
			var bone = instance.kf().bone(i)
			if (bone) {
				var match = match_a_dot(bone, click)
				if (match) return [bone, match]
			}
		};
		return 0 //that's also like false in JS
	}
	
	// Returns 0 if none, 1 if the first dot, 2 if the second
	// This can be bugged if a dot is too near another //but i guess this is normal on editors..
	function match_a_dot(bone, click){
		if( Math.abs( bone.p1x - click.x ) <= instance.near_limit && Math.abs( bone.p1y - click.y ) <= instance.near_limit )
			return 1
		if( Math.abs( bone.p2x - click.x ) <= instance.near_limit && Math.abs( bone.p2y - click.y ) <= instance.near_limit )
			return 2
		return 0
	}
	
	function scroll_down(){ }
	
	function scroll_up(){ }
	
	// TEST do need some testing
	function export(){
    var kf_a = []
	  for(var i=0; i<instance.key_frames.length; i++){
	    kf_a.push( instance.key_frames[i].export() )
	  }
	  return "["+kf_a.join(',\n  ')+"]"
	   
	}
	
	this.export = export
	this.bind_keys = bind_keys
	this.set_mode = set_mode
	this.add_key_frame = add_key_frame
	this.scroll_down = scroll_down
	this.scroll_up = scroll_up
	this.focus_key_frame = focus_key_frame
	this.redraw_kf = redraw_kf
	this.notice_click = notice_click
	this.kf = kf
}
