Ext.Loader.setConfig({
            enabled : true,
            paths : {
                'Ext.ux' : 'http://extjs.cachefly.net/extjs-4.1.1-gpl/examples/ux/',
                'Ext.ux.upload' : 'ext/ux/upload'
            }
        });

Ext.require(['Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.state.*', 'Ext.ux.upload.Button',
        'Ext.ux.upload.plugin.Window']);

Ext.define('Ext.ux.upload.AttachmentUploadButton', {
            extend : 'Ext.ux.upload.Button',
            // renderTo : Ext.getBody(),
            // singleFile: true,
            plugins : [{
                        ptype : 'ux.upload.window',
                        title : '上传',
                        width : 830,
                        height : 530
                    }],
            uploader : {
                // url : 'upload.json',
                url : 'plupload/pluploadServlet',
                uploadpath : '/Root/files',
                autoStart : false,
                max_file_size : '10mb',
                drop_element : 'dragload',
                statusQueuedText : 'Ready to upload',
                statusUploadingText : 'Uploading ({0}%)',
                statusFailedText : '<span style="color: red">Error</span>',
                statusDoneText : '<span style="color: green">Complete</span>',

                statusInvalidSizeText : '文件太大，超过限制值(10M)。',
                statusInvalidExtensionText : '无效的文件类型。',
                filters : [{
                            title : "选择需要上传的文件",
                            extensions : "jpg,gif,png,bmp,zip,rar,txt,rtf,doc,docx,xls,xlsx,pdf,wps"
                        }],
                multipart_params : {
                    'tableName' : "'xquant_test_table_001'",
                    'sourcePKClause' : " '1=1' "
                }
            },
            listeners : {
                filesadded : function(uploader, files) {
                    // console.log('filesadded');
                    return true;
                },

                beforeupload : function(uploader, file) {
                    // console.log('beforeupload');
                    // uploader.settings.multipart_params.sourcePKClause = ' 1 = 1 ';
                },

                fileuploaded : function(uploader, file) {
                    // console.log('fileuploaded');
                },

                uploadcomplete : function(uploader, success, failed) {
                    // console.log('uploadcomplete');
                },
                scope : this
            }
        });