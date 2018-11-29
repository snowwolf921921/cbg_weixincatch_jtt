// correctly handle PNG transparency in Win IE 5.5 & 6.
function correctPNG() 
{
     var arVersion = navigator.appVersion.split("MSIE");
     var version = parseFloat(arVersion[1]);
     if ((version >= 5.5) && (document.body.filters));
     {
        for(var j=0; j<document.images.length; j++)
        {
           var img = document.images[j];
           var imgName = img.src.toUpperCase();
           if (imgName.substring(imgName.length-3, imgName.length) == "PNG")
           {
              var imgID = (img.id) ? "id='" + img.id + "' " : ""
              var imgClass = (img.className) ? "class='" + img.className + "' " : ""
              var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
              var imgStyle = "display:inline-block;" + img.style.cssText
              if (img.align == "left") imgStyle = "float:left;" + imgStyle
              if (img.align == "right") imgStyle = "float:right;" + imgStyle
              if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle
              var strNewHTML = "<span " + imgID + imgClass + imgTitle
              + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
              + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
              + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>"
              img.outerHTML = strNewHTML
              j = j-1
           }
        }
     }   
}
/*
 * 功能：创建一个文件上传对话框
 */
function uploadFile(uploadUrl,uploadParams,successFn){
	var selectedFileName;
    var fp = new Ext.FormPanel({
        fileUpload: true,
        frame: true,
        bodyStyle: 'padding: 10px 10px 0',
        border : false,
        labelWidth: 60,
		labelAlign : 'right',
		labelSeparator : '：', 
        defaults: {
            anchor: '98%',
            allowBlank: false
        },
        items: [{
            xtype: 'fileuploadfield',
            emptyText: '请选择一个文件',
            fieldLabel: '文件名',
            name: 'fileName',
            buttonCfg: {
                text: '',
                iconCls: 'upload-icon'
            },
            listeners: {
            	'fileselected' : function(btn,fileName){ selectedFileName = fileName}
            }
        },{
        	xtype: 'panel',
        	hideLabel: true,
        	bodyStyle: 'padding: 10px 5px 0 20px',
        	html: '<span style="color : blue">提示：请您选择的文件大小不要超过10M！</span>'
        }]
    });
    
    var selectWin = new Ext.Window({
    	title : '文件上传对话框',
    	height : 160,
    	width : 500,
    	layout : 'fit',
    	buttonAlign : 'center',
    	plain: true,
    	items : [fp],
    	modal : true,
    	buttons: [{
            text: '开始上传',
            handler: function(){
                if(fp.getForm().isValid()){
	                fp.getForm().submit({
	                    waitMsg: '正在上传文件，请稍候...',
	                    url: uploadUrl,
	                    params : uploadParams,
	                    success: function(form,o){
	                    	successFn(selectedFileName,o.result);
			                selectWin.close();
			                selectWin = null;
	                    }
	                });
                }
            }
        },{
            text: '重置',
            handler: function(){
                fp.getForm().reset();
            }
        },{
            text: '取消',
            handler: function(){
                selectWin.close();
                selectWin = null;
            }
        }]
    });
    
    selectWin.show();
}
/*
 * 功能：清除缓存
 * 参数：keys		Array	需要清除的缓存key的数组
 */

function deleteCache(keys){
/*	Ext.Ajax.request({
		url: 'cache.do',
		success: function(response){
		},
		failure: function(){
		},
		params: {action:'delete',keys: Ext.util.JSON.encode(keys)}
	});*/
}

/*
 * 复制到剪贴板的代码
 */
function copy2Clipboard(txt){
	if(window.clipboardData){
		window.clipboardData.clearData();
		window.clipboardData.setData("Text",txt);
	}
	else if(navigator.userAgent.indexOf("Opera")!=-1){
		window.location=txt;
	}
	else if(window.netscape){
		try{
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		}
		catch(e){
			alert("您的firefox安全限制限制您进行剪贴板操作，请打开’about:config’将signed.applets.codebase_principal_support’设置为true’之后重试，相对路径为firefox根目录/greprefs/all.js");
			return false;
		}
		var clip=Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		if(!clip)return;
		var trans=Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if(!trans)return;
		trans.addDataFlavor('text/unicode');
		var str=new Object();
		var len=new Object();
		var str=Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		var copytext=txt;str.data=copytext;
		trans.setTransferData("text/unicode",str,copytext.length*2);
		var clipid=Components.interfaces.nsIClipboard;
		if(!clip)return false;
		clip.setData(trans,null,clipid.kGlobalClipboard);
	}
}

