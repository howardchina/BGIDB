<div class='infotablediv'>
<form id="modify_form" action="__MODULE__/user/modify_ajax" method="post">
<table class="table table-bordered">
	<tbody>
	<tr>
		<th colspan="8">个人信息（{$strlist[$userinfo['kind']]}）：</th>
	</tr>
	<tr>
		<td class="info td_3w">姓名：</td>
		<td class="td_4w">{$userinfo['name']}</td>
		<td class="info td_4w">帐号：</td>
		<td>{$userinfo['uid']}</td>
		<td class="info td_3w">性别：</td>
		<td>{$userinfo['sex_str']}</td>
		<td class="info td_4w">学历：</td>
		<td>{$userinfo['degree_str']}</td>
	</tr>
	<tr>
		<td class="info td_3w">民族：</td>
		<td >{$userinfo['nation']}</td>	
		<td class="info td_4w">生日：</td>
		<td class="td_4w">{$userinfo['birthday']}</td>
		<td class="info td_3w">手机号：</td>
		<td class="td_5w">{$userinfo['phone']}</td>
		<td class="info td_3w">邮箱：</td>
		<td>{$userinfo['email']}</td>
	</tr>
	<tr>
		<td class="info td_3w">身份：</td>
		<td>{$userinfo['kind_str']}</td>
		<td class="info td_4w">政治面貌：</td>
		<td>{$userinfo['political']}</td>
		<td class="info td_3w">证件：</td>
		<td colspan="3">{$userinfo['idcard']}</td>
	</tr>
	<tr>
		<td class="info td_3w">部门：</td>
		<td colspan="7">{$userinfo['institute']}</td>
	</tr>
	<tr>
		<td colspan="8">自我介绍：</td>
	</tr>
	<tr>
		<td colspan="8">
			{$userinfo['selfintro']}
		</td>
	</tr>
	</tbody>
</table>
</form>
</div>