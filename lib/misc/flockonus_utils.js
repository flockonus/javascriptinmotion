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




// EACH for(k in b){ if(b.hasOwnProperty(k)) alert( b[k]) }