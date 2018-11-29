
		  
		  
		var postData = {"author":null,"clc":null,"searchContent":"藏书","categories":"1,2,3,4,6","types":"1,2,3","isRestart":false,"pageCount":"1000","asc":"true","relative":"false","facets":[],"currentPage":2,"typeId":1};
 
		postData = (function(obj){ // 转成post需要的字符串.
		    var str = "";
		 
		    for(var prop in obj){
		        str += prop + "=" + obj[prop] + "&"
		    }
		    return str;
		})(postData);
		 
		var xhr = new XMLHttpRequest();
		 
		xhr.open("POST", "http://www.cnbksy.net/search/query", true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.se
		xhr.onreadystatechange = function(){
		    var XMLHttpReq = xhr;
		    if (XMLHttpReq.readyState == 4) {
		        if (XMLHttpReq.status == 200) {
		            var text = XMLHttpReq.responseText;
		 
		            console.log(text);
		        }
		    }
		};
		xhr.withCredentials = true;
		xhr.send(postData);  

		  
		  


		
	