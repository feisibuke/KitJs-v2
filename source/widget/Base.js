define('widget/Base', [ 'common' ], function($) {
	function Base() {

	}
	$.merge(Base.prototype, {
		once : function(ev, fn) {
			var me = this;
			if (/array/i.test(Object.prototype.toString.call(ev)) && ev.length) {
				$.each(ev, function(i, o) {
					me.once(o, fn)
				});
			} else {
				me.event = me.event || {};
				me.event[ev] = me.event[ev] || [];
				me.event[ev].push({
					fn : fn,
					once : true
				});
			}
		},
		bind : function(ev, fn) {
			var me = this;
			if (/array/i.test(Object.prototype.toString.call(ev)) && ev.length) {
				$.each(ev, function(i, o) {
					me.bind(o, fn)
				});
			} else {
				me.event = me.event || {};
				me.event[ev] = me.event[ev] || [];
				me.event[ev].push({
					fn : fn
				});
			}
		},
		fireEvent : function(config) {
			var me = this, ev;
			if (typeof (config) == 'string') {
				ev = config;
				config = {
					type : ev
				};
			} else {
				ev = config.type;
			}
			if (me.event && me.event[ev]) {
				for (var i = 0; me.event[ev] && i < me.event[ev].length;) {
					me.event[ev][i].fn.call(me, config);
					if (me.event && me.event[ev] && me.event[ev][i] && me.event[ev][i].once) {
						me.event[ev].splice(i, 1);
						if (me.event[ev].length == 0) {
							delete me.event[ev];
						}
					} else {
						i++;
					}
				}
			}
		},
		unbind : function(ev, fn) {
			var me = this;
			if (/array/i.test(Object.prototype.toString.call(ev)) && ev.length) {
				$.each(ev, function(i, o) {
					me.unbind(o, fn)
				});
			} else {
				if (me.event && me.event[ev]) {
					if (arguments.length == 1) {
						delete me.event[ev];
					} else {
						for (var i = 0; me.event[ev] && i < me.event[ev].length; i++) {
							if (fn == me.event[ev][i]) {
								me.event[ev].splice(i, 1);
								break;
							}
						}
					}
				}
			}
		}
	})
	return Base;
})