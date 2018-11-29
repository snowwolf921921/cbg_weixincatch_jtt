Ext.namespace("Ext.ux");
Ext.namespace("Ext.ux.form");
Ext.ux.form.UniqueField = Ext.extend(Ext.form.Textfield,  {
	tooltip:{},   
    onRender:function(ct, position){   
        Fairies.form.TextField.superclass.onRender.call(this, ct, position);   
        if(this.tooltip.text)   
            new Ext.ToolTip({target:this.id,trackMouse:false,draggable:true,maxWidth:200,minWidth:100,title:this.tooltip.title,html:this.tooltip.text});   
    }  
})
Ext.reg('uniquefield', Ext.ux.form.UniqueField );
