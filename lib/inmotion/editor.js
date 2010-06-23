/**
 * @author laptop
 */

function Editor(){
	this.key_frames = []
	this.dt = null
	this.mode = false
	this.focused_kf = null
	this.last_click = { x:0, y:0 }
	
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
			case 'view' :
				break;
			default: 
			alert( "MODO NAO IMPLEMENTADO: set_mode('"+state+"')" )
		}
		this.mode = state
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
		kf = new KeyFrame()
		this.key_frames.push(kf)
		j('#keyframes').append('<dd>'+(this.key_frames.length-1)+'.'+kf.preview()+'</dd>')
		scroll_down()
		_focus_key_frame( j('#keyframes').children(':eq('+(this.key_frames.length-1)+')'  ) )
	}
	
	function _focus_key_frame(frame_node){
		j('.selected').removeClass('selected')
		j(frame_node).addClass('selected')
	}
	
	function scroll_down(){ }
	
	function scroll_up(){ }
}
