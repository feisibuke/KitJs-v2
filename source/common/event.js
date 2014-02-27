define('common/event', [ 'common', function($) {
	function on(element, eventType, eventData, handler) {
		if (arguments.length == 3 && typeof eventData == 'function') {
			eventData = {};
			handler = eventData;
		}
		if (element.length) {
			for ( var i = 0; i < element.length; i++) {
				$(element[i]).bind(eventType, eventData, handler);
			}
		} else {
			$(element).bind(eventType, eventData, handler);
		}
	}
} ])