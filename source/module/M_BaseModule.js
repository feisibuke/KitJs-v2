define('module/M_BaseModule', [ 'common' ], function($) {
	function M_BaseModule(config) {
		config = $.mix(config, {});
	}
	M_BaseModule.prototype = {

	}
	return M_BaseModule;
})