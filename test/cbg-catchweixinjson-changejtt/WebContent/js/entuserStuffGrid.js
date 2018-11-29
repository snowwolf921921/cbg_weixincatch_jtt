var storeValue="";
var submitFlog="no";//是否可以提交
function entStuffGridCall(r, options, success) {
			storeValue="";
			submitFlog="no";//是否可以提交
			if (success == false) {  
				Ext.Msg.alert('提示信息',"加载数据失败，无对应数据或者系统出现异常！"); 
			}else{
				for(var i=0;i<r.length;i++){
				  if(r[i].get('STATE')=="0"&&r[i].get('ISVALIT')=="1"){
					  storeValue=storeValue+r[i].get('POWER_NAME')+",";				  	
				  }
                  /*var record = r[i];   
                  var v = record.data.POWER_NAME;   
                  if(v==null || v==""){   
                      //record.set("userViewId",1);
                      Ext.Msg.alert('Info', 'POWER_NAME:'+v+':');     
                  }else{
                	  Ext.Msg.alert('Info', 'POWER_NAME:'+v+':');
                  } */  
            	}
            	//查看表单是否可以提交 AS_STATE为1或者 tbca_enterprise_as_process无对应单位、日期数据
            	Ext.Ajax.request({
							url :session.ctxpath+'/form.do',
							success : function(response) {				
								var result = Ext.util.JSON.decode(response.responseText);
								if (result.success == true) {//退回和未填时允许提交					
									submitFlog="yes";					
								}
							},
							failure : function() {
								//alert('ccl');								
							},
							params:{
								action:'getSubmitResult',
								parNames:session.unitID+","+session.as_year
							}
						});	
			} 
		} 	

var entuserStuffGrid=function(){
	var createstfgrid=function(gridw,gridh){
		
	var store = new Ext.data.JsonStore({
	    url:session.ctxpath+"/form.do?action=getSearchResult&parNames="+session.unitID+","+session.unitID+","+session.unitID,
	    root: 'Result_ITEM',
	    fields:['POWER_ID','POWER_NAME','POWER_URL','STATE','ISVALIT']
    });
    store.load({
		callback: function(r, options, success) {
			entStuffGridCall(r, options, success)
		} 
	}); 
    /*
     * 0未填red---------可以查看表单----yes
1已填black---------不可以查看表单-------no	
2回退green---------可以查看表单--------yes
3审核blue---------不可以查看表单--------no
     * */
    //定义列
	
	
	/*
	 * Ext.MessageBox.confirm('确认', '您是否确认要删除所选中文件？删除后将无法恢复?', function(btn) {
					if (btn == 'yes') {
						var data = [];
						var inParams = 'id,length';
						var ids = "";
						for (i = 0; i < obj.length; i++) {
							ids += obj[i].get('40606') + ","
						}

						data.push({
									id : ids,
									length : obj.length
								});
						params = {
							action : 'batchCallProc',
							procName : 'COMMONFILE_DEL',
							inParams : inParams,
							outParamCount : 1,
							data : Ext.util.JSON.encode(data)
						}
						Ext.Ajax.request({
									url : 'data.do',
									success : function(response) {
										var result = Ext.util.JSON
												.decode(response.responseText);
										Ext.MessageBox.show({
													title : '成功',
													msg : result.result,
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.INFO,
													fn : ListModule.refresh()
												});
									},
									failure : function() {
										Ext.MessageBox.show({
													title : '错误',
													msg : '删除操作出现错误！',
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.ERROR
												});
									},
									params : params
								});
					}
				});
	 
	 * */
	
	var saveBtn = new Ext.Button({
			id: 'save',
			//region :'north',
			disabled : false,
			iconCls: 'save',
			text: '提交',
			handler: function(){
				if(storeValue!=""){
					//alert(storeValue.length);
					Ext.Msg.alert('提示信息', '以下表单没有提交:'+storeValue.substring(0,storeValue.length-1)+'!');
					return false;
				}
				if(submitFlog=="no"){//退回和未填时允许提交
					Ext.Msg.alert('提示信息', '表单已经是提交状态，不允许重复提交!');
					return false;
				}
				Ext.MessageBox.confirm('确认', '材料提交后数据将不允许修改，您真的要提交吗？', function(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
							url :session.ctxpath+'/data.do',
							success : function(response) {				
								var result = Ext.util.JSON.decode(response.responseText);
								if (result.success == true) {					
									Ext.MessageBox.show({
											title : '成功',
											msg : '操作成功！',
											minWidth:200,
											buttons : Ext.MessageBox.OK,
											icon: Ext.MessageBox.INFO
									});		
									submitFlog="no";
									window.location.reload();												
								}
							},
							failure : function() {
								Ext.MessageBox.show({
											title : '错误',
											msg : '操作出现错误！',
											minWidth:200,
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
								});
							},
							params:{
								action:'opeReportSubmit',
								unit_id:session.unitID,
								as_year:session.as_year
							}
						});	
					}
				});				
			}		
		});
	

    
	//生成表格
	if (gridw&&gridh){
		var colM=new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),//增加自动编号，不需要可不必定义
		{header:'编号',dataIndex:'POWER_ID',width:100,sortable:true,hidden:true},// 生成列，sortable为列排序，不需要设置为false，默认false，renderer为该列增加自定义函数
		{header:'名称',dataIndex:'POWER_NAME',width:297,sortable:true},
		{header:'URL',dataIndex:'POWER_URL',width:300,sortable:true,hidden:true},
		{header:'状态',dataIndex:'STATE',width:100,sortable:true,align:'center',renderer:function(value){
			 if (value == '0') {
		     	return "<span style='color:red;'>未填</span>";           
		     } else if(value == '1'){
		        return "<span style='color:black;'>已填</span>";// style='font-weight:bold;'
		     } else if(value == '2'){
		        return "<span style='color:green;'>退回</span>";// style='font-weight:bold;'
		     } else if(value == '3'){
		        return "<span style='color:blue;'>审核通过</span>";// style='font-weight:bold;'
		     }
		}},
		{header:'必添表单',dataIndex:'ISVALIT',width:100,sortable:true,align:'center',renderer:function(value){
			 if (value == '1') {
		     	return "<span style='color:red;'>是</span>";            
		     } else {
		        return "<span>否</span>";            
		     }
		}}
		]);
		
		var grid = new Ext.grid.GridPanel({		
			id:'id_grid_njcltj',	
//		region :'center',
		//title:"年检材料提交",
		height:gridh,
		width:gridw,
		store:store,
		cm:colM
		,
		//sm:sm,				
		buttonAlign:'center',
		buttons:[saveBtn]
		});

	}else{
		var colM=new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),//增加自动编号，不需要可不必定义
		{header:'编号',dataIndex:'POWER_ID',width:100,sortable:true,hidden:true},// 生成列，sortable为列排序，不需要设置为false，默认false，renderer为该列增加自定义函数
		{header:'名称',dataIndex:'POWER_NAME',width:300,sortable:true},
		{header:'URL',dataIndex:'POWER_URL',width:300,sortable:true,hidden:true},
		{header:'状态',dataIndex:'STATE',width:170,sortable:true,align:'center',renderer:function(value){
			 if (value == '0') {
		     	return "<span style='color:red;'>未填</span>";           
		     } else if(value == '1'){
		        return "<span style='color:black;'>已填</span>";// style='font-weight:bold;'
		     } else if(value == '2'){
		        return "<span style='color:green;'>退回</span>";// style='font-weight:bold;'
		     } else if(value == '3'){
		        return "<span style='color:blue;'>审核通过</span>";// style='font-weight:bold;'
		     }
		}},
		{header:'必添表单',dataIndex:'ISVALIT',width:170,sortable:true,align:'center',renderer:function(value){
			 if (value == '1') {
		     	return "<span style='color:red;'>是</span>";            
		     } else {
		        return "<span>否</span>";            
		     }
		}}
		]);
		
		var grid = new Ext.grid.GridPanel({
		region :'center',
		//title:"年检材料提交",
		//height:680,
		//width:600,
		store:store,
		cm:colM,
		//sm:sm,				
		buttonAlign:'center',
		buttons:[saveBtn]
		});
		var myMask = new Ext.LoadMask(Ext.getBody(), {store:store,msg:"数据加载中,请稍后..."});
		myMask.show();
	}
	
