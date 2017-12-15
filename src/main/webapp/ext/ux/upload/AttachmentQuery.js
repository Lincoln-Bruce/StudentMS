/**
 * 附件文档管理页面
 * 
 * @version 2014.01.10
 * @author yujj
 */
Ext.define('Ext.ux.upload.AttachmentQuery', {
            extend : 'Ext.grid.Panel',
            hidden : true,
            store : Ext.ux.upload.AttachementStore,
            initComponent : function() {
                Ext.apply(this, {

                            title : "附件文档管理",
                            // store : store,
                            autoScroll : true,
                            split : true,
                            border : true,
                            collapsible : true,
                            flex : 1,
                            columns : [Ext.create("Ext.grid.RowNumberer", {
                                                text : " ",
                                                width : 30
                                            }), {
                                        text : "附件编号",
                                        align : 'left',
                                        width : 80,
                                        align : 'left',
                                        dataIndex : "PK_PUB_BLOB"
                                    }, {
                                        text : "附件名称",
                                        align : 'left',
                                        width : 320,
                                        align : 'left',
                                        dataIndex : "FILE_NAME"
                                    }, {
                                        text : "附件类型",
                                        align : 'left',
                                        width : 60,
                                        dataIndex : "FILE_TYPE"
                                    }, {
                                        xtype : 'actioncolumn',
                                        width : 60,
                                        text : '附件管理',
                                        id : 'attachmentManagment',
                                        items : [{
                                            icon : 'images/icons/download.png',
                                            id : 'download',
                                            tooltip : '下载附件',
                                            handler : function(grid, rowIndex, colIndex) {
                                                var record = grid.getStore().getAt(rowIndex);
                                                var file_name = record.get('FILE_NAME');
                                                var pk_pub_blob = record.get('PK_PUB_BLOB');
                                                window.location.href = 'attachmentManager/downloadAttachment.action?file_name='
                                                        + encodeURI(encodeURI(file_name))
                                                        + '&pk_pub_blob='
                                                        + pk_pub_blob;
                                            }
                                        }, {
                                            icon : 'images/icons/delete.gif',
                                            id : 'delete',
                                            tooltip : '删除附件',
                                            handler : function(grid, rowIndex, colIndex) {
                                                var me = this;
                                                var record = grid.getStore().getAt(rowIndex);
                                                Ext.Ajax.request({
                                                            method : 'POST',
                                                            params : {
                                                                pk_pub_blob : record.get('PK_PUB_BLOB')
                                                            },
                                                            url : 'attachmentManager/deleteAttachment.action',
                                                            success : function() {

                                                                grid.getStore().reload();
                                                                xjs.MessageBox.Info("附件删除成功。");
                                                            }
                                                        });
                                            }
                                        }]
                                    }],
                            displayInfo : true,
                            emptyMsg : "当前选中的记录没有附件信息。"
                        });
                this.callParent(arguments);
            }
        });
