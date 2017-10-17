<div class='infotablediv'>
<form id="modify_form" action="__MODULE__/user/modify_ajax" method="post">
<table class="table table-bordered">
	<tbody>
	<tr>
		<th colspan="8">个人信息修改（{$strlist[$userinfo['kind']]}）：</th>
	</tr>
	<tr>
		<td class="info td_3w">姓名：</td>
		<td class="td_4w">
			<input class="form-control" name="name" type="text" placeholder="姓名..." value="{$userinfo['name']}">
		</td>
		<td class="info td_4w">帐号：</td>
		<td>{$userinfo['uid']}<input class="form-control" type="hidden" name="uid" value="{$userinfo['uid']}"/></td>
		<td class="info td_3w">性别：</td>
		<td>
			<select name="sex" class="form-control">
			<?php for($i = 81; $i <= 82; $i ++){ ?>
				<option value="{$i}" 
					<?php if($i == $userinfo['sex']) { ?>
					selected = "selected"
					<?php } ?>
				>{$strlist[$i]}</option>
			<?php } ?>
			</select>
		</td>
		<td class="info td_4w">学历：</td>
		<td>
			<select name="degree" class="form-control" value="{$strlist[$userinfo['degree']]}">
			<?php for($i = 10; $i <= 12; $i ++){ ?>
				<option value="{$i}" 
					<?php if($i == $userinfo['degree']) { ?>
					selected = "selected"
					<?php } ?>
				>{$strlist[$i]}</option>
			<?php } ?>
			</select>
		</td>
	</tr>
	<tr>
		<td class="info td_3w">民族：</td>
		<td >
			<input class="form-control" name="nation" type="text" placeholder="民族..." value="{$userinfo['nation']}">
		</td>	
		<td class="info td_4w">生日：</td>
		<td class="td_4w"> 
			<input class="form-control" name="birthday" type="date" value="{$userinfo['birthday']}"/>
		</td>
		<td class="info td_3w">手机号：</td>
		<td class="td_5w">
			<input class="form-control" name="phone" type="text" placeholder="手机号..." value="{$userinfo['phone']}">
		</td>
		<td class="info td_3w">邮箱：</td>
		<td>
			<input class="form-control" name="email" type="email" placeholder="xx@xx.xx" value="{$userinfo['email']}">
		</td>
	</tr>
	<tr>
		<td class="info td_3w">身份：</td>
		<td>
			<select name="kind" class="form-control" value="{$userinfo['kind']}">
			<?php for($i = 41; $i <= 48; $i ++){ ?>
				<option value="{$i}" 
					<?php if($i == $userinfo['kind']) { ?>
					selected = "selected"
					<?php } ?>
				>{$strlist[$i]}</option>
			<?php } ?>
			</select>
		</td>
		<td class="info td_4w">政治面貌：</td>
		<td>
			<input class="form-control" name="political" type="text" placeholder="党员、团员等..." value="{$userinfo['political']}">
		</td>
		<td class="info td_3w">证件：</td>
		<td colspan="3">
			<input class="form-control" name="idcard" type="text" placeholder="身份证号..." value="{$userinfo['idcard']}">
		</td>
	</tr>
	<tr>
		<td class="info td_3w">新密码：</td>
		<td >
				<input class="form-control" id='modify_passwd' name="passwd" type="password" placeholder="密码（不填写则不修改）...">
		</td>
		<td class="info td_3w">确认：</td>
		<td >
				<input class="form-control" id='modify_passwd_confirm' name="passwd_confirm" type="password" placeholder="密码确认...">
		</td>
		<td class="info td_3w">部门：</td>
		<td colspan="3">
			<input class="form-control" name="institute" type="text" placeholder="所在部门..." value="{$userinfo['institute']}">
		</td>
	</tr>
	<tr>
		<td colspan="8">自我介绍：</td>
	</tr>
	<tr>
		<td colspan="8">
			<textarea name="selfintro" class="form-control" rows="10" >{$userinfo['selfintro']}</textarea>
		</td>
	</tr>
	</tbody>
	<tfoot>
		<tr>
			<th colspan="8">
				<button id="modify_submit"  type="submit" class="btn btn-default">
					提交
				</button>
			</th>
		</tr>
	</tfoot>
</table>
</form>
</div>
<script src="__PUBLIC__/js/user/modify.js" type="text/javascript"></script>