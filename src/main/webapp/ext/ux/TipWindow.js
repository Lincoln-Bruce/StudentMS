Ext.define('Ext.ux.TipsWindow', {
			extend : 'Ext.Window',

			layout : 'fit',

			hideTask : null,

			delaySecond : null,

			constructor : function(conf) {
				this.callParent(arguments);
				this.initPosition(true);
			},
			initEvents : function() {
				var me = this;
				me.callParent(arguments);
				// 自动隐藏
				if (false !== this.autoHide) {
					me.hideTask = new Ext.util.DelayedTask(me.hide, me);
					me.delaySecond = (parseInt(me.autoHide) || 3) * 1000;
					me.on('show', function(self) {
								me.hideTask.delay(me.delaySecond);
							});
					me.on('afterrender', function(_thisWin) {
						alert(1);
								me.setDelayHideOnMouseover(_thisWin);
							});
				}
				me.on('beforeshow', me.showTips);
				me.on('beforehide', me.hideTips);

				Ext.EventManager.onWindowResize(me.initPosition, me); // window大小改变时，重新设置坐标
				Ext.EventManager.on(window, 'scroll', me.initPosition, me); // window移动滚动条时，重新设置坐标
			},
			initPosition : function(flag) {
				if (true !== flag && this.hidden) { // 不可见时，不调整坐标
					return false;
				}
				var doc = document, bd = (doc.body || doc.documentElement);
				// ext取可视范围宽高(与上面方法取的值相同), 加上滚动坐标
				var left = bd.scrollLeft + Ext.Element.getViewWidth() - 4 - this.width;
				var top = bd.scrollTop + Ext.Element.getViewHeight() - 30 - this.height;
				this.setPosition(left, top);
			},
			showTips : function() {
				this.isHide = false;
				var self = this;
				if (!self.hidden) {
					return false;
				}

				self.initPosition(true); // 初始化坐标
				self.el.slideIn('b', {
							callback : function() {
								// 显示完成后,手动触发show事件,并将hidden属性设置false,否则将不能触发hide事件
								self.fireEvent('show', self);
								self.hidden = false;
							}
						});
				return false; // 不执行默认的show
			},
			hideTips : function() {
				this.isHide = true;
				var self = this;
				if (self.hidden) {
					return false;
				}

				self.el.slideOut('b', {
							callback : function() {
								// 渐隐动作执行完成时,手动触发hide事件,并将hidden属性设置true
								self.fireEvent('hide', self);
								self.hidden = true;
							}
						});
				return false; // 不执行默认的hide
			},
			setDelayHideOnMouseover : function(_thisWin) {
				_thisWin.mon(_thisWin.el, {
							mouseover : function() {
								me.hideTask.cancel(); // 鼠标悬停时不隐藏窗体
							},
							mouseout : function() {
								me.hideTask.delay(delaySecond); // 鼠标移开时开启延时隐藏窗体
							}
						});
			}

		});