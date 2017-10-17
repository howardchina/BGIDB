
<div class="container-fluid">
	<div class="row">
		<div class="col-lg-2 col-md-3 col-sm-3 col-xs-6 btn-group">
			<button type="button" id="tab_prePic" class="btn btn-success">上一张</button>
			<button type="button" id="tab_nextPic" class="btn btn-success">下一张</button>
		</div>
		<div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
		    <div class="input-group">
				<span class="input-group-addon" id="tab_picID_title">页面</span>
				<input name="number" id="tab_picID" type="text" class="form-control" placeholder="图像编号...">
		      	<span class="input-group-btn">
					<button type="button" id="tab_forPic" class="btn btn-success">跳转</button>
		      	</span>
		    </div><!-- /input-group -->
	  	</div><!-- /.col-lg-6 -->
		<div class="col-lg-3 col-md-4 col-sm-5 col-xs-9">
			<button type="button" class="btn btn-success" id="tab_statue">编辑</button>
			<button type="button" id="tab_undo" class="btn btn-success" disabled="disabled">撤销</button>
			<button type="button" id="tab_redo" class="btn btn-success" disabled="disabled">恢复</button>
			<button type="button" id="tab_clear" class="btn btn-success" disabled="disabled">重置</button>
		</div>
		
		<div class="col-lg-2 col-md-2 col-sm-3 col-xs-5 btn-group">
			<button type="button" class="btn btn-success" id="tab_already">读取</button>
			<button type="button" class="btn btn-success" id="tab_save">保存</button>
		</div>

		<div class="col-lg-3 col-md-3 col-sm-3 col-xs-5">
			<div class="input-group">
				<span class="input-group-addon" id="tab_task_title">类型</span>
				<select name="parameter" class="form-control" id="tab_task">
					<option >视杯</option>
					<option selected="selected">视盘</option>
				<!-- 	<option >ONH</option>
					<option >RIM</option>
					<option >RNFL</option>
					<option >PPA</option> -->
	<!--						<option >黄斑</option>-->
				</select>
			</div>
		</div>

		<div class="col-lg-3 col-md-3 col-sm-5 col-xs-7">
			<div class="input-group">
				<span class="input-group-addon" id="tab_note_title">专家注释</span>
				<input name="note" type="text" class="form-control" placeholder="相关补充说明..." id="tab_note">
			</div>
		</div>

        <div class="col-lg-3 col-md-3 col-sm-5 col-xs-7">
            <div class="input-group">
                <span class="input-group-addon" id="tab_tool_title">标定工具</span>
                <select name="parameter" class="form-control" id="tab_tool">
                    <option >B样条</option>
                    <option >椭圆</option>
                    <option selected="selected">椭圆+调整</option>
                </select>
                <span class="input-group-btn">
					<button type="button" id="tab_ass" class="btn btn-success" disabled="disabled">辅助</button>
		      	</span>
            </div>
        </div>

        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-5 btn-group">
			<button type="button" id="tab_mask" class="btn btn-success">掩码</button>
			<button type="button" id="tab_mask_export" class="btn btn-success">导出</button>
		</div>


	</div>
