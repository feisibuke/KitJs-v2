define('service/s_log', function() {
	return {
		send : {
			//url: 'http://app.'+urlConfig.mainDomain+'/tjson.php?mod=aitem&act=getdetail&callback=?',
			url : 'http://m.' + (location.host.indexOf('51buy') > -1 ? '51buy' : 'yixun') + '.com/tjson.php?mod=treport&act=getReport',
			get : {

			}
		}
	}
})