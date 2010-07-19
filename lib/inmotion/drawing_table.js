/**
 * @author @flockonus
 * 
 * @classDescription is responsible for handling drawing and click positioning translation to InMotion system
 *  
 */


function DrawingTable(canvas_id, editor){
	var instance = this
	this.class_name = "DrawingTable"
	
	this.editor = editor
	this.canvas_id = canvas_id
	canvas = get_canvas()
	if( !canvas ) throw('Init error by DrawingTable, requires a valid canvas_id ready')
	this.h = canvas.height
	this.w = canvas.width
	this.center_x = this.w/2.0
	this.center_y = this.h/2.0
	this.center_rate = 100.0 // bigger the number, smaller the arrow
	this.dull_color = 'green'
	this.dot_color = 'black'
	// Will use for CTRL-Z ?
	this.click_history = []
	
	bind_click()
	
	function get_canvas(){
		return document.getElementById(instance.canvas_id)
	}
	
	function bind_click(){
		
		j(get_canvas()).click(function(e){
			var canvas = get_canvas()
			var c = e.target.getContext('2d')
			c.save()
			
			c.lineWidth =  2.0
			c.strokeStyle = instance.dot_color
			var click = canvas_click_position(e)
			remember_click(click)
			// Draw dot // this is somehow a flaw in the abstraction, but the better seams worst
			var draw_reg = /draw.*/i
			if( draw_reg.test( instance.editor.mode ) ) draw_dot( click.x, click.y) 
			
			// this is to be used to record the bones InMotion way
			var inmotion_click = mapped_position(click) 
			instance.editor.notice_click( inmotion_click )
			
//alert("Raw click: "+click.x+","+click.y+" \nInMotion :"+inmotion_click.x+","+inmotion_click.y)
//var c_click = raw_position( inmotion_click.x, inmotion_click.y)
//alert("Raw click: "+click.x+","+click.y+" \nInMotion :"+inmotion_click.x+","+inmotion_click.y+" \nCounter Map :"+c_click.x+","+c_click.y)
			
			c.restore()
		})
	}
	
	function draw_dot( x, y ){
		var context = instance.get_canvas().getContext('2d')
		//context.save()
		context.beginPath()
			context.strokeStyle = "rgb(200,200,200)"
			context.arc(x, y, 3, 0, Math.PI*2, false  ) // halo
			context.strokeStyle = "rgb(0,0,0)"
			context.arc(x, y, 2, 0, Math.PI*2, false  ) // circle
		context.stroke()
		//context.restore()
	}
	
	function remember_click(c){	instance.click_history.push(c)	}
	
	function reset(){
		var c =  instance.get_canvas().getContext('2d')
		c.save()
		
		// borders
		c.fillStyle = instance.dull_color
		c.fillRect( 0, 0, instance.w+1, instance.h+1)
		c.fillStyle = "rgb(255, 255, 255)"
		c.fillRect(1, 1, instance.w-2, instance.h-2)
		
		// center arrow
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
	}
	
	// More likely should be in other class!
	// Works on my editor, but dunno for all
	function canvas_click_position(e){
	    var nav = e.target
	    var x = 0
	    var y = 0
	    while( nav.tagName && nav.tabIndex ){
	        y += nav.offsetTop
	        x += nav.offsetLeft
	        nav = nav.parentNode
	    }
	    return {x : e.clientX - x, y : e.clientY - y}
		/* failed method.. craps
		x = e.clientX
		y = e.clientY
		var pos = j(e.target).position() // se pah nao faz o que eu quero =/
		debugger
		return {x : x-pos.left, y : y-pos.top}
	    */
	}
	
	// Convert from Canvas to Carthesian system, middled in the center X, Y
	function mapped_position(click){
		return {
			x: click.x - instance.center_x,
			y: instance.center_y - click.y
		}
	}
	// Convert from Carthesian system, middled in the center X, Y to Canvas
	function raw_position(dot_x, dot_y){
		return {
			x: dot_x + instance.center_x,
			y:  -(dot_y - instance.center_y)
		}
	}
	
	function draw_bone( bone ){
		var dot1 = raw_position( bone.p1x, bone.p1y)
		var dot2 = raw_position( bone.p2x, bone.p2y)
		
		var c = get_canvas().getContext('2d')
		c.save()
		
		c.lineWidth = 3.0
		c.lineCap = 'round'
		c.beginPath()
			c.moveTo(dot1.x, dot1.y)
			c.lineTo(dot2.x, dot2.y)
		c.stroke()
		c.restore()
	}
	
	function draw_bone_list( list ){
		instance.reset() // It Works :D
		j.each( list, function(i,e){
			draw_bone(e)
		})
	}
	
	// PUBLIC METHODS
	this.reset = reset
	this.get_canvas = get_canvas
	this.draw_dot = draw_dot
	this.draw_bone = draw_bone
	this.draw_bone_list = draw_bone_list
	// this is smelly...
	//this.click_history = click_history
}