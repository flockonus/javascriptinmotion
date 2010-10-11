

/*--------------------------------------------------------------------------*/



// ==========================================



var test_add
var test_remove
var test_each

flag = true
count = 0


function kill_flag() { flag = false } // NOT WORKING
/*
function test_add_p(){
	var count = 0
	var h = $H()
	flag = true
	setTimeout(kill_flag, 1000)
	while(flag){
		h.set('a', 'apple')
		count++
	}
	console.log('test_add_p', count)
}
*/
function test_add_s(){
	var count = 0
	var h = {}
	flag = true
	setTimeout(kill_flag, 1000)
	while(flag){
		h['a'] = 'apple'
		count++
	}
	console.log('test_add_s', count)
}

//test_add_p();
setTimeout(test_add_s, 1);
//test_add_s();
//test_add_p();