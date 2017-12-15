/**
 * @class Ext.ux.upload.Button
 * @extends Ext.button.Button
 * 
 * @author Harald Hanek (c) 2011-2012
 * @license http://harrydeluxe.mit-license.org
 */
Ext.define('Ext.ux.upload.Button', {
            // extend: 'Ext.button.Button',
            extend : 'xjs.app.common.component.button.BasicButton',
            text : '上传附件',
            alias : 'widget.uploadbutton',
            requires : ['Ext.ux.upload.Basic'],
            disabled : true,

            constructor : function(config) {
                var me = this;
                config = config || {};
                Ext.applyIf(config.uploader, {
                            browse_button : config.id || Ext.id(me)
                        });
                me.callParent([config]);
            },

            initComponent : function() {
                var me = this, e;
                me.callParent();
                me.uploader = me.createUploader();

                if (me.uploader.drop_element && (e = Ext.getCmp(me.uploader.drop_element))) {
                    e.addListener('afterRender', function() {
                                me.uploader.initialize();
                            }, {
                                single : true,
                                scope : me
                            });
                } else {
                    me.listeners = {
                        afterRender : {
                            fn : function() {
                                me.uploader.initialize();
                            },
                            single : true,
                            scope : me
                        }
                    };
                }

                me.relayEvents(me.uploader, ['beforestart', 'uploadready', 'uploadstarted', 'uploadcomplete',
                                'uploaderror', 'filesadded', 'beforeupload', 'fileuploaded', 'updateprogress',
                                'uploadprogress', 'storeempty']);
            },

            /**
             * @private
             */
            createUploader : function() {
            	this.initialConfig.uploadButtonText='开始';
            	this.initialConfig.cancelButtonText='取消';
            	this.initialConfig.deleteAllText='移除';
                return Ext.create('Ext.ux.upload.Basic', this, Ext.applyIf({
                                    listeners : {}
                                }, this.initialConfig));
            }
        });