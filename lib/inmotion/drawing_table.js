/**
 * @author @flockonus
 * 
 * @classDescription is responsible for handling drawing and click positioning translation to InMotion system
 *  
 */


function DrawingTable(canvas_id){
	var instance = this
	
	this.canvas_id = canvas_id;
	canvas = get_canvas()
	if( !canvas ) throw('Init error by DrawingTable, requires a valid canvas_id ready')
	this.h = canvas.height
	this.w = canvas.width
	this.center_x = this.w/2.0
	this.center_y = this.h/2.0
	this.center_rate = 100.0 // bigger the number, smaller the arrow
	this.dull_color = 'green'
	this.dot_color = 'black'
	// Will use for CTRL-Z
	this.raw_click_history = []
	
	bind_events()
	
	
	function get_canvas(){
		return document.getElementById(instance.canvas_id)
	}
	
	function bind_events(){
		j(get_canvas()).click(function(e){
			var canvas = get_canvas()
			var c = e.target.getContext('2d')
			c.save()
			
			c.lineWidth =  2.0
			c.strokeStyle = instance.dot_color
			//TODO POST ! ta sendo chato..
			var click = canvas_click_position(e)
			remember_raw_click(click)
			// Draw dot
			c.beginPath()
				c.arc(click.x, click.y, 3, 0, Math.PI*2, false  )
			c.stroke()
			
			// this is to be used to record the bones InMotion way
			var inmotion_click = mapped_position(click) // TODO something :P
			
			alert("Raw click: "+click.y+","+click.y+" \nInMotion :"+inmotion_click.x+","+inmotion_click.y)
			
			c.restore()
		})
	}
	
	function remember_raw_click(c){	instance.raw_click_history.push(c)	}
	
	function reset(){
		var c = get_canvas().getContext('2d')
		c.save()
		
		// borders
		c.fillStyle = instance.dull_color
		c.fillRect( 0, 0, instance.w+1, instance.h+1)
		c.clearRect(1, 1, instance.w-2, instance.h-2)
		
		// center arrow
		c.lineWidth = 1.0
		c.lineCap = 'round'
		c.strokeStyle = instance.dull_color
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
	}
	
	// Cuz I use the Carthesian system, middled in the center X, Y
	function mapped_position(click){
		return {
			x: click.x - instance.center_x,
			y: instance.center_y - click.y
		}
	}
	
	// PUBLIC METHODS
	this.reset = reset
	this.canvas = get_canvas
	// this is smelly...
	//this.click_history = click_history
}