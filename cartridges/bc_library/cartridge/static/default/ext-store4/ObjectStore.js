/**
 * Copyright(c) 2013, Demandware Inc.
 * 
 * @author Holger Nestmann
 */

Ext.define('dw.ext.PersistentObjectStore', {
	init : function(options) {
		this.system = this.system || false;
		var object= {
			autoLoad : true,
//			autoSync : true,
			storeId: this.type,
		    proxy : {
			    type : 'ajax',
			    api: {
			        create  : 'ObjectStore-CreateObject',
			        read    : 'ObjectStore-ReadObjects',
			        update  : 'ObjectStore-SaveObject',
			        destroy : 'ObjectStore-DeleteObject'
			    },
			    reader : {
					type : 'json',
					root : 'customObjects'
			    },
			    headers : {
			    	type   : this.type,
			    	system : this.system,
			    	config : this.config
			    }
			}
		}

		Ext.apply(object,options);
		return object;
    },
    addHandlers : function(){
		this.on('beforeload', function(store, record, operation) {
			if(window.console) console.log('Loading objects of type ',this.type);
			return true;
		});
		this.on('load', function(store, record, operation) {
			if(window.console) console.log('Loaded objects of type ',this.type);
			return true;
		});
		this.on('metachange', function( scope, meta, eOpts) {
			this.customMeta = meta;
			return true;
		});
    },

    getResponseStatus : function(res) {
		var result = false;
		var idx = res.responseText.indexOf('{');
		if (res.responseText && idx > -1 && idx < 10) {
		    result = Ext.decode(res.responseText).success
		}
		return result;
	}
});

Ext.define('dw.ext.CustomObjectStore', {
    extend : 'Ext.data.Store',
    mixins : { objectStore : 'dw.ext.PersistentObjectStore'},
    constructor : function(type, fields, config) {
    	// allow options type constructor and verbose one
    	if(typeof(type) === 'string'){
        	this.type = type;
        	this.config = config;
    		var options = new Object();
    		options.fields = fields;
    		options.type = type;
    		options.config = config;
    	}else{
    		var options = type;
        	this.type = options.type;
        	this.config = options.config;
    	}
    	options.remoteSort = options.remoteSort !== false;
		this.callParent([this.init(options)]);
		this.addHandlers(options);
	}
});

Ext.define('dw.ext.CustomObjectTreeStore', {
    extend : 'Ext.data.TreeStore',
    mixins : { objectStore : 'dw.ext.PersistentObjectStore'},
    constructor : function(options) {
    	this.type = options.type;
    	this.config = options.config;
    	
		this.callParent([this.init(options)]);
		this.addHandlers(options);
	}
});

Ext.define('dw.ext.SystemObjectStore', {
    extend : 'dw.ext.CustomObjectStore',
    system : true
});

Ext.define('dw.ext.SystemObjectTreeStore', {
    extend : 'dw.ext.CustomObjectTreeStore',
    system : true
});

