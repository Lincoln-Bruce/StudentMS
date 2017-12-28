var store = Ext.create('Ext.data.Store',{
	fields: ['id', 'name', 'age', 'fm'],
	proxy: {
		type: 'ajax',
		url: '/student/queryStudents.action',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'total'
		},
		pageSize: 20,
		autoLoad: true,
	}
});

var grid = Ext.create('Ext.grid.Panel', {
	store: store,
	border: false,
	columns: [{
		dataIndex: 'id',
		header: 'ID',
		width: 120
	}, {
		dataIndex: 'name',
		header: '名字',
		width: 120
	}, {
		dataIndex: 'age',
		header: '年龄',
		width: 120
	}, {
		dataIndex: 'fm',
		header: '性别',
		width: 120
	}]
});

//var panel = Ext.create('js.example',{
//	
//});

var examplePanel = Ext.create("Ext.panel.Panel", {
	width: 1000,
	height: 200,
	items: [grid]

//	html : '<div class="m-header"><h2 class="logo"><img src="images/headerFontABS.png"></h2><div class="tip"><span>业务日期：<em id="buzDate">'
//		+ '</em></span><span>欢迎您： <em id ="userName">'
//		+ '</em></span></div><div class="link"><a href="javascript:closeAllTabs();" onmouseover="showTipIndex();" onmouseout="hideTip();" class="index">首页</a><a href="javascript:modifyPwd();" onmouseover="showTipSetting();" onmouseout="hideTip();" class="lock">设置</a><a href="javascript:logout();" onmouseover="showTipLogout();" onmouseout="hideTip();" class="logout">注销</a></div><div style="color:#fff;"><span>tip</span></div></div>'
});
