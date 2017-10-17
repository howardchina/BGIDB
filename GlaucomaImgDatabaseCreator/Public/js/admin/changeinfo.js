$(document).ready(function ()
{
	var pjaxflag = false;
	$(document).on('pjax:end', function() {
		ondo_changeinfo();
		pjaxflag = true;
	})
	if(!pjaxflag)
		ondo_changeinfo();
	
})
function ondo_changeinfo()
{
	$('#selectsex').unbind('dropdown').dropdown();
	$('#selectdegree').unbind('dropdown').dropdown();
	$('#selectinstitute').unbind('dropdown').dropdown();
	$('#selectmajor').unbind('dropdown').dropdown();
	$('#selectkind').unbind('dropdown').dropdown();
	$('#selectgraduate').unbind('dropdown').dropdown();


	$('#changeinfo_form').unbind("ajaxForm").ajaxForm();
    $('#changeinfo_form').unbind("submit").submit(function(){
    	ChangeinfoAjaxSubmit();
    	return false;
    });
}
function ChangeinfoAjaxSubmit()
{
    $('#changeinfo_form').ajaxSubmit(function(data){
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