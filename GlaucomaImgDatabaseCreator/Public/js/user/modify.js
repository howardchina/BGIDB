$(document).ready(function ()
{
	ondo_modify();
});
function ondo_modify()
{
	$('#modify_form').submit(function(){
    	passwdlen = $.trim($('#modify_passwd').val()).length;
    	if(passwdlen != 0 && passwdlen < 6)
    	{
        	alertify.error("密码长度不能小于6位");
        	return false;
    	}
    	else if($('#modify_passwd').val() != $('#modify_passwd_confirm').val())
    	{
        	alertify.error("两次密码不相等");
        	return false;
    	}
    	ModifyAjaxSubmit();
    	return false;
    });
}
function ModifyAjaxSubmit()
{
    $('#modify_form').ajaxSubmit(function(data){
    	jsondata = data;
    	if(jsondata["wrongcode"] == 72)
        	alertify.log(jsondata["wrongmsg"]);
    	else if(jsondata["wrongcode"] == 81)
        	alertify.error('输入导师的姓名和所输入帐号对应导师的姓名不相符');
    	else if(jsondata["wrongcode"] != 999)
        	alertify.error(jsondata["wrongmsg"]);
        else
        {
        	alertify.success( "用户信息更新成功!");
        }
        return false;
    });
    return false;
}