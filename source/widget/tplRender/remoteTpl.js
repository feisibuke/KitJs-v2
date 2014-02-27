define('widget/tplRender/remoteTpl', function() {
	return {
		matchHTML : function(html) {
			//只取得body内容
			var content = html.match(/<body(.*(\r\n|\n))+.*<\/body>/mg)[0].replace(/<body(^>)*>/mi, '').replace(/<\/body>/i, '');
			//忽略优先匹配最小的script块，然后删除
			//删除script src
			content = content.replace(/<script[^>]+src=[^>]+>(((?!<\/?script).)*[\r\n]*)+<\/script>/mgi, '')
			//删除script块
			content = content.replace(/<script>(((?!<\/?script).)*[\r\n]*)+<\/script>/mgi, '')
			return content;
		}
	}
})