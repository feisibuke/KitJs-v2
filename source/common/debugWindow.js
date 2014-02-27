/**
 * debug window
 */
define('common/debugWindow', function() {
	var debugWinDiv, debugWinTips;
	function init() {
		if (document.querySelector('.J_debugWindow')) {
			debugWinDiv = document.querySelector('.J_debugWindow');
			debugWinTips.style.display = 'block';
			debugWinDiv.style.display = 'none';
		} else {
			debugWinDiv = document.createElement('div');
			debugWinDiv.className = 'J_debugWindow';
			document.body.appendChild(debugWinDiv);
			debugWinDiv.style.width = '100%';
			debugWinDiv.style.height = '100%';
			debugWinDiv.style.zIndex = 9999999999999;
			debugWinDiv.style.position = 'fixed';
			debugWinDiv.style.top = 0;
			debugWinDiv.style.left = 0;
			debugWinDiv.style.backgroundColor = '#fff';
			debugWinDiv.style.height = '100%';
			debugWinDiv.style.color = '#000';
			debugWinDiv.style.display = 'none';
			debugWinDiv.innerHTML = [//
			'<div style="height:10%;"><input class="J_debugWindowBtn1" type="button" value="清空执行">',//
			'<input class="J_debugWindowBtn2" type="button" value="清空结果">',//
			'<input class="J_debugWindowBtn3" type="button" value="执行">',//
			'<input class="J_debugWindowBtn4" type="button" value="关闭">',//
			'</div>',//
			'<div style="height:30%"><textarea class="J_debugWindowTextarea1" style="width:100%;height:100%;display:block"></textarea></div>',//
			'<div style="height:60%"></textarea><textarea class="J_debugWindowTextarea2" style="width:100%;height:100%;display:block"></textarea></div>' ].join('');
			document.querySelector('.J_debugWindowBtn1').onclick = function() {
				document.querySelector('.J_debugWindowTextarea1').value = '';
			}
			document.querySelector('.J_debugWindowBtn2').onclick = function() {
				document.querySelector('.J_debugWindowTextarea2').value = '';
			}
			document.querySelector('.J_debugWindowBtn3').onclick = function() {
				var re = '';
				try {
					re = eval($('textarea', debugWinDiv).eq(0).val());
				} catch (e) {
					re = e.stack || e;
				}
				document.querySelector('.J_debugWindowTextarea2').value = document.querySelector('.J_debugWindowTextarea2').value + (document.querySelector('.J_debugWindowTextarea2').value.length ? '\r\n\r\n' : '') + re;
				document.querySelector('.J_debugWindowTextarea2').scrollTop = document.querySelector('.J_debugWindowTextarea2').scrollHeight;
			}
			document.querySelector('.J_debugWindowBtn4').onclick = function() {
				debugWinDiv.style.display = 'none';
				debugWinTips.style.display = 'block';
			}
		}
		if (document.querySelector('.J_debugWindowTips')) {
			debugWinTips = document.querySelector('.J_debugWindowTips');
			debugWinTips.style.display = 'block';
		} else {
			debugWinTips = document.createElement('div');
			debugWinTips.style.position = 'fixed';
			debugWinTips.style.top = 0;
			debugWinTips.style.left = '30px';
			debugWinTips.innerHTML = 'DEBUG';
			debugWinTips.style.height = 30;
			debugWinTips.style.width = 120;
			debugWinTips.style.color = 'red';
			debugWinTips.style.zIndex = 9999999999999;
			debugWinTips.style.backgroundColor = 'yellow';
			document.body.appendChild(debugWinTips);
			debugWinTips.onclick = function() {
				debugWinTips.style.display = 'none';
				debugWinDiv.style.display = 'block';
			}
		}
	}
	//	window.__J_DEBUG_WINDOW__TIPS = debugWinTips;
	//window.__J_DEBUG_WINDOW__DIV = debugWinDiv;
	return {
		show : function() {
			init();
		},
		hide : function() {
			debugWinTips.style.display = 'none';
			debugWinDiv.style.display = 'none';
		}
	}
})
