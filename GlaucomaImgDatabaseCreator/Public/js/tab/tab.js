/**
 * [用于处理所有的Tab页面的js控制代码]
 * @param  {[无]} ){
 * @return {[无]}     [canvas绘图、鼠标事件]
 */
$(document).ready(function(){
	//Layout avtive 标定系统在Layout高亮
	console.log($('#top_nav_mainpage'));
	$('#top_nav_mainpage').parents('.active').attr('class', "");
	$('#top_nav_calibration').parent().attr('class', "active");

    $(document).bind("contextmenu",function(e){
        return false;
    });

	var isDown = 0,//鼠标是否下压
		scalespeed = 2,//滚轮放大缩小图片比率
		scalelimit = 5,//缩放的最大次数限制
		scaletime = 0;//统计目前缩放的次数

	var cvsBuff,//canvas的缓存空间
		ctxBuff,//canvas的缓存空间的画笔
		canvas,//实际的canvas
		context;//实际的canvas的画笔

	var img,//图片对象
	    imgIsLoaded,//图片是否加载完成;
	    imgX = 0,//图片的横坐标
	    imgY = 0,//图片的纵坐标
	    imgScale = 1;//图片的缩放比例

	var points_stack_array = new Array(new Array(),new Array()),//视杯、视盘的型值点
		points_recycle_stack_array = new Array(new Array(),new Array()),//视杯、视盘的型值点的栈


		points_ellipse_array =  new Array(new Array(),new Array()), // 椭圆的左上角和右下角的点
		points_recycle_ellipse_array =  new Array(new Array(),new Array()), // 椭圆的左上角和右下角的点的栈

		points_ellipse_array_ass =  new Array(new Array(),new Array()), // 椭圆的左上角和右下角的点
		points_recycle_ellipse_ass_array =  new Array(new Array(),new Array()), // 椭圆的左上角和右下角的点的栈

		points_generate_array = new Array(new Array(),new Array()),//视杯、视盘的计算得到的插值点

		points_hover;//当前鼠标框选的点
	
	var btn_statue,//进入编辑按钮
		btn_undo,//撤销按钮
		btn_redo,//恢复按钮
		btn_clear,//重置按钮
        btn_bSpline,//三次均匀B-样条算法按钮
		btn_prePic,
		btn_nextPic,
		btn_forPic;

	var msg_ctr;

	var sel_task;//选择任务类型

	var assFLAG0 = 0,//辅助视杯标记
		assFLAG1 = 0;//辅助视盘标记

	var maskFLAG = 0;

	var time1 = -1,
		time2 = -1,
		time301 = -1,
		time302 = -1,
		time303 = -1,
		time3032 = -1,
		time304 = -1,
		time3042 = -1,
		timeedit = -1,
		timeass = -1,
		timeback = -1;


	var txt_picID;

	var sta_edit,
		sta_curve;

	(function int()
	{
	    canvas = $('#tab_canvas')[0];
	    context = canvas.getContext('2d');

		btn_statue = $('#tab_statue');//进入编辑按钮
		btn_undo = $('#tab_undo');//撤销按钮
		btn_redo = $('#tab_redo');//恢复按钮
		btn_clear = $('#tab_clear');//重置按钮
		btn_ass = $('#tab_ass');//辅助按钮
        
        btn_bSpline = $('#tab_bSpline');
        /* 测试
		btn_bezier1 = $('#tab_bezier1');//贝塞尔曲线算法一按钮
		btn_hermite1 = $('#tab_hermite1');//Hermite曲线算法一按钮
		btn_bezier2 = $('#tab_bezier2');//贝塞尔曲线算法二按钮
		btn_bezier3 = $('#tab_bezier3');//贝塞尔曲线算法二按钮
	//	btn_inter1 = $('#tab_inter1');//插值算法按钮
        */

		btn_prePic = $('#tab_prePic');//
		btn_nextPic = $('#tab_nextPic');//
		btn_forPic = $('#tab_forPic');//

		txt_picID = $('#tab_picID');//

		sel_task = $('#tab_task');

		msg_ctr = {suc:0,bad:0};
		sta_edit = false;
		sta_curve = getStaCurve();

	    loadImg();
	    dataClear();
	    already();
		resetSetting();

		// setInterval(function(){
		// 	console.log(new Date().getTime());
		// }, 1000);
	})();

	function getStaCurve(){
		var i = $("#tab_tool")[0].selectedIndex;
		if (i == 0){
			return 5;
		}else if (i == 1){
			return 6;
		}else if (i == 2){
			return 7;
		}else{
			return -1;
		}
	}

	function loadImg()
	{
	    img = new Image();
	    img.onload = function()
	    {
	        imgIsLoaded = true;
	        imgScale = canvas.width / img.width;
	        drawImage();
	    }
	    img.src = $('#imginfo').attr('imgurl');
	    $('#tab_picID').attr('value',$('#imginfo').attr('imgid'));
	}

	function resetSetting()
	{
		if(imgIsLoaded)
		{
   			imgScale = canvas.width / img.width;
   			scaletime = 0;
   			imgX = 0;
   			imgY = 0;
		}
	}

	function getPrePic()
	{
	 	$.get(
			'/bgidb/tab/pic_change_ajax', 
			{oper : "1",nowpic :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['imginfo'] != null){
					img = new Image();
				    img.onload = function()
				    {
				        imgIsLoaded = true;
				        imgScale = canvas.width / img.width;
				        drawImage();
				    }
				    var url = $('#imginfo').attr('imgurl');
					img.src = data['imginfo']['imgsite'];
					img.onerror = function(){
						img.src = url;
						$('#imginfo').attr('imgurl', url);
				    	alertify.error("该张图片暂时无法访问");
					};
					$('#imginfo').attr('imgurl', data['imginfo']['imgsite']);
					$('#imginfo').attr('imgid', data['imginfo']['id']);
	    			$('#tab_picID').attr('value',$('#imginfo').attr('imgid'));
	    			already();
			    }else{
				    alertify.error("已经是第一张！");
			    }
			},
			"json");
	}

	function getNextPic()
	{
	 	$.get(
			'/bgidb/tab/pic_change_ajax', 
			{oper : "2",nowpic :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['imginfo'] != null){
					img = new Image();
				    img.onload = function()
				    {
				        imgIsLoaded = true;
				        imgScale = canvas.width / img.width;
				        drawImage();
				    }
				    var url = $('#imginfo').attr('imgurl');
					img.src = data['imginfo']['imgsite'];
					img.onerror = function(){
						img.src = url;
						$('#imginfo').attr('imgurl', url);
				    	alertify.error("该张图片暂时无法访问");
					};
					$('#imginfo').attr('imgurl', data['imginfo']['imgsite']);
					$('#imginfo').attr('imgid', data['imginfo']['id']);
	    			$('#tab_picID').attr('value',$('#imginfo').attr('imgid'));
	    			already();
				}else{
					alertify.error("已经是最后一张！");
				}
			},
			"json");
	}

	function getForPic(myforpic)
	{
	 	$.get(
			'/bgidb/tab/pic_change_ajax', 
			{oper : "3",nowpic: $('#imginfo').attr('imgid'),forpic : myforpic},
			function(data){
			    if(data['imginfo'] != null){
					img = new Image();
				    img.onload = function()
				    {
				        imgIsLoaded = true;
				        imgScale = canvas.width / img.width;
				        drawImage();
				    }
				    var url = $('#imginfo').attr('imgurl');
					img.src = data['imginfo']['imgsite'];
					img.onerror = function(){
						img.src = url;
						$('#imginfo').attr('imgurl', url);
				    	alertify.error("该张图片暂时无法访问");
					};
					$('#imginfo').attr('imgurl', data['imginfo']['imgsite']);
					$('#imginfo').attr('imgid', data['imginfo']['id']);
	    			$('#tab_picID').attr('value',$('#imginfo').attr('imgid'));
	    			already();
				}else{
					alertify.error("没有那一张");
				}
			},
			"json");
	}
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

	function resCommit()
	{
		// var taskkind = $('#tab_task')[0].selectedIndex;
		// var points_stack = points_stack_array[taskkind];
		// if(points_stack.length==0){
		// 	alertify.error("没有需要保存的内容");
		// 	return;
		// }
		
		if (points_stack_array[0].length > 0){
		 	$.get(
				'/bgidb/tab/res_commit_ajax', 
				{taskkind : 1,imgid :$('#imginfo').attr('imgid'),points :JSONstringify(points_stack_array[0]).replace(/\"/gm,"\\"),time :time1 },
				function(data){
				    if(data['wrongcode']==999) alertify.success("视杯保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log(JSONstringify(points_stack).replace(/\"/gm,"\\"));
				},
				"json");
		}

	 	if (points_stack_array[1].length > 0){
		 	$.get(
				'/bgidb/tab/res_commit_ajax', 
				{taskkind : 2,imgid :$('#imginfo').attr('imgid'),points :JSONstringify(points_stack_array[1]).replace(/\"/gm,"\\"),time :time2 },
				function(data){
				    if(data['wrongcode']==999) alertify.success("视盘保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log(JSONstringify(points_stack).replace(/\"/gm,"\\"));
				},
				"json");
		 }


		if (points_ellipse_array[0].length == 2){
		 	$.get(
				'/bgidb/tab/res_commit_ajax', 
				{taskkind : 301,imgid :$('#imginfo').attr('imgid'),points :JSONstringify(points_ellipse_array[0]).replace(/\"/gm,"\\"),time :time301 },
				function(data){
				    if(data['wrongcode']==999) alertify.success("椭圆视杯保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log(JSONstringify(points_stack).replace(/\"/gm,"\\"));
				},
				"json");
		}



	 	if (points_ellipse_array[1].length == 2){
		 	$.get(
				'/bgidb/tab/res_commit_ajax', 
				{taskkind : 302,imgid :$('#imginfo').attr('imgid'),points :JSONstringify(points_ellipse_array[1]).replace(/\"/gm,"\\"),time :time302 },
				function(data){
				    if(data['wrongcode']==999) alertify.success("椭圆视盘保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log(JSONstringify(points_stack).replace(/\"/gm,"\\"));
				},
				"json");
		 }

	 	if (assFLAG0 == 2 && getStaCurve() == 7){
		 	$.get(
				'/bgidb/tab/res_commit_ajax', 
				{taskkind : 303,imgid :$('#imginfo').attr('imgid'),points :JSONstringify(points_ellipse_ass_array[0]).replace(/\"/gm,"\\"),time :time303, time2 :time3032 },
				function(data){
				    if(data['wrongcode']==999) alertify.success("椭圆+调整 视杯保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log(JSONstringify(points_stack).replace(/\"/gm,"\\"));
				},
				"json");
		 }

		 if (assFLAG1 == 2 && getStaCurve() == 7){
		 	$.get(
				'/bgidb/tab/res_commit_ajax', 
				{taskkind : 304,imgid :$('#imginfo').attr('imgid'),points :JSONstringify(points_ellipse_ass_array[1]).replace(/\"/gm,"\\"),time :time304, time2 :time3042 },
				function(data){
				    if(data['wrongcode']==999) alertify.success("椭圆+调整 视盘保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log(JSONstringify(points_stack).replace(/\"/gm,"\\"));
				},
				"json");
		}



	 	if ($('#tab_lor')[0].selectedIndex > -1){ 		
		 	$.get(
				'/bgidb/tab/diagnose_commit_ajax', 
				{taskkind : 101, imgid : $('#imginfo').attr('imgid'), diagnose : $('#tab_lor')[0].selectedIndex + 1},
				function(data){
				    if(data['wrongcode']==999) alertify.success("左右眼信息保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log("lor:" + (lor + 1));
				},
				"json");
	 	}

	 	if ($('#tab_rnfl')[0].selectedIndex > -1){
		 	$.get(
				'/bgidb/tab/diagnose_commit_ajax', 
				{taskkind : 102, imgid : $('#imginfo').attr('imgid'), diagnose : $('#tab_rnfl')[0].selectedIndex + 1},
				function(data){
				    if(data['wrongcode']==999) alertify.success("视神经纤维层信息保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log("lor:" + (lor + 1));
				},
				"json");
	 	}

	 	if ($('#tab_notch')[0].selectedIndex > -1){
		 	$.get(
				'/bgidb/tab/diagnose_commit_ajax', 
				{taskkind : 103, imgid : $('#imginfo').attr('imgid'), diagnose : $('#tab_notch')[0].selectedIndex + 1},
				function(data){
				    if(data['wrongcode']==999) alertify.success("缺损信息保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log("lor:" + (lor + 1));
				},
				"json");
	 	}

	 	if ($('#tab_haemorrh')[0].selectedIndex > -1){
		 	$.get(
				'/bgidb/tab/diagnose_commit_ajax', 
				{taskkind : 104, imgid : $('#imginfo').attr('imgid'), diagnose : $('#tab_haemorrh')[0].selectedIndex + 1},
				function(data){
				    if(data['wrongcode']==999) alertify.success("出血信息保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log("lor:" + (lor + 1));
				},
				"json");
	 	}

	 	if ($('#tab_appa')[0].selectedIndex > -1){
		 	$.get(
				'/bgidb/tab/diagnose_commit_ajax', 
				{taskkind : 105, imgid : $('#imginfo').attr('imgid'), diagnose : $('#tab_appa')[0].selectedIndex + 1},
				function(data){
				    if(data['wrongcode']==999) alertify.success("α区域盘弧萎缩信息保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log("lor:" + (lor + 1));
				},
				"json");
	 	}

	 	if ($('#tab_bppa')[0].selectedIndex > -1){
		 	$.get(
				'/bgidb/tab/diagnose_commit_ajax', 
				{taskkind : 106, imgid : $('#imginfo').attr('imgid'), diagnose : $('#tab_bppa')[0].selectedIndex + 1},
				function(data){
				    if(data['wrongcode']==999) alertify.success("β区域盘弧萎缩信息保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log("lor:" + (lor + 1));
				},
				"json");
		}

		if ($('#tab_ddls')[0].selectedIndex > -1){
		 	$.get(
				'/bgidb/tab/diagnose_commit_ajax', 
				{taskkind : 107, imgid : $('#imginfo').attr('imgid'), diagnose : $('#tab_ddls')[0].selectedIndex + 1},
				function(data){
				    if(data['wrongcode']==999) alertify.success("DDLS分类信息保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log("lor:" + (lor + 1));
				},
				"json");
		}

		

		if ($('#tab_note').val()){
		 	$.get(
				'/bgidb/tab/diagnose_commit_ajax', 
				{taskkind : 108, imgid : $('#imginfo').attr('imgid'), diagnose : $('#tab_note').val()},
				function(data){
				    if(data['wrongcode']==999) alertify.success("专家注释信息保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log("lor:" + (lor + 1));
				},
				"json");
		}


		if ($('#tab_isgla')[0].selectedIndex > -1){
		 	$.get(
				'/bgidb/tab/diagnose_commit_ajax', 
				{taskkind : 109, imgid : $('#imginfo').attr('imgid'), diagnose : $('#tab_isgla')[0].selectedIndex + 1},
				function(data){
				    if(data['wrongcode']==999) alertify.success("是否青光眼信息保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log("lor:" + (lor + 1));
				},
				"json");
		}
	}

	function after_already(){

		var points_cup = points_generate_array['0'];
		var points_disc = points_generate_array["1"];

		var ch = -1;
		var dh = -1;
		
		// console.log(points_generate_array);
		// $.each(points_generate_array, function(n, value){
		// 	console.log(n);
		// 	console.log(value);

		// });

		// console.log(points_generate_array[0]);
		// console.log(points_generate_array[1]);

		if(points_cup.length != 0){
			var miny = 1000000000;
			var maxy = -1;
			for (var i = 0; i < points_cup.length; i ++) {
				// if (points[i].type == 'c') continue;
				miny = Math.min(miny, points_cup[i]['y']);
				maxy = Math.max(maxy, points_cup[i]['y']);
			}
			$('#cupheight').attr('value', (maxy - miny).toFixed(2));
			// console.log((maxy - miny).toFixed(2));
			ch = maxy - miny;

		}else{
			// console.log("无");
		}

		if(points_disc.length != 0){
			var miny = 1000000000;
			var maxy = -1;
			for (var i = 0; i < points_disc.length; i ++) {
				// if (points[i].type == 'c') continue;
				miny = Math.min(miny, points_disc[i]['y']);
				maxy = Math.max(maxy, points_disc[i]['y']);
			}
			$('#discheight').attr('value', (maxy - miny).toFixed(2));
			// console.log((maxy - miny).toFixed(2));
			dh = maxy - miny;

		}else{
			// console.log("无");
		}		

		if (dh > 0 && ch > 0){
			$('#cdr').attr('value', (ch / dh).toFixed(5));
		}


		if(points_disc.length != 0){
			var sumy = 0;
			var sumx = 0;
			for (var i = 0; i < points_disc.length; i ++) {
				// if (points[i].type == 'c') continue;
				sumx += points_disc[i]['x'];
				sumy += points_disc[i]['y'];
			}
			sumx /= points_disc.length;
			sumy /= points_disc.length;
			$('#roi').attr('value', sumx.toFixed(1) + "," + sumy.toFixed(1));
			// console.log(sumx.toFixed(1) + "," + sumy.toFixed(1));

		}else{
			// console.log("无");
		}		
	}

	function already()
	{
	 	$.get(
			'/bgidb/tab/already_tab_ajax', 
			{taskkind : 1,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	points_stack_array[0] = jQuery.parseJSON(data['tabpoints'].points.replace(/\\/gm,"\""));
			    	// alertify.alert("读取成功");
			    	if (points_stack_array[0].length > 0){
				    	// alertify.success("视杯信息读取成功");
				    	generatePoints();
				    	drawImage();
			    	}else {
			    		// alertify.error("无视杯信息");
			    	}

			    // }else alertify.alert(data['wrongmsg']);
				}else{
					// alertify.error("无视杯信息");
				}
			},
			"json");

	 	$.get(
			'/bgidb/tab/already_tab_ajax', 
			{taskkind : 2,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	points_stack_array[1] = jQuery.parseJSON(data['tabpoints'].points.replace(/\\/gm,"\""));
			    	// alertify.alert("读取成功");
			    	if (points_stack_array[1].length > 0){
				    	// alertify.success("视盘信息读取成功");
				    	generatePoints();
				    	drawImage();
			    	}else{
			    		// alertify.error("无视盘信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					// alertify.error("无视盘信息");
				}
			},
			"json");

		$.get(
			'/bgidb/tab/already_tab_ajax', 
			{taskkind : 301,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	points_ellipse_array[0] = jQuery.parseJSON(data['tabpoints'].points.replace(/\\/gm,"\""));
			    	// alertify.alert("读取成功");
			    	if (points_ellipse_array[0].length == 2){
				    	// alertify.success("视杯信息读取成功");
				    	generatePoints();
				    	drawImage();

			    	}else {
			    		// alertify.error("无视杯信息");
			    	}

			    // }else alertify.alert(data['wrongmsg']);
				}else{
					// alertify.error("无视杯信息");
				}
			},
			"json");

	 	$.get(
			'/bgidb/tab/already_tab_ajax', 
			{taskkind : 302,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	points_ellipse_array[1] = jQuery.parseJSON(data['tabpoints'].points.replace(/\\/gm,"\""));
			    	// alertify.alert("读取成功");
			    	if (points_ellipse_array[1].length == 2){
				    	// alertify.success("视盘信息读取成功");
				    	generatePoints();
				    	drawImage();
			    	}else{
			    		// alertify.error("无视盘信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					// alertify.error("无视盘信息");
				}
			},
			"json");

		$.get(
			'/bgidb/tab/already_tab_ajax', 
			{taskkind : 303,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	points_ellipse_ass_array[0] = jQuery.parseJSON(data['tabpoints'].points.replace(/\\/gm,"\""));
			    	// alertify.alert("读取成功");
			    	if (points_ellipse_ass_array[0].length > 0){
				    	// alertify.success("视杯信息读取成功");
				    	assFLAG0 = 2;
				    	generatePoints();
				    	drawImage();

			    	}else {
			    		// alertify.error("无视杯信息");
			    	}

			    // }else alertify.alert(data['wrongmsg']);
				}else{
					// alertify.error("无视杯信息");
				}
			},
			"json");

	 	$.get(
			'/bgidb/tab/already_tab_ajax', 
			{taskkind : 304,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	points_ellipse_ass_array[1] = jQuery.parseJSON(data['tabpoints'].points.replace(/\\/gm,"\""));
			    	// alertify.alert("读取成功");
			    	if (points_ellipse_ass_array[1].length > 0){
				    	// alertify.success("视盘信息读取成功");
				    	assFLAG1 = 2;
				    	generatePoints();
				    	drawImage();
			    	}else{
			    		// alertify.error("无视盘信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					// alertify.error("无视盘信息");
				}
			},
			"json");

		
	 	$.get(
			'/bgidb/tab/already_diagnose_ajax', 
			{taskkind : 101,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	$('#tab_lor')[0].selectedIndex = parseInt(data['tabdiagnose'].diagnose - 1);
			    	// console.log($('#tab_lor')[0].selectedIndex);
			    	// alertify.alert("读取成功");
			    	if ($('#tab_lor')[0].selectedIndex > -1){
			    		// alertify.success("左右眼读取成功");
			    	}else{
			    		// alertify.error("无左右眼信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					$('#tab_lor')[0].selectedIndex = -1;
					// alertify.error("无左右眼信息");
				}
			},
			"json");

	 	$.get(
			'/bgidb/tab/already_diagnose_ajax', 
			{taskkind : 102,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	$('#tab_rnfl')[0].selectedIndex = parseInt(data['tabdiagnose'].diagnose - 1);
			    	// console.log($('#tab_rnfl')[0].selectedIndex);
			    	// alertify.alert("读取成功");
			    	if ($('#tab_rnfl')[0].selectedIndex >  -1){
			    		// alertify.success("视神经纤维层损伤信息读取成功");
			    	}else{
			    		// alertify.error("无视神经纤维层损伤信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					$('#tab_rnfl')[0].selectedIndex = -1;
					// alertify.error("无视神经纤维层损伤信息");
				}
			},
			"json");

	 	$.get(
			'/bgidb/tab/already_diagnose_ajax', 
			{taskkind : 103,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	$('#tab_notch')[0].selectedIndex = parseInt(data['tabdiagnose'].diagnose - 1);
			    	// console.log($('#tab_notch')[0].selectedIndex);
			    	// alertify.alert("读取成功");
			    	if ($('#tab_notch')[0].selectedIndex > -1){
			    		// alertify.success("缺损信息读取成功");
			    	}else{
			    		// alertify.error("无缺损信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					$('#tab_notch')[0].selectedIndex = -1;
					// alertify.error("无缺损信息");
				}
			},
			"json");

	 	$.get(
			'/bgidb/tab/already_diagnose_ajax', 
			{taskkind : 104,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	$('#tab_haemorrh')[0].selectedIndex = parseInt(data['tabdiagnose'].diagnose - 1);
			    	// console.log($('#tab_haemorrh')[0].selectedIndex);
			    	// alertify.alert("读取成功");
			    	if ($('#tab_haemorrh')[0].selectedIndex > -1){
			    		// alertify.success("出血信息读取成功");
			    	}else{
			    		// alertify.error("无出血信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					$('#tab_haemorrh')[0].selectedIndex = -1;
					// alertify.error("无出血信息");
				}
			},
			"json");

	 	$.get(
			'/bgidb/tab/already_diagnose_ajax', 
			{taskkind : 105,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	$('#tab_appa')[0].selectedIndex = parseInt(data['tabdiagnose'].diagnose - 1);
			    	// console.log($('#tab_appa')[0].selectedIndex);
			    	// alertify.alert("读取成功");
			    	if ($('#tab_appa')[0].selectedIndex > -1){
			    		// alertify.success("α区域盘弧萎缩信息读取成功");
			    	}else{
			    		// alertify.error("无α区域盘弧萎缩信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					$('#tab_appa')[0].selectedIndex = -1;
					// alertify.error("无α区域盘弧萎缩信息");
				}
			},
			"json");

	 	$.get(
			'/bgidb/tab/already_diagnose_ajax', 
			{taskkind : 106,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	$('#tab_bppa')[0].selectedIndex = parseInt(data['tabdiagnose'].diagnose - 1);
			    	// console.log($('#tab_bppa')[0].selectedIndex);
			    	// alertify.alert("读取成功");
			    	if ($('#tab_bppa')[0].selectedIndex > -1){
			    		// alertify.success("β区域盘弧萎缩信息读取成功");
			    	}else{
			    		// alertify.error("无β区域盘弧萎缩信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					$('#tab_bppa')[0].selectedIndex = -1;
					// alertify.error("无β区域盘弧萎缩信息");
				}
			},
			"json");

	 	$.get(
			'/bgidb/tab/already_diagnose_ajax', 
			{taskkind : 107,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	$('#tab_ddls')[0].selectedIndex = parseInt(data['tabdiagnose'].diagnose - 1);
			    	// console.log($('#tab_ddls')[0].selectedIndex);
			    	// alertify.alert("读取成功");
			    	if ($('#tab_ddls')[0].selectedIndex > -1){
			    		// alertify.success("DDLS分类信息读取成功");
			    	}else{
			    		// alertify.error("无DDLS分类信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					$('#tab_ddls')[0].selectedIndex = -1;
					// alertify.error("无DDLS分类信息");
				}
			},
			"json");

		$.get(
			'/bgidb/tab/already_diagnose_ajax', 
			{taskkind : 108,imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	$('#tab_note').val(data['tabdiagnose'].diagnose);
			    	// alertify.alert("读取成功");
			    	if ($('#tab_note').val()){
			    		// alertify.success("专家注释信息读取成功");
			    	}else{
			    		// alertify.error("无专家注释信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					$('#tab_note').val("");
					// alertify.error("无专家注释信息");
				}
			},
			"json");

		$.get(
			'/bgidb/tab/already_diagnose_ajax', 
			{taskkind : 109,imgid :$('#imginfo').attr('imgid')},
			function(data){
     				if(data['wrongcode']==999){
			    	$('#tab_isgla')[0].selectedIndex = parseInt(data['tabdiagnose'].diagnose - 1);
			    	// console.log($('#tab_ddls')[0].selectedIndex);
			    	// alertify.alert("读取成功");
			    	if ($('#tab_isgla')[0].selectedIndex > -1){
			    		// alertify.success("是否青光眼信息读取成功");
			    	}else{
			    		// alertify.error("无是否青光眼信息");
			    	}
			    // }else alertify.alert(data['wrongmsg']);
				}else{
					$('#tab_isgla')[0].selectedIndex = -1;
					// alertify.error("无是否青光眼信息");
				}
			},
			"json");
	}

	// function clearCoordinates()
	// {
	// 	div_xycoordinates[0].innerHTML="";
	// }

	function calTime(){
		var taskkind = $("#tab_task")[0].selectedIndex;

		console.log(getStaCurve());
		switch (getStaCurve()){
			case 5:
				if (taskkind == 0){
					time1 = timeback - timeedit;
				}else{
					time2 = timeback - timeedit;
				}
				break;
			case 6:
				if (taskkind == 0){
					time301 = timeback - timeedit;
				}else{
					time302 = timeback - timeedit;
				}
				break;
			case 7:
				if (taskkind == 0){
					time303 = timeback - timeedit;
					time3032 = timeass - timeedit;
				}else{
					time304 = timeback - timeedit;
					time3042 = timeass - timeedit;
				}
				break;
			default:
				alert("function calTime default");
				break;
		}

		console.log("time:");
		console.log(time1);
		console.log(time2);
		console.log(time301);
		console.log(time302);
		console.log(time303);
		console.log(time304);
		console.log("========");
	}

	function changeEditStatue()
	{
		if('btn btn-success' == btn_statue.attr('class'))
		{
			timeedit = new Date().getTime();

			btn_statue.attr('class','btn btn-danger');
			btn_statue[0].innerHTML = '返回';
			$('#tab_statue_dropdown').attr('class','btn btn-danger dropdown-toggle');

			btn_prePic[0].disabled = true;
			btn_nextPic[0].disabled = true;
			btn_forPic[0].disabled = true;

			btn_undo[0].disabled = false;
			btn_redo[0].disabled = false;
			btn_clear[0].disabled = false;


			if (getStaCurve() == 7){
				btn_ass[0].disabled = false;
			}

			sel_task[0].disabled = true;

			sta_edit = true;
		}else{
			timeback = new Date().getTime();

			calTime();

			btn_statue[0].className = "btn btn-success";
			btn_statue[0].innerHTML = "编辑";
			$('#tab_statue_dropdown').attr('class','btn btn-success dropdown-toggle');

			btn_prePic[0].disabled = false;
			btn_nextPic[0].disabled = false;
			btn_forPic[0].disabled = false;

			btn_undo[0].disabled = true;
			btn_redo[0].disabled = true;
			btn_clear[0].disabled = true;

			btn_ass[0].disabled = true;

			sel_task[0].disabled = false;

			sta_edit = false;
		}
	}

	function drawPoint(point){
		if(point==null || false == sta_edit) return;
		ctxBuff.save();
		ctxBuff.translate(imgX,imgY);//以图片建立用户坐标系
				

		ctxBuff.beginPath();

		ctxBuff.fillStyle="#FFFF00";
		ctxBuff.rect(point["x"]*imgScale-5,point["y"]*imgScale-5,10,10);
		ctxBuff.closePath();
		ctxBuff.stroke();

		// 恢复之前的canvas状态
		ctxBuff.restore();
	}

	function drawPoints(taskkind, points)
	{

		//return;

		ctxBuff.save();
		ctxBuff.translate(imgX,imgY);//以图片建立用户坐标系
		
		
		
		if (taskkind != $('#tab_task')[0].selectedIndex){
			ctxBuff.globalAlpha=0.3;
		}

		for(var i=0; i < points.length;i++)
		{

			ctxBuff.beginPath();
			if('c' == points[i].type){
				// ctxBuff.fillStyle="#FF0000";
				// ctxBuff.arc(points[i]["x"]*imgScale,points[i]["y"]*imgScale,2,0,Math.PI*2,true);
			}else{
				ctxBuff.fillStyle="#000000";
				ctxBuff.arc(points[i]["x"]*imgScale,points[i]["y"]*imgScale,1.5,0,Math.PI*2,true);
			}
			ctxBuff.closePath();
			ctxBuff.stroke();
			ctxBuff.fill();
		}


		// 恢复之前的canvas状态
		ctxBuff.restore();
	}

	function drawImage()
	{
		if (maskFLAG) {
			drawMask($("#tab_task")[0].selectedIndex);
			return;
		}

		// printKeyPoints();
		cvsBuff = document.createElement('canvas');
		cvsBuff.width = 800;
		cvsBuff.height = 800;
		ctxBuff = cvsBuff.getContext('2d');

	    ctxBuff.clearRect(0, 0, cvsBuff.width, cvsBuff.height);
	    ctxBuff.drawImage(img, imgX, imgY, img.width*imgScale, img.height*imgScale);

	    for (var i = 0; i < 2; i++) {
	    	
			var taskkind = i;
			var points_stack = points_stack_array[taskkind];
			var points_ellipse_ass = points_ellipse_ass_array[taskkind];
			if (getStaCurve() == 5){
			    drawPoints(taskkind, points_stack);
			    drawPoint(points_hover);
			}
			if (getStaCurve() == 7){
				if ((taskkind == 0 && assFLAG0 == 2) || (taskkind == 1 && assFLAG1 == 2)) {
					drawPoint(points_hover);
					drawPoints(taskkind, points_ellipse_ass);
				}
			}
	//	    drawPoints(points_generate);
		    drawLines(taskkind);

	    };
	    context.clearRect(0, 0, canvas.width, canvas.height);
	    context.drawImage(cvsBuff, 0, 0);

	    after_already();
	}


    function insertBSplinePoints (somePoints) {
		var points = new Array();

		if (somePoints.length >= 3) {
            //反控制点矩阵A的拓展矩阵的初始化，大小为n*(n+2) 
            var n = somePoints.length;
            var A = new Array();
            for(var i=0;i<n;i++) {
                A[i] = new Array();
                for(var j=0;j<n+2;j++) {
                    A[i][j]=0;
                }
            }
            for(var i=0;i<n;i++) {
                A[i][(i-1+n)%n] = 1;
                A[i][i] = 4;
                A[i][(i+1)%n] = 1;
            }
            for(var i=0;i<n;i++) {
                A[i][n] = 6*somePoints[i].x;
                A[i][n+1] = 6*somePoints[i].y;
            }
            
            //高斯消元得到控制点
            for(var i=0;i<n;i++) {
                var r=i;
                for(var j = i+1; j<n;j++) {
                    if(Math.abs(A[j][i]) > Math.abs(A[r][i])) r = j;
                }
                if(r!=i) for(var j=0;j<n+2;j++) {
                    var t = A[r][j];
                    A[r][j] = A[i][j];
                    A[i][j] = t;
                }

                for(var j=n;j>=i;j--)
                    for(var k=i+1;k<n;++k) {
                        A[k][j] -= A[k][i]/A[i][i] * A[i][j];
                        if(j==n) {
                            A[k][j+1] -= A[k][i]/A[i][i] * A[i][j+1];
                        }
                    }
            }
            for(var i=n-1;i>=0;i--) {
                for(var j=i+1;j<n;j++) {
                    A[i][n] -= A[j][n]*A[i][j];
                    A[i][n+1] -= A[j][n+1]*A[i][j];
                }
                A[i][n]/=A[i][i];
                A[i][n+1]/=A[i][i];
            }
            
            //将控制点带入闭合三次均匀B样条方程得到插值点
            
            for (var i = 0; i<n; i++) {
                for (var u=0.1; u<1; u+=0.1) {
                    var temp = new Array();
                    for(var j=n;j<n+2;j++){
                        var xi_1 = A[(i-1+n)%n][j];
                        var xi = A[i][j];
                        var xi1 = A[(i+1)%n][j];
                        var xi2 = A[(i+2)%n][j];

                        var ax = 1/6*(xi2-xi_1) + 1/2*(xi-xi1);
                        var bx = 1/2*(xi1+xi_1) - xi;
                        var cx = 1/2*(xi1-xi_1);
                        var dx = 1/6*(xi1+xi_1)+2/3*xi;

                        temp[j-n] = ax*u*u*u + bx*u*u + cx*u + dx;
                    }
                    var p = {
                        x: temp[0],
                        y: temp[1]
                    };
                    points.push(p);
                }
            }
            
		}
		return points;
	}

	function insertEllipsePoints(twopoints){

		var points = new Array();

		if (twopoints.length == 2){
			var x = (twopoints[0]['x'] + twopoints[1]['x'])/2;
			var y = (twopoints[0]['y'] + twopoints[1]['y'])/2;
			var a = Math.abs(twopoints[0]['x'] - twopoints[1]['x'])/2;
			var b = Math.abs(twopoints[0]['y'] - twopoints[1]['y'])/2;

			var step = (a > b) ? 1 / a : 1 / b;

			points.push({x: x+a, y: y});
			for (var i = 0; i < 2 * Math.PI; i += step)
			{
				//参数方程为x = a * cos(i), y = b * sin(i)，
			    //参数为i，表示度数（弧度）
			    points.push({x: x + a * Math.cos(i), y: y + b * Math.sin(i)});
			}
		}
		return points;
	}

	function insertEllipseAssPoints(twopoints, taskkind){

		var points = new Array();

		if (taskkind == 0 && assFLAG0 == 2){
			return points_ellipse_ass_array[taskkind];
		}

		if (taskkind == 1 && assFLAG1 == 2){
			return points_ellipse_ass_array[taskkind];
		}

		if (twopoints.length == 2){
			var x = (twopoints[0]['x'] + twopoints[1]['x'])/2;
			var y = (twopoints[0]['y'] + twopoints[1]['y'])/2;
			var a = Math.abs(twopoints[0]['x'] - twopoints[1]['x'])/2;
			var b = Math.abs(twopoints[0]['y'] - twopoints[1]['y'])/2;

			var step = (a > b) ? 1 / a : 1 / b;

			if (taskkind == 0 && assFLAG0 == 1){
				assFLAG0 = 2;
				step = 2 * Math.PI / 16;
				points.push({x: x+a, y: y});
				for (var i = 0; i < 2 * Math.PI; i += step)
				{
					//参数方程为x = a * cos(i), y = b * sin(i)，
				    //参数为i，表示度数（弧度）
				    points.push({x: x + a * Math.cos(i), y: y + b * Math.sin(i)});
				}
				points_ellipse_ass_array[taskkind] = points;

			} else if (taskkind == 1 && assFLAG1 == 1){
				assFLAG1 = 2;
				step = 2 * Math.PI / 28;
				points.push({x: x+a, y: y});
				for (var i = 0; i < 2 * Math.PI; i += step)
				{
					//参数方程为x = a * cos(i), y = b * sin(i)，
				    //参数为i，表示度数（弧度）
				    points.push({x: x + a * Math.cos(i), y: y + b * Math.sin(i)});
				}
				points_ellipse_ass_array[taskkind] = points;

			}else{
				points.push({x: x+a, y: y});
				for (var i = 0; i < 2 * Math.PI; i += step)
				{
					//参数方程为x = a * cos(i), y = b * sin(i)，
				    //参数为i，表示度数（弧度）
				    points.push({x: x + a * Math.cos(i), y: y + b * Math.sin(i)});
				}
			}
		}
		return points;
	}

	function drawStraight(points)
	{
		if(points.length==0) return;
		ctxBuff.moveTo(points[0]['x']*imgScale, points[0]['y']*imgScale);
		for (var i = 1; i < points.length; i ++) {
			// if (points[i].type == 'c') continue;
			ctxBuff.lineTo(points[i]["x"]*imgScale, points[i]['y']*imgScale);
		}
		ctxBuff.lineTo(points[0]["x"]*imgScale, points[0]['y']*imgScale);
	}


	function drawLines(taskkind)
	{

		// var taskkind = $('#tab_task')[0].selectedIndex;
		var points_stack = points_stack_array[taskkind];
		var points_ellipse = points_ellipse_array[taskkind];
		var points_ellipse_ass = points_ellipse_ass_array[taskkind];


		var points_generate = points_generate_array[taskkind];

		// 保存canvas的状态并绘制路径
		if(points_stack.length<2 && getStaCurve() < 6) return;//三点成面
		if(points_ellipse.length==0 && getStaCurve() == 6) return;
		if(points_ellipse_ass.length==0 && getStaCurve() == 7) return;

		ctxBuff.save();
		ctxBuff.translate(imgX,imgY);//以图片建立用户坐标系

		ctxBuff.beginPath();

		switch(getStaCurve())
		{
			case 0: drawStraight(points_stack);
				break;
            /* 测试
			case 1: drawBezier1();
				break;
			case 2: drawHermite1();
				break;
			case 3: drawStraight(points_generate);
				break;
			case 4: drawBezier3();
				break;
            */
            case 5: drawStraight(points_generate);
                break;
            case 6: drawStraight(points_generate);
            	break;
            case 7: drawStraight(points_generate);
            	break;
			default: break;
		}
		
		ctxBuff.strokeStyle = '#ffffff';
		ctxBuff.lineWidth = 1;
		if (taskkind != $('#tab_task')[0].selectedIndex){
			ctxBuff.globalAlpha=0.3;
		}
		ctxBuff.stroke();
		ctxBuff.closePath();
		
		// 恢复之前的canvas状态
		ctxBuff.restore();
	}

	function windowToCanvas(canvas, x, y)
	{
	    var bbox = canvas.getBoundingClientRect();
	    var ret = {
	    		x: (x - bbox.left),
	    		y: (y - bbox.top)
	    	    };
	    return ret;
	    
	}

	function pointsToConsole(points)
	{
		for(var i=0;i<points.length;i++)
			console.log("%d %d %s",points[i]["x"],points[i]["y"],points[i]['type']);
	}

	function pointsToConsoleWarn(points)
	{
		for(var i=0;i<points.length;i++)
			console.warn("%d %d %s",points[i]["x"],points[i]["y"],points[i]['type']);
	}


	function generatePoints()
	{
		// var taskkind = $('#tab_task')[0].selectedIndex;
		for(var taskkind = 0; taskkind <= 1; taskkind++){

			var points_stack = points_stack_array[taskkind];
			var points_ellipse = points_ellipse_array[taskkind];
			var points_ellipse_ass = points_ellipse_ass_array[taskkind];
			switch(getStaCurve())
			{
				case 0: 
					//points_generate_array[parseInt(taskkind)] = new Array();
					for(var i=0;i<points_stack.length;i++)
				 		points_generate_array[parseInt(taskkind)][i] = points_stack[i];
					break;
	            /*测试
				case 1: 
					points_generate_array[taskkind] = insertBezier1Points(points_stack);
					break;
				case 2: 
					points_generate_array[taskkind] = insertHermite1Points(points_stack);
					break;
				case 3: 
					points_generate_array[taskkind] = insertBezier2Points(points_stack);
					break;
				case 4:
					points_generate_array[taskkind] = insertBezier3Points(points_stack);
					break;
	                */
	            case 5:
	                points_generate_array[parseInt(taskkind)] = insertBSplinePoints(points_stack);
	                break;
	            case 6:
	            	points_generate_array[parseInt(taskkind)] = insertEllipsePoints(points_ellipse);
	            	break;
	            case 7:
	            	points_generate_array[parseInt(taskkind)] = insertEllipseAssPoints(points_ellipse_ass, taskkind);
	            	break;
				default:
					alert("generateDefault");
					break;
			}
		}
	}

	// function printKeyPoints()
	// {
	// 	var taskkind = $('#tab_task')[0].selectedIndex;
	// 	var points_stack = points_stack_array[taskkind];
	// 	div_print_key_points[0].innerHTML="";
	// 	var str="";
	// 	for (var i = 0; i < points_stack.length; i++) {
	// 		str += "点" + (i+1) + ":("+ Math.floor(points_stack[i]["x"]*100)/100 + "," + Math.floor(points_stack[i]["y"]*100)/100;
	// 		if(!!points_stack[i]["k"]){
	// 			str += "," + points_stack[i]["k"];
	// 		}
	// 		str += ")</br>";
	// 	};
	// 	div_print_key_points[0].innerHTML=str;
	// }

	function dataClear(){
		
		points_stack_array = new Array();
		points_recycle_stack_array = new Array();
		
		points_ellipse_array = new Array();
		points_recycle_ellipse_array = new Array();

		points_ellipse_ass_array = new Array();
		points_recycle_ellipse_ass_array = new Array();
		assFLAG = 0;

		points_generate_array = new Array();
		// points_generate_array = new Array(new Array(),new Array())



		for(var taskkind = 0; taskkind < 2; taskkind++){
			points_stack_array[taskkind] = new Array();
			points_recycle_stack_array[taskkind] = new Array();

			points_ellipse_array[taskkind] = new Array();
			points_recycle_ellipse_array[taskkind] = new Array();

			points_ellipse_ass_array[taskkind] = new Array();
			points_recycle_ellipse_ass_array[taskkind] = new Array();

			points_generate_array[taskkind] = new Array();
		}
		
		assFLAG0 = assFLAG1 = 0;

		time1 = time2 = time301 = time302 = time303 = time3032 = time304 = time3042 = -1;

		$('#tab_lor')[0].selectedIndex = -1;
		$('#tab_rnfl')[0].selectedIndex = -1;
		$('#tab_notch')[0].selectedIndex = -1;
		$('#tab_haemorrh')[0].selectedIndex = -1;
		$('#tab_appa')[0].selectedIndex = -1;
		$('#tab_bppa')[0].selectedIndex = -1;

		$('#roi').attr('value', "NaN, NaN");
		$('#cupheight').attr('value', "NaN");
		$('#discheight').attr('value', "NaN");
		$('#cdr').attr('value', "NaN");

	}

	btn_prePic.click(function(){
		dataClear();
		getPrePic();
		resetSetting();

	});

	btn_nextPic.click(function(){
		dataClear();
		getNextPic();
		resetSetting();
	});

	btn_forPic.click(function(){
		dataClear();
		getForPic(txt_picID[0].value);
		resetSetting();
	});

	btn_clear.click(function() {
		dataClear();
		drawImage();
	});
    
    btn_bSpline.click(function(){
        sta_curve = 5;
        generatePoints();
        drawImage();
    });
    
	btn_statue.click(function(){
		changeEditStatue();
		drawImage();
	});

	btn_undo.click(function(){
		undo();
	});

	btn_ass.click(function(){
		ass();
	});

	function ass(){
		timeass = new Date().getTime();

		var taskkind = $('#tab_task')[0].selectedIndex;

		if (taskkind == 0) assFLAG0 = 1;
		if (taskkind == 1) assFLAG1 = 1;
		
		generatePoints();
		drawImage();

	}

	function undo(){
		var taskkind = $('#tab_task')[0].selectedIndex;
		if (sta_curve == 6){
			var points_ellipse = points_ellipse_array[taskkind];
			var points_recycle_ellipse = points_recycle_ellipse_array[taskkind];

			if (points_ellipse.length == 2){
				points_recycle_ellipse.push(points_ellipse.pop()); points_recycle_ellipse.push(points_ellipse.pop());
			}
		}
		else{
			var points_stack = points_stack_array[taskkind];
			var points_recycle_stack = points_recycle_stack_array[taskkind];
			if(points_stack.length>0){
				points_recycle_stack.push(points_stack.pop());
			}
		}
		generatePoints();
		drawImage();
	}

	btn_redo.click(function(){
		var taskkind = $('#tab_task')[0].selectedIndex;

		if (sta_curve == 6){
			var points_ellipse = points_ellipse_array[taskkind];
			var points_recycle_ellipse = points_recycle_ellipse_array[taskkind];

			if (points_recycle_ellipse.length >= 2){
				while(points_ellipse.length > 0) points_ellipse.pop();
				points_ellipse.push(points_recycle_ellipse.pop()); points_ellipse.push(points_recycle_ellipse.pop());
			}
		}
		else{

			var points_stack = points_stack_array[taskkind];
			var points_recycle_stack = points_recycle_stack_array[taskkind];
			if(points_recycle_stack.length>0){
				points_stack.push(points_recycle_stack.pop());
			}
		}
		generatePoints();
		drawImage();
	});

	$('#tab_task').click(function(){
		drawImage();
	});

	$('#tab_save').click(function(){
	//	console.log($('#tab_task')[0].selectedIndex);
		resCommit();
		// diagnoseCommit();
	});

	$('#tab_already').click(function(){
		//dataClear();
		already();
		//resetSetting();
	});

	function nearPoint(point,x,y){
		var eps=10;
		if(Math.abs(point['x']-x)<eps && Math.abs(point['y']-y)<eps) return true;
		return false;
	}

	function commonMousemove(){

		canvas.onmousemove = function(event){
			// getCoordinates(event);
			if(true==sta_edit){
				if (getStaCurve() == 6) return;

				var pos = windowToCanvas(canvas, event.clientX, event.clientY);
				var x = Math.floor((pos.x - imgX)/imgScale);
				var y = Math.floor((pos.y - imgY)/imgScale);
				var eps=10;
				var taskkind = $('#tab_task')[0].selectedIndex;

				if (getStaCurve() == 7 && ((taskkind == 0 && assFLAG0 == 2) || (taskkind == 1 && assFLAG1 == 2)) ){
					var points_ellipse_ass = points_ellipse_ass_array[taskkind];
					var n = points_ellipse_ass.length;
					for(var i=0;i<n;i++){
						if(nearPoint(points_ellipse_ass[i], x, y)){
							points_hover=points_ellipse_ass[i];
							points_hover['type']='h';
							break;
						}
					}
				}
				else if (getStaCurve() == 5){
					var points_stack = points_stack_array[taskkind];
					var n = points_stack.length;
					for(var i=0;i<n;i++){
						if(nearPoint(points_stack[i], x, y)){
							points_hover=points_stack[i];
							points_hover['type']='h';
							break;
						}
					}
				}
				drawImage();
			}
		}

	}

	canvas.onmousemove = function(event){
		// getCoordinates(event);
		if(true==sta_edit){
			if (getStaCurve() == 6) return;

			var pos = windowToCanvas(canvas, event.clientX, event.clientY);
			var x = Math.floor((pos.x - imgX)/imgScale);
			var y = Math.floor((pos.y - imgY)/imgScale);
			var eps=10;
			var taskkind = $('#tab_task')[0].selectedIndex;

			if (getStaCurve() == 7 && ((taskkind == 0 && assFLAG0 == 2) || (taskkind == 1 && assFLAG1 == 2)) ){
				var points_ellipse_ass = points_ellipse_ass_array[taskkind];
				var n = points_ellipse_ass.length;
				for(var i=0;i<n;i++){
					if(nearPoint(points_ellipse_ass[i], x, y)){
						points_hover=points_ellipse_ass[i];
						points_hover['type']='h';
						break;
					}
				}
			}
			else if (getStaCurve() == 5){
				var points_stack = points_stack_array[taskkind];
				var n = points_stack.length;
				for(var i=0;i<n;i++){
					if(nearPoint(points_stack[i], x, y)){
						points_hover=points_stack[i];
						points_hover['type']='h';
						break;
					}
				}
			}
			generatePoints();
			drawImage();
		}
	}

	canvas.onmouseout = function(event)
	{
		commonMousemove();
	}

	canvas.onmousedown = function(event)
	{

		var taskkind = $('#tab_task')[0].selectedIndex;
		var points_stack = points_stack_array[taskkind];
		var points_ellipse = points_ellipse_array[taskkind];
		var points_ellipse_ass = points_ellipse_ass_array[taskkind];

        var n = points_stack.length;

		if(false == sta_edit){
			if (event.button == 1){

				var pos = windowToCanvas(canvas, event.clientX, event.clientY);
				event.preventDefault();
			    canvas.onmousemove = function(event)
			    {
			        canvas.style.cursor = "move";
			        var pos1 = windowToCanvas(canvas, event.clientX, event.clientY);
			        var x = pos1.x - pos.x;
			        var y = pos1.y - pos.y;
			        pos = pos1;
			        imgX += x;
			        imgY += y;
			        drawImage();
			    }
			    canvas.onmouseup = function()
			    {
			        canvas.onmousemove = null;
			        canvas.onmouseup = null;
			        canvas.style.cursor = "default";
			     //    canvas.onmousemove = function(event)
				    commonMousemove();
			    }
			}

		}else{
			var pos = windowToCanvas(canvas, event.clientX, event.clientY);
			var x = Math.floor((pos.x - imgX)/imgScale);
			var y = Math.floor((pos.y - imgY)/imgScale);
			var haschange = 0;

			if (getStaCurve() == 6){
				points_ellipse[0] = {x: x, y: y};

				//console.log("000 " + x + " " + y);

				canvas.onmousemove = function(event){


					var pos = windowToCanvas(canvas, event.clientX, event.clientY);
					var x = Math.floor((pos.x - imgX)/imgScale);
					var y = Math.floor((pos.y - imgY)/imgScale);

					points_ellipse[1] = {x: x, y: y};

				//	console.log("111 " + x + " " + y);

					generatePoints();
					drawImage();

					canvas.onmouseup = function(event){
						var pos = windowToCanvas(canvas, event.clientX, event.clientY);
						var x = Math.floor((pos.x - imgX)/imgScale);
						var y = Math.floor((pos.y - imgY)/imgScale);

						points_ellipse[1] = {x: x, y:y};


					//	console.log("222 " + x + " "  + y);

						generatePoints();
						drawImage();

				        canvas.onmouseup = null;
						canvas.onmousemove = null;
				        canvas.style.cursor = "default";
				        commonMousemove();
					//	alertify.success("pushed and save");
					}
				}

				canvas.onmouseup = function(event){

			        canvas.onmouseup = null;
					canvas.onmousemove = null;
			        canvas.style.cursor = "default";
			        commonMousemove();
				//	alertify.success("pushed and save");
				}

			}
			else if (getStaCurve() == 7){

				if ((taskkind == 0 && assFLAG0 == 2) || (taskkind == 1 && assFLAG1 == 2)){

					n = points_ellipse_ass.length;
					for(var i=0;i<n;i++){
						if(nearPoint(points_ellipse_ass[i], x, y)){


							canvas.onmousemove = function(event)
						    {
						        canvas.style.cursor = "move";
								var pos = windowToCanvas(canvas, event.clientX, event.clientY);
								var x = Math.floor((pos.x - imgX)/imgScale);
								var y = Math.floor((pos.y - imgY)/imgScale);
						        
								points_ellipse_ass[i]['x'] = x;
								points_ellipse_ass[i]['y'] = y;

								generatePoints();

				        		drawImage();
						    }
					        canvas.onmouseup = function(event)
						    {
						        canvas.onmousemove = null;
						        canvas.onmouseup = null;
						        canvas.style.cursor = "default";
						        commonMousemove();

						    }
						    return;
						}
					}

				}else{

					points_ellipse_ass[0] = {x: x, y: y};

					//console.log("000 " + x + " " + y);

					canvas.onmousemove = function(event){


						var pos = windowToCanvas(canvas, event.clientX, event.clientY);
						var x = Math.floor((pos.x - imgX)/imgScale);
						var y = Math.floor((pos.y - imgY)/imgScale);

						points_ellipse_ass[1] = {x: x, y: y};

					//	console.log("111 " + x + " " + y);

						generatePoints();
						drawImage();

						canvas.onmouseup = function(event){
							var pos = windowToCanvas(canvas, event.clientX, event.clientY);
							var x = Math.floor((pos.x - imgX)/imgScale);
							var y = Math.floor((pos.y - imgY)/imgScale);

							points_ellipse_ass[1] = {x: x, y:y};

							if (taskkind == 0) assFLAG0 = 0;
							if (taskkind == 1) assFLAG1 = 0;
						//	console.log("222 " + x + " "  + y);

							generatePoints();
							drawImage();

					        canvas.onmouseup = null;
							canvas.onmousemove = null;
					        canvas.style.cursor = "default";
					        commonMousemove();
						//	alertify.success("pushed and save");
						}
					}

					canvas.onmouseup = function(event){

				        canvas.onmouseup = null;
						canvas.onmousemove = null;
				        canvas.style.cursor = "default";
				        commonMousemove();
					//	alertify.success("pushed and save");
					}
				}

			}
			else if (getStaCurve() == 5){

				for(var i=0;i<n;i++){
					if(nearPoint(points_stack[i], x, y)){
						canvas.onmousemove = function(event)
					    {
					        canvas.style.cursor = "move";
							var pos = windowToCanvas(canvas, event.clientX, event.clientY);
							var x = Math.floor((pos.x - imgX)/imgScale);
							var y = Math.floor((pos.y - imgY)/imgScale);
					        
							points_stack[i]['x'] = x;
							points_stack[i]['y'] = y;
							generatePoints();
			        		drawImage();
					    }
				        canvas.onmouseup = function(event)
					    {
					        canvas.onmousemove = null;
					        canvas.onmouseup = null;
					        canvas.style.cursor = "default";
					        commonMousemove();
					    }
					    return;
					}
				}
				canvas.onmouseup = function(){
					var pos = windowToCanvas(canvas, event.clientX, event.clientY);
					var x = Math.floor((pos.x - imgX)/imgScale);
					var y = Math.floor((pos.y - imgY)/imgScale);

					var n=points_stack.length;
					if(n==0 || (Math.abs(points_stack[n-1].x-x)>10 || Math.abs(points_stack[n-1].y-y)>10)){
						if($('#tab_task')[0].selectedIndex != 2){
							points_stack.push({
								x: x,
								y: y
							});
							generatePoints();
						}else{
							points_stack[0] = {x: x,y: y};
						}
						drawImage();
					}

			        canvas.onmousemove = null;
			        canvas.onmouseup = null;
			        canvas.style.cursor = "default";
			        commonMousemove();
					//alertify.success("pushed and save");
				}


			}
		}
	}


	/*canvas.onmousewheel = */
	canvas.onwheel = function(event)
	{
		if(true == sta_edit) return;

	    var pos = windowToCanvas(canvas, event.clientX, event.clientY);
	    event.wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltaY * (-40));
	    
	    if(event.wheelDelta > 0)
	    {
	    	if(scaletime >= scalelimit) return;
	    	scaletime ++;
	        imgScale *= scalespeed;
	        imgX = imgX * scalespeed - pos.x;
	        imgY = imgY * scalespeed - pos.y;
	    }
	    else
	    {
	    	if(-scaletime >= scalelimit) return;
	    	scaletime --;
	        imgScale /= scalespeed;
	        imgX = imgX / scalespeed + pos.x / scalespeed;
	        imgY = imgY / scalespeed + pos.y / scalespeed;
	    }
	    drawImage();
	}
	$(document).bind('keydown', 'ctrl+s', function (){resCommit(); return false;});
	$(document).bind('keydown', 'ctrl+z', function (){undo(); return false;});

	//mobie
	function mobie_menu() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            // alert("phone");
            $("#phone_nav").show();
            //resize canvas
            $(window).resize(resizeCanvas);
 			function resizeCanvas() {
		        canvas.width = $(window).get(0).innerWidth/10*9;
		        if (canvas.width > 800) canvas.width = 800;
		        canvas.height = canvas.width/4*3;
        		drawImage();
			};
			resizeCanvas();

        } else {
            // alert("pc");
            $("#phone_nav").hide();
        }
    }
    mobie_menu();
    $("#hand_right").click(function() {
        var x = -canvas.width/10;
        imgX += x;
        drawImage();
    });
	$("#hand_left").click(function() {
        var x = canvas.width/10;
        imgX += x;
        drawImage();
    });
    $("#hand_down").click(function() {
        var y = -canvas.height/10;
        imgY += y;
        drawImage();
    });
    $("#hand_up").click(function() {
        var y = canvas.height/10;
        imgY+= y;
        drawImage();
    });
    $("#size_large").click(function() {
    	if(scaletime >= scalelimit) return;
    	scaletime ++;
        imgScale *= scalespeed;
        imgX = imgX * scalespeed - canvas.width/2;
        imgY = imgY * scalespeed - canvas.height/2;
	    drawImage();
    });
	$("#size_small").click(function() {
    	if(-scaletime >= scalelimit) return;
    	scaletime --;
        imgScale /= scalespeed;
        imgX = imgX / scalespeed + canvas.width/2/scalespeed;
        imgY = imgY / scalespeed + canvas.height/2/scalespeed;
	    drawImage();
    });

    $("#tab_tool")[0].onchange = function(){
    	sta_curve = getStaCurve();
    	generatePoints();
    	drawImage();
    }


    function drawMask(taskkind){
		console.log("drawMask");


		// printKeyPoints();
		cvsBuff = document.createElement('canvas');
		cvsBuff.width = 800;
		cvsBuff.height = 800;
		ctxBuff = cvsBuff.getContext('2d');

	    ctxBuff.clearRect(0, 0, cvsBuff.width, cvsBuff.height);
	    //ctxBuff.drawImage(img, imgX, imgY, img.width*imgScale, img.height*imgScale);
		ctxBuff.fillStyle = '#000000';
	    ctxBuff.fillRect(imgX, imgY, img.width*imgScale, img.height*imgScale);

	    var tmp = $("#tab_tool")[0].selectedIndex;
	    for(var toolindex = 0; toolindex < 3; toolindex++){

			$("#tab_tool")[0].selectedIndex = toolindex;

			generatePoints();
			points_generate = points_generate_array[taskkind];

			if (points_generate.length == 0) continue;

			console.log(toolindex);

			ctxBuff.save();
			ctxBuff.translate(imgX,imgY);//以图片建立用户坐标系


			ctxBuff.fillStyle ='rgba(255,255,255,.666)';//填充颜色：白色，半透明
			ctxBuff.lineWidth = 10;
		   	ctxBuff.beginPath();

			
			ctxBuff.moveTo(points_generate[0]['x']*imgScale, points_generate[0]['y']*imgScale);
			for(var i = 1; i < points_generate.length; i++){
				ctxBuff.lineTo(points_generate[i]['x']*imgScale, points_generate[i]['y']*imgScale);
			}


	  		ctxBuff.closePath();//可以把这句注释掉再运行比较下不同
	   		ctxBuff.fill();//填充颜色

			
			// 恢复之前的canvas状态
			ctxBuff.restore();
	    
	    }

	    $("#tab_tool")[0].selectedIndex = tmp;

	    context.clearRect(0, 0, canvas.width, canvas.height);
	    context.drawImage(cvsBuff, 0, 0);
    }

    $("#tab_mask").click(function(){
    	if (!maskFLAG){
			maskFLAG = 1;
    	}else{
    		maskFLAG = 0;
    	}
		generatePoints();
		drawImage();
    });

    function getNiceMask(taskkind){
    	var cvsMask = document.createElement('canvas');
		cvsMask.width = img.width;
		cvsMask.height = img.height;
		ctxMask = cvsMask.getContext('2d');

	    ctxMask.clearRect(0, 0, cvsMask.width, cvsMask.height);
	    //ctxBuff.drawImage(img, imgX, imgY, img.width*imgScale, img.height*imgScale);
		ctxMask.fillStyle = '#000000';
	    ctxMask.fillRect(0, 0, img.width, img.height);

	    var tmp = $("#tab_tool")[0].selectedIndex;
	    for(var toolindex = 0; toolindex < 3; toolindex++){

			$("#tab_tool")[0].selectedIndex = toolindex;

			generatePoints();
			points_generate = points_generate_array[taskkind];

			if (points_generate.length == 0) continue;

			console.log(toolindex);

			ctxMask.save();
			ctxMask.translate(0,0);//以图片建立用户坐标系


			ctxMask.fillStyle ='rgba(255,255,255,.666)';//填充颜色：白色，半透明
			ctxMask.lineWidth = 10;
		   	ctxMask.beginPath();

			
			ctxMask.moveTo(points_generate[0]['x'], points_generate[0]['y']);
			for(var i = 1; i < points_generate.length; i++){
				ctxMask.lineTo(points_generate[i]['x'], points_generate[i]['y']);
			}


	  		ctxMask.closePath();//可以把这句注释掉再运行比较下不同
	   		ctxMask.fill();//填充颜色

			
			// 恢复之前的canvas状态
			ctxMask.restore();
	    
	    }

	    $("#tab_tool")[0].selectedIndex = tmp;

	    return cvsMask;
    }

    $("#tab_mask_export").click(function(){
    	var cs = new CanvasSaver('/bgidb/tab/saveMask')
    	var taskkind = $("#tab_task")[0].selectedIndex;
    	var cnvs = getNiceMask(taskkind);
    	var imgname = taskkind == 0 ? "cupmask" : "diskmask";
		cs.savePNG(cnvs, imgname);
		//cs.savePNG(canvas, imgname);

    });

    function CanvasSaver(url) {
	
		this.url = url;
		
		this.savePNG = function(cnvs, fname) {
			if(!cnvs || !url) return;
			fname = fname || 'picture';
			
			var data = cnvs.toDataURL("image/png");
			data = data.substr(data.indexOf(',') + 1).toString();
			
			var dataInput = document.createElement("input") ;
			dataInput.setAttribute("name", 'imgdata') ;
			dataInput.setAttribute("value", data);
			dataInput.setAttribute("type", "hidden");
			
			var nameInput = document.createElement("input") ;
			nameInput.setAttribute("name", 'name') ;
			nameInput.setAttribute("value", fname + '.png');
			
			var myForm = document.createElement("form");
			myForm.method = 'post';
			myForm.action = url;
			myForm.appendChild(dataInput);
			myForm.appendChild(nameInput);
			
			document.body.appendChild(myForm) ;
			myForm.submit() ;
			document.body.removeChild(myForm) ;
		};
		
	}

});