<!DOCTYPE html>
<html>
<head>
	<title>OCT文件浏览系统</title>

	<link href="__PUBLIC__/metro/css/metro.min.css" rel="stylesheet">

	
	<script src="__PUBLIC__/js/jquery-2.1.1.min.js" type="text/javascript"></script>
	<script src="__PUBLIC__/metro/js/metro.min.js" type="text/javascript"></script>
	<script type="text/javascript">
		$(document).ready(function(){
		    var filePanel = $("#filePanel");
		    var backStepId = 0;

		    query(0);

		    function query(id){
		        $.post(
		            '/bgidb/oct/octFileAjax',
		            {parent : id},
		            function(data){
		                //console.log(data);
		                if(data['wrongcode']==999){
		            		backStepId = data['backStepId'];
		                    var files = data['files'];
		                    filePanel.html(formatFiles(files));
		                    boundListener();
		                }else{
		                    alert(data['wrongmsg']);
		                }
		            },
		            "json");
		    }

		    function formatFolder(file){
                //backStepId = file.parent;
		        return '<div class="list octFolder" folderId="' + file.id + '" folderParentId="' + file.parent + '" ><img src="/Public/metro/images/folder-images.png" class="list-icon"><span class="list-title">'+ file.nodename +'</span></div>';
		    }

		    function formatImg(file){
		        return '<div class="list octImage" name="' + file.nodename + '"><img src="' + file.imgsite + '" class="list-icon"><span class="list-title">'+ file.nodename +'</span></div>';
		    }

		    function formatStepBack(){
		        return  '<div class="list stepBack"><span class="list-icon icon-font-icon">..</span><span class="list-title">上级目录</span></div>';
		    }

		    function formatFiles(files){


		        var re = "";

		        re += formatStepBack(files);

		        for(var i = 0; i < files.length; i++){
		            var file = files[i];
		            if(file.leaf == 0){
		                re += formatFolder(file);
		            }
		            else{
		                re += formatImg(file);
		            }
		        }
		        return re;
		    }

		    function boundListener(){
		        $(".octImage").click(function(){
		            var nodeName = $(this).attr('name');
		            $("#input").val(nodeName);
		            $("#uploadAgent").submit();
		        })

		        $(".octFolder").click(function(){
		            var folderId = $(this).attr('folderId');
		            query(folderId);
		        })

		        $(".stepBack").click(function(){
		            query(backStepId);
		        })
		    }
		});


	</script>
</head>
<body>
	<div class="app-bar">
	    <a class="app-bar-element" href="__MODULE__/oct/octFileSys">OCT文件浏览系统</a>
   		<span class="app-bar-divider"></span>
	    <a class="app-bar-element" href="/">回到首页</a>
	</div>
	<form action="{:U('Bgidb/Oct/oct')}" enctype="multipart/form-data" method="post" id="uploadAgent" target='_blank' ">
		<input type="hidden" name="imageName" id="input"/>
	</form>

	<div class="listview " id="filePanel">
	</div>
</body>
</html>







