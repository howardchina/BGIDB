
<div class="container-fluid" id='canvas_tools'>
	<div class="row">
		<button type="button" id="tab_prePic" class="col-lg-1 btn btn-success">上一张</button>
		<button type="button" id="tab_nextPic" class="col-lg-1 btn btn-success">下一张</button>
      	<form class="col-lg-3 form-inline" role="form" method="post">
			<input name="imageId" id="tab_picID" type="text" class="form-control input-small" placeholder="图像编号">
			<button type="button" id="tab_forPic" class="btn btn-success">跳转</button>
      	</form>
		<!-- <button type="button" class="col-lg-1 btn btn-success" id="tab_statue">编辑</button>-->
		<!-- <button type="button" class="col-lg-1 btn btn-success" id="tab_fullScreen">全屏</button>-->
		<button type="button" class="col-lg-1 btn btn-success" id="tab_already">读取</button>
		<button type="button" class="col-lg-1 btn btn-success" id="tab_save">保存</button>
		<!-- <form class="col-lg-3 form-inline" role="form">
			<input name="note" type="text" class="form-control" placeholder="专家注释..." id="tab_note">
		</form>
		-->
		<form class="col-lg-1 form-inline" role="form">
			<p class="form-control-static" id="tool_state"></p>
		</form>
	</div>
</div>
<div id="movecontainer" style="position:absolute;top:100px;left:50px;z-index:20;background-color: Teal;border-radius:5px;">
	<p id="floatingToolbox" style="text-align:center;padding:2px;color:White;">按住此处拖动</p>
	<button type="button" class="btn btn-success" id="btn_hand">
		<span class="glyphicon glyphicon-hand-down"></span> 手指工具
	</button>
	<br/>
	<button type="button" class="btn btn-success" id="btn_pencil">
		<span class="glyphicon glyphicon-pencil"></span> 铅笔工具
	</button>
	<br/>
	<button type="button" class="btn btn-success" id="btn_eraser">
		<span class="glyphicon glyphicon-screenshot"></span> 橡皮工具
	</button>
	<br/>
	<button type="button" class="btn btn-success" id="btn_modification">
		<span class="glyphicon glyphicon-screenshot"></span> 修改工具
	</button>
	<br/>
	<button type="button" class="btn btn-success" id="btn_list" data-toggle="modal" data-target="#layerModal">
		<span class="glyphicon glyphicon-list"></span> 图层列表
	</button>
	<br/>
	<button type="button" class="btn btn-success" id="btn_release">
		<span class="glyphicon glyphicon-pushpin"></span> 释放工具
	</button>
	<br/>
	<button type="button" class="btn btn-success" id="btn_preview">
		<span class="glyphicon glyphicon-eye-open"></span> 预览图层
	</button>

	<!--<button type="button" class="btn btn-success" id="btn_export">
		<span class="glyphicon glyphicon-pushpin"></span> 导出当前
	</button>
	-->
	
	<!-- <br/>
	<button type="button" class="btn btn-success" id="btn_plus"  data-toggle="modal" data-target="#newLayerModal">
		<span class="glyphicon glyphicon-plus"></span> 新建图层
	</button>
	<br/>
	<button type="button" class="btn btn-success" id="btn_clear">
		<span class="glyphicon glyphicon-trash"></span> 清空图层
	</button>
	-->
</div>
<div class="row">
	<div class="col-lg-12 col-md-12" id="canvas_container">
		<canvas id="tab_canvas" style="border:1px solid #d3d3d3;background:#ffffff;z-index=0;">
			您的浏览器不支持canvas！
		</canvas>
	</div>
	
</div>

<!-- Modal -->
<div class="modal fade" id="layerModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      	<div class="modal-header">
        	<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        	<h4 class="modal-title" id="myModalLabel">图层列表 - 详细设置</h4>
      	</div>
      	<div class="modal-body" id="layerModalBody">
	  		<div class="input-group input-group-lg">
	  			<input type="text" class="form-control" value="图层1">
				<span class="input-group-addon">
					<input type="checkbox">
				</span>
				<span class="input-group-addon">
					<input type="radio" name="layerRadio">
				</span>
		  		<span class="input-group-btn">
	        		<button class="btn btn-default" type="button">删除</button>
	    		</span>
			</div>
      	</div>
      	<div class="modal-footer">
      		<button type="button" class="btn btn-primary" id="btnCreateNewLayer" data-toggle="modal" data-target="#newLayerModal">新建图层</button>
        	<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        	<button type="button" class="btn btn-primary" id="layerModalSave">确定</button>
      	</div>
    </div>
  </div>
</div>

<div class="modal fade" id="newLayerModal" tabindex="-1" role="dialog" aria-labelledby="myNewModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      	<div class="modal-header">
        	<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        	<h4 class="modal-title" id="myNewModalLabel">新建图层(不要用中文字符)</h4>
      	</div>
      	<div class="modal-body" id="newLayerModalBody">
	  		<div class="input-group input-group-lg">
	  			<input type="text" class="form-control" id="newLayerName" value="new layer" placeholder="set name for your layer">
			</div>
      	</div>
      	<div class="modal-footer">
        	<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        	<button type="button" class="btn btn-primary" id="newLayerModalSave">确定</button>
      	</div>
    </div>
  </div>
</div>

<br/>
<br/>
<br/>
<!-- 用不会在前端显示的控件来存放后台传来的数据，供js获取 -->
<imginfo id="imginfo" imgid="{$imginfo['id']}" imgurl="{$imginfo['imgsite']}" ></imginfo>
<!--
<script type="text/javascript">
	$imgurl = $('#imginfo').attr('imgurl');
	alertify.alert($imgurl);
</script>
-->
<script src="__PUBLIC__/js/jquery.hotkeys.js" type="text/javascript"></script>
<script src="__PUBLIC__/js/oct/oct.js" type="text/javascript"></script>

