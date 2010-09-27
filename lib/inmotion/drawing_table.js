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
	this.dot_highligth_color = "Gold"
	this.bone_first_color = "OrangeRed"
	this.bone_second_color = "LightSalmon"
	//this.bone_position_color = ["", "OrangeRed", "LightSalmon", "#AAAAAA"]
	this.bone_position_color = ["", "#111111", "#777777", "#CCCCCC"]
	
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
	
	function draw_dot( x, y, color ){
		var context = instance.get_canvas().getContext('2d')
		context.save()
		context.beginPath()
			context.strokeStyle = "rgb(200,200,200)"
			context.arc(x, y, 3, 0, Math.PI*2, false  ) // halo
			context.strokeStyle = (color ?  color : "rgb(0,0,0)")
			context.arc(x, y, 2, 0, Math.PI*2, false  ) // circle
		context.stroke()
		context.restore()
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
	// Works on my editor, but not likely for all
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
	
	// Convert from <Canvas> to Carthesian system, middled in the center X, Y
	function mapped_position(click){
		return {
			x: click.x - instance.center_x,
			y: instance.center_y - click.y
		}
	}
	// Convert from Carthesian system, middled in the center X, Y to <Canvas>
	function raw_position(dot_x, dot_y){
		return {
			x: dot_x + instance.center_x,
			y:  -(dot_y - instance.center_y)
		}
	}
	
	function draw_bone( bone, position ){
		var dot1 = raw_position( bone.p1x, bone.p1y)
		var dot2 = raw_position( bone.p2x, bone.p2y)
		
		var c = get_canvas().getContext('2d')
		
		if(bone.visible){
			c.save()
			
			c.lineWidth = 3.0
			c.lineCap = 'round'
			//c.strokeStyle = (bone.moved ) ? instance.bone_main_color : instance.bone_second_color
			c.strokeStyle = instance.bone_position_color[position]
			c.beginPath()
				if( bone.shape == 'linear'){
					c.moveTo(dot1.x, dot1.y)
					c.lineTo(dot2.x, dot2.y)
				}
			c.stroke()
			
			c.restore()
		}
	}
	
	function draw_bone_list( list, position ){
		//if(position == 1) instance.reset() 
		j.each( list, function(i,e){
			draw_bone(e, position)
		})
	}
	
	function highlight_bone_dot(bone, dot){
		if( bone ){
			var pos = {}
			//TODO improve visual aspect!
			if( dot == 1){
				pos = raw_position( bone.p1x, bone.p1y )
			}else{
				pos = raw_position( bone.p2x, bone.p2y )
			}
			draw_dot(pos.x, pos.y, instance.dot_highligth_color)
		}
	}
	
	// PUBLIC METHODS
	this.reset = reset
	this.get_canvas = get_canvas
	this.draw_dot = draw_dot
	this.draw_bone = draw_bone
	this.draw_bone_list = draw_bone_list
	this.highlight_bone_dot = highlight_bone_dot
}