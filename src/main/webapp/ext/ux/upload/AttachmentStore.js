Ext.define('Ext.ux.upload.AttachmentStore', {
            extend : "Ext.data.Store",
            fields : ['PK_PUB_BLOB', 'SOURCE_TABLE', 'PK_SOURCE_CLAUSE', 'FILE_NAME', 'FILE_TYPE'],
            pageSize : 10,
            proxy : {
                type : 'ajax',
                url : 'attachmentManager/queryAttachment.action',
                actionMethods : {
                    read : 'POST'
                },
                reader : {
                    type : 'json',
                    root : 'data',
                    totalProperty : 'count'
                }
            },
            autoLoad : false
        });