//	var myMask = new Ext.LoadMask(Ext.getCmp('id_grid_njcltj').getEl(), {store:store,msg:"数据加载中,请稍后..."});
//    var myMask = new Ext.LoadMask(Ext.getBody(), {store:store,msg:"数据加载中,请稍后..."});
//	myMask.show();
	
	
	grid.addListener('rowClick', rowClick);
	function rowClick(grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);   //Get the Record
				//所有状态都可查看	
		//if((record.get(grid.getColumnModel().getDataIndex(4))=="0"||record.get(grid.getColumnModel().getDataIndex(4))=="2")&&submitFlog=="yes"){
		    var par = record.get(grid.getColumnModel().getDataIndex(3)).split(",");
		  	//Ext.MessageBox.alert('show','当前选中的数据是:'+data[0]+":"+data[1]+":");		  	
		  	/*com.unicom.service.TreeController
		  	 * if (nowMap.get("PPOWER_ID").equals("0101")
						  ||nowMap.get("PPOWER_ID").equals("0102")
						  ||nowMap.get("PPOWER_ID").equals("0103")
						  ||nowMap.get("PPOWER_ID").equals("0104")){
							strurl=",href: \"javascript:openIFrameTab('"+sarray[0]+"','state.do?url="+sarray[1]+"&pId="+nowMap.get("POWER_ID")+"');\"";
						}else{
							strurl=",href: \"javascript:openIFrameTab('"+sarray[0]+"','"+sarray[1]+"');\"";
						}
		  	 * */
		  	var power_id=record.get(grid.getColumnModel().getDataIndex(1));
		  	var ppower_id=power_id.substring(0,4);
		  	if(ppower_id=="0101"||ppower_id=="0102"||ppower_id=="0103"||ppower_id=="0104"||ppower_id=="0105"){
		  		top.openIFrameTab(par[0],'state.do?url='+par[1]+'&pId='+power_id);
		  	}else{
		  		top.openIFrameTab(par[0],par[1]);
		  	}		  	
		//}		
	}
	return grid
	
	}
		return{
		createGrid:function(w,h){
			if(w&&h){
			 	return createstfgrid(w,h)
			 }else{
			 	return createstfgrid()
			 }
			
		}
	}
}();