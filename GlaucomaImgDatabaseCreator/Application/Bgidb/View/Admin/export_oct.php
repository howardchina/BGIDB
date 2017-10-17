<!-- <script src="__PUBLIC__/js/jquery-2.1.1.min.js" type="text/javascript"></script> -->

<form action="/bgidb/oct/countOct">
	<div class="input-group input-group-lg">
	  	<input type="text" class="form-control" placeholder="输入合法的用户uid，下载该用户合法的已标定图层数据" aria-describedby="sizing-addon1" name="uid">
	  	<span class="input-group-btn">
	    	<button class="btn btn-default" type="submit">检出</button>
	    </span>
	</div>
	<!--
	<div class="panel panel-default">
		<div class="panel-body" id='pa'>
		</div>
	</div>
	-->
</form>


<script type="text/javascript">
	$(document).ready(function(){

		function JSONstringify(Json){
		    if($.browser.msie){
		       if($.browser.version=="7.0"||$.browser.version=="6.0"){
		          var  result=jQuery.parseJSON(Json);
		       }else{
		          var result=JSON.stringify(Json);  
		       }       
		    }else{
		        var result=JSON.stringify(Json);           
		    }
		    return result;
		}
		/*
		$("#countOct").click(function(){

			$.post(
				'/bgidb/oct/countOct', 
				{uid: $("#txt").val()},
				function(data){
				    if(data['wrongcode']==999){
				    	alertify.success("获取到");
				    	$("#txt").val("包含"+ data['re'].length +"条记录");
				    	
				    	$('#pa').html(JSONstringify(data['re']));
				    	console.log(data['re']);
				    }
				    else alertify.error(data['wrongmsg']);
				},
				"json");
		});*/

	});
</script>