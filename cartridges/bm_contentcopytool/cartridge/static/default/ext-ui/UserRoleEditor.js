Ext.define('dw.ext.UserRoleEditor', {
    extend : 'dw.ext.CustomObjectGridEditor',
    constructor : function() {
	this.callParent(arguments);
    },

    getFieldByAttributeDefinition : function(attributeDefinition) {
	// return
	// FolderPermissionEditor.superclass.getFieldByAttributeDefinition.apply(this,
	// arguments);
	var editorScope = this;

	if (attributeDefinition.ID == "users") {

	    Ext.define('dw.ext.BMUser', {
		extend : 'Ext.data.Model',
		idProperty : "ID",
		fields : {
		    name : "ID",
		    type : "string"
		}
	    });

	    Ext.define("dw.ext.BMUserReader", {
		extend : 'Ext.data.reader.Reader',
		read : function(response) {
		    var result = new Object();
		    result.text = response.responseText;
		    result.records = new Array();
		    result.total = new Array();
		    // ViewUser-Show .*"table_detail_link2">(.*)</a>
		    // build regexp to match catalog ids
		    var regExp = new RegExp('ViewUser-Show.*"table_detail_link2">(.*)</a>', 'g');
		    while (match = regExp.exec(result.text)) {
			// push catalog ids onto array
			var user = Ext.create('dw.ext.BMUser', {
			    "ID" : match[1]
			});
			result.records.push(user);
		    }
		    var regExp = new RegExp('of <span class="pagecursoritem bold">(.*)</span>', 'g');
		    while (match = regExp.exec(result.text)) {
			// push catalog ids onto array
			result.total = parseInt(match[1]);
		    }

		    return result;
		}
	    });

	    Ext.define("dw.ext.BMUserProxy", {
		extend : 'Ext.data.proxy.Ajax',
		buildUrl : function(request) {
		    if (request && request.params && request.params.query) {
			return this.url + '&Login=' + request.params.query + "*";
		    }
		    return this.callParent(arguments)
		}

	    });

	    var bmProxy = Ext.create('dw.ext.BMUserProxy', {
		type : 'ajax',
		url : '/on/demandware.store/Sites-Site/default/ViewUserList-Dispatch?AccessRoleID=All&DisabledFlag=0&Email=&FirstName=&FormName=UserForm&LastName=&parametricSearch=Find',
		reader : Ext.create('dw.ext.BMUserReader')
	    });

	    var dataStore = Ext.create('Ext.data.Store', {
		pageSize : 10,
		proxy : bmProxy
	    });

	    var field = Ext.create('Ext.ux.form.field.BoxSelect', {
		fieldLabel : "Users",
		displayField : "ID",
		queryMode : 'remote',
		typeAhead : true,
		valueField : "ID",
		emptyText : "Type userlogin to add",
		store : dataStore,
		listeners : {
		    change : {
			fn : function(field, newValue, oldValue, options) {
			    var record = editorScope.grid.selModel.getSelection()[0]
			    var recordData = record.data;
			    var users = newValue.split(", ");
			    recordData.users = users;
			    record.set(recordData)
			    record.setDirty();

			},
			scope : this
		    }
		}
	    })

	    this.usersField = field;
	    return field;
	} else {
	    return this.callParent(arguments);
	}
    },

    buildFormPanel : function() {
	this.callParent(arguments);
	this.formPanel.form.on('formload', function(scope, record) {
	     scope.usersField.setValue(record.data.users.join(", "));
	});
    }

});
