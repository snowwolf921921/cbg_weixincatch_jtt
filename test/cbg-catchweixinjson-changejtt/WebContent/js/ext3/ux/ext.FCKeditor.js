function getRootPath(){
	var strFullPath=window.document.location.href;
	var strPath=window.document.location.pathname;
	var pos=strFullPath.indexOf(strPath);
	var prePath=strFullPath.substring(0,pos);
	var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
	return(prePath+postPath);
}


var oFCKeditorOptions = {
	BasePath : 'fckeditor/' ,
	Config : {
		BaseHref : window.location ,
		SkinPath : getRootPath()+'/fckeditor/editor/skins/office2003/' ,
		ProcessHTMLEntities : true ,
		ProcessNumericEntities : false
	},
	ToolbarSet : 'Default'
};

Ext.form.FCKeditor = function(config){
	this.config = config;
	Ext.form.FCKeditor.superclass.constructor.call(this, config);
	this.FCKid=0;
	this.MyisLoaded=false;
	this.MyValue='';
};

Ext.extend(Ext.form.FCKeditor, Ext.form.TextArea, {
	onRender : function(ct, position){
		if(!this.el){
			this.defaultAutoCreate = {
				tag: "textarea",
				style:"width:100px;height:60px;",
				autocomplete: "off"
			};
		}
		Ext.form.TextArea.superclass.onRender.call(this, ct, position);
		//Hide textarea to stop flashing up before FCKEditor renders.
		this.hideMode = "visibility"; // set hideMode to visibility, to retain height.
		this.hidden = true; // hide textarea
		
		if(this.grow){
			this.textSizeEl = Ext.DomHelper.append(document.body, {
				tag: "pre", cls: "x-form-grow-sizer"
			});
			if(this.preventScrollbars){
				this.el.setStyle("overflow", "hidden");
			}
			this.el.setHeight(this.growMin);
		}
		if (this.FCKid==0) this.FCKid=get_FCKeditor_id_value()
		setTimeout("loadFCKeditor('"+this.id+"',"+ this.config.height +");",100); //Change this.name to this.id 
	},
	setValue : function(value){
		this.MyValue=value;
		if (this.FCKid==0) this.FCKid=get_FCKeditor_id_value();
		// only after FCKeditor_OnComplete
		if (this.MyisLoaded){
			FCKeditorSetValue(this.FCKid,this.id,value); //Change this.name to this.id
		} else {
			//alert('MyisLoaded = false');
		}
		Ext.form.TextArea.superclass.setValue.apply(this,[value]);
	},
	
	getValue : function(){
		if (this.MyisLoaded){
			value=FCKeditorGetValue(this.id); //Change this.name to this.id
			Ext.form.TextArea.superclass.setValue.apply(this,[value]);
			if 	(Ext.form.TextArea.superclass.getValue(this))
			return Ext.form.TextArea.superclass.getValue(this);
			else return value;
		}else{
			return this.MyValue;
		}
	},
	
	getRawValue : function(){
			if (this.MyisLoaded){
				value=FCKeditorGetValue(this.id); //Change this.name to this.id
				Ext.form.TextArea.superclass.setRawValue.apply(this,[value]);
				return Ext.form.TextArea.superclass.getRawValue(this);
			}else{
				return this.MyValue;
			}
		}
});
Ext.reg('fckeditor', Ext.form.FCKeditor);


function loadFCKeditor(element, height){
	oFCKeditor = new FCKeditor( element );
	oFCKeditor.BasePath = oFCKeditorOptions.BasePath;
	oFCKeditor.ToolbarSet = oFCKeditorOptions.ToolbarSet;
	oFCKeditor.Config = oFCKeditorOptions.Config;
	oFCKeditor.Height = height;
	oFCKeditor.ReplaceTextarea();
}
function FCKeditor_OnComplete(editorInstance){

	Ext.getCmp(editorInstance.Name).MyisLoaded=true;
	//editorInstance.Events.AttachEvent('OnStatusChange' , function(){
		//Ext.getCmp(editorInstance.Name).setValue(Ext.getCmp(editorInstance.Name).value);
	//})
}
var FCKeditor_value=new Array();

function FCKeditorSetValue(id,name,value){
	if ((id!=undefined)&&(name!=undefined)){
		if (value!=undefined) FCKeditor_value[id]=value;
		else if (FCKeditor_value[id]==undefined) FCKeditor_value[id]='';
		var oEditor = FCKeditorAPI.GetInstance(name);
		// some trouble in Opera 9.50
		if(oEditor!=undefined) oEditor.SetData(FCKeditor_value[id]);
	}
}
function FCKeditorGetValue(name){
if ((id!=undefined)&&(name!=undefined)){
	data='';
	var oEditor = FCKeditorAPI.GetInstance(name);
	// some trouble in Opera 9.50:
	//
	// message: Statement on line 36: Cannot convert undefined or null to Object
	// oEditor.GetData();
	//
	if(oEditor!=undefined) data=oEditor.GetData();
	return data;
	}
}
var FCKeditor_id_value;

function get_FCKeditor_id_value(){
	if (!FCKeditor_id_value){
		FCKeditor_id_value=0;
	}
	FCKeditor_id_value=FCKeditor_id_value+1;
	return FCKeditor_id_value;
}
