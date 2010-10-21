/**
 * @author FlockonUS
 * 
 * Tween
 * A class responsible to interpolate states, shapes, and return the Drawing
 */

var Tween = {
	'default' : function(s1, s2, percent){
		//alert(""+p1+p2+percent);
		//console.log(""+p1+p2+percent);
		
		function diff(p1, p2){
			return(p2 - p1) + p1
		}
		
		return new SuperBone(diff(s1.p1x, s2.p1x), diff(s1.p1y, s2.p1y), diff(s1.p2x, s2.p2x), diff(s1.p2y, s2.p2y) )
	}
}

// Define your own! ex: MotionTween['your_animation'] : function(state1, state2,percent)