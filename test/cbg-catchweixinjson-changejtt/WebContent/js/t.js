
//		Ext.onReady(function(){
//			var button2 = new Ext.Button({  
//                renderTo: Ext.getBody(),  
//                text: "Listeners Test",  
//                minWidth:100,  
//                listeners:{  
//                       "click":function(){  
//                              alert("Listeners Test");  
//                       }  
//                }  
//        });  
//
//			
		
		  
		  function bchange(){
//			  alert(document.getElementById('textOrgin').value);
//			  return ;
			  document.getElementById('bchange').disabled=true;
			  document.getElementById('divResult').innerHTML='';
			  var responseText=document.getElementById('textOrgin').value;
			  var _griddataall=eval(responseText);
				var _griddata=_griddataall[0].documents;
				var temppage='';
				var temptitle1='';
//				var printstr='<div style="width:100%;height:200px; overflow:scroll; border:1px solid;">';
				var printstr='';
				var value={};
				var tempstrfuhao=false;
				var tempJuanYeshu='';
				for(var i in _griddata){  
			        //alert(_griddata[i].Title1);
			        //document.getElementById('result').innerHTML='_griddata[o].Title1';
			       // window.document.body.innerHTML=_griddata[o].Title1;
						
					temptitle1=_griddata[i].Title1+' ';
					
				//	temptitle1="本馆藏书楼:[照片] 学风(安庆)";
	//				temptitle1=String(temptitle1).replace(/\:\[照片\]/g,"");
	//				alert(temptitle1);
	
					
					//temppage=_griddata[i].Page!=null?_griddata[i].Page:'';
					//tempPageVo=_griddata[i].PageVo==null?'':_griddata[i].PageVo;
					
					//	添加原页面逻辑
					value=_griddata[i];
					//添加行号
					printstr+=Number(i)+1+".";
					//添加题目
					printstr+=temptitle1;
					if(value.Author1){printstr+=value.Author1;}
					if(value.Author2){printstr+=', '+value.Author2;}
					if(value.Author3){printstr+=', '+value.Author3;}
					tempJuanYeshu='';
					//现刊
					if (value.LiteratureCategory==2) { printstr+=' 《'+_griddata[i].LiteratureTitle+'》 '+_griddata[i].Year+'年 '
						if (value.Volumn){tempJuanYeshu+=value.Volumn+'卷'; tempstrfuhao=true;} 
						if(value.Issue){tempJuanYeshu+=' '+value.Issue+'期'; tempstrfuhao=true;}
						if(value.Page){tempJuanYeshu+=', '+value.Page;empstrfuhao=true;}
						if (tempstrfuhao) {tempJuanYeshu='['+tempJuanYeshu+']'}
						printstr+=tempJuanYeshu;
					}
					//晚晴
					if (value.LiteratureCategory==7) { printstr+=' 《'+_griddata[i].LiteratureTitle+'》 '+_griddata[i].Year+'年 '
						if (value.PageVo){tempJuanYeshu=value.PageVo;tempstrfuhao=true;} 
						else if(value.Volumn){tempJuanYeshu+=' 第'+value.Volumn+'卷'; tempstrfuhao=true;}
						else if(value.Issue){tempJuanYeshu+=', 第'+value.Issue+'期'; tempstrfuhao=true;}
						if (value.Piid && value.Page ){tempJuanYeshu+=','+ value.Page} 
						if (tempstrfuhao) {tempJuanYeshu='['+tempJuanYeshu+']'}
						printstr+=tempJuanYeshu;
						//原有逻辑没有添加 if (value.Piid){printstr+=value.PageVo} 
					}
					//中文报纸 或者 外文报纸
					if (value.LiteratureCategory==3 || value.LiteratureCategory==4) { 
						printstr+=' 《'+_griddata[i].LiteratureTitle+'》 '+_griddata[i].Year+'年'+_griddata[i].Month+'月'+_griddata[i].Day+'日';
					
						if (value.BC){printstr+=' '+value.BC+'版'} 
					}
					//行名录
					if (value.LiteratureCategory==6) { printstr+=' 《'+_griddata[i].LiteratureTitle+'》 '+_griddata[i].Year+'年 '+_griddata[i].Month+'月'
						if (value.BC){printstr+=value.BC+'版'} 
					}
					
					
			        printstr+='<br>';
			   
			        				
		        
		   
		      }  
//			     printstr+='</div>'
				document.getElementById('divResult').innerHTML=printstr;
				document.getElementById('bchange').disabled=false;
			  
		  }
		  
		


		
      
		
	