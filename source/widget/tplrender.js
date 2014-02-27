/*
 * 模板渲染工厂组件
 * @author: addisonxue
 */
define('widget/tplrender', [ 'common', 'widget/tplFn', 'config/url', 'widget/tplRender/remoteTpl', 'widget/mustache' ], function($, tplFn, configUrl, remoteTpl, mustache) {
	/*
	 * 申明$T作为alias
	 */
	this.$T = this.tplFn = tplFn;
	/*
	 * 给tplFn挂上特别的方法
	 */
	tplFn.makeUrl = $.makeUrl;
	/*
	 * 开始申明相关状态变量
	 */
	var self = this;
	var worker;
	var PREFIX = 'TPLRENDER_CMD_';
	//是否启用worker
	var enableWorker = true;
	//是否支持worker
	var isSupportWorker = true;
	/*
	 * 保存模板命令的存储对象
	 */
	__tplrender_ticket__ = {};
	/*
	 * 保存模板的存储对象
	 */
	__tplrender_tpl_store__ = {};
	/*
	 * 保存任务的存储对象
	 */
	__tplrender_mission__ = {};
	/*
	 * 保存待执行任务的队列
	 */
	__tplrender_mainThread_jobArray__ = [];
	__tplrender_workerThread_jobArray__ = [];
	/*
	 * 当前执行队列的长度
	 */
	var excuteQueueSequence = 0;
	/*
	 * 当前的环境变量，需要传给worker一份的
	 */
	$ENV = $.mix({
		navigator : $.formatToValueType(navigator),
		location : $.formatToValueType(location)
	}, configUrl);
	/*
	 * worker池
	 */
	window.workerPool = [];
	/*
	 * worker池内worker最大数量
	 */
	var workerPoolAmount = 2;
	/*
	 * 页面主线程对象
	 */
	var localThread;
	/**
	 * 渲染
	 */
	function tpl(el, data, callback, excuteQueue) {
		try {
			/*
			if ('length' in el && typeof (el) != 'string' && el.length == 0) {
				return;
			}
			*/
			/*
			 * 如果是递归进来的，就是已经创建了执行队列excuteQueue
			 */
			if (excuteQueue) {
				//
			} else {
				/*
				 * 创建一个执行队列
				 */
				var sequence = 'EXCUTE_SEQUENCE_' + excuteQueueSequence++;
				excuteQueue = {
					//当前任务
					mission : sequence,
					//这里的el可能是个数组，或者单个元素，值是<script或者<textarea的js模板的HTML元素
					el : el,
					//用于覆盖js模板的数据json
					data : data,
					//回调
					callback : callback,
					//执行完毕的任务数字，初始为0,没有任务执行完毕
					total : 0
				//用于统计执行时间
				//,startTime : new Date().getTime()
				}
				/*
				 * misson任务存根
				 */
				__tplrender_mission__[sequence] = excuteQueue;
			}
			if (typeof el != 'string' && el.length && !el.nodeName) {
				/*
				 * 如果需要执行模板的el是HTML元素的数组，那么递归开始
				 */
				for (var i = 0; i < el.length; i++) {
					tpl(el[i], data, callback, excuteQueue);
				}
			} else if (!el.nodeName && el.wrapperId && el.url && !el.tpl) {
				/*
				 * 如果el不是HTML元素，是一个json，包括了url，那么就是拉取一个远程模板
				 */
				if (__tplrender_tpl_store__[el.url]) {
					/*
					 * 先判断当前页面是否已经拉取过该模板了，拉取过就直接用了
					 */
					el.tpl = __tplrender_tpl_store__[el.url];
					tpl(el, data, callback, excuteQueue);
				} else {
					/*
					 * 没有拉取过，则开始发送ajax请求拉取HTML，并且去掉HTML中的script标签块
					 */
					$.get(el.url, function(remoteHTMLFile) {
						$.log('远程tpl模板', remoteHTMLFile);
						el.tpl = remoteTpl.matchHTML(remoteHTMLFile);
						__tplrender_tpl_store__[el.url] = el.tpl;
						//记录tpl
						excuteQueue.tpl = el.tpl;
						//
						tpl(el, data, callback, excuteQueue);
					})
				}
			} else if (typeof (el) == 'object' && 'length' in el && el.length == 0) {
				return;
			} else {
				/*
				 * 最终单个模板的执行代码
				 */
				//计算当然票据id
				var id = PREFIX + (window._cmd_no_tplrender_++);
				__tplrender_ticket__[id] = {
					el : el
				}
				//执行队列+1
				excuteQueue.total++;
				//统计执行队列总数
				$.log('total', excuteQueue.total);
				//需要传递给worker的消息
				var message = {
					//告诉worker这个是一个模板命令
					cmd : 'tpl',
					//模板的字符串
					tpl : _getTemplate(el),
					//当前任务id
					id : id,
					//附加的环境变量
					data : mixData(data),
					//任务号
					mission : excuteQueue.mission,
					mainThread : el && el.nodeName && el.getAttribute('main-thread') == 'true' ? true : false
				}
				/*
				 * 当支持worker且启用worker的时候
				 */
				if (isSupportWorker && enableWorker && message.mainThread != true) {
					/*
					 * 查找worker池中空闲的worker发送任务消息
					 */
					for (var i = 0; i < workerPool.length; i++) {
						var worker = workerPool[i];
						//status=0才是空闲的
						if (worker.status == 0) {
							worker.postMessage(message);
							//发送完立刻置状态为1，表示busy状态
							worker.status = 1;
							break;
						}
						//发现到最后一个了，没有worker可用的时候，把当前任务放在等待队列里面
						if (i == workerPool.length - 1) {
							__tplrender_workerThread_jobArray__.push(message);
						}
					}
				} else {
					/*
					 * 当不支持worker时候，用主线程执行模板计算任务，先将任务放在等待队列里面
					 */
					__tplrender_mainThread_jobArray__.push(message);
					//当主线程不忙（status==0）时，下次渲染结束间隙时，开发执行计算
					if (localThread.status == 0) {
						localThread.status = 1;
						(window.requestAnimationFrame || window.webkitRequestAnimationFrame || setTimeout)(function() {
							localThread.job(__tplrender_mainThread_jobArray__.shift());
						}, 0);
					}
				}
			}
		} catch (e) {
			Logger.error('模板报错' + e.stack);
			throw e;
		}
	}
	/**
	 * 取得HTML元素内的js模板数据
	 */
	function _getTemplate(el) {
		if (typeof el == 'string') {
			return el;
		} else if (el && el.tagName) {
			switch (el.tagName.toLowerCase()) {
			case 'script':
				return el.text;
				break;
			case 'textarea':
				return el.value;
				break;
			default:
				return '';
			}
		} else if (el.tpl) {
			return el.tpl;
		} else {
			return '';
		}
	}
	/**
	 * 开始实际的HTML渲染
	 */
	function _render(id, result, missionId, stepVariable) {
		$.log('finish tpl replace');
		//var d1 = new Date().getTime();
		//装在js模板的HTML元素
		var el = __tplrender_ticket__[id].el;
		//旧的js模板的HTML元素的id
		var oldTextareaId;
		var dataRemove, wrapperId, re, wrapperCls;
		//当js模板的HTML元素存在时
		if (el.nodeName) {
			//data-remove表示该元素是否模板是否支持循环使用
			dataRemove = el.getAttribute('data-remove');
			wrapperId = el.getAttribute('data-wrapper-id');
			wrapperCls = el.getAttribute('data-wrapper-cls');
			wrapperTag = el.getAttribute('data-wrapper-tag') || 'div';
			//保存这次模板的HTML的id
			oldTextareaId = el.id;
			if (dataRemove && dataRemove.toLowerCase() == 'false') {
				//当不需要循环使用的时候
				if (wrapperId && wrapperId.length > 0) {
					$('#' + wrapperId).remove();
					if (result.length && !/^\s+$/.test(result)) {
						var div = document.createElement(wrapperTag);
						div.id = wrapperId;
						div.innerHTML = result;
						if (wrapperCls) {
							div.className = wrapperCls;
						}
						$(el).before(div);
					}
				} else {
					if (result.length && !/^\s+$/.test(result)) {
						if ($(el).attr('data-insert-position') == 'after') {
							$.insertHTML(el, result, 'after');
						} else {
							$.insertHTML(el, result, 'before');
						}
					}
				}
			} else {
				if (result.length && !/^\s+$/.test(result)) {
					$.replaceHTML(el, result);
				}
			}
		} else if (el.wrapperId && el.wrapperId.length) {
			var wrapperId = el.wrapperId, wrapperCls = el.wrapperCls, wrapperTag = el.wrapperTag || 'div';
			if (wrapperId && wrapperId.length > 0) {
				$('#' + wrapperId).remove();
				var div = document.createElement(wrapperTag);
				div.id = wrapperId;
				div.innerHTML = result;
				if (wrapperCls) {
					div.className = wrapperCls;
				}
				if ($('body>footer').length) {
					$('body>footer').before(div);
				} else {
					document.body.appendChild(div);
				}
			}
		}
		delete __tplrender_ticket__[id];
		var mission = __tplrender_mission__[missionId];

		mission.total--;
		/*var left = 0;
		for ( var p in __tplrender_ticket__) {
			left++;
		}
		*/
		re = {
			left : mission.total,
			id : oldTextareaId,
			result : result,
			wrapperId : wrapperId,
			wrapperCls : wrapperCls
		}
		if (mission.tpl) {
			re.tpl = mission.tpl;
		}
		$.log('missionId', missionId);
		$.log('mission total', mission.total);
		//
		$.log('__tplrender_ticket__', __tplrender_ticket__);
		$.log('re', re);
		try {
			mission.callback && mission.callback(re);
		} catch (e) {
			Logger.error(e);
			Logger.send();
			throw e;
		} finally {
			if (mission.total == 0) {
				//alert(new Date().getTime() - parseFloat(__tplrender_mission__[missionId].startTime));
				delete __tplrender_mission__[missionId];
				if (stepVariable) {
					for ( var p in stepVariable) {
						$ENV.step = $ENV.step || {};
						$ENV.step[p] = Math.max($ENV.step[p] || 0, stepVariable[p]);
					}
				}
			}
		}
		$.log('mission.callback', mission.callback);
	}
	/**
	 * 获取远程模板，并加入到当前页面，但是没有执行渲染
	 */
	function getRemoteTpl(el, callback) {
		if (__tplrender_tpl_store__[el.url]) {
			el.tpl = __tplrender_tpl_store__[el.url];
			then();
		} else {
			$.get(el.url, function(remoteHTMLFile) {
				$.log('远程tpl模板', remoteHTMLFile);
				el.tpl = remoteTpl.matchHTML(remoteHTMLFile);
				__tplrender_tpl_store__[el.url] = el.tpl;
				then();
			})
		}
		function then() {
			var wrapperTag = el.wrapperTag || 'div';
			if (el.wrapperId) {
				if (document.getElementById(el.wrapperId)) {
					$('#' + el.wrapperId).remove();
				}
				var wrapper = document.createElement(wrapperTag);
				wrapper.id = el.wrapperId;
				if (el.wrapperCls) {
					wrapper.className = el.wrapperCls;
				}
				wrapper.innerHTML = el.tpl;
				if ($('body>footer').length) {
					$('body>footer').before(wrapper);
				} else {
					document.body.appendChild(wrapper);
				}
			}
			callback && callback();
		}
	}
	/**
	 * 混合环境信息
	 */
	function mixData(data, thread) {
		return $.mix({
			_$ENV : $ENV
		}, data);
	}
	return (function() {
		window._cmd_no_tplrender_ = 0;
		if (!window._tplrenderWorker) {
			var _prefix = '';
			// if ($.url.getPathname().indexOf('/\event')) {
			// 	_prefix = 'http://' + $.url.getHost() + '/event';
			// } else {
			// 	_prefix = 'http://' + $.url.getHost() + '/t';
			// }
			_prefix = 'http://' + $.url.getHost() + '/touch_v2/build/worker/';
			try {
				for (var i = 0; i < workerPoolAmount; i++) {
					worker = new Worker(_prefix + '/worker.js?v=' + (GLOBAL_CONFIG.workerVersion || ''));
					worker.onerror = function(e) {
						Logger.error(e.stack || e.message, 'worker错误信息');
						Logger.error(e.lineno, 'worker错误行号');
						Logger.error(e.filename, 'worker错误文件');
						Logger.send();
					};

					if (worker) {
						if (window._tplrenderWorker != true) {
							document.body.addEventListener('beforeunload', function() {
								for (var i = 0; i < workerPool.length; i++) {
									workerPool[i].terminate();
								}
							})
						}
						window._tplrenderWorker = true;
						worker.onmessage = function(message) {
							var data = message.data;
							if ('result' in data) {
								this.status = 0;
								try {
									if (__tplrender_workerThread_jobArray__.length) {
										this.postMessage(__tplrender_workerThread_jobArray__.shift());
										this.status = 1;
									}
									//

									$.log('on message data', data);
									if (data.id && __tplrender_ticket__[data.id]) {
										//var originData = __tplrender_ticket__[data.id];
										var result = data.result;
										//if (result.length && !/^\s+$/.test(result)) {
										_render(data.id, result, data.mission, data.step);
										//}
									}
									$.log('data.id+time', data.id + ' ' + (+new Date()));
									//
								} catch (e2) {
									Logger.error(e2);
									Logger.send();
									throw e2;
								}
							}
						}
						worker.status = 0;
					}
					workerPool.push(worker);
				}
			} catch (e) {
				'不支持双核处理模式';
				isSupportWorker = false;
			}
		}
		localThread = {
			job : function(message) {
				if (message == null)
					return;
				try {
					if (__tplrender_mainThread_jobArray__.length) {
						(window.requestAnimationFrame || window.webkitRequestAnimationFrame || setTimeout)(function() {
							localThread.job(__tplrender_mainThread_jobArray__.shift());
						}, 0);
					} else {
						localThread.status = 0;
					}
					(function() {
						$.log('localMainThreadID', message.id);
						var rr = mustache.render(message.tpl, message.data);
						if (rr.indexOf('{%') > -1 && message.data != null) {
							rr = this.tplFn.jtpl(rr, message.data);
						}
						rr = rr.replace(/{#/g, '{').replace(/#}/g, '}');
						_render(message.id, rr, message.mission);
					}).call(self);
				} catch (e1) {
					Logger.error(e1);
					Logger.send();
					//alert(e1.stack);
					throw e1;
				}
			},
			status : 0
		}
		/**
		 * exports
		 */
		return {
			tpl : tpl,
			getRemoteTpl : getRemoteTpl,
			disableMutiThread : function() {
				enableWorker = false;
			},
			enableMutiThread : function() {
				enableWorker = true;
			},
			stepVariable : function() {
				$ENV.step = $ENV.step || {};
				return $ENV.step;
			}

		/*
		addVariable : function(k, v) {
			$ENV[k] = v;
		},
		removeVariable : function(k) {
			delete $ENV[k]
		},
		*/
		}
	})()
})