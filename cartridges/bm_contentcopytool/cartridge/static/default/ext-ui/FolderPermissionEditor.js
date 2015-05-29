Ext.define('dw.ext.FolderPermissionEditor', {
	extend : 'dw.ext.CustomObjectGridEditor',
	constructor : function() {
		// this.initialise();
		this.callParent(arguments);
	},

	getFieldByAttributeDefinition : function(attributeDefinition) {
		// return
		// FolderPermissionEditor.superclass.getFieldByAttributeDefinition.apply(this,
		// arguments);
		var editorScope = this;

		if (attributeDefinition.ID == "roles") {
			// There seems to be a bug in the multi select box, so we have to
			// build a simple store
			var roleStore = new dw.ext.CustomObjectStore("ElFinderUserRole", [ "ID", "name" ]);

			var field = new Ext.ux.form.field.BoxSelect({
				fieldLabel : "Roles",
				displayField : "ID",
				typeAhead : true,
				valueField : "ID",
				emptyText : "Pick one or more roles",
				store : roleStore,
				listeners : {
					change : {
						fn : function(field, newValue, oldValue, options) {
							var record = editorScope.grid.selModel.getSelection()[0]
							var recordData = record.data;
							var roles = newValue.split(", ");
							recordData.roles = roles;
							record.set(recordData)
							record.setDirty();

						},
						scope : this
					}
				}
			})
			this.roleField = field;
			return field;
		} else if (attributeDefinition.ID == "activeLocales") {
			var items = BMUtils.getLocales();
			var values = new Array();
			for ( var i = 0; i < items.length; i++) {
				values.push([ items[i] ])
			}
			var simpleStore = new Ext.data.SimpleStore({
				fields : [ 'ID' ],
				data : values
			});

			var field = new Ext.ux.form.field.BoxSelect({
				fieldLabel : "Active Locales",
				displayField : "ID",
				typeAhead : true,
				valueField : "ID",
				emptyText : "Pick one or more locales",
				store : simpleStore,
				listeners : {
					change : {
						fn : function(field, newValue, oldValue, options) {
							var record = editorScope.grid.selModel.getSelection()[0]
							var recordData = record.data;
							var activeLocales = newValue.split(", ");
							recordData.activeLocales = activeLocales;
							record.set(recordData)
							record.setDirty();

						},
						scope : this
					}
				}
			})
			this.activeLocalesField = field;
			return field;
		} else if (attributeDefinition.ID == "standardLocale") {
			var items = BMUtils.getLocales();
			var values = new Array();
			for ( var i = 0; i < items.length; i++) {
				values.push([ items[i] ])
			}
			var simpleStore = new Ext.data.SimpleStore({
				fields : [ 'ID' ],
				data : values
			});
			var simpleStore = new Ext.data.SimpleStore({
				fields : [ 'ID' ],
				data : values
			});

			var field = Ext.create('Ext.form.field.ComboBox', {
				fieldLabel : "Standard Locale",
				displayField : "ID",
				typeAhead : true,
				valueField : "ID",
				emptyText : "Pick a locale",
				store : simpleStore,
				listeners : {
					change : {
						fn : function(field, newValue, oldValue, options) {
							var record = editorScope.grid.selModel.getSelection()[0]
							var recordData = record.data;
							recordData.standardLocale = newValue;
							record.set(recordData)
							record.setDirty();

						},
						scope : this
					}
				}
			})
			this.standardLocaleField = field;
			return field;
		} else if (attributeDefinition.ID == "rootPath") {
			var sites = BMUtils.getSiteIDs();
			var catalogs = BMUtils.getCatalogIDs();

			var values = new Array();
			for ( var i = 0; i < sites.length; i++) {
				values.push([ "/LIBRARIES/" + sites[i] ])
				values.push([ "/IMPEX/contentcopy/slots/structure/" + sites[i] ])
				values.push([ "/IMPEX/contentcopy/assets/structure/" + sites[i] ])
			}
			for ( var i = 0; i < catalogs.length; i++) {
				values.push([ "/CATALOGS/" + catalogs[i] ])
			}
			values.push([ "/IMPEX/" ]);
			values.push([ "/STATIC/" ]);

			values = Ext.Array.sort(values);
			var simpleStore = new Ext.data.SimpleStore({
				fields : [ 'ID' ],
				data : values
			});

			var field = Ext.create('Ext.form.field.ComboBox', {
				fieldLabel : "Root Path",
				displayField : "ID",
				typeAhead : true,
				valueField : "ID",
				emptyText : "Pick a rootfolder",
				store : simpleStore,
				listeners : {
					change : {
						fn : function(field, newValue, oldValue, options) {
							var record = editorScope.grid.selModel.getSelection()[0]
							var recordData = record.data;
							recordData.rootPath = newValue;
							record.set(recordData)
							record.setDirty();

						},
						scope : this
					}
				}
			})
			this.rootPathField = field;
			return field;
		} else {
			return this.callParent(arguments);
		}
	},

	buildFormPanel : function() {
		this.callParent(arguments);
		
		var tooltip = Ext.create('Ext.tip.ToolTip', {
            target: 'field_ElFinderRootFolder_subPathFolderRegexp',
            title: 'Mouse Track',
            width: 200,
            html: 'This tip will follow the mouse while it is over the element',
            trackMouse: true
        });
		Ext.QuickTips.init();
		
		this.formPanel.form.on('formload', function(scope, record) {
			scope.roleField.setValue(record.data.roles.join(", "));
			scope.standardLocaleField.setValue(record.data.standardLocale);
			scope.rootPathField.setValue(record.data.rootPath);
			if (record.data.activeLocales) {
				scope.activeLocalesField.setValue(record.data.activeLocales.join(", "));
			}
		});
	}
});