/*
*功能：将数组转换为JSON对象
*参数：	src			二维数组类型，需要汇总的数组
*		staticCol	数组类型，固定列定义数组
*		valueCol	数组类型，汇总数据所在的列
*返回：	result		JSON对象，{items:[{title:'',items:[],total:0},...],total:Number}
*例子：
		var src = [{"10672":"0","10670":"小灵通来电显示月租费","10656":"来电显示","10671":"3"}, {"10672":"0","10670":"移数通Vip包月","10656":"灵通秘书","10671":"1.8"}, {"10672":"0","10670":"小灵通短信费","10656":"普通短信","10671":".56"}, {"10672":"0","10670":"小灵通网际短信费","10656":"普通短信","10671":".48"}, {"10672":"0","10670":"月租费","10656":"基本月租费","10671":"15"}, {"10672":"-15","10670":"月租费优惠费","10656":"基本月租费","10671":"0"}, {"10672":"0","10670":"小灵通区间费","10656":"区间通话费","10671":".2"}, {"10672":"0","10670":"区内通话费","10656":"区内通话费","10671":"44.7"}, {"10672":"0","10670":"小灵通区内（铁通）费","10656":"区内通话费","10671":"2.5"}, {"10672":"0","10670":"sp-3431000112","10656":"其他增值业务","10671":"2"}, {"10672":"0","10670":"sp-3431000264","10656":"其他增值业务","10671":"5"}];
		var o = Array2JSON(src,['10656','10670'],['10671','10672']);
		document.write(Ext.util.JSON.encode(o)+'<br>');
		var tpl = new Ext.XTemplate(
			'<table border=1>',
		    '<tpl for="items">',
		        '<tr>',
		        	'<td rowspan={count +1}>{title}</td>',
				    '<tpl for="items">',
				    	'<tpl if="xindex === 1">',
				    		'<td>{10670}</td>',
				    		'<td>{10671}</td>',
				    		'<td>{10672}</td>',
				    	'</tpl>',
				    '</tpl>',
		        '</tr>',
			    '<tpl for="items">',
			    	'<tpl if="xindex &gt; 1">',
			    		'<tr>',
				    		'<td>{10670}</td>',
				    		'<td>{10671}</td>',
				    		'<td>{10672}</td>',
			    		'</tr>',
			    	'</tpl>',
			    '</tpl>',
			    '<tr><td>小计：</td><td>{[values.total[10671]]}</td><td>{[values.total[10672]]}</td></tr>',
		    '</tpl>',
		    '<tr><td colspan=2>合计：</td><td>{[values.total[10671]]}</td><td>{[values.total[10672]]}</td></tr>',
		    '</table>'
		);
		document.write(tpl.apply(o));
*/
function Array2JSON(src,staticCol,valueCol,start,count){
	var result = {items:[],total:{}};
	var lastItem;
	var itemStart =(start == null?0:start);
	var itemCount =(count == null?src.length:count);
	var title;
	var newStaticCol=[];
	var newStart = itemStart;
	var newCount = 0;
	var lastO;//保存上一次汇总的值
	for(var j=1;j<staticCol.length;j++)
		newStaticCol.push(staticCol[j]);
	for(var i=itemStart;i-itemStart<itemCount;i++){
		for(var j=0;j<valueCol.length;j++)
			if(result.total[valueCol[j]])
				result.total[valueCol[j]] = (result.total[valueCol[j]]*100 + parseFloat(src[i][valueCol[j]])*100)/100;
			else
				result.total[valueCol[j]] = parseFloat(src[i][valueCol[j]]);
		if(staticCol.length == 1){
			if(lastO && src[i][staticCol[0]] == lastO[staticCol[0]]){
				for(var j=0;j<valueCol.length;j++)
					lastO[valueCol[j]] = (lastO[valueCol[j]]*100 + parseFloat(src[i][valueCol[j]])*100)/100;
			}else{
				var o = {};
				o[staticCol[0]] = src[i][staticCol[0]];
				for(var j=0;j<valueCol.length;j++)
					o[valueCol[j]] = parseFloat(src[i][valueCol[j]]);
				result.items.push(o);
				lastO = o;
			}
		}else{
			if(!title){
				title = src[i][staticCol[0]];
				newCount++;
			}
			else if(src[i][staticCol[0]] == title){
				newCount++;
			}else{
				var item = Array2JSON(src,newStaticCol,valueCol,newStart,newCount);
				item.title = title;
				result.items.push(item);
				newStart = i;
				newCount = 1;
				title = src[i][staticCol[0]];
			}
		}
	}
	result['count']=result.items.length;
	return result;
}


