/*
 * Copyright(c) 2013, Demandware Inc.
 * 
 * @author Holger Nestmann
 */

var CustomObjectServerConfig = function(wrapperScript, keyAttribute) {
	this.wrapperScript = wrapperScript;
	this.keyAttribute = keyAttribute;
	
	/** Setter */
	this.setWrapperScript = function (wrapperScript) {
		this.wrapperScript = wrapperScript;
	}
	
	this.setKeyAttribute = function (keyAttribute) {
		this.keyAttribute = keyAttribute;
	}
};
