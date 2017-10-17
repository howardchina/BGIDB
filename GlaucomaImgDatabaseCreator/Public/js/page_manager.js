//
//$(document).on('page:fetch',   function() { NProgress.start(); });
//$(document).on('page:change',  function() { NProgress.done(); });
//$(document).on('page:restore', function() { NProgress.remove(); });


$(document).ready(function(){
	//login
	$('#index_login_form').submit(function(){
		if($("#index_login_uid").val().length < 1)
		{
	    	alertify.error("请输入用户名");
	    	return false;
		}
		IndexLoginAjaxSubmit();
		return false;
    });
});
//登录表单ajax提交
function IndexLoginAjaxSubmit()
{
	$('#index_login_form').ajaxSubmit(function(data){
    	jsondata = data;
    	if(jsondata["wrongcode"] < 900)
	    	alertify.error( jsondata["wrongmsg"] );
        else
        {
			window.location.href="/";
        }
    });
	return false;
}
//登出表单ajax提交
function IndexLogoutAjaxSubmit()
{
	$.get(
		"/bgidb/user/logout_function", 
		function(data){
	    	jsondata = data;
	    	if(jsondata["valid"] == false)
	        	alertify.error(jsondata["retMsg"]);
	        else
	        {
				location.reload();
	        }
		},
		"json");
    return false;
}