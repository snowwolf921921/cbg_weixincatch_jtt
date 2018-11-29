
		  function bchange(){
//			  alert(document.getElementById('textOrgin').value);
//			  return ;
			  document.getElementById('bchange').disabled=true;
			  document.getElementById('divResult').innerHTML='';
			  var responseText=document.getElementById('textOrgin').value;
			  var _arraydataall={};
			   _arraydataall=eval(responseText);
			  var resultText='';
			  var _itemData_content='';
			  var _itemData_content_split='';
			  var _itemData_contentNo='';
			  var _itemData_contentName='';
			  
			  var _itemData_t='';
			  var _itemData_t_d=new Date();
			  var _itemData_n='';
//			  for(var i in _arraydataall){ 
			  for(i=0;i<_arraydataall.length;i++){ 
				  if (_arraydataall[i].content){
					  _itemData_content=_arraydataall[i].content.trim();
					  _itemData_content_split='';
					  if(_itemData_content.indexOf("+")>0){
//						  _itemData_content_split= _itemData_content.replace('/\+/g',',');
						  _itemData_content_split= _itemData_content.replace(new RegExp("\\+","gm"),',');
						 
						  /*_itemData_contentNo=_itemData_content.subStr(0,_itemData_content.indexOf("+")-1);
						  _itemData_contentName=_itemData_content.subStr(itemData_content.indexOf("+"),);*/
					  }else{//不符合格式，不分解
//						  _itemData_content_split+=_itemData_content+",";
						  _itemData_content_split=",,,";
					  }
					  _itemData_t=_arraydataall[i].date_time;
					  _itemData_t_d=getLocalTime2(_itemData_t);
					  _itemData_n=_arraydataall[i].nick_name;
					  resultText+=(i+1)+','+_itemData_content+','+_itemData_content_split+","+_itemData_n+','+_itemData_t_d+'<br>';

				  }else{
					  resultText+=(i+1)+','+''+','+''+","+''+','+''+'<br>';
 
				  }
					  
				  			 
			  }
		   document.getElementById('divResult').innerHTML=resultText;
		   document.getElementById('bchange').disabled=false;  
		  } 
		  function getLocalTime(nS) { 
			  //格式是  2010年12月23日 10:53 
			  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' '); 
			  } 
			  
		  function getLocalTime2(nS) {
			  //2010-10-20 10:00:00 
			  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " "); 
			  } 
				
			  
		 
		  
		


		
      
		
	