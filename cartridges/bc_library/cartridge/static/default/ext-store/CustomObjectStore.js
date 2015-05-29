/*
 * Copyright(c) 2013, Demandware Inc.
 * 
 * @author Danny Gehl
 */

var CustomObjectStore = function(type, fields, config) {
	CustomObjectStore.superclass.constructor.call(this, {
	root : 'customObjects',
	fields : fields,
	// header: { type : type },
	proxy : new Ext.data.HttpProxy({
	    url : 'ObjectStore-ReadObjects',
	    headers : {
		type : type,
		config : config
	    }
	})
    });

    function getResponseStatus(res) {
	var result = false;
	var idx = res.responseText.indexOf('{');
	if (res.responseText && idx > -1 && idx < 10) {
	    result = Ext.util.JSON.decode(res.responseText).success
	}
	return result;
    }

    this.on('update', function(store, record, operation) {
	if (operation == Ext.data.Record.COMMIT) {
	    Ext.Ajax.request({
		url : 'ObjectStore-SaveObject',
		jsonData : record.data,
		success : function(res) {
		    this.fireEvent('remoteupdate', this, record, getResponseStatus(res));
		},
		failure : function(res) {
		    this.fireEvent('remoteupdate', this, record, false);
		},
		scope : this,
		headers : {
		    type : type,
		    config : config
		}
	    });
	}
    }, this);

    this.on('add', function(store, records, index) {
	var data = records[0].data;
	hasContent = false;
	for ( var name in data) {
	    hasContent = true;
	}
	if (hasContent) {
	    Ext.Ajax.request({
		url : 'ObjectStore-CreateObject',
		jsonData : records[0].data,
		success : function(res) {
		    this.fireEvent('remoteadd', this, records, index, getResponseStatus(res));
		},
		failure : function(res) {
		    this.fireEvent('remoteadd', this, records, index, false);
		},
		scope : this,
		headers : {
		    type : type,
		    config : config
		}
	    });
	}
    }, this);

    this.on('remove', function(store, record, index) {
	Ext.Ajax.request({
	    url : 'ObjectStore-DeleteObject',
	    jsonData : record.data,
	    success : function(res) {
		this.fireEvent('remoteremove', this, record, index, getResponseStatus(res));
	    },
	    failure : function(res) {
		this.fireEvent('remoteremove', this, record, index, false);
	    },
	    scope : this,
	    headers : {
		type : type,
		config : config
	    }
	});
    }, this);
};

Ext.extend(CustomObjectStore, Ext.data.JsonStore, {
// add methods here
});