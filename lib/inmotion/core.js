/**
 * @author @flockonus
 * @classDescription The class responsible for animation itself
 * 
 * On the contruction should be fed with a valid canvas_id to draw on.
 * This class does not erase, it just draw, so I consider it non-ubtrusive, it is supposed to play well with other engines
 * 
 * In the future this class should split in various, but for now it is ok
 */



function InMotion(canvas_id){
	var instance = this
	this.class_name = "InMotion"
	
	
	// These are loaded as model animations, by name
	// ex: 'basic' : { a model imported from the Editor here }
	this.models = {}
	
	// All animations by id
	// ex: 'preview' : { 'state' : 'playing'|'stop', 'time': Date, 'model': basic }
	this.animations = {}
	
	
	this.canvas_id = canvas_id
	canvas = get_canvas()
	if( !canvas ) throw('Init error by DrawingTable, requires a valid and ready canvas_id')
	this.h = canvas.height
	this.w = canvas.width
	this.center_x = this.w/2.0
	this.center_y = this.h/2.0
	this.center_rate = 100.0 // bigger the number, smaller the arrow
	
	
	function get_canvas(){
		return document.getElementById(instance.canvas_id)
	}
	
	
	
	
	function step( clear ) {
		
		// All the drawing to perform, defined by Tweens
		var draw = []
		
		instance.animations.each( function(id, anim){ //Each animation registered
			if( anim.state == 'play'){ // only the ones playing
				if(anim.start == null)	anim.start = new Date(); // this garantee my animation will trigger in the first step()
				
				instance.models[ anim.model ].each(function(bone_id, bone){ // Each bone
					var elapse = (new Date() - anim.start) / 1000 // animation progress in sec
//debugger;
					
					bone.each(function(pos, state){ // must find the current state to draw
						var i = parseInt( pos );
						//alert(bone_id+" "+i+" "+elapse +"  "+state.duration );
						
console.log( 'bone_id', bone_id, 'i' ,i, 'elapse',elapse, 'state.duration', state.duration );
						
						// Finished with this bone, for sure
						if( elapse < 0 ){
							//return false finished with this bone
							return false;
						}else{
							// This mean there is a frame up front & the elapse is in here
							if( bone[i+1] && elapse < state.duration ){
//debugger;
								var next_state = bone[i+1];
								if(typeof(Tween[state.animation]) != 'function') {
							  	alert("The Tween['" + state.animation + "'] is not defined as a function =(");
									return false;
							  }else{
									var percent = elapse*100/state.duration;
							  	draw.push( Tween[state.animation](state, next_state, percent) );
console.log('Drawing', id, bone_id, 'state:'+i, percent+"%");
//debugger;
									return true; // TODO way to optimize is to return i and store it on the animation as current, the next step() bone.each start from that i
								}
							}else{
								// we just decrease elapse and go next
//debugger;
								elapse = elapse - state.duration;
							}
						}
					})//bone.each
				})//instance.models
			}
		// Para cada animação ativa:
			// Para cada bone:
				// Verifica qual ponto está no tempo
					// Verifica se a animação daquele bone é 'continue' ou 'hold' (à fazer)
						// Verifica quais bones estao visíveis, destes:
							// Verifica em qual frame está, baseado no TEMPO que foi dado start
								// Faz operação com a posição (à fazer) e a posição absoluta, converte e desenha
									// Para desenhar verificar qual a shape / imagem
		})//instance.animations
		
		var c = get_canvas().getContext('2d');
		c.save();
		
		if( clear ){
			
			// borders
			c.fillStyle = "rgb(255, 255, 255)"
			c.fillRect(0, 0, instance.w, instance.h)
			
			// center arrow
			/*
			c.lineWidth = 1.0
			c.lineCap = 'round'
			c.strokeStyle = instance.dull_color
			c.beginPath()
				// x
				c.moveTo(instance.center_x, instance.center_y - instance.w/instance.center_rate)
				c.lineTo(instance.center_x, instance.center_y + instance.w/instance.center_rate)
				// y
				c.moveTo(instance.center_x - instance.h/instance.center_rate, instance.center_y)
				c.lineTo(instance.center_x + instance.h/instance.center_rate, instance.center_y)
			c.stroke()
			
			c.restore()
			*/			
		}
		c.stroke();
		c.restore();
		
		
		return (draw.length > 0)
	}
	
	// Convert from Carthesian system, middled in the center X, Y to <Canvas>
	function raw_position(dot_x, dot_y){
  	return {
  		x: dot_x + instance.center_x,
  		y: -(dot_y - instance.center_y)
  	}
  }
	
	/**
	 * Step on the current time, print on the canvas
	 */
	this.step = step
	
	
	
	
	function register(id, model ){
		instance.models[id] = parse_model( model )
		if( instance.models[id].length < 1 ) alert('Parse error on import of : '+id+'. It is defined as empty') 
		// TODO: load all the images that are required. The class should take a Hash of images'url so don't load the same image multiple times.
		// TODO: It should have a callback for when all load is done.
	}
	
	function parse_model( str ){
		try{
			return eval(str) 
		} catch(e){
			return []
		}
	}
	
	/**
	 * Create a animation that is actionable from a id:String
	 * @param id [{string}] [This will be used fot reference]
	 * @param model [{string}] [A string generated by the Editor]
	 */ 
	this.register = register;
	
	function create_animation(id, base) {
		if( !instance.models[base] ){
			alert( "There is no such model registered: "+base );
			return(false)
		}
		/*if( instance.animations[id] ){
			alert( "There is already a animation matching that ID: "+id );
			return(false)
		} LAME*/
		
		instance.animations[id] = ( { 'state' : 'stop', 'start' : null, 'time': null, 'model': base } )
	}
	/**
	 * Create a animation based on a existing one
	 * @param id [{string}] [The animation given ID]
	 * @param base [{string}] [The animation ID from the model]
	 */
	this.create_animation = create_animation;
	
	
	
	
	function play(id, loop) {
		 instance.animations[id].state = 'play';
		 instance.animations[id].start = null//new Date();
		 // instance.animations[id]= { start: new Date(), loop: loop, state: 'play'}
	}
	/**
	 * Set the stated of a given animation as Playing
	 * @param id [{string}]
	 */
	this.play = play
	
	function stop(id) {
		 instance.animations[id].state = 'stop';
		 instance.animations[id].start = null
	}
	/**
	 * Brings the refered animation to halt
	 * @param id [{string}]
	 */
	this.stop = stop
	
	function scale() { 1 }
	/**
	 * Scale the given animation to a percetage
	 * @param id [{string}]
	 * @param percentage [{number}] [expected to be a positive number]
	 */
	this.scale = scale
	
	function move() { 1 }
	/**
	 * Move the given animation position
	 * @param id [{string}]
	 * @param x [{number}] [The posion x on the canvas system (positive)]
	 * @param y [{number}] [The posion y on the canvas system (positive)]
	 */
	this.move = move
	
	function rotate() { 1 }
	/**
	 * Move the given animation position
	 * @param id [{string}]
	 * @param angle [{number}] [The angle to turn the animation by( radix?) ]
	 * @param clockwise [{boolean}] [Clockwise if true (default)]
	 */
	this.rotate = rotate
	
	this.get_canvas = get_canvas
}
