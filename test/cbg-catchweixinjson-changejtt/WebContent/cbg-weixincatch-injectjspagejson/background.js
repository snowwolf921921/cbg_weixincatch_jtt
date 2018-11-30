﻿//restart 需要读取全局变量
var totalInfoAndCurrentDownloadInfo = {
				totalPageAmount : 0,
				maxP:0,
				itemsAmountPerPage:0,
				currentDPageIndex : 0, // 1开始
				displayData:""
};
var currentDownloadInfo2 = {};
var totalData = {
	jsonTotalDatas : [],
	downloadStatus : "无",
	catchStatus : "无",
	error :"加载中...",
	displayData:""	
};
var maxDownloadConfig=-1;
var startDownloadConfig=-1;
var displayConfig={};
//默认可以翻页
var nextPageEnableFlag = true;
var intIntervalNextPage;
//时间间隔
var timeP=0;
var timeI=0;
var timeRnd=0;
var t=-1;
//chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.runtime.onMessage.addListener(function(request, sender, sendRequest) {
	// 获取cs消息组装并记录供下面下载时使用并发送给popup显示
	if (request.type == "setBgConfig") {
		maxDownloadConfig=request.data.maxD;
		startDownloadConfig=request.data.startD;
		displayConfig=request.data.dConfig;
		timeP=request.data.time.p;
		timeRnd=request.data.time.rnd;
//		nextPageEnableFlag = true;
	}else if (request.type == "pupupStart-withConfig") {
		//开始页，和结束页
		maxDownloadConfig=request.data.maxP;
		startDownloadConfig=request.data.startP;
//		displayConfig=request.data.dConfig;
		timeP=request.data.time.p;
//		timeI=request.data.time.i;
//		timeRnd=request.data.time.rnd;
		nextPageEnableFlag=true;
	    tSendMsgToCS("firstStart",{'startP':startDownloadConfig , 'maxP':maxDownloadConfig});
	}else if (request.type == "pupupResume-withConfig") {
	    maxDownloadConfig=request.data.maxD;
	    startDownloadConfig=request.data.startD;
	    displayConfig=request.data.dConfig;
	    timeP=request.data.time.p;
//		timeI=request.data.time.i;
//		timeRnd=request.data.time.rnd;
	    totalInfoAndCurrentDownloadInfo.maxP=maxDownloadConfig;
	    totalInfoAndCurrentDownloadInfo.currentDPageIndex=startDownloadConfig;
	    
	    if(checkMax()){
	    	nextPageEnableFlag = true;
	    	tSendMsgToCS("msg-catch&downloadThisItem-withTotalInfo",totalInfoAndCurrentDownloadInfo);
	    }else{
	       alert("已经下载到最大值")
	    }
	}else if (request.type == "wolf-catch-pagedata") {
		totalData.firstAccess = "获取中...";
		totalData.error = false;
		totalData.jsonTotalDatas = totalData.jsonTotalDatas
				.concat(request.data.records);
		totalData.displayData += request.data.pageDispalyText;
		tSendMsgToPopup("popup-displayData");
	} else if (request.type == "firstStartToBg") {
		//第一次接收，放入本地变量存储：
		totalInfoAndCurrentDownloadInfo=request.data;
//		totalInfoAndCurrentDownloadInfo.currentDPageIndex=totalInfoAndCurrentDownloadInfo。currentDPageIndex;
		//totalItemsAmount 已经在cs页中放入了
		//通知cs下载第一条；
		tSendMsgToCS('msg-catch&downloadThisItem-withTotalInfo',totalInfoAndCurrentDownloadInfo);
	} else if (request.type == "currentItemInfo-waitdownload") {
		//待确定
		totalInfoAndCurrentDownloadInfo = request.data;
		totalData.displayData += totalInfoAndCurrentDownloadInfo.itemTrInfo;
		//只管加一的操作，其他的逻辑暂时放到cs中。
		totalInfoAndCurrentDownloadInfo.currentDItemIndexInTotal++;
		tSendMsgToPopup("popup-displayData");
		tSendMsgToCS('msg-catch&downloadThisItem-withTotalInfo',totalInfoAndCurrentDownloadInfo);
		
	}else if(request.type == "askCS-downloadSameItem-afterAWhile"){
		if(nextPageEnableFlag){
			totalInfoAndCurrentDownloadInfo = request.data;
			//setInterval定时不断执行，setTimeout只执行一次
			if(timeP){
				t=setTimeout(function(){
					tSendMsgToPopup("popup-displayData");
					tSendMsgToCS('msg-catch&downloadThisItem-withTotalInfo',totalInfoAndCurrentDownloadInfo);
				},timeP)
			}
		}
	}else if(request.type == "askCS-downloadNextPage-afterAWhile"){
		if(nextPageEnableFlag){
			totalInfoAndCurrentDownloadInfo = request.data;
			if(totalInfoAndCurrentDownloadInfo.currentDPageIndex<totalInfoAndCurrentDownloadInfo.totalPagesAmount&&totalInfoAndCurrentDownloadInfo.currentDPageIndex<totalInfoAndCurrentDownloadInfo.maxP){
				totalInfoAndCurrentDownloadInfo.currentDPageIndex++;
				totalInfoAndCurrentDownloadInfo.itemTrInfoWithNo+="p:"+totalInfoAndCurrentDownloadInfo.currentDPageIndex;
				totalData.displayData += totalInfoAndCurrentDownloadInfo.itemTrInfo;
//				totalData.downloadStatus="已下载："+totalInfoAndCurrentDownloadInfo.currentDPageIndex+totalInfoAndCurrentDownloadInfo.itemTrInfoWithNo;
				totalData.downloadStatus="已下载："+"p:"+(totalInfoAndCurrentDownloadInfo.currentDPageIndex-1);
				tSendMsgToPopup("popup-displayData");
				//setInterval定时不断执行，setTimeout只执行一次
				if(timeP){
					t=setTimeout(function(){
						tSendMsgToCS('msg-catch&downloadThisItem-withTotalInfo',totalInfoAndCurrentDownloadInfo);
					},timeP)
					totalData.downloadStatus="已下载p:"+(totalInfoAndCurrentDownloadInfo.currentDPageIndex-1)+"；已设置延迟"+timeP/1000+"秒后下载下一页";
					tSendMsgToPopup("popup-displayData");
				}
			}else{
				//到达最大页数限制
				totalInfoAndCurrentDownloadInfo.itemTrInfoWithNo+="p:"+totalInfoAndCurrentDownloadInfo.currentDPageIndex;
				totalData.displayData += totalInfoAndCurrentDownloadInfo.itemTrInfo;
				totalData.downloadStatus="已下载："+"p:"+totalInfoAndCurrentDownloadInfo.currentDPageIndex+"已停止，到达最大数配置页数或总页数";
				tSendMsgToPopup("popup-displayData");
				nextPageEnableFlag=false;
			};
		}
	}
});

