$(document).ready(function ()
{
	var pjaxflag = false;
	$(document).on('pjax:end', function() {
		ondo_editannouncement();
		pjaxflag = true;
	})
	if(!pjaxflag)
		ondo_editannouncement();
})
function ondo_editannouncement()
{
	$('#editannouncement_form').unbind("ajaxForm").ajaxForm();
    $('#editannouncement_form').unbind("submit").submit(function(){
    	if($.trim($('#announcement_title').val()).length == 0)
    	{
        	alertify.error("标题不能为空");
        	return false;
    	}
    	EditannouncementAjaxSubmit();
    	return false;
    });
    $('#announcement_title').focus();
    
}
function EditannouncementAjaxSubmit()
{
    $('#editannouncement_form').ajaxSubmit(function(data){
    	jsondata = data;
    	if(jsondata["wrongcode"] != 999)
        	alertify.error(jsondata["wrongmsg"]);
        else
        {
        	alertify.success( "修改成功!");
        }
        return false;
    });
    return false;
}