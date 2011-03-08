/**
 * @author laptop
 */

 // TODO: add Shortcuts Draw Move Add kf and Action!
 
function Editor(){
	var instance = this;
	
	this.key_frames = []; // a list of key frames
	this.dt = new DrawingTable('drawingtable', this);
	this.dt.reset();
	this.mode = false;
	this.kfi = -1;
	this.last_click = { x:0, y:0 };
	this.near_limit = 4; // the limit (on px) to detect a click from a bone
	this.move_bone_dot = [ null, 1];
	
	this.im = $im; // new InMotion('drawingtable');
	this.preview_routine = 9999;
	
	resize();
	bind_keys();
	
	// Aplico a Altura 
	function resize(){
		var h_header = jQuery('#header').css('height');
		var h_bonepane = jQuery('#bonepane').css('height');
		var h_body = jQuery('body').css('height');
		
		var h_timeline = parseInt(h_body) - parseInt(h_header) - parseInt(h_bonepane);
		j('#timeline').css('height', h_timeline + 'px' );
	}
	
	function set_mode(state){
		switch(state){
			case 'draw0' :
				activate_button('draw_bt');
				set_stage_header('DRAW');
				break;
			case 'draw1' :
				set_stage_header("DRAW'n");
				break;
			case 'move0' :
				set_stage_header('MOVE');
				activate_button('move_bt');
				break;
			case 'move1' :
				set_stage_header("MOVE'n");
				break;
			case 'preview0' :
				// TODO: in future there should be a worry about waiting for images to load
				set_stage_header('PREVIEW');
				activate_button('play_bt');
				
				var exp_string = instance.export();
				j(document.getElementById('console')).html("EXPORT CODE: <br/>" + exp_string.replace(/\n/g, "<br/>") );

				clearInterval( instance.preview_routine );
				function preload_img_cb(){
					instance.im.create_animation('preview', 'base');
					instance.im.play('preview');
					instance.preview_routine = setInterval('$e.loop_preview()', 30 );
				}
				instance.im.register( 'base', exp_string, preload_img_cb );
				 
				break;
			default: 
				alert( "MODO NAO IMPLEMENTADO: set_mode('"+state+"')" );
		}
		instance.mode = state;
	}
	
	function loop_preview(){
		console.group('step()');
		if( !instance.im.step(true) ){
			clearInterval( instance.preview_routine );
			//alert('fim ')
		}
		console.groupEnd();
		
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
		opt = {'type':'keydown'}
		
		shortcut.add("Ctrl+A",function(){ instance.add_key_frame() }, opt);
		shortcut.add("Ctrl+=",function(){ instance.add_key_frame() }, opt);
		shortcut.add("Ctrl++",function(){ instance.add_key_frame() }, opt);
		shortcut.add("Ctrl+Insert",function(){ instance.add_key_frame() }, opt);
		shortcut.add("A",function(){ instance.add_key_frame() }, opt);
		
		shortcut.add("Ctrl+D",function(){ instance.set_mode('draw0') }, opt);
		shortcut.add("D",function(){ instance.set_mode('draw0') }, opt);
		
		shortcut.add("Ctrl+M",function(){ instance.set_mode('move0') }, opt);
		shortcut.add("M",function(){ instance.set_mode('move0') }, opt);
		
		shortcut.add("Page_up"  ,function(){ instance.focus_key_frame('prev') }, opt);
		shortcut.add("Page_down",function(){ instance.focus_key_frame('next') }, opt);
		
		shortcut.add("P",function(){ instance.set_mode('preview0') }, opt);
		
		
		//shortcut.add("Ctrl+A",function(){ instance.add_key_frame() });
	}
	
	function add_key_frame(){
	  instance.key_frames.push( new KeyFrame( instance.key_frames[ instance.key_frames.length -1] ) );
	  instance.kfi = instance.key_frames.length-1; //instance.kfi + 1
		//var kf = new KeyFrame( instance.kf )
		//instance.kf = kf // This sets the current kf as this
		//instance.key_frames.push(kf)
		j('#keyframes').append('<dd>'+(this.key_frames.length-1)+'.'+instance.kf().preview()+'</dd>');
		instance.scroll_down();
		focus_key_frame( j('#keyframes').children(':eq('+(this.key_frames.length-1)+')'  ) ); // this sucks!
		instance.redraw_kf();
	}
	
	function kf(){
	  return instance.key_frames[instance.kfi]
	}
	
	function focus_key_frame(frame){
		
		if( typeof(frame) == 'string' ){
			var query = (frame == 'next' ? j('.selected:first').next() :
									 frame == 'prev' ? j('.selected:first').prev() :
									 null )
									 
			if( query && query.size() == 1 ) frame = query
			else return false
		}
		
		j('.selected').removeClass('selected');
		var j_node = j(frame);
		j_node.addClass('selected');
		//instance.kf = instance.key_frames[parseInt( j_node.html().split('.')[0] )]
		instance.kfi = parseInt( j_node.html().split('.')[0]);
		
		//if(instance.mode == 'draw1' ) set_mode('draw0')
		if(instance.mode == 'move1') instance.move_bone_dot = [null, 1];
		set_mode('move0');
		instance.redraw_kf();
		return true;
	}
	
	// Use only for DrawingTable to communicate a click {x, y}. Behavior is defined by the current mode
	function notice_click(click){
		switch( instance.mode ){
			
			case 'draw0' : 
				instance.last_click = click
				instance.set_mode('draw1')
				break
				
			case 'draw1' :
				//instance.kf().add_bone( bone );
				// ADD forward (visible)
				//var bone = null;
				//var bone_name = new SuperBone(instance.last_click.x, instance.last_click.y, click.x, click.y).name
				var bone = new SuperBone(instance.last_click.x, instance.last_click.y, click.x, click.y);
				j.each(instance.key_frames.slice(instance.kfi), function(i,e){
					//bone = new SuperBone(instance.last_click.x, instance.last_click.y, click.x, click.y,
					//											{name: bone_name})
					e.add_bone( bone.clone() );
				})
				
				// ADD backward (invisible)
				//var bone_invis = null;
				bone.visible = false;
				j.each(instance.key_frames.slice(0, instance.kfi), function(i,e){
					//bone_invis = new SuperBone(instance.last_click.x, instance.last_click.y, click.x, click.y,
					//														{visible: false,  name: bone_name});
					e.add_bone( bone.clone() );
				})
				
				// set the Bonepane with the bone, so the user can customize the bone.
				instance.set_bonepane( bone );
				
				instance.redraw_kf();
				instance.set_mode('draw0');
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
				
			case 'preview0' :
				
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
	
	function scroll_down(){ 1 }
	
	function scroll_up(){ 1 }
	
	function export(){
    // this is the returning hash, { 'name1': [{state1-1}, {state1-2}, {state1-3}], 'name2': [{state2-1}, {state2-2}, {state2-3}]  }
		var animations_a = [];
		// we grab the last KF, so im pretty sure that all bones are present there.
		var bone_name_list = instance.key_frames[ instance.key_frames.length-1 ].bone_name_list()
		// interact from the first bone present to the last
		for (var i = 0; i < bone_name_list.length; i++) {
			
			var bone_name = bone_name_list[i];
			
			// make a hash containing only the name pointing to an empty array of states => 'bone_name' : []
			var bone_def = {};
			bone_def[bone_name] = []
			// go through all the frames
			for(var j=0; j<instance.key_frames.length; j++){
				var bone = instance.key_frames[j].bone_named( bone_name )
				// if the bone is there, export it, else, just put a empty hash
				bone_def[bone_name].push( bone ? " "+bone.export() : ' {}' );
			}
			// join all states for the given bone
			animations_a.push( " '"+bone_name+"' : [\n    "+bone_def[bone_name].join(',\n    ')+"\n    ]" );
		}
		return "({\n  "+animations_a.join(',\n  ')+"\n})"
		/*
	{ 'bone_name' : [
										{p1x:-188, p1y:-64, p2x:56, p2y:34, shape:'linear', animation: 'default', duration:0.5},
										{p1x:-186, p1y:-43, p2x:51, p2y:49, shape:'linear', animation: 'default', duration:0.5}
									],
		'other_bone': [
										{p1x:-188, p1y:-64, p2x:56, p2y:34, shape:'linear', animation: 'default', duration:0.5},
										{p1x:-186, p1y:-43, p2x:51, p2y:49, shape:'linear', animation: 'default', duration:0.5}
									]
	}
		 */
	}
	
	function set_bonepane( bone ){
		j('#bonepane > .content > i:first').hide();
		
		var pane_form = j('#bonepane >.content > form');
		pane_form.children('input[name=original_name]').attr('value', bone.name);
		pane_form.children('input[name=name]').attr('value', bone.name);
		//pane_form.find('input[name=is_image]').attr('value', bone.img_url);
		pane_form.children('input[name=img_url]').attr('value', bone.img_url ? bone.img_url : "" );
	}
	
	function apply_bonepane( form ){
		jform = j('#bonepane >.content > form');
		var args = jform.serializeArray( );
		//console.log( args )
		var old_name = args[0].value;
		var new_name = args[1].value;
		var img_url = args[2].value;
		
		
		
		j.each( instance.key_frames, function(i,e){
			var b = e.bone_named( old_name );
			b.name = new_name;
			b.img_url = (typeof( img_url ) == "string" && img_url.length > 1 ) ?  img_url : false;
		});
		jform.children('input[name=original_name]').attr('value', new_name);
		return false;
	}
	
	this.apply_bonepane = apply_bonepane
	this.set_bonepane = set_bonepane
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
	this.loop_preview = loop_preview
}
