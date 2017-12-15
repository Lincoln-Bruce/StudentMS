Ext.define('js.example', {
	extend: 'js.frameBase',
	canExcel : false,
	
	createGridColumns : function() {
		return [{
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
			dataIndex: 'FM',
			header: '性别',
			width: 120
		}];
	},
	
	initComponent: function(){
		var me = this;
		
		me.callParent(arguments);
	},
	
	// 可选中记录
    allowCheckSelModel : function() {
        return true;
    },
})