function checkMax(){
//没到最大返回true
	return (maxDownloadConfig==-1||maxDownloadConfig=="")?true:totalInfoAndCurrentDownloadInfo.currentDPageIndex<=maxDownloadConfig
}
function bStop() {
	nextPageEnableFlag=false;
	if (t!=-1){clearTimeout(t); }
	
};
function tCaltulatePageIndex(itemIndex,amountPerPage){
	if (amountPerPage!=0){
		return Math.ceil(itemIndex/amountPerPage);
	}else{
		return 0;
	}
}
var lastTabId=-1;
function tSendMsgToCS(msgType,data) {
	var msg = {};
	msg.type = msgType;
	msg.data=data;
		chrome.tabs.query({
//			active : true,
			currentWindow : true
		}, function(tabs) {
			if(tabs.length>0){
//				lastTabId=tabs[0].id;
				chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
//			console.log(response.farewell);
				});
			}
		});
};
function tGetDomainFromUrl(url){
	var host = "null";
	if(typeof url == "undefined" || null == url)
		url = window.location.href;
	var match = url.match(regex);
	if(typeof match != "undefined" && null != match)
		host = match[1];
	return host;
}

function tSendMsgToPopup(msgType,data) {
//	totalData.totalInfoAndCurrentDownloadInfo=totalInfoAndCurrentDownloadInfo;
	var msg = {};
	msg.type = msgType;
	msg.data=data;
	chrome.runtime.sendMessage(msg);
};
function tRnd(n, m){
    var random = Math.floor(Math.random()*(m-n+1)+n);
    return random;
}


