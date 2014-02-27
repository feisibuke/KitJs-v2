/**
 * cookies
 */
define('common/cookie', function() {
	return {
		get : function(name) {
			var r = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)");
			var m = document.cookie.match(r);
			return (!m ? null : unescape(m[2]));
		},

		add : function(name, v, path, expire, domain) {
			var s = name + "=" + escape(v) + "; path=" + (path || '/') // 默认根目录
					+ (domain ? ("; domain=" + domain) : '');
			if (expire > 0) {
				var d = new Date();
				d.setTime(d.getTime() + expire * 1000);
				s += ";expires=" + d.toGMTString();
			}
			document.cookie = s;
		},

		del : function(name, path, domain) {
			if (arguments.length == 2) {
				domain = path;
				path = "/"
			}
			document.cookie = name + "=;path=" + path + ";" + (domain ? ("domain=" + domain + ";") : '') + "expires=Thu, 01-Jan-70 00:00:01 GMT";
		}
	}
})