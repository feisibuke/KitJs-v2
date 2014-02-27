onmessage = function(e) {
	var o = e.data;
	try {

		if (o.method == 'set') {
			localStorage.setItem(e.data.key, e.data.value);
			parent.postMessage({
				errno : 0,
				cmd : e.data.cmd,
				from : location.href
			}, '*')
		} else if (o.method == 'get') {
			var result = localStorage.getItem(e.data.key);
			parent.postMessage({
				errno : 0,
				cmd : e.data.cmd,
				from : location.href,
				result : result
			}, '*')
		} else if (o.method == 'del') {
			localStorage.removeItem(e.data.key);
			parent.postMessage({
				errno : 0,
				cmd : e.data.cmd,
				from : location.href
			}, '*')
		}
	} catch (err) {
		parent.postMessage({
			errno : err.toString(),
			cmd : o.cmd,
			from : location.href
		}, '*')
	}
}