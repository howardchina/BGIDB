<div class="jumbotron">
	<h3>批量添加帐号</h3>
	每行一个用户，内容为：ID、姓名、密码，由'$'或制表符[tab]隔开。<br/>
	例：<br/>
	1246xxxxx	张xx		123456<br/>
	1246xxxxx$张xx$123456<br/>
	ID重复或已存在于系统中，将由新信息覆盖之前的信息。ID和姓名为必填，之后的内容可不填，不填密码则默认为与ID相等。<br/>
</div>

<form id="adduser_form" action="__MODULE__/admin/adduser_ajax" method="post">
	<div id="adduser_div" class="form-group">
		<textarea id="adduser_textarea" name='adduser' class="form-control"></textarea>
	</div>
	<button id="adduser_submit" type="submit" class="ui blue labeled icon button">
		<i class="user icon"></i>提交
	</button>
</form>
<script type="text/javascript">
$(document).ready(function ()
{
	ondo_adduser();
});
function ondo_adduser()
{
    $('#adduser_form').submit(function(){
    	AdduserAjaxSubmit();
    	return false;
    });
}
function AdduserAjaxSubmit()
{
    $('#adduser_form').ajaxSubmit(function(data){
    	jsondata = data;
    	if(jsondata["wrongcode"] < 900)
        	alertify.error(jsondata["wrongmsg"]);
        else
        {
        	alertify.success( "增加:"+jsondata['add_cnt'] + "\\n 更新:" + jsondata['update_cnt'] + "\\n 失败:" + jsondata['fail_cnt']);
        }
        return false;
    });
    return false;
}
</script>