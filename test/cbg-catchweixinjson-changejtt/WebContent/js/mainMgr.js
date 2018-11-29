function roleFunction(centerPanel, cmpTree, viewport) {
		centerPanel.addListener('tabchange', mgrListener);
		if (session.roleId == '0002' || session.roleId == '0005') {
			//审核
			Application.openIFrameTab('首页',
					'jsp/searchMessage.jsp?NJCL_TYPE=03', false);
		} else if (session.roleId == '0003' || session.roleId == '0004') {
			//查询
			Application.openIFrameTab('首页',
					'jsp/searchMessage.jsp?NJCL_TYPE=04', false);
		}
		//				viewport.doLayout();
		//				centerPanel.doLayout();
}
function mgrListener(tabPanel, tab) {
	if (tab.id == 'jsp/submitMain.jsp') {
		tab.iframe.setSrc();
	}
	if (tab.id == 'jsp/compWholeAuditing.jsp') {
		tab.iframe.setSrc();
	}
}

