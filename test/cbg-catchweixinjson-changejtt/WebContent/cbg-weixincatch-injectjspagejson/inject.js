//var script = document.createElement('script');
//script.type = 'text/javascript';
//script.innerHTML = "document.body.setAttribute('data-fp','"+ cJsonToCvs(wx.cgiData.list) + "');";
//document.head.appendChild(script);
//document.head.removeChild(script);
//console.log(document.body.getAttribute('data-fp'));

document.body.setAttribute('data-fp',cJsonToCvs(wx.cgiData.list));
//console.log(document.body.getAttribute('data-fp'));
function _getLocalTime2(nS) {
	// 2010-10-20 10:00:00
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-")
			.replace(/日/g, " ");
}
// 页面变量 wx.cgiData
function cJsonToCvs(list) {
	var _arraydataall = {};
	_arraydataall = list;
	var resultText = '';
	var _itemData_content = '';
	var _itemData_content_split = '';
	var _itemData_contentNo = '';
	var _itemData_contentName = '';

	var _itemData_t = '';
	var _itemData_t_d = new Date();
	var _itemData_n = '';
	var tagCurrentPageIndex=".page_num label:eq(0)";
	var itemsAmountPerPage=20;
	var currentPageIndex=Number($(tagCurrentPageIndex).text());
	for (i = 0; i < _arraydataall.length; i++) {
		if (_arraydataall[i].content) {
			_itemData_content = _arraydataall[i].content.trim();
			_itemData_content = removeEmpty(_itemData_content);
			_itemData_content = _itemData_content.replace(/\,|\，|/g, "");
			_itemData_content_almostOrigin=_itemData_content;
//			清除空格 引号 错误加号
			_itemData_content = _itemData_content.replace(/\"\"/g, "\"xxxxxx\"");
			_itemData_content = _itemData_content.replace(/\“\”/g, "\"xxxxxx\"");
			_itemData_content = _itemData_content.replace(/\,|\，|\，|\"|\“|\”|\＂|\‘|\’|\'|:|@|/g, "");
			_itemData_content = _itemData_content.replace(/\十/g, "+");
			_itemData_content = _itemData_content.replace(/\＋/g, "+");
			_itemData_content = _itemData_content.replace(/&(lt|gt|nbsp|amp|quot);/g,"");
			//注意顺序，先过滤引号在过滤；
			_itemData_content = _itemData_content.replace(/\;/g, "");
			_itemData_content = _itemData_content.replace(/\；/g, "");
			
			_itemData_content_split = '';
			_rightFlag=1;//1为正确，0为错误申请
			var t=_itemData_content;
//			if (_getPlaceholderCount(t)>=2) {	
				
				if (_itemData_content.indexOf("+") >= 0) {
//				_itemData_content_split = _itemData_content.replace(new RegExp("\\+", "gm"), ',');
				_itemData_content_splits = _itemData_content.split("+");
				_itemData_content_split="";
				(_itemData_content_splits[0])? _itemData_content_split+=_itemData_content_splits[0]+",":_itemData_content_split+=",";
				(_itemData_content_splits[1])? _itemData_content_split+=_itemData_content_splits[1]+",":_itemData_content_split+=",";
				(_itemData_content_splits[1])?_rightFlag=1 :_rightFlag=0;
				
				if(_itemData_content_splits[2]){
					_itemData_content_split+=_itemData_content_splits[2]+",";
//					if(_itemData_content_splits[2]!="申请使用读者存包柜"){
//						if(_itemData_content_splits[2]!="申请使用读者存包柜"){
//						_rightFlag=0;
//					}
				}else{
					_itemData_content_split+=",";
					_rightFlag=0;
				}
				(_itemData_content_splits[3])? _itemData_content_split+=_itemData_content_splits[3]+",":_itemData_content_split+=",";
				(_itemData_content_splits[3])?_rightFlag=1 :_rightFlag=0;
				
			} else {// 不符合格式，不分解 ;共4项如1511140103,排日扎提,申请使用读者存包柜,新馆  ,；带后面的逗号，组装时不用再加，
				_itemData_content_split = ",,,,";
				_rightFlag=0;
			}
			_itemData_t = _arraydataall[i].date_time;
			_itemData_t_d = _getLocalTime2(_itemData_t);
				_itemData_n = _arraydataall[i].nick_name.replace(/\,|\，|/g, "");
			resultText += ((i + 1)+(currentPageIndex-1)*itemsAmountPerPage) + ','+_itemData_content_almostOrigin+',' + _itemData_content + ','
					+ _itemData_content_split
					+ _itemData_t_d+ ',' +_itemData_t+ ','+_rightFlag+','+ _itemData_n +','+_arraydataall[i].id+ '\n';
//			+ _itemData_t_d + '<br>';
		} else {
			_rightFlag=0;
			resultText += ((i + 1)+(currentPageIndex-1)*itemsAmountPerPage)  + ',,' + ',' + ',' + ',' + "," + ',' + ',' + ',,'+_rightFlag+',,,'
					+ '\n';
//			+ '<br>';
		}
	}
	return resultText;
};
function _getPlaceholderCount(strSource) {
	  //统计字符串中包含{}或{xxXX}的个数
	  var thisCount = 0;
	  strSource.replace(/\+/g, function (m, i) {
	    //m为找到的{xx}元素、i为索引
	    thisCount++;
	  });
	  return thisCount;
	}
function removeEmpty(str) {
//	去除所有空格:   
		str   =   str.replace(/\s+/g,"");       
	str = str.replace(/[ | ]*\n/g, '\n'); // 去除行尾空白
	str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	str = str.replace(/ /ig, '');// 去掉
	return str;
}
/*
 * 1,,,,<br>2,/::D,,,,,王新月,2018/9/15 下午8:40:01<br>3,&quot;1503540112&quot;+&quot;张丽&quot;+&quot;申请使用读者存包柜&quot;+&quot;新馆&quot;,&quot;1503540112&quot;,&quot;张丽&quot;,&quot;申请使用读者存包柜&quot;,&quot;新馆&quot;,Ирина,2018/9/15 下午5:14:47<br>4,“1518340114”+“邢维”+“申请使用读者存包柜”+“新馆”,“1518340114”,“邢维”,“申请使用读者存包柜”,“新馆”,浅笑安然,2018/9/15 下午5:11:44<br>5,“1608140221”+“崔馨雨”+“申请使用读者存包
柜”+“新馆”,“1608140221”,“崔馨雨”,“申请使用读者存包
柜”,“新馆”,  ,2018/9/15 下午4:26:22<br>6,“1703140301”+“龙雷”+“申请使用读者存包柜”+“新馆”,“1703140301”,“龙雷”,“申请使用读者存包柜”,“新馆”,forever,2018/9/15 下午3:59:33<br>7,“1607240123”+&quot;杨天华&quot;+&quot;申请使用读者存包柜&quot;+&quot;旧馆&quot;；,“1607240123”,&quot;杨天华&quot;,&quot;申请使用读者存包柜&quot;,&quot;旧馆&quot;；,倾殇,2018/9/15 下午12:49:01<br>8,“1607240123”+&quot;杨天华&quot;,“1607240123”,&quot;杨天华&quot;,倾殇,2018/9/15 下午12:46:10<br>9,“1608140214”+“杨
雪”十“申请使用读者存包
柜”+“新馆”,“1608140214”,“杨
雪”十“申请使用读者存包
柜”,“新馆”,  ,2018/9/15 上午11:47:15<br>10,“1608140221”+“崔馨
雨”+“申请使用读者存包
柜”+“新馆”,“1608140221”,“崔馨
雨”,“申请使用读者存包
柜”,“新馆”,  ,2018/9/15 上午11:46:50<br>11,“1607140104”+“王怡旋”+“申请使用读者存包柜”+“旧馆”,“1607140104”,“王怡旋”,“申请使用读者存包柜”,“旧馆”,TODAY,2018/9/15 上午10:51:23<br>12,“1607140104”+“王怡旋”+“申请使用读者存包柜”+“旧馆”,“1607140104”,“王怡旋”,“申请使用读者存包柜”,“旧馆”,TODAY,2018/9/15 上午10:50:54<br>13,1607140104+王怡旋+申请使用读者存包柜+旧馆,1607140104,王怡旋,申请使用读者存包柜,旧馆,TODAY,2018/9/15 上午10:49:42<br>14,柜子,,,,,Power or Over,2018/9/15 上午10:48:05<br>15,1601140119+沈慧萍+申请使用读者存包柜+新馆,1601140119,沈慧萍,申请使用读者存包柜,新馆,萍萍,2018/9/15 上午10:44:17<br>16,座位,,,,,红发安妮,2018/9/15 上午8:13:17<br>17,“1519140234”+“李萍”+“申请使用读者存包柜”+“新馆”,“1519140234”,“李萍”,“申请使用读者存包柜”,“新馆”,🔥 ，路过的人看到的只是烟,2018/9/15 上午7:22:50<br>18,长师图书馆管理员你好~  我是一名长春师范大学的学生，在图书馆学习的时间比较长，我希望学校旧图书馆能给旧图三楼的女厕所安个灯！黑乎乎的！并且最过分的是打扫卫生的阿姨，拿着扫地的扫把往桌上扫垃圾！每位学生来学习走的时候还要带走一身的细菌，并且他们吃的零食就放在桌上，太影响学生的身心健康了！,,,,,æ고 미 남,2018/9/15 上午7:22:39<br>19,好的,,,,,珊,2018/9/14 下午11:47:33<br>20,“”＋“黄珊”＋“申请使用读者存包柜”＋“新馆”,,,,,珊,2018/9/14 下午11:24:39<br>
 */
 

//setTimeout(function() {
//}, 2000);