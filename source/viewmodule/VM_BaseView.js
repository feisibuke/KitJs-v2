define([ 'common', 'widget/tplrender' ], function($, tplrender) {
	var delegateEventSplitter = /^(\S+)\s*(.*)$/;

	var uniqueId = (function() {
		var idCounter = 0;
		return function(prefix) {
			var id = ++idCounter + '';
			return prefix ? prefix + id : id;
		};
	})();

	var bind = function(fn, me) {
		return function() {
			return fn.apply(me, arguments);
		};
	};

	function VM_BaseView(config) {
		config = $.mix(config, {});
		this.wrapper = config.wrapper || $(document.body);
		this.defaultConfig = {
			templateNodeSelector : '.J_template',
			viewDataNodeSelector : '.J_viewData'
		}
		this.config = $.mix(this.defaultConfig, config);
		this.config.firstContentTemplate = this.wrapper.html();
		this.cid = uniqueId('vm');
		this.initialize(config);
		this.delegateEvents();
	}
	VM_BaseView.prototype = {
		initialize : function(options) {
		},

		$ : function(selector) {
			return this.wrapper.find(selector);
		},

		delegateEvents : function(events) {
			if (!(events || (events = this.events))) {
				return this;
			}
			this.undelegateEvents();
			for ( var key in events) {
				var method = events[key];
				if (!$.isFunction(method)) {
					method = this[events[key]];
				}
				if (!method) {
					continue;
				}

				var match = key.match(delegateEventSplitter);
				var eventName = match[1], selector = match[2];
				method = bind(method, this);
				eventName += '.delegateEvents' + this.cid;
				if (selector === '') {
					this.wrapper.on(eventName, method);
				} else {
					this.wrapper.on(eventName, selector, method);
				}
			}
			return this;
		},

		undelegateEvents : function() {
			this.wrapper.off('.delegateEvents' + this.cid);
			return this;
		},

		render : function() {
			var me = this;
			if (arguments.length == 2) {
				var data = arguments[0];
				var then = arguments[1];
				var me = this;
				tplrender.tpl($(me.config.templateNodeSelector, me.wrapper), data, function(mission) {
					if (mission.left == 0) {
						//成功之后，绑定click事件
						then && then.call(this);
					}
				})
			} else if (arguments.length == 3) {
				var selector = arguments[0];
				var data = arguments[1];
				var then = arguments[2];
				tplrender.tpl($(selector, me.wrapper), data, function(mission) {
					if (mission.left == 0) {
						//成功之后，绑定click事件
						then && then.call(this);
					}
				})
			}
		},
		hide : function() {
			this.wrapper.hide();
		},
		show : function() {
			this.wrapper.show();
		},
		gc : function() {
			this.wrapper.remove();
		},
		reset : function() {
			this.wrapper.html(this.config.firstContentTemplate);
		},
		endLoading : function() {
			$('.J_view_loading', this.wrapper).hide();
			$('.J_loadingEnd', this.wrapper).show();
		},
		startLoading : function() {
			$('.J_view_loading', this.wrapper).show();
			$('.J_loadingEnd', this.wrapper).hide();
		},
		loadViewData : function() {
			try {
				this.viewDataNode = $(this.config.viewDataNodeSelector, this.wrapper);
				if (this.viewDataNode.length) {
					this.viewData = JSON.parse(this.viewDataNode.val());
				}
			} catch (e) {

			}
		},
		saveViewData : function() {
			try {
				this.viewDataNode.val(JSON.stringify(this.viewData));
			} catch (e) {

			}
		},
		action : function(actionName) {
			
		}
	}
	return VM_BaseView;
})