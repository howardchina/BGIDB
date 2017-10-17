<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
	<meta name="keywords" content="html5, ui, library, framework, javascript" />
	
	<block name="TP_icon">
	</block>

	<block name="TP_title">
		<title id="page_title">眼科图像数据库</title>
	</block>
	
	<include file="Public/base_css" /> 
	
	<block name="TP_addcss">
	<link href="__PUBLIC__/css/gidb.css" rel="stylesheet" type="text/css">
	</block>
	
	<include file="Public/base_js" /> 
	
	<block name="TP_addjs">
	</block>
	
</head>
<block name="TP_body">
<body id="gidcbody">

<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
			<span class="sr-only">Toggle navigation</span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="/" id="top_nav_title">CSU眼科图像数据库</a>
		</div>
		<div class="navbar-collapse collapse">
			<ul class="nav navbar-nav">
				<li class="active"><a href="/" id="top_nav_mainpage">主页</a></li>
				<li><a href="__MODULE__/tab/tab" id="top_nav_calibration">标定系统</a></li>
				<!-- <li><a href="__MODULE__/oct/oct" id="top_nav_oct">OCT标定</a></li> -->
				<li><a href="__MODULE__/oct/octFileSys" id="top_nav_octFileSys">OCT文件系统</a></li>
				<!-- <li><a href="/" id="top_nav_algorithm">算法检验系统</a></li>
				<li><a href="/" id="top_nav_screening">筛查系统</a></li>
				<li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="top_nav_about">关于</a>
					<ul class="dropdown-menu" role="menu">
					<li><a href="#">Action</a></li>
					<li><a href="#">Another action</a></li>
					<li><a href="#">Something else here</a></li>
					<li class="divider"></li>
					<li class="dropdown-header">Nav header</li>
					<li><a href="#">Separated link</a></li>
					<li><a href="#">One more separated link</a></li>
					</ul>
				</li> -->
				<li><a href="#" id="top_nav_zh">中文</a></li>
				<li><a href="#" id="top_nav_en">English</a></li>
				<?php if(IsAdmin()) { ?>
				<li><a href="__MODULE__/admin" id="top_nav_admin">后台管理</a></li>
				<?php } ?>
			</ul>
			<?php if(IsLoggedin()) { $gidb_uid = session('gidb_uid'); ?>
			<ul id="navBar-right" class="nav navbar-nav navbar-right">
				<li class="dropdown">
				<a href="#" class="dropdown-toggle" style="margin-bottom:-5px" data-toggle="dropdown">
					<span class="glyphicon glyphicon-th-large"></span>&nbsp;&nbsp;{$gidb_uid}
				</a>
				<ul class="dropdown-menu">
					
					<li><a href="__MODULE__/user/userinfo">个人资料</a></li>
					<!-- TODO:	Dashboard	-->
					<li><a href="__MODULE__/user/modify">修改信息</a></li>
					<li class="divider"></li>
					<li onclick="IndexLogoutAjaxSubmit()" ><a>登出</a></li>
				</ul>
				</li>
			</ul>
			<?php } else { ?>
			<div class="navbar-form navbar-right">
				<a class="btn btn-primary" href="__MODULE__/user/login">登录</a>
			</div>
			<?php }?>
			
		</div><!--/.nav-collapse -->
	</div>
</div>
<div class="container theme-showcase" role="main" id="main_body">
	{__CONTENT__}
</div>
</body>
</block>
</html>



