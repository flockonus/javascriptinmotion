/**
 * @author laptop
 */

function Editor(){
	var instance = this;
	
	this.key_frames = []
	this.dt = new DrawingTable('drawingtable', this)
	this.dt.reset()
	this.mode = false
	this.kf = null
	this.last_click = { x:0, y:0 }
	
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
				set_stage_header('DRAW')
				break
			case 'draw1' :
				set_stage_header('DRAWing')
				break;
			case 'view' :
				break;
			default: 
				alert( "MODO NAO IMPLEMENTADO: set_mode('"+state+"')" )
		}
		instance.mode = state
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
		var kf = new KeyFrame()
		instance.kf = kf // This sets the current kf as this
		instance.key_frames.push(kf)
		j('#keyframes').append('<dd>'+(this.key_frames.length-1)+'.'+kf.preview()+'</dd>')
		instance.scroll_down()
		focus_key_frame( j('#keyframes').children(':eq('+(this.key_frames.length-1)+')'  ) )
	}
	
	function focus_key_frame(frame_node){
		j('.selected').removeClass('selected')
		j(frame_node).addClass('selected')
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
				instance.kf.add_bone( bone )
				instance.dt.draw_bone( bone );
				instance.set_mode('draw0')
				break;
			case 'view' :
				break;
			default: 
				alert( "MODO NAO IMPLEMENTADO: notice_click('"+ instance.mode +"')" )
		}
		
	}
	
	function scroll_down(){ }
	
	function scroll_up(){ }
	
	this.bind_keys = bind_keys
	this.set_mode = set_mode
	this.add_key_frame = add_key_frame
	this.scroll_down = scroll_down
	this.scroll_up = scroll_up
	this.focus_key_frame = focus_key_frame
	
	this.notice_click = notice_click
}
