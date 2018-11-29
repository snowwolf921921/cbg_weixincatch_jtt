
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
	minlengthText:'长度过小'
	
});
