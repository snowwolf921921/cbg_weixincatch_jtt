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
 * {
    	xtype: 'treefield',
    	allowBlank:false,
    	readOnly: true,
    	fieldLabel: '上级单位',
    	treeUrl: '../tree.do?type=unit&leafLevel=4&unitId=',
	   	treeRootId: 4,
		treeRootText: '吉林省',
    	treeRootVisible: false,
    	treeWinWidth: 250,
    	treeWinHeight: 400,
    	treeWinTitle: '选择上级单位',
        anchor: '95%',
        invalidLevel: [0,1],
    	hiddenName: 'unitId',
    	value: '吉林省',
    	hiddenValue: 4
	}
 */
Ext.namespace("Ext.ux");
Ext.namespace("Ext.ux.form");
Ext.ux.form.TreeField = Ext.extend(Ext.form.TriggerField,  {
    treeWin: null, //选择窗口
	treeUrl : '未设置treeUrl',
	treeRootId:4,
	treeRootText:'根节点',
	treeRootVisible:true,
	treeWinWidth:300,
	treeWinHeight:500,
	treeWinTitle:'选择窗口',
	invalidLevel:[-1],
	invalidTitle: '无效选择',
	invalidInfo: '您选中的节点为无效节点，请重新选择！',
	triggerClass : 'x-form-search-trigger',
	
	//初始化弹出窗口
	init : function(){
		var selectNode;
        //创建选择窗口
		var tree = new Ext.tree.TreePanel({
			rootVisible: this.treeRootVisible,
			loader: new Ext.tree.TreeLoader({
				dataUrl: ''
			}),
			autoScroll:true,
			root: new Ext.tree.AsyncTreeNode({
				text: this.treeRootText,
				id: this.treeRootId,
				leaf: 'false',
				expanded: true,
				singleClickExpand: true
			}),
			listeners:{
				beforeload:function(node){
					tree.loader.dataUrl = this.treeUrl + node.id;
				},
				click: function(node){
					if(this.fireEvent('beforeselect', this, node)){
						selectNode = node;
					}else
						selectNode = null;
				},
				dblclick: function(node){
					if(selectNode && this.checkValidate( selectNode.getDepth())){
						this.setValue(selectNode.text);
						if(this.hiddenName){
							this.hiddenField.value = selectNode.id;
						}
						this.treeWin.hide();
						this.fireEvent('select', this, selectNode);
					}else{
						Ext.MessageBox.show({
							 title: this.invalidTitle,
							 msg: this.invalidInfo,
							 buttons: Ext.MessageBox.OK,
							 icon: Ext.MessageBox.INFO
						});	
					}
				},
				scope:this
			}
		});
	    
		//弹出窗口
		this.treeWin = new Ext.Window({
			title: this.treeWinTitle,
	        layout:'fit',
	        width:this.treeWinWidth,
	        height:this.treeWinHeight,
			items: tree,
			modal: true,
			closeAction :'hide',
			resizable: false,
			buttonAlign: 'center',
	        buttons: [{
				text : '确定',
				listeners:{
					click:function(){
						if(selectNode && this.checkValidate( selectNode.getDepth())==true){
							this.setValue(selectNode.text);
							if(this.hiddenName){
								this.hiddenField.value = selectNode.id;
							}
							this.treeWin.hide();
							this.fireEvent('select', this, selectNode);
						}else{
							Ext.MessageBox.show({
								 title: this.invalidTitle,
								 msg: this.invalidInfo,
								 buttons: Ext.MessageBox.OK,
								 icon: Ext.MessageBox.INFO
							});	
						}
					},
					scope:this
				}
			},{
				text : '取消',
				listeners:{
					click:function(){
						this.treeWin.hide();
					},
					scope:this
				}
			}]
	    });
	},
	
	/*
	 * 判断当前所选节点是否符合要求
	 */
    checkValidate : function(selectLevel){
		var result = true;
		for(i=0;i<this.invalidLevel.length;i++){
			if(this.invalidLevel[i] == selectLevel){
				result = false;
			}
		}
		return result;
	},
	
    /**
     * The function that should handle the trigger's click event.  This method does nothing by default until overridden
     * by an implementing function.
     * @method
     * @param {EventObject} e
     */
    onTriggerClick : function(){
    	if(this.disabled)
    		return;
    	if(!this.treeWin){
    		this.init();
    	}
    	this.treeWin.show(this.trigger);
    },
    initComponent : function(){
        Ext.ux.form.TreeField.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event beforeselect
             * Fires before a node item is selected. Return false to cancel the selection.
             * @param {Ext.ux.form.TreeField} treeField This TreeField
             * @param {Ext.tree.TreeNode} node The node selected
             */
            'beforeselect',
            /**
             * @event select
             * Fires when a list item is selected
             * @param {Ext.ux.form.TreeField} treeField This TreeField
             * @param {Ext.tree.TreeNode} node The node selected
             */
            'select'
        );
	},
    afterRender : function(){
        Ext.ux.form.TreeField.superclass.afterRender.call(this);
		//生成隐藏域
		if(this.hiddenName){
            this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName, id: (this.hiddenId||this.hiddenName)},
                    'before', true);
            this.hiddenField.value =
                this.hiddenValue !== undefined ? this.hiddenValue :
                this.value !== undefined ? this.value : '';

			this.originalHiddenValue = this.hiddenField.value; 
            // prevent input submission
            this.el.dom.removeAttribute('name');
        }
    },
    
	onDestroy : function(){
		if(this.treeWin){
			this.treeWin.destroy();
			this.treeWin = null;
		}
		Ext.ux.form.TreeField.superclass.onDestroy.call(this);
    },
    /**
     * Returns the currently selected field value or empty string if no value is set.
     * @return {String} value The selected value
     */
    getValue : function(){
		if(this.hiddenField)
			return this.hiddenField.value;
		else
		    return Ext.form.ComboBox.superclass.getValue.call(this);
    },
	getHiddenValue : function(){
		if(this.hiddenField)
			return this.hiddenField.value;
		else
		    return this.hiddenValue;
    },

    /**
     * Clears any text/value currently set in the field
     */
    clearValue : function(){
        if(this.hiddenField){
            this.hiddenField.value = '';
            this.hiddenValue = '';
        }
        this.setRawValue('');
        this.value = '';
    },

    setHiddenValue : function(v){
        if(this.hiddenField){
	    	this.hiddenValue = v;
            this.hiddenField.value = v;
        }
    },
    
    reset: function(){
    	Ext.ux.form.TreeField.superclass.reset.call(this);
        if(this.hiddenField){
	    	this.hiddenValue = this.originalHiddenValue;
            this.hiddenField.value = this.originalHiddenValue;
        }
    } 
});
Ext.reg('treefield', Ext.ux.form.TreeField );