<div class="jumbotron">
	<h1>欢迎!</h1>
	<p>本系统用于中南大学数字图像处理-眼科图像分析科研.</p>
	<p><a href="#" class="btn btn-primary btn-lg" role="button">了解更多 »</a></p>
	<div class="row">
	<?php
		if(!IsLoggedin())
		{
	?>
		<form id="index_login_form" class="form" method="POST" action="__MODULE__/user/login_function">
		<div class="form-group">
			<div class="col-md-3 no-left-padding">
				<input id="index_login_uid" maxlength="30" name="uid" placeholder="用户名" type="text" class="form-control input-lg"/>
			</div>
		</div>
		<div class="form-group">
			<div class="col-md-3 no-left-padding">
				<input id="index_login_passwd" maxlength="50" name="passwd" placeholder="密码" type="password" class="form-control input-lg"/>
			</div>
		</div>
		<div class="col-md-3">
			<div class="row">
			<button class="btn btn-primary btn-lg" type="submit">登录</button>
			</div>
		</div>
		</form>
	<?php
		}
	?>
	</div>
</div>