/*
*功能：	对数组进行汇总
*参数：	src			二维数组类型，需要汇总的数组,例：src = [["200706","15","月租费","1568"],["200706","15","月租费","1562"],["200706","3","小灵通来电显示月租费","1562"],["200708","10.68","月租费","1562"],["200708","2.13","小灵通来电显示月租费","1562"],["200710","45","月租费","1562"],["200710","9","小灵通来电显示月租费","1562"],["200711","15","月租费","1562"],["200711","3","小灵通来电显示月租费","1562"]];
											或 src = [{"10610":"1565","10632":"IP国内长话费","10631":"200709","10633":".3"},{"10610":"1565","10632":"小灵通区间费","10631":"200709","10633":"8.63"},{"10610":"1565","10632":"国内长途通话费","10631":"200709","10633":"14.7"},{"10610":"1565","10632":"小灵通区间（电信）费","10631":"200709","10633":".2"},{"10610":"1565","10632":"总额优惠","10631":"200710","10633":"5"},{"10610":"1565","10632":"酷铃月租费","10631":"200710","10633":"5"},{"10610":"1565","10632":"总额优惠","10631":"200711","10633":"5"},{"10610":"1565","10632":"酷铃月租费","10631":"200711","10633":"5"},{"10610":"1565","10632":"酷铃月租费","10631":"200712","10633":"5"}];
*		staticCol	数组类型，固定列定义数组，例：staticCol = [0,3] 或 staticCol = ['10631','10610'];
*		itemCol		数字类型，汇总项所在的列，例：itemCol = 2 或 itemCol = '10632';
*		valueCol	数字类型，汇总数据所在的列，例：valueCol = 1 或 valueCol = '10633';
*返回：	result		JSON对象，{data:[],items:[],total:Number}，data中保存有汇总后的二维数组，items中保存有所有的汇总项列表，total为总计值
*
*例子1：
	var src = [["200706","15","月租费","1568"],["200706","15","月租费","1562"],["200706","3","小灵通来电显示月租费","1562"],["200708","10.68","月租费","1562"],["200708","2.13","小灵通来电显示月租费","1562"],["200710","45","月租费","1562"],["200710","9","小灵通来电显示月租费","1562"],["200711","15","月租费","1562"],["200711","3","小灵通来电显示月租费","1562"]];
	var result = ArrayCount(src,[0],2,1);
	document.write(Ext.util.JSON.encode(result.items)+'<br>');
	for(var i=0;i<result.data.length;i++)
		document.write(Ext.util.JSON.encode(result.data[i])+'<br>');
	document.write('总计：'+result.total+'<br>');

*例子2：
	var src = [{"10610":"1565","10632":"IP国内长话费","10631":"200709","10633":".3"},{"10610":"1565","10632":"小灵通区间费","10631":"200709","10633":"8.63"},{"10610":"1565","10632":"国内长途通话费","10631":"200709","10633":"14.7"},{"10610":"1565","10632":"小灵通区间（电信）费","10631":"200709","10633":".2"},{"10610":"1565","10632":"总额优惠","10631":"200710","10633":"5"},{"10610":"1565","10632":"酷铃月租费","10631":"200710","10633":"5"},{"10610":"1565","10632":"总额优惠","10631":"200711","10633":"5"},{"10610":"1565","10632":"酷铃月租费","10631":"200711","10633":"5"},{"10610":"1565","10632":"酷铃月租费","10631":"200712","10633":"5"}];
	var result = ArrayCount(src,['10631','10610'],'10632','10633');
	document.write(Ext.util.JSON.encode(result.items)+'<br>');
	for(var i=0;i<result.data.length;i++)
		document.write(Ext.util.JSON.encode(result.data[i])+'<br>');
	document.write('总计：'+result.total+'<br>');
*/
function ArrayCount(src,staticCol,itemCol,valueCol){
	var des = [];
	var items = [];
	var itemCount = 0;
	var staticColLength = staticCol.length;
	var total = 0;

	//获取所有的汇总项
	for(var i=0;i<src.length;i++){
		if(items.indexOf(src[i][itemCol]) < 0){
			items[itemCount++] = src[i][itemCol];
		}
	}
	
	//获取返回的记录数组
	var lastRow = [];
	var index = -1;
	var value = 0;
	for(var i=0;i<src.length;i++){
		var o = [];
		//先取得所有固定列的值
		for(var j=0;j<staticColLength;j++){
			o[j] = src[i][staticCol[j]];
			if(o[j] != lastRow[j]){
				lastRow = o;
				des.push(lastRow);
			}
		}
		//补0
		for(var j = 0;j<=itemCount;j++)
			if(!lastRow[j+staticColLength])
				lastRow[j+staticColLength] = 0;
		//向数组中填数
		index = items.indexOf(src[i][itemCol])+staticColLength;
		value = parseFloat(src[i][valueCol]) * 100;
		lastRow[index] = (lastRow[index]*100 + value)/100;
		//计算合计值
		lastRow[staticColLength + itemCount] = (lastRow[staticColLength + itemCount] * 100 +value)/100; 
		//计算总计值
		total = (total *100 + value)/100;
	}
	return {data:des,items:items,total:total};
}
/*
* 功能：返回月份字典数据
* 例子：store: new Ext.data.JsonStore({
				data: getDictMonth(24),
				fields: [{name: 'DICT_ID'},{name: 'DICT_NAME'}],
				autoLoad: true
			})
*/
function getDictMonth(monthCount){
	var month = [];
	for(var i = 1; i <= monthCount;i ++){
		var tempMonth = (new Date()).add(Date.MONTH, -i).format('Ym');
		month.push({DICT_ID:tempMonth,DICT_NAME:tempMonth});
	}
	return month;
}
/**
 * allows for downloading of grid data (store) directly into excel
 * 例子：				var form = Ext.getDom('frmExportResult');
					form.fileType.value = '.xls';
					form.fileData.value = grid.getExcelXml();
					form.submit();
 */
