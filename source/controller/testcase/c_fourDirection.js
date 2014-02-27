require([ 'common', 'controller/a_baseAction',//
'controller/testcase/a_pageScroll' ],//
function($, ACTION) {
	ACTION.fireEvent('pageScroll');
});
