/**
 * @author @flockonus
 */


function DrawingTable(canvas_id){
	this.canvas_id = canvas_id;
	canvas = get_canvas()
	if( !canvas ) throw('Init error by DrawingTable, requires a valid canvas_id ready')
	this.h = canvas.height
	this.w = canvas.width
	this.center_x = this.w/2.0
	this.center_y = this.h/2.0
	this.center_rate = 100.0 // the bigger the smaller the arrow
	this.dull_color = 'green'
	
	bind_click()
	
	
	function get_canvas(){
		return document.getElementById(canvas_id)
	}
	
	function bind_click(){
		j(get_canvas()).click(function(e){
			var canvas = get_canvas()
			var c = e.target.getContext('2d')
			//TODO POST ! ta sendo chato..
			var click = relative_click_position(e)
			c.beginPath()
				c.arc(click.x, click.y, 3, 0, Math.PI*2, false  )
			c.stroke()
		})
	}
	
	function reset(){
		var c = get_canvas().getContext('2d')
		c.save()
		
		// borders
		c.fillStyle = this.dull_color
		c.fillRect( 0, 0, this.w+1, this.h+1)
		c.clearRect(1, 1, this.w-2, this.h-2)
		
		// center arrow
		c.lineWidth = 1.0
		c.lineCap = 'round'
		c.strokeStyle = this.dull_color
		// x
		c.moveTo(this.center_x, this.center_y - this.w/this.center_rate)
		c.lineTo(this.center_x, this.center_y + this.w/this.center_rate)
		// y
		c.moveTo(this.center_x - this.h/this.center_rate, this.center_y)
		c.lineTo(this.center_x + this.h/this.center_rate, this.center_y)
		c.stroke()
		
		c.restore()
	}
	
	// More likely should be in other class!
	// Works on my editor, but dunno for all
	function relative_click_position(e){
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
	
	// METHODS
	this.reset = reset
	this.canvas = get_canvas
}