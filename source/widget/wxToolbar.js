/**
 * 微信导航条
 * @author: deliliu
 * @since: 12/11/13 11:45
 */

define(function () {
    var _w = window;

    var hideBottom = function () {
        try {
            _w.WeixinJSBridge.call('hideToolbar');
        } catch (e) {}
    };

    var showBottom = function () {
        try {
        _w.WeixinJSBridge.call('showToolbar');
        } catch (e) {}
    };


    return {
        //隐藏底部导航条
        hideBottomBar: function() {
            if (_w.WeixinJSBridge) {
                hideBottom();
            } else {
                var _timeout_WX_regist = setTimeout(hideBottom, 1000);

                document.addEventListener("WeixinJSBridgeReady", function() {
                    clearTimeout(_timeout_WX_regist);
                    hideBottom();
                });

            }
        },

        //显示底部导航条
        showBottomBar: function() {
            if (_w.WeixinJSBridge) {
                showBottom();
            } else {
                var _timeout_WX_regist = setTimeout(showBottom, 1000);

                document.addEventListener("WeixinJSBridgeReady", function() {
                    clearTimeout(_timeout_WX_regist);
                    hideBottom();
                });
            }
        }
    };
});