/**
 *  @author: Mask
 *  @since: 2013-04-11
 */
Ext.define('Ext.ux.ClearValuePlugin', {
    alias: 'plugin.clearvalueplugin',
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    trigger2Cls: Ext.baseCSSPrefix + 'form-arrow-trigger',
    hasSearch: false,
    constructor: function(config) {
        var me = this;
        Ext.apply(me, config);
    },
    init: function(combo) {
        var me = this;
        combo.hasSearch = me.hasSearch;
        me.editable = combo.editable;

        combo.trigger1Cls = me.trigger1Cls;
        combo.trigger2Cls = me.trigger2Cls;
        combo.onTrigger1Click = me.onTrigger1Click;
        combo.onTrigger2Click = me.onTrigger2Click;

        var oldClearValue = combo.clearValue;

        var oldSetValue = combo.setValue;

        var oldSetReadOnly = combo.setReadOnly;

        combo.mon(combo,'afterrender', me.afterRender, combo);

        combo.clearValue = function(){
            combo.setEditable(me.editable);
            if(combo.triggerCell && combo.triggerCell.item(0)){
                combo.hasSearch = false;
                combo.triggerCell.item(0).setDisplayed(false);
            }
            oldClearValue.call(combo);
        };

        combo.setReadOnly = function (readOnly) {
            if (readOnly) {
                combo.setEditable(me.editable);
                combo.hasSearch = false;
                combo.triggerCell.item(0).setDisplayed(false);

            }
            oldSetReadOnly.call(combo, readOnly);
        };

        combo.setValue = function(value,doSelect){

            var me = this,
                i, len, record,
                matchedRecords = [];

            var value1 = Ext.Array.from(value);

            // Loop through values, matching each from the Store, and collecting matched records
            for (i = 0, len = value1.length; i < len; i++) {
                record = value1[i];
                if (!record || !record.isModel) {
                    record = me.findRecordByValue(record);
                }
                // record found, select it.
                if (record) {
                    matchedRecords.push(record);
                }
            }

            if(matchedRecords.length > 0 && !me.readOnly){
                combo.hasSearch = true;
                combo.setEditable(false);
                combo.triggerCell.item(0).setDisplayed(true);
            }else{
                if (me.hasSearch) {
                    me.hasSearch = false;
                    me.setEditable(me.editable);
                    me.triggerCell.item(0).setDisplayed(false);
                }
            }

            oldSetValue.call(combo,value,doSelect);
        };

        combo.mon(combo,'select',function(combo, records, eOpts){
            if(records != null || records.length != 0){
                combo.hasSearch = true;
                combo.setEditable(false);
                combo.triggerCell.item(0).setDisplayed(true);
            }
        });
    },
    afterRender: function() {
        this.triggerCell.item(0).setDisplayed(false);
    },
    onTrigger1Click: function() {
        var me = this;
        if (me.hasSearch) {
            me.setValue("");
            me.hasSearch = false;
            me.setEditable(true);
            me.triggerCell.item(0).setDisplayed(false);
//            me.updateLayout();
        }
    },
    onTrigger2Click: function() {
        this.onTriggerClick();
//        this.hasSearch = true;
//        this.triggerCell.item(0).setDisplayed(true);
    }
});