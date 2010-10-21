/**
 * @author FlockonUS
 * 
 * Tween
 * A class responsible to interpolate states, shapes, and return the Drawing
 */

gambia = 0

var Tween = {
	'default' : function(s1, s2, percent){
		//alert(""+p1+p2+percent);
		//console.log(""+p1+p2+percent);
		
		function diff(p1, p2, percent){
			return( (p2 - p1)*percent/100 + p1  );
		}
		
		var sb =  new SuperBone(diff(s1.p1x, s2.p1x, percent), diff(s1.p1y, s2.p1y, percent), 
														diff(s1.p2x, s2.p2x, percent), diff(s1.p2y, s2.p2y, percent) );
		
		if(gambia++ == 3)debugger;
		return sb;
	}
}

// Define your own! ex: MotionTween['your_animation'] : function(state1, state2,percent)