Ext.override(Ext.grid.GridPanel, {
    getExcelXml: function(includeHidden) {
        var worksheet = this.createWorksheet(includeHidden);
        var totalWidth = this.getColumnModel().getTotalWidth(includeHidden);
        return '<xml version="1.0" encoding="utf-8">' +
            '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office">' +
            '<o:DocumentProperties><o:Title>data</o:Title></o:DocumentProperties>' +
            '<ss:ExcelWorkbook>' +
                '<ss:WindowHeight>' + worksheet.height + '</ss:WindowHeight>' +
                '<ss:WindowWidth>' + worksheet.width + '</ss:WindowWidth>' +
                '<ss:ProtectStructure>False</ss:ProtectStructure>' +
                '<ss:ProtectWindows>False</ss:ProtectWindows>' +
            '</ss:ExcelWorkbook>' +
            '<ss:Styles>' +
                '<ss:Style ss:ID="Default">' +
                    '<ss:Alignment ss:Vertical="Top" ss:WrapText="1" />' +
                    '<ss:Font ss:FontName="arial" ss:Size="10" />' +
                    '<ss:Borders>' +
                        '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top" />' +
                        '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom" />' +
                        '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left" />' +
                        '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right" />' +
                    '</ss:Borders>' +
                    '<ss:Interior />' +
                    '<ss:NumberFormat />' +
                    '<ss:Protection />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="title">' +
                    '<ss:Borders />' +
                    '<ss:Font />' +
                    '<ss:Alignment ss:WrapText="1" ss:Vertical="Center" ss:Horizontal="Center" />' +
                    '<ss:NumberFormat ss:Format="@" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="headercell">' +
                    '<ss:Font ss:Bold="1" ss:Size="10" />' +
                    '<ss:Alignment ss:WrapText="1" ss:Horizontal="Center" />' +
                    '<ss:Interior ss:Pattern="Solid" ss:Color="#A3C9FF" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="even">' +
                    '<ss:Interior ss:Pattern="Solid" ss:Color="#FFFFFF" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evendate">' +
                    '<ss:NumberFormat ss:Format="[ENG][$-409]dd\-mmm\-yyyy;@" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evenint">' +
                    '<ss:NumberFormat ss:Format="0" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evenfloat">' +
                    '<ss:NumberFormat ss:Format="0.00" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="odd">' +
                    '<ss:Interior ss:Pattern="Solid" ss:Color="#CAFFC0" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="odddate">' +
                    '<ss:NumberFormat ss:Format="[ENG][$-409]dd\-mmm\-yyyy;@" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="oddint">' +
                    '<ss:NumberFormat ss:Format="0" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="oddfloat">' +
                    '<ss:NumberFormat ss:Format="0.00" />' +
                '</ss:Style>' +
            '</ss:Styles>' +
            worksheet.xml +
            '</ss:Workbook></xml>';
    },

    createWorksheet: function(includeHidden) {
	// Calculate cell data types and extra class names which affect formatting
        var cellType = [];
        var cellTypeClass = [];
        var cm = this.getColumnModel();
        var totalWidthInPixels = 0;
        var colXml = '';
        var headerXml = '';
        for (var i = 0; i < cm.getColumnCount(); i++) {
            if ((includeHidden || !cm.isHidden(i))&&(cm.getDataIndex(i) != '')) {
                var w = cm.getColumnWidth(i)
                totalWidthInPixels += w;
                colXml += '<ss:Column ss:AutoFitWidth="1" ss:Width="' + w + '" />';
                headerXml += '<ss:Cell ss:StyleID="headercell">' +
                    '<ss:Data ss:Type="String">' + cm.getColumnHeader(i) + '</ss:Data>' +
                    '<ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>';
                var fld = this.store.recordType.prototype.fields.get(cm.getDataIndex(i));
                switch(fld.type) {
                    case "int":
                        cellType.push("Number");
                        cellTypeClass.push("int");
                        break;
                    case "float":
                        cellType.push("Number");
                        cellTypeClass.push("float");
                        break;
                    case "bool":
                    case "boolean":
                        cellType.push("String");
                        cellTypeClass.push("");
                        break;
                    case "date":
                        cellType.push("DateTime");
                        cellTypeClass.push("date");
                        break;
                    default:
                        cellType.push("String");
                        cellTypeClass.push("");
                        break;
                }
            }
        }
        var visibleColumnCount = cellType.length;

        var result = {
            height: 9000,
            width: Math.floor(totalWidthInPixels * 30) + 50
        };

		// Generate worksheet header details.
        var t = '<ss:Worksheet ss:Name="data">' +
            '<ss:Names>' +
                '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'data\'!R1:R2" />' +
            '</ss:Names>' +
            '<ss:Table x:FullRows="1" x:FullColumns="1"' +
                ' ss:ExpandedColumnCount="' + visibleColumnCount +
                '" ss:ExpandedRowCount="' + (this.store.getCount() + 1) + '">' +
                colXml +
                '<ss:Row ss:AutoFitHeight="1">' +
                headerXml +
                '</ss:Row>';

		// Generate the data rows from the data in the Store
        for (var i = 0, it = this.store.data.items, l = it.length; i < l; i++) {
            t += '<ss:Row>';
            var cellClass = (i & 1) ? 'odd' : 'even';
            r = it[i].data;
            var k = 0;
            for (var j = 0; j < cm.getColumnCount(); j++) {
	            if ((includeHidden || !cm.isHidden(j))&&(cm.getDataIndex(j) != '')) {
                    var v = r[cm.getDataIndex(j)];
                    t += '<ss:Cell ss:StyleID="' + cellClass + cellTypeClass[k] + '"><ss:Data ss:Type="' + cellType[k] + '">';
                        if (cellType[k] == 'DateTime') {
                            t += v.format('Y-m-d');
                        } else {
                            t += v;
                        }
                    t +='</ss:Data></ss:Cell>';
                    k++;
                }
            }
            t += '</ss:Row>';
        }

        result.xml = t + '</ss:Table>' +
            '<x:WorksheetOptions>' +
                '<x:PageSetup>' +
                    '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />' +
                    '<x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" />' +
                    '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />' +
                '</x:PageSetup>' +
                '<x:FitToPage />' +
                '<x:Print>' +
                    '<x:PrintErrors>Blank</x:PrintErrors>' +
                    '<x:FitWidth>1</x:FitWidth>' +
                    '<x:FitHeight>32767</x:FitHeight>' +
                    '<x:ValidPrinterInfo />' +
                    '<x:VerticalResolution>600</x:VerticalResolution>' +
                '</x:Print>' +
                '<x:Selected />' +
                '<x:DoNotDisplayGridlines />' +
                '<x:ProtectObjects>False</x:ProtectObjects>' +
                '<x:ProtectScenarios>False</x:ProtectScenarios>' +
            '</x:WorksheetOptions>' +
        '</ss:Worksheet>';
        return result;
    }
});

