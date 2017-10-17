<div class="container">

	<form id="login_form" class="form-signin" role="form" method="POST" action="__MODULE__/user/login_function">
	<h2 class="form-signin-heading">请登录</h2>
	<input id='login_uid' type="text" maxlength="30" name="uid" class="form-control" placeholder="用户名..." required autofocus>
	<input type="password" maxlength="50" name="passwd" class="form-control" placeholder="密码..." required>
<!-- 	<div class="checkbox"> -->
<!-- 		<label> -->
<!-- 		<input type="checkbox" value="remember-me"> Remember me -->
<!-- 		</label> -->
<!-- 	</div> -->
	<button class="btn btn-lg btn-primary btn-block" type="submit">登录</button>
	</form>

</div> <!-- /container -->

<script src="__PUBLIC__/js/user/login.js" type="text/javascript"></script>