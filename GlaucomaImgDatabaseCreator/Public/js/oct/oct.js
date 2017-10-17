/**
 * [用于处理所有的Oct页面的js控制代码]
 * @param  {[无]} ){
 * @return {[无]}     [canvas绘图、鼠标事件]
 */
$(document).ready(function(){

	//Layout avtive OCT标定在Layout高亮
	$('#top_nav_mainpage').parents('.active').attr('class', "");
	$('#top_nav_oct').parent().attr('class', "active");

    $(document).bind("contextmenu",function(e){
        return false;
    });


	var cvsBuff,//canvas的缓存空间
		ctxBuff,//canvas的缓存空间的画笔
		canvas,//实际的canvas
		context;//实际的canvas的画笔

	var img,//图片对象
	    imgIsLoaded,//图片是否加载完成;
	    imgX = 0,//图片的横坐标
	    imgY = 0,//图片的纵坐标
	    imgScale = 1;//图片的缩放比例

	
	var btn_statue,//进入编辑按钮
		btn_undo,//撤销按钮
		btn_redo,//恢复按钮
		btn_clear,//重置按钮
		btn_prePic,
		btn_nextPic,
		btn_forPic;

	var txt_picID;

	var sta_edit;

	//双击全屏
	var doubleTouchCount = 0;
	var fullScreenFlag = false;

	//初始化canvas大小，按钮jQuery对象
	(function int()
	{
	    canvas = $('#tab_canvas')[0];
	    context = canvas.getContext('2d');

	    if (window.innerHeight * $('#canvas_container').width() > window.innerWidth * $('#canvas_container').height()){
	    	canvas.width=$('#canvas_container').width();
			canvas.height=window.innerHeight;
	    }
	    else{
	    	canvas.width=window.innerWidth;
			canvas.height=$('#canvas_container').height();
	    }
        
		btn_prePic = $('#tab_prePic');//
		btn_nextPic = $('#tab_nextPic');//
		btn_forPic = $('#tab_forPic');//

		btn_clear = $('#btn_clear');

		txt_picID = $('#tab_picID');//

		sel_task = $('#tab_task');

		sta_edit = false;

	    loadImg();
	})();

	//加载canvas图片
	function loadImg()
	{
	    img = new Image();
	    img.onload = function()
	    {
	        imgIsLoaded = true;
	        if (canvas.height * img.width > img.height * canvas.width){
	        	imgScale = canvas.width / img.width;
	        }
	        else{
	        	imgScale = canvas.height / img.height;
	        }
			resetSetting();
	        drawImage();
			already();
	    }
	    img.src = $('#imginfo').attr('imgurl');
	    $('#tab_picID').attr('value',$('#imginfo').attr('imgid'));
	}
	//清空canvas设置
	function resetSetting()
	{
		if(imgIsLoaded)
		{
	        if (canvas.height * img.width > img.height * canvas.width){
	        	imgScale = canvas.width / img.width;
	        }
	        else{
	        	imgScale = canvas.height / img.height;
	        }
   			scaletime = 0;
   			if (canvas.height * img.width > img.height * canvas.width){
	        	imgX = 0;//(canvas.width - img.width) / 2 * imgScale;
	        	imgY = 0;//(canvas.height - img.height) /2 * imgScale;//canvas.height / 10;
	        }
	        else{
	        	
	        	imgX = 0;//(canvas.width - img.width) / 2 * imgScale;//canvas.width / 10;
	        	imgY = 0;//(canvas.height - img.height) /2 * imgScale;
	        }
   			clearTools();
		}
	}
	//获取前一张图片
	function getPrePic()
	{
	 	$.get(
			'/bgidb/oct/pic_change_ajax', 
			{oper : "1",nowpic :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['imginfo'] != null){
					img = new Image();
				    img.onload = function()
				    {
				        imgIsLoaded = true;
				        resetSetting();
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
	//获取下一张图片
	function getNextPic()
	{
	 	$.get(
			'/bgidb/oct/pic_change_ajax', 
			{oper : "2",nowpic :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['imginfo'] != null){
					img = new Image();
				    img.onload = function()
				    {
				        imgIsLoaded = true;
				        resetSetting();
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
	//获取指定图片
	function getForPic(myforpic)
	{
	 	$.get(
			'/bgidb/oct/pic_change_ajax', 
			{oper : "3",nowpic: $('#imginfo').attr('imgid'),forpic : myforpic},
			function(data){
			    if(data['imginfo'] != null){
					img = new Image();
				    img.onload = function()
				    {
				        imgIsLoaded = true;
				        resetSetting();
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
	//将对象转为JSON字符串
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
	//提交点的数据
	function resCommit()
	{
		if (pointsLayers.length > 0){
		 	$.post(
				'/bgidb/oct/res_commit_ajax', 
				{imgid :$('#imginfo').attr('imgid'),layers :JSONstringify(pointsLayers).replace(/\"/gm,"\\")},
				function(data){
				    if(data['wrongcode']==999) alertify.success("图层保存成功");
				    else alertify.error(data['wrongmsg']);
				    // console.log(JSONstringify(points_stack).replace(/\"/gm,"\\"));
				},
				"json");
		}
	}

	//读取点的数据
	function already()
	{
	 	$.post(
			'/bgidb/oct/already_oct_ajax',
			{imgid :$('#imginfo').attr('imgid')},
			function(data){
			    if(data['wrongcode']==999){
			    	//console.log(data['octlayers']);
			    	pointsLayers = jQuery.parseJSON(data['octlayers'].layers.replace(/\\/gm,"\""));
			    	//alertify.alert("读取成功");
			    	//console.log(pointsLayers);
			    	if (pointsLayers.length > 0){
				    	alertify.success("OCT信息读取成功");
				    	drawImage();
			    	}else {
			    		alertify.error("无OCT信息");
			    	}
				}else{
					//alertify.error("无OCT信息");
				}
			},
			"json");
	}
	//坐标转为canvas坐标
	function windowToCanvas(canvas, x, y)
	{
	    var bbox = canvas.getBoundingClientRect();
	    var ret = {
			x: (x - bbox.left),
			y: (y - bbox.top)
	    };
	    return ret;
	    
	}
	//清除原来标记
	function dataClear(){
		
	}
	//上一张图片
	btn_prePic.click(function(){
		dataClear();
		getPrePic();

	});
	//下一张图片
	btn_nextPic.click(function(){
		dataClear();
		getNextPic();
	});
	//读取某个图片
	btn_forPic.click(function(){
		dataClear();
		getForPic(txt_picID[0].value);
	});
	//清空当前
	btn_clear.click(function() {
		dataClear();
		drawImage();
	});

	//保存
	$('#tab_save').click(function(){
		resCommit();
	});
	//读取
	$('#tab_already').click(function(){
		already();
	});


	//绑定保存、读取事件
	$(document).bind('keydown', 'ctrl+s', function (){resCommit(); return false;});

	//全屏
	function fullScreen() {
		
		//var element = document.getElementById('canvas_container'),method = "RequestFullScreen";
		var element = document.getElementById('tab_canvas'),method = "RequestFullScreen";
		

		var prefixMethod;
		["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
			if (prefixMethod) 
				return;
			if (prefix === "") {
				// 无前缀，方法首字母小写
				method = method.slice(0,1).toLowerCase() + method.slice(1);
			}
			var fsMethod = typeof element[prefix + method];
				if (fsMethod + "" !== "undefined") {
					// 如果是函数,则执行该函数
					if (fsMethod === "function") {
						prefixMethod = element[prefix + method]();
					} else {
						prefixMethod = element[prefix + method];
					}
				}
			}
		);
		return prefixMethod;
	};

	//退出全屏
	function exitFullScreen() {
		try{
			de = document;

		    // exit full-screen
			if (de.exitFullScreen) {
				de.exitFullScreen();
			} else if (de.webkitExitFullScreen) {
				de.webkitExitFullScreen();
			} else if (de.webkitCancelFullScreen) {
				de.webkitCancelFullScreen();
			} else if (de.mozCancelFullScreen) {
				de.mozCancelFullScreen();
			} else if (de.msExitFullScreen) {
				de.msExitFullScreen();
			} 
		}
		catch(err){
			alert(err.description);
		}
	};


	//工具栏to_
	const HAND  = 0;//手指工具
	const PENCIL   = 1;//铅笔工具
	const ERASER   = 2;//橡皮工具
	const LAYER    = 3;//图层列表
	const NEWLAYER = 4;//新建图层
	const CLLAYER  = 5;//清空图层
	const RELEASE  = 6;//释放工具
	const MODIFICATION = 7;//修改工具

	var NOWSTATE = RELEASE;
	var STATESTR = ["手指工具", "铅笔工具", "橡皮工具", "图层列表", "新建图层", "清空图层", "释放工具", "修改工具"];
	//获取工具当前状态
	function getState(){
		return NOWSTATE;
	}                                                                                                                                                           
	//修改当前工具状态
	var state_txt = $("#tool_state");
	function changeState(state){
		NOWSTATE = state;
		if (0 <= NOWSTATE && NOWSTATE <= 7){
			state_txt.html(STATESTR[NOWSTATE]);
		}
		else {
			state_txt.html("其他状态");
		}
	}
	//手指工具
	$("#btn_hand").click(function(){
		if (NOWSTATE != HAND){
			changeState(HAND);
		}
	});
	//铅笔工具
	$("#btn_pencil").click(function(){
		if (NOWSTATE != PENCIL){
			changeState(PENCIL);
		}
	});
	//橡皮工具
	$("#btn_eraser").click(function(){
		if (NOWSTATE != ERASER){
			changeState(ERASER);
		}
	});
	//修改
	$("#btn_modification").click(function(){
		if (NOWSTATE != MODIFICATION){
			changeState(MODIFICATION);
		}
	});
	//图层列表
	$("#btn_list").click(function(){
		if (NOWSTATE != LAYER){
			//changeState(LAYER);
		}
	});
	//释放工具
	$("#btn_release").click(function(){
		if (NOWSTATE != RELEASE){
			changeState(RELEASE);
		}

		//debug
		pointsLayers.forEach(function(e){
			console.log(e);
		});

	});

	//拖拽工具箱
	var to_isdrag=false;   
	var to_tx,to_x,to_ty,to_y;
	$(function(){
	    document.getElementById("floatingToolbox").addEventListener('touchend',function(){  
	        to_isdrag = false;
	    });  
	    document.getElementById("floatingToolbox").addEventListener('touchstart',to_selectmouse);  
	    document.getElementById("floatingToolbox").addEventListener('touchmove',to_movemouse);  
	});

	//工具箱拖拽触摸移动
	function to_movemouse(e){
	  	e.preventDefault();
	  	if (to_isdrag){   
	   		var n = to_tx + e.touches[0].pageX - to_x;
	   		$("#movecontainer").css("left",n);  
	   		var n = to_ty + e.touches[0].pageY - to_y;
	   		$("#movecontainer").css("top",n);
	   		return false;   
	   	}   
	}

	//工具箱拖拽触摸开始
	function to_selectmouse(e){   
	  	e.preventDefault();
	   	to_isdrag = true;   
	   	to_tx = parseInt(document.getElementById("movecontainer").style.left+0);   
	   	to_x = e.touches[0].pageX;
	   	to_ty = parseInt(document.getElementById("movecontainer").style.top+0);   
	   	to_y = e.touches[0].pageY;

	   	return false;   
	}
	//铅笔
	var touchable = 'createTouch' in document;
	if (touchable) {
	    canvas.addEventListener('touchstart', onTouchStart, false);
	    canvas.addEventListener('touchmove', onTouchMove, false);
	    canvas.addEventListener('touchend', onTouchEnd, false);
	    canvas.addEventListener('touchcancel', onTouchCancel, false);
	}
	else
	{
	    //alert("touchable is false !");
	}

	//新增鼠标事件
	canvas.addEventListener("mousedown",doMouseDown,false); 
	canvas.addEventListener('mousemove', doMouseMove,false); 
	canvas.addEventListener('mouseup', doMouseUp, false); 

	//复制线段数组
	function cloneLines(lines){
		var len = lines.length;
		var re = new Array();
		for(var i = 0; i < len; i++){
			console.log(lines[i]);
			re.push(cloneLine(lines[i]));
		}
		return re;
	}

	//类型：图层
	function layer(ID, lines, name, display){
		this.ID = ID;
		this.lines = cloneLines(lines);
		this.name = name;
		this.display = display;
	}
	//图层数量限制
	var layerLengthLimit = 8;
	//当前图层
	var currentLayerId = 0;

	//存储图层信息
	var pointsLayers = new Array();

	//存储正在画的那条线段
	var linesBuffer = new Array();

	//上一次触摸坐标
	var lastX, lastX2;
	var lastY, lastY2;
	//刚触摸的时间
	var startTime;
	//刚接触的坐标
	var startX, startY;
	var ctx =canvas.getContext("2d");
	ctx.lineWidth=2;//画笔粗细
	ctx.strokeStyle="#00FFFF";//画笔颜色

	var surroundingLinesIndex;//保存某点周围的线段的序号
	var currentLines;//暂时保存当前图层的线段数组的数据

	var isDown = false;

	//触摸开始事件
	function onTouchStart(event) {
		try
	    {
	    	if (getState() != RELEASE){
		    	event.preventDefault();
	    	}
		    //单点
		    var pos = windowToCanvas(canvas, event.touches[0].clientX, event.touches[0].clientY);

		    if (getState() == MODIFICATION){
		    	//currentLayer = cloneLayer(pointsLayers[currentLayerId]);
		    	currentLines = cloneLines(pointsLayers[currentLayerId].lines);
		    	surroundingLinesIndex = getSurroundingLinesIndex(new point((pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale));
		    }

		    //画图连接邻近的断点
		    if (getState() == PENCIL){
		    	linesBuffer = new Array();

		    	var endPoint = findNeighbourhoodEndPoint(new point((pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale));
		    	//console.log(endPoint);
		    	if (endPoint){
		    		addPathToLinesBuffer(endPoint.x, endPoint.y, (pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale);
				   	drawImage();
		    	}
		    }


		    //第二点
		    if (event.touches[1]){
		    	var pos2 = windowToCanvas(canvas, event.touches[1].clientX, event.touches[1].clientY);
		    	lastX2 = pos2.x;
		    	lastY2 = pos2.y;
			}
		    lastX = pos.x;
		    lastY = pos.y;

		    startX = pos.x; 
		    startY = pos.y;
		    startTime=(new Date()).getTime();
		}
	    catch(err){
	        console.log( err);
	    }
	}

	function doMouseDown(event){
		try
	    {
	    	if (getState() != RELEASE){
		    	event.preventDefault();
	    	}

	    	isDown = true;
		    //单点
		    var pos = windowToCanvas(canvas, event.clientX, event.clientY);

			if (getState() == MODIFICATION){
		    	//currentLayer = cloneLayer(pointsLayers[currentLayerId]);
		    	console.log(pointsLayers[currentLayerId].lines);

		    	currentLines = cloneLines(pointsLayers[currentLayerId].lines);
		    	surroundingLinesIndex = getSurroundingLinesIndex(new point((pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale));
		    }

		    //画图连接邻近的断点
		    if (getState() == PENCIL){
		    	linesBuffer = new Array();

		    	var endPoint = findNeighbourhoodEndPoint(new point((pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale));
		    	//console.log(endPoint);
		    	if (endPoint){
		    		addPathToLinesBuffer(endPoint.x, endPoint.y, (pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale);
				   	drawImage();
		    	}
		    }

		    lastX = pos.x;
		    lastY = pos.y;

		    startX = pos.x; 
		    startY = pos.y;
		    startTime=(new Date()).getTime();
		}
	    catch(err){
	        console.log( err);
	    }
	}

	//将线段加入buffer
	function addPathToLinesBuffer(startX, startY, endX, endY){
		linesBuffer.push(new line(startX, startY, endX, endY));
	}

	//获取离pk最近的端点
	const NEIGHBOURLIMIT = 10;
	function findNeighbourhoodEndPoint(pk){
		var len = pointsLayers[currentLayerId].lines.length;

		var points = new Array();

		for(var i = 0; i < len; i++){
			var pi = new point(pointsLayers[currentLayerId].lines[i].startX, pointsLayers[currentLayerId].lines[i].startY);
			var pj = new point(pointsLayers[currentLayerId].lines[i].endX, pointsLayers[currentLayerId].lines[i].endY);

			var disIK = distance(pi, pk);
			if (disIK <= NEIGHBOURLIMIT/imgScale){
				points.push(pi);
			}

			var disJK = distance(pj, pk);
			if (disJK <= NEIGHBOURLIMIT/imgScale){
				points.push(pj);
			}
		}

		//console.log(points);

		points.sort(function(a,b){
			if (a.x == b.x){
				return a.y < b.y ? -1 : 1;
			}
			return a.x < b.y ? -1 : 1;
		});

		len = points.length;
		var candidatePoints = new Array();
		for(var i = 0; i < len; i++){
			if (i == len - 1){
				candidatePoints.push(points[i]);
				break;
			}
			if (points[i].isEqualTo(points[i+1])){
				i++;
			}
			else{
				candidatePoints.push(points[i]);
			}
		}

		len = candidatePoints.length;
		if (len < 1){
			return null;
		}
		else{
			var re = candidatePoints[0];

			for(var i = 1; i < len; i++){
				if (distance(re, pk) > distance(candidatePoints[i], pk)){
					re = candidatePoints[i];
				}
			}

			return re;
		}
		
	}

	//触摸位置移动事件，不同工具表现不同
	function onTouchMove(event) {
	    try
	    {
	    	doubleTouchCount = 0;

	    	if (getState() == HAND){
	    		event.preventDefault();

	    		if (event.touches[1]){
	    			var pos = windowToCanvas(canvas, event.touches[0].clientX, event.touches[0].clientY);
			        var x = pos.x - lastX;
			        var y = pos.y - lastY;

				    var pos2 = windowToCanvas(canvas, event.touches[1].clientX, event.touches[1].clientY);
			        var x2 = pos2.x - lastX2;
			        var y2 = pos2.y - lastY2;

				    var lastDis = Math.sqrt((lastX - lastX2) * (lastX - lastX2) + (lastY - lastY2) * (lastY - lastY2));
				    var dis = Math.sqrt((pos.x - pos2.x) * (pos.x - pos2.x) + (pos.y - pos2.y) * (pos.y - pos2.y));

				    var scale = dis / lastDis;

				    imgScale = imgScale * scale;
				    var centerX = (pos.x + pos2.x)/2;
				    var centerY = (pos.y + pos2.y)/2;
				    var lastCenterX = (lastX + lastX2)/2;
				    var lastCenterY = (pos.y + pos2.y)/2;

				    var shiftX = (x + x2)/2;
				    var shiftY = (y + y2)/2;

				    imgX = imgX * scale + shiftX + centerX * (1 - scale);
				    imgY = imgY * scale + shiftY + centerY * (1 - scale);

				    lastX = pos.x;
				    lastY = pos.y;
				    lastX2 = pos2.x;
				    lastY2 = pos2.y;

			        drawImage();
	    		}
	    		else{
	    			var pos = windowToCanvas(canvas, event.touches[0].clientX, event.touches[0].clientY);
			        var x = pos.x - lastX;
			        var y = pos.y - lastY;
			        		    
				    lastX = pos.x;
				    lastY = pos.y;

			        imgX += x;
			        imgY += y;
			        drawImage();
	    		}
	    	}
	    	else if (getState() == PENCIL && pointsLayers[currentLayerId].display == true){
	    		event.preventDefault();
	    		
		    	//单点
			    var pos = windowToCanvas(canvas, event.touches[0].clientX, event.touches[0].clientY);
			   
				//drawLine(lastX,lastY,pos.x,pos.y);
				addPathToLinesBuffer((lastX - imgX)/imgScale, (lastY - imgY)/imgScale, (pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale);
			   	drawImage();
			   	
			    lastX=pos.x;
			    lastY=pos.y;
	    	}
	    	else if (getState() == ERASER && pointsLayers[currentLayerId].display == true){
	    		event.preventDefault();
	    		//单点
			    var pos = windowToCanvas(canvas, event.touches[0].clientX, event.touches[0].clientY);

			   	erasePath((lastX - imgX)/imgScale,(lastY - imgY)/imgScale, (pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale);
			   	
			    lastX=pos.x;
			    lastY=pos.y;

			    drawImage();
	    	}
	    	else if (getState() == MODIFICATION && pointsLayers[currentLayerId].display == true){

			    var pos = windowToCanvas(canvas, event.touches[0].clientX, event.touches[0].clientY);
			    //newLayer = getChangedLayer((lastX - imgX)/imgScale, (lastY - imgY)/imgScale, (pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale);
			    pointsLayers[currentLayerId].lines = getChangedLines((lastX - imgX)/imgScale, (lastY - imgY)/imgScale, (pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale);

			    drawImage();
	    	}
	    	else if (getState() == RELEASE){

	    	}
	    }
	    catch(err){
	        console.log(err);
	    }

	}


	function doMouseMove(event){
		try
	    {
	    	doubleTouchCount = 0;

	    	if (isDown == false){
	    		return;
	    	}

	    	if (getState() == HAND){
	    		event.preventDefault();
				
				var pos = windowToCanvas(canvas, event.clientX, event.clientY);
		        var x = pos.x - lastX;
		        var y = pos.y - lastY;
		        		    
			    lastX = pos.x;
			    lastY = pos.y;

		        imgX += x;
		        imgY += y;
		        drawImage();
	    	}
	    	else if (getState() == PENCIL && pointsLayers[currentLayerId].display == true){
	    		event.preventDefault();
	    		
		    	//单点
			    var pos = windowToCanvas(canvas, event.clientX, event.clientY);
			   
				//drawLine(lastX,lastY,pos.x,pos.y);
				addPathToLinesBuffer((lastX - imgX)/imgScale, (lastY - imgY)/imgScale, (pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale);
			   	drawImage();
			   	
			    lastX=pos.x;
			    lastY=pos.y;
	    	}
	    	else if (getState() == ERASER && pointsLayers[currentLayerId].display == true){
	    		event.preventDefault();
	    		//单点
			    var pos = windowToCanvas(canvas, event.clientX, event.clientY);

			   	erasePath((lastX - imgX)/imgScale,(lastY - imgY)/imgScale, (pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale);
			   	
			    lastX=pos.x;
			    lastY=pos.y;

			    drawImage();
	    	}
	    	else if (getState() == MODIFICATION && pointsLayers[currentLayerId].display == true){

			    var pos = windowToCanvas(canvas, event.clientX, event.clientY);
			    //newLayer = getChangedLayer((lastX - imgX)/imgScale, (lastY - imgY)/imgScale, (pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale);
			    pointsLayers[currentLayerId].lines = getChangedLines((lastX - imgX)/imgScale, (lastY - imgY)/imgScale, (pos.x - imgX)/imgScale, (pos.y - imgY)/imgScale);

			    drawImage();
	    	}
	    	else if (getState() == RELEASE){

	    	}
	    }
	    catch(err){
	        console.log(err);
	    }
	}

	var SURROUNDINGUPPERBOUND = 23;//23px

	//获取点pk周围的线上的点的序号 0和1构成一条线 2和3构成一条线以此类推
	function getSurroundingLinesIndex(pk){
		var indexs = new Array();
		var len = currentLines.length;
		for(var i = 0; i < len; i++){
			var pi = new point(currentLines[i].startX, currentLines[i].startY);
			var pj = new point(currentLines[i].endX, currentLines[i].endY);

			var disIK = distance(pi, pk);
			if (disIK <= SURROUNDINGUPPERBOUND){
				indexs.push(i*2);
			}

			var disJK = distance(pj, pk);
			if (disJK <= SURROUNDINGUPPERBOUND){
				indexs.push(parseInt(i*2) + 1);
			}
		}
		return indexs;
	}

	function getChangedLines(startX, startY, endX, endY){
		var direction = new point(endX - startX, endY - startY);
		var changedLines = cloneLines(currentLines);

		var len = surroundingLinesIndex.length;



		for(var i = 0; i < len; i++){
			var id = parseInt(surroundingLinesIndex[i]);

			var j = parseInt(id/2);

			var rate;

			if(id % 2 == 0){
				rate = (SURROUNDINGUPPERBOUND - distance(new point(changedLines[j].startX, changedLines[j].startY), new point(startX, startY))) / SURROUNDINGUPPERBOUND;
				
				changedLines[j].startX = changedLines[j].startX + rate * direction.x;
				changedLines[j].startY = changedLines[j].startY + rate * direction.y;
			}
			else{
				rate = (SURROUNDINGUPPERBOUND - distance(new point(changedLines[j].endX, changedLines[j].endY), new point(startX, startY))) / SURROUNDINGUPPERBOUND;
				
				changedLines[j].endX = changedLines[j].endX + rate * direction.x;
				changedLines[j].endY = changedLines[j].endY + rate * direction.y;
			}

		}

		return changedLines;
	}


	//超出当前触碰范围触发取消事件
	function onTouchCancel(event) {
	    try
	    {
	    	doubleTouchCount = 0;
	    	event.preventDefault();

	    }
	    catch(err){
	    	console.log(err);
	    }
	}

	//画线段
	function drawStraight(lines,col)
	{
		if(lines.length==0) return;
		ctxBuff.save();
		ctxBuff.translate(imgX,imgY);

	    ctxBuff.lineCap="round";
		ctxBuff.lineWidth=1;//画笔粗细
		ctxBuff.strokeStyle=col;//画笔颜色

		for (var i = 0; i < lines.length; i ++) {
			ctxBuff.beginPath();
		    ctxBuff.moveTo(lines[i].startX * imgScale,lines[i].startY * imgScale);
		    ctxBuff.lineTo(lines[i].endX * imgScale,lines[i].endY * imgScale);
		    ctxBuff.stroke();
		}


		// 恢复之前的canvas状态
		ctxBuff.restore();
	}

	//刷新canvas
	function drawImage()
	{

		// printKeyPoints();
		cvsBuff = document.createElement('canvas');
		cvsBuff.width = canvas.width;
		cvsBuff.height = canvas.height;
		ctxBuff = cvsBuff.getContext('2d');

	    ctxBuff.clearRect(0, 0, cvsBuff.width, cvsBuff.height);
	    ctxBuff.drawImage(img, imgX, imgY, img.width*imgScale, img.height*imgScale);

	    var color = new Array("#0000FF", '#00FF00', "#00FFFF", "#FF0000", "#FF00FF");

	    for (var i = 0; i < pointsLayers.length; i++){
	    	if (pointsLayers[i].display == true){
	    		var col = "#00FFFF";
	    		if (i < 5) col = color[i];
				drawStraight(pointsLayers[i].lines,col);
	    	}
	    }

	    drawStraight(linesBuffer,"#00FFFF");

	    context.clearRect(0, 0, canvas.width, canvas.height);
	    context.drawImage(cvsBuff, 0, 0);

	    //console.log("reDraw");
	}

	//类型：线段
	function line(startX, startY, endX, endY){
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
	}
	function cloneLine(_line){
		return new line(_line.startX, _line.startY, _line.endX, _line.endY);
	}

	function deleteOldLayer(n){
		try{
			pointsLayers = pointsLayers.del(n);
		}
		catch(err){
			console.log(err);
		}
	}

	// Generate four random hex digits.
	function S4() {
	   	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	// Generate a pseudo-GUID by concatenating random hexadecimal.
	function guid() {
	   	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	};
	//生成独一无二的标识码
	function generateLayerID(){
		return guid();
	}

	//新建图层
	function createNewLayer(){
		pointsLayers.push(new layer(generateLayerID(), new Array(), $('#newLayerName').val(), true));
		
		return pointsLayers.length - 1;
	}
	//向当前图层添加一条线
	function addPath(_line){//id = 0~n-1
		pointsLayers[currentLayerId].lines.push(_line);
	}
	//去除当前层所有线段
	function clearCurrentLayer(){
		try{
			//if (pointsLayers[currentLayerId].length > 0){
			//	pointsLayers[currentLayerId] = new Array();
			//}
			if (pointsLayers[currentLayerId].lines.length > 0){
				pointsLayers[currentLayerId].lines = new Array();
			}
		}catch(err){
			console.log(err);
		}
	}
	//canvas画一条线
	function drawLine(startX,startY,endX,endY){
	    ctx.beginPath();
	    ctx.lineCap="round";
	    ctx.moveTo(startX,startY);
	    ctx.lineTo(endX,endY);
	    ctx.stroke();
	}
	//返回删除数组的第n位之后的新数组
	Array.prototype.del = function(n) {
		if (n < 0){
			return this;
		}
		else{
			return this.slice(0,n).concat(this.slice(n+1,this.length));
		}
	}
	//橡皮擦去除当前图层线段上的点
	function erasePath(lastx, lasty, x, y){//id = 0~n-1
		try{
			var id = currentLayerId;
			if (id == -1){				
				alert("没有图层");
				return false;
			}
			if (pointsLayers.length < parseInt(id) + 1){

				console.log("erasePath");
				return false;
			}
			for(var i = 0; i < pointsLayers[id].lines.length; i++){
				if (isIntersected(new line(lastx, lasty, x, y), pointsLayers[id].lines[i])){
					pointsLayers[id].lines = pointsLayers[id].lines.del(i);
					i--;
				}
			}
		}
	    catch(err){
	        console.log(err);
		}
		
	}
	//类型：点
	function point(x, y){
		this.x = x;
		this.y = y;
	}
	//比较点的值相等
	point.prototype.isEqualTo = function(pk){
		try{
			return this.x == pk.x && this.y == pk.y;
		}
		catch(err){
			console.log(err);
			return null;
		}
	}
	//叉积
	function direction(pi, pj, pk){//向量 pipk pipj 的叉积
		return (pi.x - pk.x)*(pi.y - pj.y) - (pi.y - pk.y)*(pi.x - pj.x);
	}
	//判断i j k是否共线
	function onSegment(pi, pj, pk){//判断点pk是否在线段pi pj上
		if(Math.min(pi.x, pj.x) <= pk.x && pk.x <= Math.max(pi.x, pj.x)){
			if(Math.min(pi.y, pj.y) <= pk.y && pk.y <= Math.max(pi.y, pj.y)){
				return true;
			}
		}
		return false;
	}
	//返回pi和pj的距离
	function distance(pi, pj){
		return Math.sqrt((pi.x - pj.x) * (pi.x - pj.x) + (pi.y - pj.y) * (pi.y - pj.y));
	}


	const ERASERRADIUS = 8;
	//点距离圆的距离 以及线段相交
	function isIntersected(line1, line2){
		p1 = new point(line1.startX, line1.startY);
		p2 = new point(line1.endX, line1.endY);
		p3 = new point(line2.startX, line2.startY);
		p4 = new point(line2.endX, line2.endY);

		if (distance(p1, p3) <= ERASERRADIUS/imgScale  || distance(p1, p4) <= ERASERRADIUS/imgScale || distance(p2, p3) <= ERASERRADIUS/imgScale || distance(p2, p4) <= ERASERRADIUS/imgScale){
			return true;
		}

		var d1 = direction(p3, p4, p1);
		var d2 = direction(p3, p4, p2);
		var d3 = direction(p1, p2, p3);
		var d4 = direction(p1, p2, p4);

		if (d1 * d2 < 0 && d3 * d4 < 0)
			return true;
		if (Math.abs(d1) <= 1e-6 && onSegment(p3, p4, p1))
			return true;
		if (Math.abs(d2) <= 1e-6 && onSegment(p3, p4, p2))
			return true;
		if (Math.abs(d3) <= 1e-6 && onSegment(p1, p2, p3))
			return true;
		if (Math.abs(d4) <= 1e-6 && onSegment(p1, p2, p4))
			return true;
		//console.log("没有相交");
		return false;
	}

	//触摸结束事件
	function onTouchEnd(event){
		try{
		    //单点
		    
		    var in_dis = false;

		    if (Math.abs(startX - lastX) < 6 && Math.abs(startY - lastY) < 6){
		    	in_dis = true;
		    }
		    else{
		    	in_dis = false;
		    }

		    var endTime = (new Date()).getTime();

		    if (endTime - startTime < 500 && in_dis){
		    	doubleTouchCount++;
		    	if (doubleTouchCount >= 2){
		    		if (isFullScreen()){
		    			fullScreenFlag = false;
		    			exitFullScreen();
		    		}
		    		else{
		    			fullScreenFlag = true;
		    			fullScreen();
		    		}
		    		doubleTouchCount = 0;
		    	}
		    }

		    //若是第二指松开，则还留有一指，将位置更新位剩余的一指，避免无谓的先前位置和当下位置的位移
		    if (event.touches[0]){
	    		var pos = windowToCanvas(canvas, event.touches[0].clientX, event.touches[0].clientY);
		    	lastX = pos.x;
		    	lastY = pos.y;
		    }

			
		    if (getState() == PENCIL){
		    	//画图连接邻近的断点
		    	var endPoint = findNeighbourhoodEndPoint(new point((lastX - imgX)/imgScale, (lastY - imgY)/imgScale));
		    	//console.log(endPoint);
		    	if (endPoint){
			    	addPathToLinesBuffer((lastX - imgX)/imgScale, (lastY - imgY)/imgScale, endPoint.x, endPoint.y);
				   	drawImage();
		    	}

		    	//将缓存的线段加入存储
		    	for(var i = 0; i < linesBuffer.length; i++){
		    		addPath(linesBuffer[i]);
		    	}
		    	linesBuffer = new Array();
		    	drawImage();
		    }
		}
		catch(err){
			console.log(err);
		}
	}


	function doMouseUp(event){
		try{
		    //单点

		    isDown = false;
		    
		    var in_dis = false;

		    if (Math.abs(startX - lastX) < 6 && Math.abs(startY - lastY) < 6){
		    	in_dis = true;
		    }
		    else{
		    	in_dis = false;
		    }

		    var endTime = (new Date()).getTime();

		    if (endTime - startTime < 500 && in_dis){
		    	doubleTouchCount++;
		    	if (doubleTouchCount >= 2){
		    		if (isFullScreen()){
		    			fullScreenFlag = false;
		    			exitFullScreen();
		    		}
		    		else{
		    			fullScreenFlag = true;
		    			fullScreen();
		    		}
		    		doubleTouchCount = 0;
		    	}
		    }

			
		    if (getState() == PENCIL){
		    	//画图连接邻近的断点
		    	var endPoint = findNeighbourhoodEndPoint(new point((lastX - imgX)/imgScale, (lastY - imgY)/imgScale));
		    	//console.log(endPoint);
		    	if (endPoint){
			    	addPathToLinesBuffer((lastX - imgX)/imgScale, (lastY - imgY)/imgScale, endPoint.x, endPoint.y);
				   	drawImage();
		    	}

		    	//将缓存的线段加入存储
		    	for(var i = 0; i < linesBuffer.length; i++){
		    		addPath(linesBuffer[i]);
		    	}
		    	linesBuffer = new Array();
		    	drawImage();
		    }
		}
		catch(err){
			console.log(err);
		}
	}
	//判断是否全屏
	function isFullScreen(){
		return fullScreenFlag;
	}
	//显示图层列表模态框的内容
	$("#layerModal").on('show.bs.modal', function(e){
		showLayerModalContent();
	});
	//保存图层列表的设置
	$("#layerModalSave").click(function(){
		$('#layerModal').modal('hide');
		currentLayerId = $('input:radio[name=layerRadio]:checked').val();

		$("input:text[name='layerName']").each(function(){
			pointsLayers[$(this).attr("sortid")].name = $(this).val();
		});

		$("input:checkbox[name='layerCheck']").each(function(){
			if ($(this).attr("checked") == "checked"){
				pointsLayers[$(this).val()].display = true;
			}
			else{
				pointsLayers[$(this).val()].display = false;
			}
		});

		drawImage();
	});
	//保存新建图层的信息
	$("#newLayerModalSave").click(function(){
		$('#newLayerModal').modal('hide');
		currentLayerId = createNewLayer();

	});
	//刷新图层状态模态窗的内容
	function showLayerModalContent(){
		try{
			var html = '';
			for (var i = 0; i < pointsLayers.length; i++) {
				html += '<div class="input-group input-group-lg">';
		  		html += '<input type="text" class="form-control" name="layerName" sortid="' + i + '" value="' + pointsLayers[i].name + '">';
				html += '<span class="input-group-addon">';
				if (pointsLayers[i].display == true){
					html += '<input type="checkbox" name="layerCheck" value="' + i + '" checked="checked" >';
				}
				else{
					html += '<input type="checkbox" name="layerCheck" value="' + i + '" >';
				}
				html += '</span>';
				html += '<span class="input-group-addon">';
				html += '<input type="radio" name="layerRadio" value="'+ i + '" id="layerId' + i + '">';
				html += '</span>';
			  	html += '<span class="input-group-btn">';
		        html += '<button class="btn btn-default btn_delete" type="button" sortid="' + i + '" >删除</button>';
		    	html += '</span>';
				html += '</div>';
			}
			
			$("#layerModalBody").html(html);

			$("#layerId" + currentLayerId).attr('checked',true);

			$(".btn_delete").click(function(){
				deleteOldLayer($(this).attr("sortid"));
				showLayerModalContent();
			});
		}
		catch(err){
			console.log(err);
		}
	}
	//新建图层模态窗的关闭按钮触发事件
	$('#newLayerModal').on('hidden.bs.modal', function (e) {
		showLayerModalContent();
	});
	//返回图层数量
	function countLayers(){
		return pointsLayers.length;
	}
	//去除工具栏相关的变量和标记
	function clearTools(){

		changeState(RELEASE);
	

		pointsLayers = new Array();
		//pointsLayersName = new Array();
		//layerLimit = parseInt(5);
		currentLayerId = 0;

		doubleTouchCount = 0;
		fullScreenFlag = false;

		if (countLayers() == 0){
			//createNewLayer();
			createFiveNewLayers();
		}
	}

	function createFiveNewLayers(){
		pointsLayers.push(new layer(generateLayerID(), new Array(), "ILM", true));
		pointsLayers.push(new layer(generateLayerID(), new Array(), "RNFL-GCL", true));
		pointsLayers.push(new layer(generateLayerID(), new Array(), "IPL-INL", true));
		pointsLayers.push(new layer(generateLayerID(), new Array(), "BM", true));
		pointsLayers.push(new layer(generateLayerID(), new Array(), "BMO", true));
	}

/*
	function drawStraight2(lines, ctx)
	{
		if(lines.length==0) return;
		ctx.save();
		ctx.translate(imgX,imgY);

	    ctx.lineCap="round";
		ctx.lineWidth=1;//画笔粗细
		ctx.strokeStyle="#00FFFF";//画笔颜色

		for (var i = 0; i < lines.length; i ++) {
			ctx.beginPath();
		    ctx.moveTo(lines[i].startX * imgScale,lines[i].startY * imgScale);
		    ctx.lineTo(lines[i].endX * imgScale,lines[i].endY * imgScale);
		    ctx.stroke();
		}


		// 恢复之前的canvas状态
		ctx.restore();
	}
*/
	/*function getNiceMask(){
		var cvs = document.createElement('canvas');
		cvs.width = canvas.width;
		cvs.height = canvas.height;
		ctx = cvs.getContext('2d');

	    ctx.clearRect(0, 0, cvs.width, cvs.height);
	    ctx.drawImage(img, imgX, imgY, img.width*imgScale, img.height*imgScale);

	    for (var i = 0; i < pointsLayers.length; i++){
	    	if (pointsLayers[i].display == true){
				drawStraight2(pointsLayers[i].lines, ctx);
	    	}
	    }

	    drawStraight2(linesBuffer, ctx);

	    return cvs;
	}*/

	$("#btn_preview").click(function(){
		var url = "/bgidb/oct/preview";
		var imgidInput = document.createElement("input") ;
		imgidInput.setAttribute("name", 'imgid');
		imgidInput.setAttribute("value", $('#imginfo').attr('imgid'));
		imgidInput.setAttribute("type", "hidden");
		
		var myForm = document.createElement("form");
		myForm.method = 'post';
		myForm.target = '_blank';
		myForm.action = url;
		myForm.appendChild(imgidInput);
		
		document.body.appendChild(myForm) ;
		myForm.submit();
		document.body.removeChild(myForm) ;
	});

	/*
	$("#btn_export").click(function(){
    	var cs = new CanvasSaver('/bgidb/tab/saveMask')
    	var cnvs = getNiceMask();
    	var imgname = "untitled";
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
	*/
});