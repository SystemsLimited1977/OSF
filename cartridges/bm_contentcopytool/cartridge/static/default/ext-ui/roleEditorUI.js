Ext.onReady(function() {

    var customObjectType = Ext.get('customobject-ui').dom.getAttribute('data-customobjecttype')
    var tabPanel = Ext.create('Ext.tab.Panel', {});

    var panel = Ext.create('Ext.panel.Panel', {
	renderTo : 'customobject-ui',
	items : [ {
	    xtype : 'panel',
	    title : 'Description',
	    items : [ {
		xtype : 'label',
		html : '<div style="margin-left: 10px">The content copy tool provides a custom user management to allow fine grained control over the folders certain users can get access to. You can assign users to roles, and multiple roles to physical folders on the file system. <br/>Due to caching reasons, user has to relogin once user role has changed.</div>',
		padding: 5
	    } ]
	}, tabPanel ]
    });

    var userRoleEditor = new dw.ext.UserRoleEditor(true, "ElFinderUserRole");
    userRoleEditor.on('editorready', function(scope) {
	scope.getPanel().title = "Roles and Users";
	tabPanel.add(scope.getPanel());
    });

    var folderEditor = new dw.ext.FolderPermissionEditor(true, "ElFinderRootFolder");

    folderEditor.on('editorready', function(scope) {
	scope.getPanel().title = "Folder Permissions";
	tabPanel.add(scope.getPanel());
	tabPanel.setActiveTab(0);
    });
});