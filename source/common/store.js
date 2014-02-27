/**
 * localstorage
 */
define('common/store', function() {
	function set(k, v) {
		try {
			localStorage.setItem(k, v)
		} catch (e) {
			//
		}
	}
	function get(k) {
		var re;
		try {
			re = localStorage.getItem(k);
		} catch (e) {
			//
		}
		return re;
	}
	function del(k) {
		//localStorage.removeItem(k, v)
		try {
			localStorage.removeItem(k)
		} catch (e) {
			//
		}
	}
	function isPrivateBrowse() {
		try {
			localStorage.setItem('testPrivate', 1);
			localStorage.removeItem('testPrivate');
		} catch (e) {
			if (e.toString().indexOf('QUOTA_EXCEEDED_ERR')) {

			}
			return true;
		}
		return false;
	}
	return {
		set : set,
		get : get,
		del : del,
		isPrivateBrowse : isPrivateBrowse
	}
})