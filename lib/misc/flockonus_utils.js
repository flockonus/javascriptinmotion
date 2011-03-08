/**
 * @author FlockonUS
 * This lib is MIT Licensed
 * fabianosoriani{{gM41L.com
 */

//require "date" wtf?


var FlockonUS = {
	
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
	size : function( obj ) {
	  var size = 0, key;
	  for (key in obj) {
	      if (obj.hasOwnProperty(key) && obj[key] != null) size++;
	  }
	  return size;
	},

/**
 * Iterates each menber of a 'Hash'
 * Ex: 'var b = {a:1, b:2, c:3}; b.each( function(k,v) { alert(k+':'+v)})'
 * @param {function} f
 * @return {something} If the function f returns, it return the value, else undefined
 */
	each : function(obj, f ){
	  if (typeof f != "function") {
	  	throw new TypeError();
	  }
	  
	  for (key in obj) {
	    if (obj.hasOwnProperty(key) && obj[key] != null){
				var r = f.call(obj, key, obj[key]);
				if(typeof r != 'undefined') return r;
			}
	  }
	}
}

/**
 * Eval the middle of the string, just like a Ruby String template.
 * Limited to not having {} inside the #{ }
 * Ex: 
 *    a = 2; c = '3';
 *    S("sim #{ 'aaa' } !#{ a+2} #{ c+'3'} nao")
 */
function S(str){
  var str_ = "", begin = 0, end = 0, last_i = 0;
  
  while( (begin = str.indexOf('#{', last_i)) != -1 && (end = str.indexOf('}', begin)) != -1 ){
    str_ += str.substring(last_i,begin) + eval(str.substring(begin+2,end))
    last_i = end+1
  }
  
  return str_ +  str.substr(last_i)
}

// (new Date()).to_ruby() ex: "2010-07-07 16:12:16"
Date.prototype.to_ruby = function(){
	function _zero(num){ return ( num < 10 ) ? "0"+num : ""+num }
	return [this.getFullYear()+"", _zero(this.getMonth()+1), _zero(this.getDate()) ].join('-') + " " + 
			[this.getHours(), this.getMinutes(), this.getSeconds()].join(':')
}

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
