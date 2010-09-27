/**
 * @author FlockonUS
 */



/**
 * Get the length of a 'Hash' (Array with custom keys)
 * Adapted from: http://stackoverflow.com/questions/5223/length-of-javascript-associative-array
 */
Object.prototype.size = function() {
    var size = 0, key;
    for (key in this) {
        if (this.hasOwnProperty(key)) size++;
    }
    return size;
};

/**
 * Iterates each menber of a 'Hash'
 * Ex: " var b = {a:1, b:2, c:3}; b.each( function(v, k) { alert(k+':'+v)}) "
 * @param {function} f
 */
Object.prototype.each = function(f )
{
  if (typeof f != "function") throw new TypeError();
  
  var thisp = arguments[1], key;
  for (key in this) {
    if (this.hasOwnProperty(key)) f.call(thisp, this[key], key, this);
  }
};




// EACH for(k in b){ if(b.hasOwnProperty(k)) alert( b[k]) }