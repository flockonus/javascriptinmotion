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
	this.models = {};
	
	// All animations by id
	// ex: 'preview' : { 'state' : 'playing'|'stop', 'time': Date, 'model': basic }
	this.animations = {};
	
	this.img_manager = new ImgManager();
	
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
	
	
	
	/**
	 * .step() Makes all bones in the given at current time to have position calculated and get draw
	 * @param clear {Bool} Force to erase the Canvas before drawing
	 * @return {Bool} true if anything was drawn, indicating that there is still frames to go
	 */
	function step( clear ) {
		
		// All the drawing to perform, defined by Tweens
		var draw = [];
		// This is important, because I must know when I have nothing left to draw. And return the value
		var should_continue = false;
		
		f.each( instance.animations,  function(id, anim){ //Each animation registered
			if( anim.state == 'play'){ // only the ones playing
				if(anim.start == null)	anim.start = new Date(); // this garantee my animation will trigger in the first step()
				
				f.each( instance.models[ anim.model ], function(bone_id, bone){ // Each bone
					var elapse = (new Date() - anim.start) / 1000; // animation progress in sec
					
					should_continue = f.each( bone, function(pos, state){ // must find the current state to draw
						var i = parseInt( pos );
console.log( 'bone_id:', bone_id, 'i:' ,i, 'elapse:',elapse, 'state.duration:', state.duration );
						
						// Finished with this bone, for sure
						if( elapse < 0 ){
							//return false finished with this bone
							return false;
						}else{
							// This means there is a frame up front & the elapse is in here
							if( bone[i+1] && elapse < state.duration ){
								var next_state = bone[i+1];
								if(typeof(Tween[state.animation]) != 'function') {
							  	alert("The Tween['" + state.animation + "'] is not defined as a function =(");
									return false;
							  }else{
									if(state.visible){
										var percent = elapse*100/state.duration;
								  	draw.push( Tween[state.animation](state, next_state, percent) );
console.log('Drawing', id, bone_id, 'state:'+i, percent+"%", "p1:("+draw[draw.length-1].p1x+","+draw[draw.length-1].p1y+")" );
									}
									// TODO way to optimize is to return i and store it on the animation as current, the next step() bone.each start from that i
									return true; // order to stop
								}
							}else{
								// we just decrease elapse and go next
								elapse = elapse - state.duration;
							}
						}
						// If finished we draw the last frame. And stop()
						if(i == bone.length-1 && bone[ i-1 ] && bone[i].visible ){
							draw.push( Tween[state.animation](bone[ i-1 ], bone[i], 100) );
console.log('Drawing (last)', id, bone_id, 'state:'+i, 100+"%", "p1:("+draw[draw.length-1].p1x+","+draw[draw.length-1].p1y+")" );
							//anim.state == 'stop';
							instance.animations[id].state = 'stop'
							return false; // order to stop
						}
						
					}) || should_continue;//bone.each
				});//instance.models
			}
		})//instance.animations
		
		// BAD return if we have nothing to draw here, dont even reset to keep the last frame
		//if( draw.length < 1 ) return false;
		
		
		var c = get_canvas().getContext('2d');
		c.save();
		
		if( clear ){ // Paint WHITE
			c.fillStyle = "rgb(255, 255, 255)";
			c.fillRect(0, 0, instance.w, instance.h);
		}
		
		draw_bone_list(draw);
		c.restore();
		
		// due invisible //return (draw.length > 0)
		
		return should_continue;
	}
	
	function draw_bone_list( list ){
		//if(position == 1) instance.reset() 
		f.each( list, function(i,e){
			draw_bone(e);
		});
	}
	
	
	function draw_bone( bone ){
		var dot1 = raw_position( bone.p1x, bone.p1y);
		var dot2 = raw_position( bone.p2x, bone.p2y);
		
		var c = get_canvas().getContext('2d');
		
		c.save();
//console.log(bone);
		
		//
		if( bone.shape == 'linear'){
			
			// http://dev.opera.com/articles/view/html-5-canvas-the-basics/#insertingimages
			if( bone.img_url && bone.img_url.length > 0 ){ // Draw a Image //finally! =D
				var img = instance.img_manager.get( bone.img_url );
				//var dw = Math.abs(dot1.x > dot2.x ? dot1.x - dot2.x : dot2.x - dot1.x );
				//var dh = Math.abs(dot1.y > dot2.y ? dot1.y - dot2.y : dot2.y - dot1.y );
				
				var dw = Math.abs(dot1.x - dot2.x);
				var dh = Math.abs(dot1.y - dot2.y);
				
				
				c.drawImage(img, dot1.x, dot1.y, dw, dh);
				
				//debugger;
			} else {  // Draw a simple line
				
				c.lineWidth = 3.0;
				c.lineCap = 'round';
				c.strokeStyle = "#555555"; // bone.color ?
				c.beginPath();
					c.moveTo(dot1.x, dot1.y);
					c.lineTo(dot2.x, dot2.y);
				c.stroke();
			}
		}
		
		c.restore();
	}
	
	// Convert from Carthesian system, middled in the center X, Y to <Canvas>
	function raw_position(dot_x, dot_y){
  	return {
  		x: dot_x + instance.center_x,
  		y: -(dot_y - instance.center_y)
  	};
  }
	
	/**
	 * Step on the current time, print on the canvas
	 */
	this.step = step;
	
	
	
	
	
	
	
	function register(id, model, cb ){
		instance.models[id] = parse_model( model )
		//debugger
		if( instance.models[id].length < 1 ){ //FAIL
			alert('Parse error on import of : '+id+'. It is defined as empty');
			return false;
		} else { //SUCCED
		
		  var arr = [];
			
			// get all imgs and make it pre-load
			f.each( instance.models[id], function(i,e) {
				arr.push( e[0].img_url );
			});
			
			//  load all the images that are required. The class should take a Hash of images'url so don't load the same image multiple times.
			//  It should have a callback for when all load is done.
			instance.img_manager.mass_register(arr, cb);
		}
		return true;
	}
	
	/**
	 * Parse a animation model String, storing the class for future ref.
	 * @param {Object} str a well formated string for a anim model.
	 * @return {Object} Its is a object, not a S.B.
	 */
	function parse_model( str ){
		try{
			return eval(str);
		} catch(e){
			return [];
		}
	}
	
	/**
	 * Create a animation that is actionable from a id:String
	 * @param id {string} This will be used fot reference
	 * @param model {string} A string generated by the Editor
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
		
		instance.animations[id] = ( { 'state' : 'stop', 'start' : null, 'time': null, 'model': base } );
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
