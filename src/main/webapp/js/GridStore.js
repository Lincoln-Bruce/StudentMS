Ext.define('js.GridStore', {
    extend : 'Ext.data.Store',
    loadRecords:function(records,options){
        var me=this;
        
        if(Ext.isFunction(me.filterRecords)){
            records=me.filterRecords(records);
        }   
        
        me.callParent([records,options]);
    }
});