/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * @class Ext.ux.form.TreeField
 * @extends Ext.form.TriggerField
 * @param {Object} config Configuration options
 *{
	xtype: 'treecombo',
	allowBlank:false,
	readOnly: true,
	maxHeight: 300,		//可选，默认为200
	fieldLabel: '单位名称',
	treeUrl: '../tree.do?type=unit&leafLevel=4&unitId=',
   	treeRootId: 4,
	treeRootText: '吉林省',
	treeRootVisible: true,
    anchor: '95%',
	hiddenName: 'userUnitId',
	value: '吉林省',
	hiddenValue: 4
}
 */
 
Ext.namespace("Ext.ux");
Ext.namespace("Ext.ux.form");
Ext.ux.form.TreeComboBox = Ext.extend(Ext.form.ComboBox,  {
	tree: null,
	treeUrl : '未设置treeUrl',
	treeRootId:4,
	treeRootText:'根节点',
	treeRootVisible:true,
	selectedClass: '',
	onSelect: Ext.emptyFn,
	maxHeight:200,
	border:false,
	mode: 'local',
	forceSelection: false,
	blankText:'',
	emptyText:'',
	editable:false,
	triggerAction:'all',
	allowBlank:true,
	store : new Ext.data.SimpleStore({fields:[],data:[[]]}),
	
	//初始化弹出窗口
	init : function(){
		var selectId,selectText,selectLevel;
		var loader = new Ext.tree.TreeLoader({dataUrl: this.treeUrl});
        //创建选择窗口
		this.tree =  new Ext.tree.TreePanel({
			loader: loader,
			border: false,
			rootVisible: this.treeRootVisible,
			renderTo: 'tree-div-'+this.id,
			root: new Ext.tree.AsyncTreeNode({id: this.treeRootId,text: this.treeRootText,expanded:true}),
			listeners: {
				beforeload: function(node){
					loader.dataUrl = this.treeUrl+node.id;
				},
				click: function(node){
					this.setValue(node.text);
					this.hiddenField.value = node.id;
				},
				dblclick: function(node){
					this.collapse();
				},
				scope: this
			}
		});
	},
	
	expand: function(){
		Ext.ux.form.TreeComboBox.superclass.expand.call(this);
		if(!this.tree){
			this.init();
		}
	},
	
	onRender : function(ct, position){
		this.tpl = '<tpl for="."><div style="height:'+this.maxHeight+'px"><div id="tree-div-'+this.id+'"></div></div></tpl>';
        Ext.ux.form.TreeComboBox.superclass.onRender.call(this, ct, position);
	},
	onDestroy : function(){
		if(this.tree){
			this.tree.destroy();
			this.tree = null;
		}
		Ext.ux.form.TreeComboBox.superclass.onDestroy.call(this);
    }, 
	setValue : function(v){
        if(this.hiddenField){
            this.hiddenField.value = v;
        }
        Ext.ux.form.TreeComboBox.superclass.setValue.call(this, v);
        this.value = v;
    },
    
	setHiddenValue : function(v){
        if(this.hiddenField){
            this.hiddenField.value = v;
        }
    },
    
    getValue : function(){
 		return Ext.ux.form.TreeComboBox.superclass.getValue.call(this);
    },
    
    getHiddenValue : function(){
 		return this.hiddenField.value;
    },
    
	reset : function(){
		Ext.ux.form.TreeComboBox.superclass.reset.call(this);
		if(this.hiddenField)
			this.hiddenField.value = this.hiddenValue==undefined?'':this.hiddenValue;
	}
});
Ext.reg('treecombo', Ext.ux.form.TreeComboBox );