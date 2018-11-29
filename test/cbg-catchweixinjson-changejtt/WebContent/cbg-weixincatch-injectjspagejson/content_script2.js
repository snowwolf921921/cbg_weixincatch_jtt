//var bAllowNextPage = true;
var bAllowDl = true;
var waitingDownload=false;
var intInterval;
var currentDownloadInfo={};
var needDownloadList=[];

// html&css 相关变量 与页面相关信息
//var tagKeyword="input[name='Book']";//文本示例<b>11433 种,用时 0.01 秒</b>
//var tagTotalItemsAmount="#searchinfo b:eq(0)";//文本示例<b>11433 种,用时 0.01 秒</b>
var tagTotalPagesAmount=".page_num label:eq(1)";//文本示例<b>11433 种,用时 0.01 秒</b>
//程序使用示例
//totalItemsAmount=substrStartToIndexofToNumber($(tagTotalItemsAmount).text(),0,'种');
var itemsAmountPerPage=20;
var tagCurrentPageIndex=".page_num label:eq(0)";//取该div中的第二个红字

/*var tagTotalItemsAmount="#queryCount";
var tagItemsAmountPerPage="#srPageCoun
var tagCurrentPageIndex="#resultcontent table:eq(0) li.active";
*///cs 里的totalInfoAndCurrentDownloadInfo变量似乎可以取消,后来发现不行，这个变量要在iframe 的回调函数里付值

//修改成按文件引入，js中还要添加数据节点处理程序, inject。js 是在cs 后插入的，cs先执行。
function injectCustomJs(jsPath)
{
    jsPath = jsPath || 'inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function()
    {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}
injectCustomJs();

var totalInfoAndCurrentDownloadInfo = {
		totalPageAmount : 0,
		maxP:0,
		itemsAmountPerPage:itemsAmountPerPage,
		currentDPageIndex : 0, // 1开始
		displayData:""	
	};
//暂时只能在第一个tab内实现接收，
function catchStop(request, sender, sendRequest) {
	if (request.type == "wolf-catch-stop") {
		stopCatchAndDl();
	} else if (request.type == "msg-catch&downloadThisItem-withTotalInfo") {
		// 取得itemIndex，catch一条并下载，
		var totalInfoAndCurrentDownloadInfo2 = {};
		totalInfoAndCurrentDownloadInfo2=request.data;
		//翻页，重新加载的情况；
		checkCPageThenCatchAndDownloadOnePageData(totalInfoAndCurrentDownloadInfo2);
	} else if (request.type == "firstStart") {//可以删除
		var startP=request.data.startP;
		var maxP=request.data.maxP;
		
		// 获取总体信息，传到bg存储，以这些信息为循环信息
		var totalInfoAndCurrentDownloadInfo2={
				maxP : maxP ,
				itemsAmountPerPage:itemsAmountPerPage,
				currentDPageIndex:startP,  // 1开始
		};
		totalInfoAndCurrentDownloadInfo2.totalPagesAmount=Number($(tagTotalPagesAmount).text());
		var msg = {};
		msg.type = "firstStartToBg";
		msg.data=totalInfoAndCurrentDownloadInfo2;
		//iframe
		chrome.runtime.sendMessage(msg);
	}else{
		return;
	}
};
chrome.runtime.onMessage.addListener(catchStop);
//****************把totalInfoAndCurrentDownloadInfo改成全局变量?需要仔细检查
function checkCPageThenCatchAndDownloadOnePageData(totalInfoAndCurrentDownloadInfo2){
	totalInfoAndCurrentDownloadInfo2.itemsAmountPerPage=pGetItemsAmountPerPage();
	totalInfoAndCurrentDownloadInfo=totalInfoAndCurrentDownloadInfo2;
	//当前页就是要下载的页，直接下载当前页
	if(Number($(tagCurrentPageIndex).text())==totalInfoAndCurrentDownloadInfo2.currentDPageIndex){
		catchAndDownloadOnePage(totalInfoAndCurrentDownloadInfo2)
		tSendMessage("askCS-downloadNextPage-afterAWhile",totalInfoAndCurrentDownloadInfo2);
		pNextPage();
	}else if(Number($(tagCurrentPageIndex).text())+1==totalInfoAndCurrentDownloadInfo2.currentDPageIndex){
		//检测当前页+1是要下载的页
		if(totalInfoAndCurrentDownloadInfo2.currentDPageIndex>totalInfoAndCurrentDownloadInfo2.maxP||totalInfoAndCurrentDownloadInfo2.currentDPageIndex>totalInfoAndCurrentDownloadInfo2.totalPagesAmount){
			//检测没有超过最后页后并翻页
			alert("要下载的第"+totalInfoAndCurrentDownloadInfo2.currentDPageIndex+"超过了配置的最大下载页或最后一页");
		}else{
//		需要下一页的情况，通知bg 记录，,
			var msgDownload = {};
			tSendMessage("askCS-downloadSameItem-afterAWhile",totalInfoAndCurrentDownloadInfo2);
			pNextPage();
			// 放到bg 过一段时间等cs翻完页在，bg 向cs发消息继续抓取
			// 考虑翻页不成功情况？通知bg？记录如较长时间没有到下个item，通知cs重新下载，并记录问题;
		}
	}else {
		alert("要下载的第"+totalInfoAndCurrentDownloadInfo2.currentDPageIndex+"页不在当前页中");
	}	
} 

function catchAndDownloadOnePage(totalInfoAndCurrentDownloadInfo2){
	console.log("data-fp:"+document.body.getAttribute('data-fp'));
	totalInfoAndCurrentDownloadInfo2.itemTrInfo = document.body.getAttribute('data-fp');
}




function tSendMsgToPopup(msgType,data) {
//	totalData.totalInfoAndCurrentDownloadInfo=totalInfoAndCurrentDownloadInfo;
	var msg = {};
	msg.type = msgType;
	msg.data=data;
	chrome.runtime.sendMessage(msg);
};
function tSendMessage(msgType,data){
	var msg = {};
	msg.type=msgType;
	msg.data=data;
	chrome.runtime.sendMessage(msg);
}
function tCaltulatePageIndex(itemIndex,amountPerPage){
	if (amountPerPage!=0){
		return Math.ceil(itemIndex/amountPerPage);
	}else{
		return 0;
	}
}

function removeHTMLTag(str) {
//	去除所有空格:   
		str   =   str.replace(/\s+/g,"");       
	str = str.replace(/[ | ]*\n/g, '\n'); // 去除行尾空白
	str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	str = str.replace(/ /ig, '');// 去掉
	return str;
}

function _click(el) {
	var e = document.createEvent('MouseEvent');
	e.initEvent('click', false, false);
	el.dispatchEvent(e);
};
// 问题处

function pNextPage() {
		_click($(".btn.page_next")[0]);
//	} 
}
function tSubstrStartToIndexofToNumber(sourceStr,start,indexStr){
	return Number(sourceStr.substring(start,sourceStr.indexOf(indexStr)).trim());
}
function pGetTotalItemsAmountNumber(){
	return tSubstrStartToIndexofToNumber($(tagTotalItemsAmount).text(),0,'种');
}
function pGetKeyword(){
	return $(tagKeyword).val();
}
function pGetItemsAmountPerPage(){
	return itemsAmountPerPage;
}