(function() {
	function generateDataStore(config) {
		var me = this;
		var fields = [];
		for (var i = 0; i < config.columns.length; i++) {
			var field = config.columns[i];
			if (field.xtype !== 'actioncolumn' && field.xtype != 'rownumberer') {
				var model = {
					name: field["dataIndex"],
					type: field["type"] ? field["type"] : "string"
				};
				fields.push(model);
			}

		}

		var dataStore = Ext.create('js.GridStore', {
			fields: fields,
			proxy: {
				type: 'ajax',
				url: config.url,
				reader: {
					type: 'json',
					root: config.serviceName != '' ? 'datas' : 'items',
					totalProperty: 'totals'
				},
				actionMethods: {
					create: 'POST',
					read: 'POST',
					update: 'POST',
					destroy: 'POST'
				}
			},
			pageSize: config.pagesize,
			autoLoad: false,
			filterRecords: config.filterRecords
		});
		config["store"] = dataStore;
		me.store = dataStore;
		me.store.on('beforeload', function(store, options) {
			Ext.apply(me.store.proxy.extraParams, {
				end: (me.store.currentPage * me.store.pageSize)
			});
		});
	};

	function createPager(config) {
		var pager = {
			xtype: 'pagingtoolbar',
			store: config["store"],
			dock: 'bottom',
			displayInfo: true
		}
		return pager;
	};

	function createMoreSearchPanel(config) {
		var me = this;
		var fields = [
			[],
			[]
		];
		for (var i = 0; i < config.moreSearchConditions.length; i++) {
			var item = config.moreSearchConditions[i];
			if (i % 2 == 0) {
				fields[0].push(item);
			} else {
				fields[1].push(item);
			}
		}

		var leftContainer = Ext.create("Ext.container.Container", {
			columnWidth: .5,
			layout: "anchor",
			defaults: {
				anchor: "100%"
			},
			margin: "5 5 5 5",
			items: fields[0]
		});

		var rightContainer = Ext.create("Ext.container.Container", {
			columnWidth: .5,
			layout: "anchor",
			defaults: {
				anchor: "100%"
			},
			margin: "5 5 5 5",
			items: fields[1]
		});

		me.leftContainer = leftContainer;
		me.rightContainer = rightContainer;

		return Ext.create("Ext.window.Window", {
			constrainHeader: true,
			title: '高级查询',
			width: 600,
			height: 280,
			plain: true,
			closeAction: 'hide',
			layout: 'column',
			buttonAlign: "center",
			defaults: {
				anchor: '100%',
				width: 600
			},
			items: [leftContainer, rightContainer],
			close: function() {
				me.mask.hide();
				me.win.hide();
			},
			buttons: [{
					text: "查 询",
					icon: "images/icons/search.gif",
					scope: me,
					handler: me.advSearch
				}
				, {
					text: "返 回",
					icon: "images/icons/back.png",
					handler: function() {
						me.mask.hide();
						me.win.hide();
					}
				}
			]
		});
	};

	function createSearchBar(config) {
		var me = this;
		var bar = {
			xtype: 'toolbar',
			dock: 'top',
			items: [],
			hidden: !config.showToolbar,
			notSplit: config.notSplit,
			splitParNeedSplit: config.splitParNeedSplit
		};

		if (config.toolbuttons && Ext.isArray(config.toolbuttons) && config.toolbuttons.length > 0) {
			bar.items = Ext.Array.merge(bar.items, config.toolbuttons);
		}

		if (config.searchConditions && Ext.isArray(config.searchConditions) && config.searchConditions.length > 0) {
			if (config.searchAlign == 'right') {
				bar.items.push('->');
			}
			bar.items = Ext.Array.merge(bar.items, config.searchConditions);

			var btnSearch = Ext.create("js.SearchButton", {
				handler: Ext.Function.bind(me.search, me)
			});

			bar.items.push(btnSearch);

			if (config.moreSearchConditions && Ext.isArray(config.moreSearchConditions) && config.moreSearchConditions.length > 0) {
				if (me.win == null) {
					me.win = callPrivateFn(me, createMoreSearchPanel, [config]);
				}
				bar.items.push({
					text: '高级查询',
					icon: "images/icons/next.png",
					handler: function() {
						this.win.show();
						this.mask.show();
					},
					scope: me
				});
			}
		}
		if (bar.items.length > 0)
			return bar;
		return false;
	};

	function createDockedItems(config) {
		var me = this;
		var dockedItems = [];
		if (config.pager === true) {
			var pager = callPrivateFn(me, createPager, [config]);
			if (pager !== false) {
				dockedItems.push(pager);
			}
		}

		var searchBar = callPrivateFn(me, createSearchBar, [config]);
		if (searchBar !== false) {
			dockedItems.push(searchBar);
		}

		if (dockedItems.length > 0) {
			config["dockedItems"] = dockedItems;
		}
	};

	function callPrivateFn(scope, fn, args) {
		return fn.apply(scope, args);
	}

	function mergeColumns(config) {
		var columns = [];
		var findColumn = function(columns, merge) {
			for (var i = 0; i < columns.length; i++) {
				if (columns[i].header == merge) {
					return columns[i];
				}
			}
			return false;
		}
		for (var i = 0; i < config.columns.length; i++) {
			var record = config.columns[i];
			if (!record.merge) {
				columns.push(record);
			} else {
				var column = findColumn(columns, record.merge);
				if (!column) {
					column = {
						header: record.merge,
						columns: []
					};
					columns.push(column);
				}
				column.columns.push(record);
			}
		}
		config["columns"] = columns;
	}

	Ext.define('js.gridPanel', {
		extend: 'Ext.grid.Panel',
		store: null,
		autoSearch: false,
		win: null,
		sqlPath: '',
		serviceName: '',
		defaultKey: '',
		pager: true,
		listeners: {
			afterrender: function(grid) {
				if (grid.autoSearch === true) {
					var conditions = grid.collectSearchConditions(false);
					grid.fireEvent('beforesearch', conditions);
					grid.store.proxy.extraParams = conditions;
					grid.store.loadPage(1, conditions);
				}
			}
		},
		leftContainer: null,
		rightContainer: null,
		constructor: function(config) {
			var me = this;
			me.pager = config.pager;
			if (config.sqlPath)
				me.sqlPath = config.sqlPath;
			if (config.serviceName)
				me.serviceName = config.serviceName;
			callPrivateFn(me, generateDataStore, [config]);
			callPrivateFn(me, mergeColumns, [config]);
			callPrivateFn(me, createDockedItems, [config]);

			if (config.autoLoad === true) {
				me.autoLoad = true;
			}

			me.callParent([config]);
			me.autoSearch = config.autoSearch;
			me.mask = new Ext.LoadMask({
				target: vp
			});
		},
		collectSearchConditions: function(isAdvSearch) {
			var me = this;
			var conditions = {
				path: me.sqlPath,
				serviceName: me.serviceName
			};
			var items = [];
			if (!isAdvSearch) {
				var toolbar = me.getDockedItems('toolbar[dock="top"]');
				if (!toolbar || toolbar.length == 0) return conditions;
				items = toolbar[0].items.items;
				//工具条被分拆为多行的情况
				if (items && Ext.isArray(items) && !Ext.isEmpty(items[0].items) && !Ext.isEmpty(items[0].items.items)) {
					var tempItems = [];
					for (var i = 0; i < items.length; i++) {
						tempItems = Ext.Array.merge(tempItems, items[i].items.items);
					}
					items = tempItems;
				}
			} else {
				items = Ext.Array.merge(me.leftContainer.items.items,
					me.rightContainer.items.items);
			}

			Ext.Array.each(items, function(item) {
				if (item && item.getXType) {
					var xtype = item.getXType() ? item.getXType() : item.xtype;
					var ret = {};
					switch (xtype) {
						case 'textfield':
						case 'numberfield':
						case 'accountTree':
						case 'hidden':
						case 'checkbox':
						case 'checkboxfield':
						case 'counterpartyCombox':
						case 'CounterpartyFromCacheCombox':
						case 'counterpartyFromCacheCombox':
						case 'commonCombox':
						case 'combobox':
						case 'combo':
						case 'institutionCombox':
						case 'bondCooperCombox':
						case 'wmpsProductCombox':
						case 'cashAccountExtCombox':
						case 'dictcombo':
							ret[item.getName()] = item.getValue();
							break;
						case 'datefield':
							if (!item.isValid()) {
								Ext.Msg.alert('错误', item.getFieldLabel() + '格式不正确或为空！');
								ret.cannotSearch = true;
							}
							ret[item.getName()] = item.getRawValue();
							break;
						case 'bondCombox':
						case 'cooperBondCashlbCombox':
						case 'wmpsDefineAndFeeCombox':
						case 'instrumentCombox':
						case 'cashlbCombox':
							var code = item.getCode();
							if (code) {
								code = code.split(',');
							} else {
								code = ["", "", ""];
							}
							var name = item.getName();
							ret[name + "_i_code"] = code[0];
							ret[name + "_a_type"] = code[1];
							ret[name + "_m_type"] = code[2];

							break;
						case 'checkcombo':
						case 'userCheckCombox':
							var name = item.getName();
							var value = item.getValue();
							ret[name + "$array"] = value;
							break;
						case 'treePickerBase':
							if (item.getMultiSelect() === true) {
								var name = item.getName();
								var value = item.getValue();
								ret[name + "$array"] = value;
							} else {
								ret[item.getName()] = item.getValue();
							}
							break;
						case 'radiogroup':
							var radName = item.getChecked()[0].name;
							var radValue = item.getChecked()[0].inputValue;
							ret[radName] = radValue;
							break;

					}
					Ext.applyIf(conditions, ret);
				}
			});
			Ext.applyIf(conditions, {
				isSearch: true,
				pager: me.pager !== true ? 'nopager' : 'pager',
				isAdvSearch: isAdvSearch
			});
			return conditions
		},
		search: function(index) {
			var pageIndex = index && index > 1 ? index : 1;
			var me = this;
			var conditions = me.collectSearchConditions(false);
			conditions.defaultKey = null;
			if (!Ext.isDefined(conditions.cannotSearch) && me.fireEvent('beforesearch', conditions) !== false) {
				me.store.proxy.extraParams = conditions;
				me.store.loadPage(pageIndex, conditions);
			}
			me.cacheCondi = conditions;
		},
		advSearch: function(index) {
			var pageIndex = index && index > 1 ? index : 1;
			var me = this;
			var conditions = me.collectSearchConditions(true);
			conditions.defaultKey = null;
			if (!Ext.isDefined(conditions.cannotSearch) && me.fireEvent('beforesearch', conditions) !== false) {
				me.store.proxy.extraParams = conditions;
				me.store.loadPage(pageIndex, conditions);
			}
			me.cacheCondi = conditions;
			me.win.close();
		},
		reload: function(conditions) {
			var me = this;
			Ext.applyIf(conditions, {
				path: me.sqlPath,
				serviceName: me.serviceName,
				pager: me.pager !== true ? 'nopager' : 'pager'
			});
			me.store.proxy.extraParams = conditions;
			me.store.loadPage(1, conditions);
		},
		reloadByCacheCondi: function() {
			var me = this;
			me.reload(me.cacheCondi);
		}
	});
})();