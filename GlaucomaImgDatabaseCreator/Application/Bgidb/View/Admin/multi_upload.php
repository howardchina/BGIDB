
<!-- <script src="__PUBLIC__/js/jquery-2.1.1.min.js" type="text/javascript"></script> -->
<input type="file" name="multi_upload[]" id="multi_upload" multiple webkitdirectory />
<button id="btn">上传</button> 
<div id="info">
	<h3>引导：</h3>
	1.点击【选择文件】按钮；<p>
	2.在【弹出框】中选择【病人文件夹的上一级文件夹】，名字随意（最外层文件夹不会传到后台）；<br>
	<img src="__PUBLIC__/guide/e1.jpg"><br>
	3.点击【上传】按钮。

</div>

<script type="text/javascript">
	$("#btn").click(function(){
		uploadFiles($("#multi_upload")[0].files);
	});
	function uploadFiles(files){
		// Create a new HTTP requests, Form data item (data we will send to the server) and an empty string for the file paths.
		xhr = new XMLHttpRequest();
		data = new FormData();
		var paths = new Array();
		
		// Set how to handle the response text from the server
		
		xhr.onreadystatechange = function(ev){
			if (xhr.readyState == 4){
				$("#info").html(xhr.responseText);
			}
		};
		
		// Loop through the file list
		for (var i in files){
			if (typeof files[i] != 'object'){
				continue;
			}
			// Append the current file path to the paths variable (delimited by tripple hash signs - ###)
			paths.push(files[i].webkitRelativePath);
			//paths += files[i].webkitRelativePath+"###";
			// Append current file to our FormData with the index of i
			data.append(i, files[i]);
		};
		// Append the paths variable to our FormData to be sent to the server
		// Currently, As far as I know, HTTP requests do not natively carry the path data
		// So we must add it to the request manually.
		data.append('paths', paths);
			
		// Open and send HHTP requests to upload.php
		xhr.open('POST', "/bgidb/Data/multiuploadify", true);
		xhr.send(this.data);
	}
</script>
