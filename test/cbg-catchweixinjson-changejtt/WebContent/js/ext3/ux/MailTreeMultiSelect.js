/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * @class Ext.ux.form.TreeMultiSelect
 * @extends Ext.form.TriggerField
 * @param {Object} config Configuration options
 * {
	xtype: 'treemultiselect',
	fieldLabel: 'MultiSelect',
	treeUrl: '../tree.do?type=unit&leafLevel=4&unitId=',
   	treeRootId: 4,
	treeRootText: '吉林省',
	treeRootVisible: true,
	treeWinTitle: '多选对话框',
    anchor: '95%',
	hiddenName: 'MultiSelect',
	defaultSelected: [[431,'长春市']]
}
 */
Ext.namespace("Ext.ux");
Ext.namespace("Ext.ux.form");
Ext.ux.form.MailTreeMultiSelect = Ext.extend(Ext.form.TriggerField,  {
    treeWin: null, //选择窗口
	treeUrl : '未设置treeUrl',
	treeRootId:4,
	treeRootText:'根节点',
	treeRootVisible:true,
	treeWinWidth:650,
	treeWinHeight:400,
	treeWinTitle:'多选对话框',
	triggerClass : 'x-form-search-trigger',
	showAllUserBtn : true,//是否显示"选择当前部门下所有人员"按钮
	defaultSelected: [],
	nodeValueTypeSelect: undefined,
	nowSelectNode:null,//当前选中节点
	
	
	//初始化弹出窗口
	init : function(){
		var GridRecord = Ext.data.Record.create([
			{name: 'itemId',type: 'string'},
		    {name: 'itemText', type: 'string'}
		]);
        //创建选择窗口
		var tree = new Ext.tree.TreePanel({
			title : '可选项',
			rootVisible: this.treeRootVisible,
			loader: new Ext.tree.TreeLoader({
				dataUrl: ''
			}),
			autoScroll:true,
		    enableDrag: true,
		    ddGroup: 'MultiSelect',
		    region: 'west',
		    width: 250,
		    split: true,
		    tools:[{
	        	id:'refresh',
	        	on:{
					click: function(){
		                tree.body.mask('正在加载数据...', 'x-mask-loading');
		                tree.root.reload();
		                tree.root.collapse(true, false);
						setTimeout(function(){ 
							tree.body.unmask();
							tree.root.expand(false, false);
						}, 1000);
					}
	        	}
	        }],
			root: new Ext.tree.AsyncTreeNode({
				text: this.treeRootText,
				id: this.treeRootId,
				leaf: false,
				expanded: true,
				//nodeValueType: this.nodeValueTypeSelect,
				singleClickExpand: true
			}),
			listeners:{
				beforeload: function(node){
					tree.loader.baseParams.category = node.attributes.category;
			    	tree.loader.dataUrl = this.treeUrl + node.id;
					//tree.loader.dataUrl = this.treeUrl;
				},
				click: function(node){
					//alert('Click');
					
					if(this.nodeValueTypeSelect == 0){
						if(store.find('itemId',node.id) == -1){
							var newRecord = new GridRecord({itemId: node.id,itemText: node.text});
							store.add(newRecord);
						}	
					}else if(this.nodeValueTypeSelect == 1){
						
						//alert('Click nodeValueTypeSelect == 1');
						nowSelectNode=node;
						if(node.isLeaf()&&node.attributes.nodeValueType == 1){
							if(store.find('itemId',node.id) == -1){
								var newRecord = new GridRecord({itemId: node.id,itemText: node.text});
								store.add(newRecord);
							}					
						}
						
						//alert('Click node.isLeaf():'+node.isLeaf()+":node.attributes.nodeValueType:"+node.attributes.nodeValueType+":");							
					}
				},
				scope:this
			}
		});

		var countInfo;
		//创建已选列表		
		var store = new Ext.data.SimpleStore({
			data: this.defaultSelected,
			fields: [
				{name: 'itemId'},
				{name: 'itemText'}
			],
			listeners:{
	    		add: function(){
	    			countInfo.update('共选中'+this.getCount()+'项');
	    		},
	    		remove: function(){
	    			countInfo.update('共选中'+this.getCount()+'项');
	    		},
	    		load: function(){
	    			if(countInfo)
						countInfo.update('共选中'+this.getCount()+'项');	    			
	    		},
	    		clear: function(){
	    			countInfo.update('共选中'+this.getCount()+'项');
	    		}
			}
		});
		//清空列表按钮
		var clear = new Ext.Action({
			text: '清空全部',
			handler: function (){
				store.removeAll();
			}
		});		
		//选择部门下所有员工按钮
		var addAllUnitStaff = new Ext.Action({
			text: '选择当前部门下所有人员',
			hidden: !this.showAllUserBtn, 
			handler: function (){
				var recursionArray=new Array();//当前节点下树中非叶子节点
				var recursionTreeFun=function (n){
					var tmp=n.childNodes; 
					for(var i=0;i<tmp.length;i++){
						if(tmp[i].isLeaf() && store.find('itemId',tmp[i].id) == -1&&tmp[i].attributes.nodeValueType==1){
								var newRecord = new GridRecord({itemId: tmp[i].id,itemText: tmp[i].text});
								store.add(newRecord);									
						}else{
							//包含子结点的非叶子结点
							if(tmp[i].hasChildNodes()){
								tmp[i].expand();
								recursionArray.push(tmp[i]);	
							}							
						}
					}
					//按层次遍历
					if(recursionArray.length>0){
						recursionTreeFun(recursionArray.shift());
					}
				};
				if((typeof(nowSelectNode)=="undefined")||nowSelectNode==null){
					Ext.MessageBox.show({
						title : '提示',
						msg : '请选择一个节点！',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});					
				}else{					
					//叶子节点
					if(nowSelectNode.isLeaf()){
						
					}else{
						grid.body.mask('正在加载数据...', 'x-mask-loading');
						setTimeout(function(){ 
							grid.body.unmask();
							//展开当前结点下所有结点
							//nowSelectNode.expandChildNodes(true);
							//遍历树，选中树中所有叶子结点
							recursionTreeFun(nowSelectNode);
						}, 1000);
						
						//展开当前结点下所有结点
						//nowSelectNode.expandChildNodes(true);
						//遍历树，选中树中所有叶子结点
						recursionTreeFun(nowSelectNode);
						/*//只能遍历一层
						  nowSelectNode.eachChild(function(n){
							if(n.isLeaf() && store.find('itemId',n.id) == -1&&n.attributes.nodeValueType==1){
								var newRecord = new GridRecord({itemId: n.id,itemText: n.text});
								store.add(newRecord);									
							}
						});	
						*/ 					
					}
				}
			}
		});
		var nodeValueTypeSelect = this.nodeValueTypeSelect;
	   	var grid = new Ext.grid.GridPanel({
	   		//title: '已选项',
	   		width:370,
	   		hideHeaders : true,
	        store: store,
	        enableHdMenu: false,
	        enableDragDrop: true,
			ddGroup : 'MultiSelect',
			tbar:[clear,addAllUnitStaff],
	        columns: [new Ext.grid.RowNumberer(),
	        	{header: '标识',width: 60,sortable: false,dataIndex: 'itemId',hidden : true},
	            {id: 'itemText',header: "名称", width: 160, sortable: false, dataIndex: 'itemText'}
	        ],
	        stripeRows: true,
	        autoExpandColumn: 'itemText',
	        region: 'center',
	        sm : new Ext.grid.RowSelectionModel({
	        	listeners:{
	        		rowselect : function( sm, rowIndex, record ){
	        			if(rowIndex < store.getCount() -1){
	        				store.remove(record);
	        				grid.getView().refresh();
	        			}
	        			else{
	        				store.remove.defer(10,store,[record]);
	        			}
	        		}
	        	}
	        }),
			listeners: {
				render: function(e){
					//已选项目数量信息
	   			if(!countInfo){
						var tbar = grid.getTopToolbar();
						countInfo = Ext.fly(tbar.el.dom).createChild({cls:'x-paging-info'});
						countInfo.update('共选中'+store.getCount()+'项');
					}
				    //设置dropTarget
					var ddropTarget = new Ext.dd.DropTarget(grid.getEl(), {
						ddGroup: "MultiSelect",
						copy:false,
						notifyDrop : function(dd, e, data)
						{
							var target = Ext.lib.Event.getTarget(e);
							var destination = "";
							var rindex = grid.getView().findRowIndex(target);
							// 从 tree 到 grid
							if(data.node != null )
							{	
								if(nodeValueTypeSelect == 0){
									if(store.find('itemId',data.node.id) == -1){
										var newRecord = new GridRecord({itemId: data.node.id,itemText: data.node.text});
										if(rindex === false)
											store.add(newRecord);
										else
											store.insert(rindex,newRecord);
										grid.getView().refresh();
										return true;
									}
								}else if(nodeValueTypeSelect == 1){
									if(data.node.isLeaf()){
										//选中一项
										if(store.find('itemId',data.node.id) == -1&&data.node.attributes.nodeValueType==1){
											var newRecord = new GridRecord({itemId: data.node.id,itemText: data.node.text});
											if(rindex === false)
												store.add(newRecord);
											else
												store.insert(rindex,newRecord);
											grid.getView().refresh();
											return true;
										}
								    }else{
										//选中多项
										data.node.eachChild(function(n){
											if(n.isLeaf() && store.find('itemId',n.id) == -1&&n.attributes.nodeValueType==1){
												var newRecord = new GridRecord({itemId: n.id,itemText: n.text});
												if(rindex === false)
													store.add(newRecord);
												else
													store.insert(rindex++,newRecord);
											}
										});
										grid.getView().refresh();
										return true;
									}
								}
							}
							return false;
						}
					});
				}
			}
	    });
		//弹出窗口
		this.treeWin = new Ext.Window({
			title: this.treeWinTitle,
	        layout:'border',
	        store: store,
	        width:this.treeWinWidth,
	        height:this.treeWinHeight,
			items: [tree,grid],
			modal: true,
			closeAction :'hide',
			resizable: false,
			buttonAlign: 'center',
	        buttons: [{
				text : '确定',
				listeners:{
					click:function(){
						var idList = [],textList = [];
						store.each(function(r){
							idList.push(r.get('itemId'));
							textList.push(r.get('itemText'));
						});
						this.setValue(textList.join(','));
						if(this.hiddenName){
							this.hiddenField.value = idList.join(',');
						}
						this.treeWin.hide();
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
    
    onRender : function(ct, position){
    	if(this.defaultSelected.length > 0){
			var s = '',id = '',text = '';
			for(var i=0;i<this.defaultSelected.length;i++){
				id = id + s + this.defaultSelected[i][0];
				text = text + s + this.defaultSelected[i][1];
				s = ',';
			}
			this.value = text;
			this.hiddenValue = id;
    	}
		Ext.ux.form.TreeMultiSelect.superclass.onRender.call(this, ct, position);

        if(this.hiddenName){
            this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName, id: (this.hiddenId||this.hiddenName)},
                    'before', true);
            this.hiddenField.value =
                this.hiddenValue !== undefined ? this.hiddenValue :
                this.value !== undefined ? this.value : '';

            // prevent input submission
            this.el.dom.removeAttribute('name');
        }
    },

	onDestroy : function(){
		if(this.treeWin){
			this.treeWin.destroy();
			this.treeWin = null;
		}
		Ext.ux.form.TreeMultiSelect.superclass.onDestroy.call(this);
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
    getVisiableValue: function(){
    	return Ext.form.ComboBox.superclass.getValue.call(this);
    },
	setSelectedValue : function(selectedValue){
		this.defaultSelected = selectedValue;
    	if(this.defaultSelected.length > 0){
			var s = '',id = '',text = '';
			for(var i=0;i<this.defaultSelected.length;i++){
				id = id + s + this.defaultSelected[i][0];
				text = text + s + this.defaultSelected[i][1];
				s = ',';
			}
			this.setRawValue(text);
			this.hiddenValue = id;
        	if(this.hiddenField)
            	this.hiddenField.value = id;
           	if(this.treeWin){
           		if(this.defaultSelected.length > 0)
           			this.treeWin.store.loadData(this.defaultSelected);
           		else
           			this.treeWin.store.removeAll();
           	}
		}
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

    reset: function(){
    	if(this.defaultSelected.length > 0){
			var s = '',id = '',text = '';
			for(var i=0;i<this.defaultSelected.length;i++){
				id = id + s + this.defaultSelected[i][0];
				text = text + s + this.defaultSelected[i][1];
				s = ',';
			}
			this.setRawValue(text);
			this.hiddenValue = id;
        	if(this.hiddenField)
            	this.hiddenField.value = id;
           	if(this.treeWin){
           		if(this.defaultSelected.length > 0)
           			this.treeWin.store.loadData(this.defaultSelected);
           		else
           			this.treeWin.store.removeAll();
           	}
		}
    } 
});
Ext.reg('mailtreemultiselect', Ext.ux.form.MailTreeMultiSelect );