Ext.apply(Ext.form.VTypes,
{
	loginname:function(val,field)
	{
		var reg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
		if(!reg.test(val))
		{
			return false;
		}
		return true;
	},
	loginnameText:'字母开头，允许5-16字节，允许字母数字下划线',
	
	
	password: function(val, field)
	{
		if (field.initialPassField)
		{
			var pwd = Ext.getCmp(field.initialPassField);
			return (val == pwd.getValue());
		}
		return true;
	},
	passwordText: '两次输入的密码不一致！',
	
	chinese:function(val,field)
	{
		var reg = /^[\u4e00-\u9fa5]+$/i;
		if(!reg.test(val))
		{
			return false;
		}
		return true;
	},
	chineseText:'请输入中文',
	
	age:function(val,field)
	{
		try
		{
			if(parseInt(val) >= 18 && parseInt(val) <= 100)
				return true;
			return false;
		}
		catch(err)
		{
			return false;
		}
	},
	ageText:'年龄输入有误',
	
	alphanum:function(val,field)
	{
		try
		{
			if(!/\W/.test(val))
				return true;
			return false;
		}
		catch(e)
		{
			return false;
		}
	},
	alphanumText:'请输入英文字母或是数字,其它字符是不允许的.',
	
	url:function(val,field)
	{
		try
		{
			if(/^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(val))
				return true;
			return false;
		}
		catch(e)
		{
			return false;
		}
	},
	urlText:'请输入有效的URL地址.',
	
	max:function(val,field)
	{
		try
		{
			if(parseFloat(val) <= parseFloat(field.max))
				return true;
			return false;
		}
		catch(e)
		{
			return false;
		}
	},
	maxText:'超过最大值',
	
	min:function(val,field)
	{
		try
		{
			if(parseFloat(val) >= parseFloat(field.min))
				return true;
			return false;
		}
		catch(e)
		{
			return false;
		}
	},
	minText:'小于最小值',
		
	datecn:function(val,field)
	{
		try
		{
			var regex = /^(\d{4})-(\d{2})-(\d{2})$/;
			if(!regex.test(val)) return false;
			var d = new Date(val.replace(regex, '$1/$2/$3'));
			return (parseInt(RegExp.$2, 10) == (1+d.getMonth())) && (parseInt(RegExp.$3, 10) == d.getDate())&&(parseInt(RegExp.$1, 10) == d.getFullYear());
		}
		catch(e)
		{
			return false;
		}
	},
	datecnText:'请使用这样的日期格式: yyyy-mm-dd. 例如:2008-06-20.',
	
	integer:function(val,field)
	{
		try
		{
			if(/^[-+]?[\d]+$/.test(val))
				return true;
			return false;
		}
		catch(e)
		{
			return false;
		}
	},
	integerText:'请输入正确的整数',
	
	minlength:function(val,field)
	{
		try
		{
			if(val.length >= parseInt(field.minlen))
				return true;
			return false
		}
		catch(e)
		{
			return false;
		}
	},
	minlengthText:'长度过小',
	
	maxlength:function(val,field)
	{
	   try
	   {
		if(val.length <= parseInt(field.maxlen))
			return true;
		return false;
	   }
	   catch(e)
	   {
		return false;
	   }
	},
	maxlengthText:'长度过大',
	
	ip:function(val,field)
	{
		try
		{
			if((/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(val)))
				return true;
			return false;
		}
		catch(e)
		{
			return false;
		}
	},
	ipText:'请输入正确的IP地址',
	
	phone:function(val,field)
	{
		try
		{
			if(/^((0[1-9]{3})?(0[12][0-9])?[-])?\d{6,8}$/.test(val))
				return true;
			return false;
		}
		catch(e)
		{
			return false;
		}
	},
	phoneText:'请输入正确的电话号码,如:0431-29392929',
	
	mobilephone:function(val,field)
	{
		try
		{
			if(/(^0?[1][35][0-9]{9}$)/.test(val))
				return true;
			return false;
		}
		catch(e)
		{
			return false;
		}
	},
	mobilephoneText:'请输入正确的手机号码',
	
	alpha:function(val,field)
	{
		try
		{
			if( /^[a-zA-Z]+$/.test(val))
				return true;
			return false;
		}
		catch(e)
		{
			return false;
		}
	},
	alphaText:'请输入英文字母'
});
/*
* 功能：处理小数点多于两位的方法
*/
function formatData(str){
	str = str+'';
	if(str.indexOf ('.') >-1){
		if(str.substring(str.indexOf ('.')+1).length > 2){
			var m = 1;
			var tempNum = str;
			for(var i=1;i <= 2;i++){
				m = m * 10;
		    }
		    tempNum = tempNum * m;
			tempNum = Math.round(tempNum);
			str = tempNum / m;
		}
	}
	return str;
} 