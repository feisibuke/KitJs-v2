define('widget/messageBox/messageBox', //
[ 'common', 'widget/messageBox/BackgroundShadow', 'widget/mustache' ],//
function($, BackgroundShadow, mustache) {
	function MessageBox() {
		this.messageBoxArray = window.__MessageBoxArray || [];
		this.messageBoxCurrent = null;
	}
	$.merge(MessageBox.prototype, {
		defaultConfig : {
			tips : {
				tpl : [ //
				'<div class="txt">',//
				'<pre class="J_messageContainer">{{msg}}</pre>',//
				'</div>' //
				].join(''),
				duration : 300
			},
			error : {
				tpl : [ //
				'<dl>', //
				'<dt><pre>{{msg}}</pre></dt>', //
				'<dd>{{#btn}}<a href="javascript:;" class="J_messageBtn {{style}}" id="{{id}}">{{name}}</a>{{/btn}}</dd>', //
				'</dl>', //
				//'{{^btn}}<div class="txt"><pre>{{msg}}</pre></div>{{/btn}}', //
				].join(''),
				btn : [ {
					style : 'btn_normal btn_normal_big',
					name : '我知道了',
					fn : function() {
						$.message.hideTips();
					}
				} ]
			},
			confirm : {
				tpl : [ //
				'<dl>', //
				'<dt><pre>{{msg}}</pre></dt>', //
				'<dd>{{#btn}}<a href="javascript:;" class="J_messageBtn {{style}}" id="{{id}}">{{name}}</a>{{/btn}}</dd>', //
				'</dl>', //
				//'{{^btn}}<div class="txt"><pre>{{msg}}</pre></div>{{/btn}}', //
				].join(''),
				btn : [ {
					style : 'btn_strong',
					name : '是'
				}, {
					style : 'btn_normal',
					name : '否',
					fn : function() {
						$.message.hideTips();
					}
				} ]
			},
			animDuration : 'fast',
			animFx : 'ease-out'
		},
		showMessage : function(config) {
			var me = this;
			me.backgroundShadow = me.backgroundShadow || new BackgroundShadow();
			me.backgroundShadow.clear();
			me.messageBoxCurrent = me.messageWrapper = $(mustache.render(config.tpl, config)).appendTo(me.backgroundShadow.contentContainer);
			me.messageContainer = me.messageWrapper.find('.J_messageContainer');
			for (var i = 0; config.btn && config.btn.length && i < config.btn.length; i++) {
				var configBtn = config.btn[i], btn = $('.J_messageBtn', me.messageWrapper)[i];
				btn.onclick = function() {
					if (typeof (configBtn.fn) == 'function') {
						configBtn.fn.call(this);
					}
					if (typeof (configBtn.then) == 'function') {
						configBtn.then.call(this);
					}
				}
			}
			me.backgroundShadow.show();
			me.messageWrapper.css({
				opacity : 0
			});
			me.messageWrapper.animate({
				opacity : 1
			}, config.animDuration, config.animFx, function() {
				if (config.type == 'tips') {
					setTimeout(function() {
						me.messageWrapper.animate({
							opacity : 0
						}, config.animDuration, config.animFx, function() {
							me.messageBoxCurrent.remove();
							me.messageBoxCurrent = null;
							if (me.messageBoxArray.length) {
								me.showMessage(me.messageBoxArray.shift());
							} else {
								me.backgroundShadow.hide();
							}
							config.then && config.then();
						});
					}, 1000);
				}
			});
		},
		tips : function(data, then) {
			var me = this;
			var config = $.mix(me.defaultConfig['tips'], typeof (data) == 'string' ? {
				msg : data,
				then : typeof (then) == 'function' ? then : null
			} : data);
			config.type = 'tips';
			me.ifShow(config);
		},
		error : function(data, then) {
			var me = this;
			var config = $.mix(me.defaultConfig['error'], typeof (data) == 'string' ? {
				msg : data,
				then : typeof (then) == 'function' ? then : null
			} : data);
			config.type = 'error';
			me.ifShow(config);
		},
		confirm : function(data, then) {
			var me = this;
			var config = $.mix(me.defaultConfig['confirm'], typeof (data) == 'string' ? {
				msg : data,
				then : typeof (then) == 'function' ? then : null
			} : data);
			config.type = 'confirm';
			me.ifShow(config);
		},
		ifShow : function(config) {
			var me = this;
			if (me.messageBoxCurrent == null) {
				me.showMessage(config);
			} else {
				me.messageBoxArray.push(config);
			}
		},
		hideTips : function(config) {
			var me = this;
			var config = $.mix(me.defaultConfig, config);
			me.messageBoxCurrent.animate({
				opacity : 0
			}, config.animDuration, config.animFx, function() {
				me.messageBoxCurrent.remove();
				me.messageBoxCurrent = null;
				if (me.messageBoxArray.length) {
					me.showMessage(me.messageBoxArray.shift());
				} else {
					me.backgroundShadow.hide();
				}
			});
		},
		reset : function() {
			var me = this;
			me.messageBoxCurrent && me.messageBoxCurrent.remove();
			me.backgroundShadow && me.backgroundShadow.hide();
			me.messageBoxArray = [];
		}
	})
	$.message = $.message || new MessageBox();
	return $.message;
})