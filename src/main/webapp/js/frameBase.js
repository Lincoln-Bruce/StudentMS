(function () {
    function callPrivateFn(scope, fn, args) {
        return fn.apply(scope, args);
    }
    function onRenderOperColumns(value, metaData, record, rowIndex,
			columnIndex, store, view) {
        var me = this;
        var operColumns = me.registerOperColumns();
        var html = "";
        if (operColumns && Ext.isArray(operColumns) && operColumns.length > 0) {
            Ext.Array.each(operColumns, function (column) {
                if (column.renderer) {
                    var ret = column.renderer(record);
                    if (Ext.isString(ret)) {
                        html += ret + "&nbsp;&nbsp;";
                        return true;
                    } else if (ret === false) {
                        return true;
                    }
                }
                html += "<a href='javascript:void(0);'>" + column.text
                        + "</a>&nbsp;&nbsp;";
            });
        }
        return html;
    };
    function createGrid(config) {
        var me = this;
        var columns = me.createGridColumns();
        columns.push({
        	dataIndex : 'lastColumn4show',
        	width : 10,
        });//展示最后一列
        var operColumns = me.registerOperColumns();

        Ext.Array.each(columns, function (c) {
            if (c.formatString) {
                c.renderer = function (value) {
                    var ret = null;
                    if (isNaN(value)) { ret = value; }
                    else ret = xjs.app.common.common.Util.formatAmount(value,
                            c.formatString);

                    if (c.editor && ret) {
                        return "<span style='color:red'>✎" + ret + "</span>";
                    } else {
                        return ret;
                    }
                };
                c.align = 'right';
            } else {

                if (c.editor) {
                    c.renderer = function (value) {
                        if (value) {
                            return "<span style='color:red'>✎" + ret + "</span>";
                        }
                    };
                }

                if ( !c.align ){
                    c.align = 'left';
                }
            }
            if(c.hidden === true){
            	c.hideable=false;
            	c.canExport=false;
            }
        });

        me.__defineColumns = columns;

        if (operColumns && Ext.isArray(operColumns) && operColumns.length > 0) {
            var o;
            if (me.operColumnWidth <= 0) {
                o = {
                    locked: true,
                    dataIndex: columns[0]['dataIndex'],
                    header: '操作',
                    renderer: Ext.Function.bind(onRenderOperColumns, me),
                    hideable: false
                };
            } else {
                o = {
                    locked: true,
                    dataIndex: columns[0]['dataIndex'],
                    header: '操作',
                    renderer: Ext.Function.bind(onRenderOperColumns, me),
                    hideable: false,
                    width: me.operColumnWidth
                };
            }
            columns = Ext.Array.merge([o], columns);
        }

        Ext.Array.each(columns, function (c) {
            Ext.applyIf(c, {
                sortable: false
            })
        });

        var buttons = [];

        if (me.canExcel) {
        	var btnExport = Ext.create('xjs.app.common.component.ExportButton', {
				fileTypes : ['xls'],
				exportReport : Ext.Function.bind(export4Xls, me)
			});

            buttons = Ext.Array.merge([btnExport], me.createToolbuttons());
        } else {
            buttons = Ext.Array.merge([], me.createToolbuttons());
        }
        var plugins = { ptype: 'cellediting', clicksToEdit: 1, editing: true };
        if (config.grid_plugins) {
            plugins = config.grid_plugins;
        }
        if (!me.allowCheckSelModel()) {
            return Ext.create('js.gridPanel', {
                columns: columns,
                searchConditions: me.createSearchConditions(),
                moreSearchConditions: me.createMoreSearchConditions(),
                toolbuttons: buttons,
                url: config.queryUrl ? config.queryUrl : 'queryframe/query.action',
                sortableColumns: false,
                sqlPath: me.instructSQLPath == ""? me.getSQLPath() : me.instructSQLPath,
                serviceName: me.getServiceName(),
                pager: config.showPager,
                showToolbar: config.showToolbar,
                pagesize: config.pagesize,
                autoSearch: config.autoSearch,
                defaultKey: config.defaultKey,
                searchAlign: config.searchAlign,
                plugins: plugins,
                viewConfig: me.viewConfig(),
                filterRecords:config.filterRecords,
                notSplit : me.notSplit,
                splitParNeedSplit : me.splitParNeedSplit
            });
        } else {
            return Ext.create('js.gridPanel', {
                columns: columns,
                searchConditions: me.createSearchConditions(),
                moreSearchConditions: me.createMoreSearchConditions(),
                toolbuttons: buttons,
                url: config.queryUrl ? config.queryUrl : 'queryframe/query.action',
                sortableColumns: false,
                sqlPath: me.instructSQLPath == ""? me.getSQLPath() : me.instructSQLPath,
                serviceName: me.getServiceName(),
                multiSelect: true,
                selModel: me.getSelModel(),
                pager: config.showPager,
                pagesize: config.pagesize,
                showToolbar: config.showToolbar,
                autoSearch: config.autoSearch,
                defaultKey: config.defaultKey,
                searchAlign: config.searchAlign,
                plugins: plugins,
                viewConfig: me.viewConfig(),
                filterRecords:config.filterRecords,
                notSplit : me.notSplit,
                splitParNeedSplit : me.splitParNeedSplit
            });
        }
    };
    function onCellClick(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        var me = this;
        if (me.onOperaterCellClick(e, record) === false) {
        	var operColumns = me.registerOperColumns();
	        if (operColumns && Ext.isArray(operColumns) && operColumns.length > 0) {
	                var clickText = e.getTarget().innerHTML;
	                Ext.Array.each(operColumns, function (column) {
	                    if (clickText == column.text) {
	                        if (column.handler) {
	                            var f = Ext.Function.bind(column.handler,
	                                    me);
	                            f(record);
	                        }
	                        return false;
	                    }
	                });
	            }
        }
    };
    /**
     * Kunoy
     * 合并单元格
     * @param {} grid  要合并单元格的grid对象
     * @param {} cols  要合并哪几列 [1,2,4]
     */
    function mergeCells(grid,cols){
        if ( !document.getElementById(grid.getId()+"-body") ){
            return;
        }
        var arrayTr=document.getElementById(grid.getId()+"-body").firstChild.firstChild.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        var trCount = arrayTr.length;
        var arrayTd;
        var td;
        var merge = function(rowspanObj,removeObjs){ //定义合并函数
            if(rowspanObj.rowspan != 1){
                arrayTd =arrayTr[rowspanObj.tr].getElementsByTagName("td"); //合并行
                td=arrayTd[rowspanObj.td-1];
                td.rowSpan=rowspanObj.rowspan;
                td.vAlign="middle";
                Ext.each(removeObjs,function(obj){ //隐身被合并的单元格
                    arrayTd =arrayTr[obj.tr].getElementsByTagName("td");
                    arrayTd[obj.td-1].style.display='none';
                });
            }
        };
        var rowspanObj = {}; //要进行跨列操作的td对象{tr:1,td:2,rowspan:5}
        var removeObjs = []; //要进行删除的td对象[{tr:2,td:2},{tr:3,td:2}]
        var col;
        Ext.each(cols,function(colIndex){ //逐列去操作tr
            var rowspan = 1;
            var divHtml = null;//单元格内的数值
            for(var i=0;i<trCount;i++){  //i=0表示表头等没用的行
                arrayTd = arrayTr[i].getElementsByTagName("td");
                var cold=0;
                Ext.each(arrayTd,function(Td){ //获取RowNumber列和check列
                    if(Td.getAttribute("class").indexOf("x-grid-cell-special") != -1)
                        cold++;
                });
                col=colIndex+cold;//跳过RowNumber列和check列
                if(!divHtml){
                    divHtml = arrayTd[col-1].innerHTML;
                    rowspanObj = {tr:i,td:col,rowspan:rowspan}
                }else{
                    var cellText = arrayTd[col-1].innerHTML;
                    var addf=function(){
                        rowspanObj["rowspan"] = rowspanObj["rowspan"]+1;
                        removeObjs.push({tr:i,td:col});
                        if(i==trCount-1)
                            merge(rowspanObj,removeObjs);//执行合并函数
                    };
                    var mergef=function(){
                        merge(rowspanObj,removeObjs);//执行合并函数
                        divHtml = cellText;
                        rowspanObj = {tr:i,td:col,rowspan:rowspan}
                        removeObjs = [];
                    };
                    if(cellText == divHtml){
                        if(colIndex!=cols[0]){
                            var leftDisplay=arrayTd[col-2].style.display;//判断左边单元格值是否已display
                            if(leftDisplay=='none')
                                addf();
                            else
                                mergef();
                        }else
                            addf();
                    }else
                        mergef();
                }
            }
        });
    };

    function down4Xls(response, o) {
        var me = this;
        me.hideMask();
        var o = Ext.JSON.decode(response.responseText);
        if (o.code == "0") {
            var fileName = o.result.relativePath;

            if (Ext.isIE6 || Ext.isIE7 || Ext.isSafari || Ext.isSafari2
					|| Ext.isSafari3) {
                Ext
						.getBody()
						.insertHtml(
								'afterEnd',
								'<iframe frameborder="0" width="0" location="queryframe/download.action?fileName='
										+ fileName
										+ '&title='
										+ me.exportTitle
										+ '" />');
            } else {
                Ext.getBody().insertHtml(
						'afterEnd',
						'<iframe frameborder="0" width="0" src="queryframe/download.action?fileName='
								+ fileName + '&title=' + me.exportTitle
								+ '" />');
            }
        } else {
            Ext.Msg.alert("提示", "文件导出失败");
        }
    }

    function exportFailed() {
        var me = this;
        me.hideMask();
    }
    
    function findColumnByDataIndex( columns, dataIndex){
    	var length = columns.length,
    		col;
    	for(var i = 0; i< length; i++){
    		col = columns[i];
    		if (col.dataIndex == dataIndex)
    			return col;
    	}
    	console.error('not found' + dataIndex)
    	return {
    		isHidden:function(){ 
    			return true;
    		}
    	};
    }

    function export4Xls() {
        var me = this;
        var extraParam = me.grid.getStore().getProxy().extraParams;
        if (extraParam.isSearch === true) {
			var length = me.__defineColumns.length,
				columns = me.grid.columns,
				shiftNum= columns.length == length ? 0 : 1,//__defineColumns+操作列=columns 可知两个数组间一一对应关系 利于查找时
				cs = [],
				colA, colB;
			for(var i = 0; i < length; i++){
				colA = me.__defineColumns[i];
				if(colA.canExport !== false || colA.sumDataIndex){
					// 如果一一对应查找的列有误 遍历查询
					colB = columns[i + shiftNum];
					if (colB.dataIndex != colA.dataIndex){
						colB = findColumnByDataIndex(columns, colA.dataIndex);
					}
					(colB.isHidden()&&!colA.sumDataIndex) || cs.push(colA);// 用户隐藏列不在导出
				}
			}
			
			var columns = Ext.JSON.encode(cs);

            var data = {
                columns: columns,
                path: me.getSQLPath(),
                serviceName: me.getServiceName()
            };
            Ext.applyIf(data, extraParam);

            me.showMask();
            me.ajaxRequest(data, "queryframe/export.action", Ext.Function.bind(
							down4Xls, me), Ext.Function.bind(exportFailed, me));
        } else {
            Ext.Msg.alert("提示", "请先查询");
        }
    }

    Ext.define('js.frameBase', {
        extend: 'Ext.panel.Panel',
        layout: 'fit',
        refreshUrl: 'queryframe/refresh.action',
        mask: null,
        grid: null,
        canExcel: true,
        exportTitle: 'default',
        showPager: true,
        showToolbar: true,
        pagesize: 20,
        searchAlign: 'left',
        operColumnWidth: 0,
        queryUrl: '',
        autoSearch: false,
        defaultKey: '',
        instructSQLPath: '',
        initComponent: function () {
            var me = this;
            me.grid = callPrivateFn(me, createGrid, [{
                showPager: me.showPager,
                showToolbar: me.showToolbar,
                searchAlign: me.searchAlign,
                pagesize: me.pagesize,
                autoSearch: me.autoSearch,
                defaultKey: me.defaultKey,
                queryUrl: me.queryUrl,
                grid_plugins: me.grid_plugins,
                filterRecords:me.filterRecords
            }]);
            me.grid.on('cellclick', onCellClick, me);
            me.grid.on('itemclick', me.onItemclick, me);
            me.grid.on('itemdblclick', me.onItemdblclick, me);
            me.doMergeCells && me.mon(me.grid.store, 'load', function(){ mergeCells(me.grid, me.mergeCellArray); }, me);

            me.items = [me.grid];
            me.mask = new Ext.LoadMask(vp, {
                msg: "请稍候……"
            });
            this.callParent(arguments);
        },
        /** **********以下为需要重载的方法************ */
        createGridColumns: function () {
            return [];
        },
        viewConfig: function () {
            return {};
        },
        createSearchConditions: function () {
            return [];
        },
        createMoreSearchConditions: function () {
            return [];
        },
        registerOperColumns: function () {
            return [];
        },
        createToolbuttons: function () {
            return [];
        },
        allowCheckSelModel: function () {
            return false;
        },
        getSelModel: function () {
            return Ext.create("Ext.selection.CheckboxModel");
        },
        onItemclick: function (grid, record, item, index, e, eOpts) {
        },
        onItemdblclick: function (grid, record, item, index, e, eOpts) {

        },
        onOperaterCellClick: function (e, record) {
            return false;
        },
        getSQLPath: function () {
            return "";
        },
        // 获取服务名, 用以替代sqlPath
        // 如果服务名不为空，则使用服务进行查询
        getServiceName: function () {
            return "";
        },
        doAfterRefreshRecordSuccess: function (record) {

        },
        /** **************end******************** */
        ajaxRequest: function (data, url, success, failure) {
            var me = this;
            Ext.Ajax.request({
                method: 'POST',
                url: url,
                timeout: xjs.app.common.common.Util.ajaxTimeout,
                params: data,
                success: function (response, opts) {
                    Ext.Function.bind(success, me)(response,
                            opts);
                },
                failure: function (response, opts) {
                    Ext.Function.bind(failure, me)(response,
                            opts);
                }
            });
        },
        refreshRecord: function (record, callback) {
            var me = this;
            me.showMask();
            var success = function (res) {
                var text = res.responseText;

                if (text == '') {
                    me.grid.getSelectionModel().deselect(record);
                    me.grid.getStore().remove(record);
                }
                else {
                    var o = eval("(" + text + ")");
                    if(o.length && o.length>0){
                        if(Ext.isFunction(me.filterRecords)){
                          var rs=me.grid.getStore().getProxy().getReader().readRecords(o);
                          o=me.filterRecords(rs.records);                        
                          o=o[0].getData();
                        }else{
                        	o=o[0];
                        }
                    }
                    for (var key in o) {
                        record.set(key, o[key]);
                    }
                        
                    record.commit();
                }

                if (me.doAfterRefreshRecordSuccess)
                    me.doAfterRefreshRecordSuccess(record);

                if (callback && Ext.isFunction(callback)) {
                    callback();
                }
                me.hideMask();
            };

            var failure = function () {
                if (callback && Ext.isFunction(callback)) {
                    callback();
                }
                me.hideMask();
            };

            var data = {};
            Ext.applyIf(data, record.data);
            Ext.applyIf(data, {
                path: me.instructSQLPath == ""? me.getSQLPath() : me.instructSQLPath,
                serviceName: me.getServiceName()
            });

            me.ajaxRequest(data, me.refreshUrl, success, failure);
        },
        showMask: function () {
            var me = this;
            me.mask.show();
        },
        hideMask: function () {
            var me = this;
            me.mask.hide();
        },
				initMainPage : function(actionId, title) {
				},
        reload: function (conditions) {
            this.grid.reload(conditions);
        },
        getSelected: function () {
            var records = this.grid.getSelectionModel().getSelection();
            return records;
        },
        getModifiedRecords: function () {
            var records = this.grid.getStore().getModifiedRecords();
            return records;
        },
        commitChanges: function () {
            this.grid.getStore().commitChanges()
        },
        getAllRecords: function () {
            return this.grid.getStore().getRange();
        },
        loadData: function (data) {
            this.grid.getStore().loadData(data);
        }
    });
})();