<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="keywords" content="html5, ui, library, framework, javascript" />
	
	<block name="TP_icon">
	</block>

	<block name="TP_title">
		<title>眼科图像数据库</title>
	</block>
	
	<include file="Public/base_css" /> 
	
	<link href="__PUBLIC__/css/gidb_admin.css" rel="stylesheet" type="text/css">
	
	
	<include file="Public/base_js" /> 
	
	<block name="TP_addjs">
	</block>
	
</head>
<block name="TP_body">
<body id="gidcbody">
<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
	<div class="container-fluid">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
			<span class="sr-only">Toggle navigation</span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#">CSU眼科图像数据库_管理后台</a>
		</div>
		<div class="navbar-collapse collapse">
			<ul class="nav navbar-nav">
				<li><a href="/">回到首页</a></li>
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
		</div>
	</div>
</div>
<div class="container-fluid">
	<div class="row">
		<div class="col-sm-3 col-md-2 sidebar">
			<ul class="nav nav-sidebar">
			<li><a href="__MODULE__/admin/adduser">添加用户</a></li>
<!-- 			<li><a href="__MODULE__/admin/manageuser">用户维护</a></li> -->
<!-- 			<li><a href="__MODULE__/admin/manageprivilege">权限管理</a></li> -->
			<li><a href="__MODULE__/admin/img_upload">批量导入眼底图片</a></li>
			<!-- <li><a href="__MODULE__/admin/oct_upload">批量导入OCT图片</a></li>-->
			<li><a href="__MODULE__/admin/multi_upload">文件夹批量导入OCT图片</a></li>
			<li><a href="__MODULE__/admin/oct_mark_upload">导入OCT人工标定图片</a></li>
			<li><a href="__MODULE__/admin/export_oct">导出OCT标定</a></li>
			</ul>
		</div>
		<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
			{__CONTENT__}
		</div>
	</div>
</div>
</body>
</block>
</html>