</div>
<div class="row">
	<div class="col-lg-9 col-md-12">
		<canvas id="tab_canvas" width="800" height="600" style="border:1px solid #d3d3d3;background:#ffffff;z-index=0;">
			您的浏览器不支持canvas！
		</canvas>
	</div>
	<div class="col-lg-3 col-md-12">
		<!-- <div class="alert bg-info">
			<p>鼠标坐标：</p>
			<div id="tab_xycoordinates"></div>
		</div>
		<div class="alert bg-info point_data_list">
			<p>型值点值：</p>
			<div id="tab_print_key_points"></div>
		</div> -->
		<div class="row">

			<div class="col-lg-12 col-md-3 col-sm-3">
				<label class="control-label" for="formGroupInputLarge" id="tab_lor_title">左右眼:</label>
				<div>
					<select name="leftOrRight" class="col-sm-4 form-control" id="tab_lor">
						<option>右眼</option>
						<option>左眼</option>
					</select>
				</div>
			</div>
			<div class="col-lg-12 col-md-3 col-sm-3">
				<label class="control-label" for="formGroupInputLarge" id="tab_rnfl_title">神经纤维层:</label>
				<div >
					<select name="rnfl" class="form-control" id="tab_rnfl">
						<option>无神经纤维层损伤</option>
						<option>神经纤维层损伤</option>
					</select>
				</div>
			</div>
			<div class="col-lg-12 col-md-3 col-sm-3">
				<label class="control-label" for="formGroupInputLarge" id="tab_notch_title">缺损:</label>
				<div>
					<select name="notch" class="form-control" id="tab_notch">
						<option>无缺损</option>
						<option>缺损</option>
					</select>
				</div>
			</div>
			<div class="col-lg-12 col-md-3 col-sm-3">
				<label class="control-label" for="formGroupInputLarge" id="tab_haemorrh_title">出血:</label>
				<div>
					<select name="haemorrh" class="form-control" id="tab_haemorrh">
						<option>无出血</option>
						<option>出血</option>
					</select>
				</div>
			</div>
			<div class="col-lg-12 col-md-3 col-sm-3">
				<label class="control-label" for="formGroupInputLarge" id="tab_appa_title">视盘萎缩弧α区域:</label>
				<div>
					<select name="alphappa" class="form-control" id="tab_appa">
						<option>无α区域盘弧萎缩</option>
						<option>α区域盘弧萎缩</option>
					</select>
				</div>
			</div>
			<div class="col-lg-12 col-md-3 col-sm-3">
				<label class="control-label" for="formGroupInputLarge"  id="tab_bppa_title">视盘萎缩弧β区域:</label>
				<div>
					<select name="betappa" class="form-control" id="tab_bppa">
						<option>无β区域盘弧萎缩</option>
						<option>β区域盘弧萎缩</option>
					</select>
				</div>
			</div>
			<div class="col-lg-12 col-md-3 col-sm-3">
				<label class="control-label" for="formGroupInputLarge" id="tab_ddls_title">DDLS分类:</label>
				<div>
					<select name="ddlstype" class="form-control " id="tab_ddls">
						<option>0</option>
						<option>1</option>
						<option>2</option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
						<option>6</option>
						<option>7</option>
						<option>8</option>
						<option>9</option>
						<option>10</option>
					</select>
				</div>
			</div>

			<div class="col-lg-12 col-md-3 col-sm-3">
				<label class="control-label" for="formGroupInputLarge"  id="tab_isgla_title">是否青光眼:</label>
				<div>
					<select name="isgla" class="form-control" id="tab_isgla">
						<option>是</option>
						<option>否</option>
						<option>需进一步确定</option>
					</select>
				</div>
			</div>


		</div>

		<form class="row">
		  	<div class="form-group">
		   		<label class="col-lg-5 col-md-1 col-sm-2 control-label" id="roi_title">兴趣区域中心</label>
		   		<div class="col-lg-7 col-md-2 col-sm-4">
		   			<input type="text" class="form-control" id="roi" value="" readonly>
		    	</div>
		  	</div>
		  	<div class="form-group">
		    	<label class="col-lg-5 col-md-1 col-sm-2 control-label" id="cupheight_title">视杯高度</label>
		   		<div class="col-lg-7 col-md-2 col-sm-4">
		   			<input type="text" class="form-control" id="cupheight" value="" readonly>
		    	</div>
		  	</div>
		  	<div class="form-group">
		    	<label class="col-lg-5 col-md-1 col-sm-2 control-label" id="discheight_title">视盘高度</label>
		   		<div class="col-lg-7 col-md-2 col-sm-4">
		   			<input type="text" class="form-control" id="discheight" value="" readonly>
		    	</div>
		  	</div>
		  	<div class="form-group">
		    	<label class="col-lg-5 col-md-1 col-sm-2 control-label"  id="cdr_title">杯盘比</label>
		   		<div class="col-lg-7 col-md-2 col-sm-4">
		   			<input type="text" class="form-control" id="cdr" value="" readonly>
		    	</div>
		  	</div>
		</form>
	</div>
</div>

<br/>
<br/>
<br/>

<nav class="navbar navbar-default navbar-fixed-bottom" id="phone_nav" style="display:none;">
	<div class="container">
    	<div class="navbar-header">
	      	<a class="navbar-brand" href="#">移动设备辅助菜单</a>
	    </div>
	    <div class="btn-group">
			<button type="button" class="btn btn-default" id="hand_up"><span class="glyphicon glyphicon-hand-up"></span></button>
			<button type="button" class="btn btn-default" id="hand_down"><span class="glyphicon glyphicon-hand-down"></span></button>
			<button type="button" class="btn btn-default" id="hand_left"><span class="glyphicon glyphicon-hand-left"></span></button>
			<button type="button" class="btn btn-default" id="hand_right"><span class="glyphicon glyphicon-hand-right"></span></button>
			<button type="button" class="btn btn-default" id="size_large"><span class="glyphicon glyphicon-resize-full"></span></button>
			<button type="button" class="btn btn-default" id="size_small"><span class="glyphicon glyphicon-resize-small"></span></button>
	    </div>
  	</div>
</nav>

<!-- 用不会在前端显示的控件来存放后台传来的数据，供js获取 -->
<imginfo id="imginfo" imgid="{$imginfo['id']}" imgurl="{$imginfo['imgsite']}" ></imginfo>
<!--
<script type="text/javascript">
	$imgurl = $('#imginfo').attr('imgurl');
	alertify.alert($imgurl);
</script>
-->
<script src="__PUBLIC__/js/jquery.hotkeys.js" type="text/javascript"></script>
<script src="__PUBLIC__/js/tab/tab.js" type="text/javascript"></script>

