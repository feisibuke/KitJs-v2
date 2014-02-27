require([ 'common', 'controller/a_baseAction',//
'controller/testcase/a_pageScroll', 'controller/testcase/a_magnet' ],//
function($, ACTION) {
	ACTION.fireEvent('pageScroll');
});
