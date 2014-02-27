define('controller/a_baseAction', [ 'common', 'widget/Base' ], function($, Base) {
	var Action = $.inherit(Base);
	$.merge(Action.prototype, {
		/**
		 * 共享友元
		 */
		sharing : {

		},
		share : function() {
			if (arguments.length == 1) {
				for ( var n in arguments[0]) {
					this.sharing[n] = arguments[0][n];
				}
			} else {
				this.sharing[arguments[0]] = arguments[1];
			}
		},
		fireEvent : function(config) {
			config = $.mix(this.sharing, (typeof (config) == 'string') ? {
				type : config
			} : config);
			Action.superClass.prototype.fireEvent.call(this, config);
		}
	})
	self['ACTION'] = self['ACTION'] || new Action();
	return ACTION;
})