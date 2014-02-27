define('widget/login', ['common', 'config/url'], function($, urlConfig) {
	/**
	 * 微信登录入口
	 * @param  {string} href  [description]
	 * @param  {object} force [description]
	 */
	function icson(href, force) {
		if (navigator.userAgent.indexOf('MicroMessenger') > -1) {
			wxAutoLogin(href || location.href);
		} else { //如果不是在微信内，则跳到标准登录去
			//location.href = 'http://m.yixun.com/t/login/index.html?url=';
			//alert('非微信');
		}
	}
	/**
	 * 微信登录模块
	 * @param  {[type]} href [description]
	 * @return {[type]}      [description]
	 */
	function wxAutoLogin(href) {
		if (typeof(href) == 'string' && href.length > 0) {
			href = href;
		} else {
			href = location.href;
		}
		var jumpWxLoginUrl = [ //
			'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxeb4c414eece9f1c6&redirect_uri=', //
			encodeURIComponent('http://w.yixun.com/t/loginProxy.php?redirectUrl=' + encodeURIComponent('http://m.yixun.com/t/my/wxlogin.html?jump=' + escape(href) + (location.hash == '#debugcookie' ? '#debugcookie' : ''))), //
			'&response_type=code&scope=snsapi_base&state=' + Date.now(), //
			'#wechat_redirect' //
		].join('');
		alert(jumpWxLoginUrl);
		location.href = jumpWxLoginUrl;
	}
	/**
	 * 备用
	 * @param  {[type]} href [description]
	 * @return {[type]}      [description]
	 */
	function wxAutoLoginFmt(href) {
		if (typeof(href) == 'string' && href.length > 0) {
			href = href;
		} else {
			href = location.href;
		}
		var jumpWxLoginUrl = [ //
			//'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxeb4c414eece9f1c6&redirect_uri=',//
			'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2f126a482eed269b&redirect_uri=', //
			encodeURIComponent('http://w3sg.w.yixun.com/t/loginProxy.php?fmt=1&redirectUrl=' + encodeURIComponent('http://' + (location.hostname.replace('51buy.com', 'yixun.com')) + '/t/my/wxlogin.html?jump=' + escape(href) + (location.hash == '#debugcookie' ? '#debugcookie' : ''))), //
			'&response_type=code&scope=snsapi_base&state=' + Date.now(), //
			'#wechat_redirect' //
		].join('');
		location.href = jumpWxLoginUrl;
	}

	function ifLogin() {
		if ($.cookie.get('uid') == '') {
			return false;
		} else {
			return true;
		}
	}
	return {
		icson: icson,
		ifLogin: ifLogin,
		wxAutoLogin: wxAutoLogin,
		wxAutoLoginFmt: wxAutoLoginFmt
	}
})