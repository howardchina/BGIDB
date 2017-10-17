$(document).ready(function(){
	//login
	$('#login_form').submit(function(){
		if($("#login_uid").val().length < 1)
		{
			alertify.error("请输入用户名");
			return false;
		}
		LoginAjaxSubmit();
		return false;
	});
});

//登录表单ajax提交
function LoginAjaxSubmit()
{
	$('#login_form').ajaxSubmit(function(data){
		jsondata = data;
		if(jsondata["wrongcode"] < 900)
			alertify.error( jsondata["wrongmsg"] );
		else
		{
			alertify.success("欢迎！登陆成功！");
			location.replace(document.referrer);
		}
	});
	return false;
}
/*!
 * IE10 viewport hack for Surface/desktop Windows 8 bug
 * Copyright 2014 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

// See the Getting Started docs for more information:
// http://getbootstrap.com/getting-started/#support-ie10-width
(function () {
	'use strict';
	if (navigator.userAgent.match('/IEMobile\/10\.0/')) {
	var msViewportStyle = document.createElement('style');
	msViewportStyle.appendChild(
		document.createTextNode(
		'@-ms-viewport{width:auto!important}'
		)
	);
	document.querySelector('head').appendChild(msViewportStyle);
	}
})();