/**
 * @author FlockonUS
 */



/**
 * Get the length of a 'Hash' (Array with custom keys)
 * Adapted from: http://stackoverflow.com/questions/5223/length-of-javascript-associative-array
 * a = {}
   a.a = 1
   a[123] = "abc"
   a['oi'] = null
   a.each( function(k,v){ alert(k+':'+v) } )
   a.size()
 */
Object.prototype.size = function() {
    var size = 0, key;
    for (key in this) {
        if (this.hasOwnProperty(key) && this[key] != null) size++;
    }
    return size;
};

/**
 * Iterates each menber of a 'Hash'
 * Ex: 'var b = {a:1, b:2, c:3}; b.each( function(k,v) { alert(k+':'+v)})'
 * @param {function} f
 */
Object.prototype.each = function(f )
{
  if (typeof f != "function") throw new TypeError();
  
  for (key in this) {
    if (this.hasOwnProperty(key) && this[key] != null){
			var r = f.call(this, key, this[key]);
			if(typeof r != 'undefined') return r;
		}
  }
};

/**
 * Array Remove - By John Resig (MIT Licensed)
 * 
 * Remove the second item from the array: 						array.remove(1)
 * Remove the second and third items from the array: 	array.remove(1,2)
 * 
 * @param {Integer} from index
 * @param {Integer} to index
 */
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

if( typeof console == 'undefined'){
	console = {
		log : function(){},
		group : function(){},
		groupEnd : function(){}
	};
}
