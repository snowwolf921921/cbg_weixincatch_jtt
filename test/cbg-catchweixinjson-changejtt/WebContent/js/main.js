

/*
 * 关闭窗口
 */
function confirmExit() {
	Ext.MessageBox.confirm('提示', '您是否确定要退出电信业务经营许可证年检系统？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : 'logout.do'
			});
			top.location.replace('index.jsp');
			self.opener = null;
			self.close();
		}
	});
}



/*
 * 在IFrame中打开新的页面
 */
function openIFrameTab(title, url) {
	Application.openIFrameTab(title, url);
}

// 根据给定的portletId刷新相应的portlet
function refreshPortlet(portlet_id) {
	var temp = Ext.getCmp("index").items.items;
	for (var i = 0; i < temp.length; i++) {
		var temp2 = temp[i].items.items;
		for (var j = 0; j < temp2.length; j++) {
			if (temp2[j].portletId == portlet_id) {
				temp2[j].refreshFn();
			}
		}
	}
}

Application = function() {

	var westPanel;
	var centerPanel;
	var menuConfig = [];
	var cookie = new Ext.state.CookieProvider({
		expires : new Date(new Date().getTime()
				+ (1000 * 60 * 60 * 24 * 365 * 12))
			//12年
	});

	var createNorthPanel = function() {
		quickLinks = [];
		quickLinks.push('->', {
			text : '修改密码',
			handler : function() {
			}
		}, {
			text : '隐藏导航栏',
			handler : function() {
			}
		}, {
			text : '注销',
			handler : function() {
			}
		}, {
			text : '退出',
			handler : function() {
			}
		});
		var northPanel = new Ext.Panel({
			region : 'north',
			split : false,
			border : false,
			html : "<div style='background-image:url(\"images/home/home_01.jpg\");position: absolute; top: 0px;  left: 0px; width: 630px;height:77px '></div><div style='background-image:url(\"images/home/home_02.jpg\"); top: 0px;  margin: 0px 249px 0px 588px;height:77px;'></div><div style='background-image:url(\"images/home/home_04.jpg\");position: absolute; top: 0px;  right: 0px; width: 392px;height:77px;text-align:right'></div>",
			height : 103,
			bbar : quickLinks,
			collapsible : false,
			margins : '0 0 0 0'
		});
		return northPanel;
	};
	//创建导航菜单（树）
	var createNavTreePanel = function() {
		westPanel = new Ext.tree.TreePanel({
			id : 'id_main_westpanel',
			region : 'west',
			title : '导航栏',
			split : true,
			width : 200,
			minSize : 175,
			maxSize : 400,
			collapsible : true,
			collapsed : cookie.get('westPanel.collapsed', false),
			margins : '0 0 1 0',
			cmargins : '0 0 1 0',
			maskDisabled : false,
			rootVisible : false,
			lines : false,
			autoScroll : true,
			layout : 'fit',
			//					root : rootMenuNode,
			root : {
				text : 'Ext JS',
				draggable : false,
				id : 'src'
			},
			loader : new Ext.tree.TreeLoader({
				dataUrl : 'tree.do?type=getMenuTree&mrootid=0&disptype=0'
			//			        	dataUrl:'tree.do?type=orguser&oid=0'      
			}),
			listeners : {
				expand : function(p) {
					cookie.set('westPanel.collapsed', false);
				},
				collapse : function(p) {
					cookie.set('westPanel.collapsed', true);
				}
			}
		});
		return westPanel;
	};



	return {
		refreshMainTree : function() {
			var cmpTree = Ext.getCmp('id_main_westpanel');
			cmpTree.loader.load(cmpTree.root, function() {
				cmpTree.expandAll()
			});
		},
		/*
		 * 在新的tab页面中创建iframe
		 */
		openIFrameTab : function(title, url, closable) {
			var iframePanel = Ext.getCmp(url);
			if (!iframePanel) {
				iframePanel = new Ext.ux.ManagedIframePanel({
					id : url,
					title : title,
					defaultSrc : url,
					closable : closable == false ? closable : true,
					listeners : {
						message : function(iframe, obj) {
							if (obj.data == "closeFrame")
								centerPanel.remove(this);
						}
					}
				});
				centerPanel.add(iframePanel);
			}
			centerPanel.setActiveTab(iframePanel);
		},
		/*
		 * 删除tab
		 */
		removeTab : function(id){
			var tab = Ext.getCmp(id);
			centerPanel.remove(tab);
		},

		/*
		 * 隐藏左侧导航栏
		 */
		hideWestPanel : function() {
			westPanel.collapse(true);
		},

		/*
		 * 初始化
		 */
		doLayoutMainViewport: function(){
			Ext.getCmp('id_viewport_main').doLayout();
		} ,
		init : function(){
				centerPanel = new Ext.TabPanel({
				region : 'center',
				defaultType : 'iframepanel',
				activeTab : 0,
				enableTabScroll : true,
				plugins : new Ext.ux.TabCloseMenu(),
				defaults : {
					// closable:true,
					loadMask : {
						msg : '请稍候，正在载入...'
					},
					autoShow : true,
					border : false
				}
			});
			var viewport = new Ext.Viewport({
				id : 'id_viewport_main',
				layout : 'border',
				autoScroll : false,
				items : [createNorthPanel(), createNavTreePanel(), centerPanel]
			});

			var cmpTree = Ext.getCmp('id_main_westpanel');
			cmpTree.expandAll();
			/*centerPanel.addListener('tabchange', mgrListener);
			Application.openIFrameTab('首页','jsp/searchMessage.jsp?NJCL_TYPE=03', false);
			centerPanel.doLayout();*/
			roleFunction(centerPanel, cmpTree);
			
			viewport.doLayout();
		},
		setting : function() {
			var formPassword = new Ext.form.FormPanel({
				frame : true,
				labelAlign : 'right',
				bodyStyle : "padding:5px 5px 0",
				labelSeparator : '：',
				labelWidth : 120,
				items : [{
					id : 'id_mainjs_old_pw',
					fieldLabel : "原密码",
					xtype : "textfield",
					inputType : 'password',
					allowBlank : false,
					name : "oldPw",
					minLength : 8,
					anchor : '98%'
				}, {
					xtype : 'textfield',
					anchor : '98%',
					fieldLabel : '新密码',
					inputType : 'password',
					allowBlank : false,
					blankText : '密码不能为空！',
					name : 'password',
					id : 'password2_id',
					vtype : 'minlength',
					minlen : '8'
				}, {
					xtype : 'textfield',
					anchor : '98%',
					fieldLabel : '确认新密码',
					inputType : 'password',
					name : 'password3',
					vtype : 'password',
					initialPassField : 'password2_id' // id of the initial password field
				}, {
					name : 'usrID',
					xtype : 'hidden',
					value : session.userId
				}]
			});
			var winPassword = new Ext.Window({
				title : '修改密码',
				border : false,
				layout : 'fit',
				width : 300,
				height : 180,
				modal : true,
				items : [formPassword],
				buttonAlign : 'center',
				focus : function() {
					Ext.getCmp('id_mainjs_old_pw').focus();
				},
				buttons : [{
					text : '确定',
					handler : function() {
						if (formPassword.form.isValid()) {
							formPassword.form.submit({
								url : 'login.do?method=changePw',
								waitMsg : '正在修改密码，请稍后...',
								reset : false,
								success : function(form, action) {
									if (action.result.success == true) {
										Ext.MessageBox.show({
											title : '成功',
											msg : '操作成功完成！',
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.INFO,
											fn : function() {
												winPassword.close();
												winPassword.destroy();
												winPassword = false;
											}
										});
									} else {
										Ext.MessageBox.show({
											title : '错误',
											msg : action.result.errors.errorString,
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
									}
								},
								failure : function(form, action) {
									Ext.MessageBox.show({
										title : '错误',
										msg : action.result.errors.errorString,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
								}
							});
						} else {
							Ext.MessageBox.show({
								title : '错误',
								msg : action.result.errors.errorString,
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
						}
					}
				}, {
					text : '取消',
					handler : function() {
						winPassword.close();
						winPassword = null;
					}
				}]
			});
			winPassword.show();
		}
	}
}();

Ext.onReady(Application.init, this);

//系统效果提示信息
Ext.effectMsgBox = function() {
	var msgCt;
	function createBox(c, t, s) {
		return [
				'<div class="x-box">',
				'<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
				'<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><div class="',
				c,
				'"><h3>',
				t,
				'</h3>',
				s,
				'</div></div></div></div>',
				'<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
				'</div>'].join('');
	}

	function showMsg(cls, title, format) {
		if (!msgCt) {
			msgCt = Ext.DomHelper.insertFirst(parent.document.body, {
				id : 'msg-div'
			}, true);
		}
		msgCt.alignTo(document, 'tr-tr');
		var s = String.format.apply(String, Array.prototype.slice.call(
				arguments, 2));
		var m = Ext.DomHelper.append(msgCt, {
			html : createBox(cls, title, s)
		}, true);
		//m.slideIn('t').pause(2).ghost("t", {remove:true});
		m.fadeIn({
			endOpacity : 0,
			duration : 1.5
		}).pause(1).fadeOut({
			endOpacity : 0,
			easing : 'easeOut',
			duration : 1.5,
			remove : true
		});
	}

	return {
		info : function(title, format) {
			showMsg('msg-info', title, format);
		},
		warning : function(title, format) {
			showMsg('msg-warning', title, format);
		},
		error : function(title, format) {
			showMsg('msg-error', title, format);
		},
		waiting : function(title, msg) {
			Ext.MessageBox.show({
				msg : title,
				progressText : msg,
				width : 300,
				wait : true,
				waitConfig : {
					interval : 200
				}
			});
		}
	}
}();
