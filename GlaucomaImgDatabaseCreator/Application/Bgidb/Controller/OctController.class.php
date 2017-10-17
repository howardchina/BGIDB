<?php
namespace Bgidb\Controller;
use Think\Controller;
class OctController extends Controller {
	public function _initialize()
	{
		header("X-XHR-Current-Location: ".current_url());
	}

    public function Oct()
    {
        //标定页
        //$data['imginfo']提供给前端，目前暂定打开此页面时候后台提供第一个图的信息，以后会加入cookie功能

    	layout('Layout/layout');
    	if(!IsLoggedin())
    	{
    		$data['wrongmsg'] = "未登录用户无法进行标定";
    		$this->assign($data);
    		$this->display('Public:alert');
    		return;
    	}

        //获取前台传来的ImgName，打开图片
        $imageName = I("post.imageName");
        $imageId = I("post.imageId");
        var_dump($imageName);
        var_dump($imageId);
        $Img = M('oct');
        if ($imageName){
            $conf = array(
                'name' => $imageName
            );
            $data['imginfo'] = $Img->where($conf)->find();
        }else if($imageId){
            $conf = array(
                'id' => $imageId
            );
            $data['imginfo'] = $Img->where($conf)->find();
        }
        else{
            $data['imginfo'] = $Img->order('id asc')->find();
        }

    	$this->assign($data);
        $this->display();
    }

    public function pic_change_ajax()
    //上一张、下一张、跳转到
    //接收POST或GET皆可
    //接收参数：
    //nowpic//当前图片编号
    //oper//操作，1为上一张，2为下一张，3为指定某一张
    //forpic//如果oper参数为3，则提供forpic指定编号
    {
    	$nowpic = I('param.nowpic');
    	$oper = intval(I('param.oper'));
    	$forpic = I('param.forpic');
    	$data = $this->findpic($oper, $nowpic, $forpic);
    	$this->ajaxReturn($data);//ajaxReturn函数返回json格式的数据，供js的ajax调用。
    }
    private function findpic($oper, $nowpic, $forpic)
    //private，与前端无关的功能函数，查找数据库对应图片信息（上一张、下一张、某一张）
    {
    	$Img = M('oct');
    	$map = array();
    	$order = "";
    	switch($oper)
    	{
    		case 1://上一张
    			$map = array(
    				'id' => array('lt', $nowpic)
    			);
    			$order = 'id desc';
    			break;
    		case 2://下一张
    			$map = array(
    				'id' => array('gt', $nowpic)
    			);
    			$order = 'id asc';
    			break;
    		case 3://指定
    			$map = array(
    				'id' => $forpic
    			);
    			$order = 'id asc';
    			break;
    	}
    	$data['imginfo'] = $Img->where($map)->order($order)->find();
    	return $data;
    }
    public function res_commit_ajax()
    {
   	//保存已标定的数据
    //接收POST或GET皆可
    //layers//json格式的图层信息
    //imgid//图片id
    //要插入两个表，一个是gidb_octtask，把任务插进去，一个是octlayers，把layers序列插进去
    //要判断表中是否已存在对应信息，存在的话应该是更新而不是插入。
    //相关数据要对应
    //要返回给前端成功与否的信息，$this->ajaxReturn($data);

    	$WRONG_CODE = C('WRONG_CODE');
    	$WRONG_MSG = C('WRONG_MSG');
    	$data['wrongcode'] = $WRONG_CODE['totally_right'];
    	$uid = session('gidb_uid');
    	if(I('param.imgid', null) == null)
    		$data['wrongcode'] = $WRONG_CODE['query_data_invalid'];
    	else 
    	{
    		$map = array(
    			'imgid' => intval(I('param.imgid')),
    			'uid' => $uid
    		);
    		$OCTTask = M('octtask');
    		$taskinfo = $OCTTask->where($map)->find();
    		$OCTLayers = M('octlayers');
    		if($taskinfo == null || $OCTLayers->where($taskinfo['id'])->find() == null)
    		{
    			$tid = $OCTTask->add($map);
    			$octlayers_add = array(
    				'octtaskid' => $tid,
    				'layers' => I('param.layers')
    			);
    			$OCTLayers->add($octlayers_add);
    		}
    		else 
    		{
    			$octlayers_update = array(
    				'layers' => I('param.layers')
    			);
    			$OCTLayers->where('octtaskid="%d"', $taskinfo['id'])->save($octlayers_update);
    		}
    	}
    	$data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
    	$this->ajaxReturn($data);
    //返回前端的json消息：
    //wrongcode，参考/gidb/GlaucomaImgDatabaseCreator/Application/Common/Conf/ConstVal.php
    //wrongmsg，对应wrongcode的错误提示消息
    }
    public function already_oct_ajax()
    {
    //返回已标定数据供前端显示
    //接收POST或GET皆可
    //uid//用户id
    //imgid//图片id

    	$WRONG_CODE = C('WRONG_CODE');
    	$WRONG_MSG = C('WRONG_MSG');
    	$data['wrongcode'] = $WRONG_CODE['totally_right'];
    	$uid = session('gidb_uid');
    	if(I('param.imgid', null) == null)
    		$data['wrongcode'] = $WRONG_CODE['query_data_invalid'];
    	else
    	{
    		$map = array(
    				'imgid' => intval(I('param.imgid')),
    				'uid' => $uid
    		);
    		$OCTTask = M('octtask');
    		$taskinfo = $OCTTask->where($map)->find();
    		if($taskinfo == null)
    		{
    			$data['wrongcode'] = $WRONG_CODE['not_exist'];
    		}
    		else
    		{
    			$data['taskinfo'] = $taskinfo;
    			$OCTlayers = M('octlayers');
    			$map = array(
    				'octtaskid' => $taskinfo['id']
    			);
    			$data['octlayers'] = $OCTlayers->where($map)->find();
    		}
    	}
    	$data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
    	$this->ajaxReturn($data);
    }
    

    public function octFileSys(){
        //layout('Layout/layout');
        if(!IsLoggedin())
        {
            $data['wrongmsg'] = "未登录用户无法进行标定";
            $this->assign($data);
            $this->display('Public:alert');
            return;
        }

        $this->display();
    }

    public function octFileAjax(){
        $WRONG_CODE = C('WRONG_CODE');
        $WRONG_MSG = C('WRONG_MSG');
        $data['wrongcode'] = $WRONG_CODE['totally_right'];

        $parent = I("post.parent", null);
        if ($parent == null){
            $data['wrongcode'] = $WRONG_CODE['query_data_invalid'];
        }
        else{
            $oF = M("octfolder");
            $cond = array(
                'parent' => $parent
            );
            $re = $oF->where($cond)->select();

            if (!$re){
                $data['wrongcode'] = $WRONG_CODE['not_exist'];
            }
            else{
                foreach ($re as $key => $file) {
                    if($file['leaf'] == 1){
                        $oct = M("oct");
                        $cond = array(
                            'name' => $file['nodename']
                        );
                        $img = $oct->field('imgsite')->where($cond)->find();
                        $re[$key]['imgsite'] = $img['imgsite'];
                    }
                }

                $data['files'] = $re;

                $oF = M("octfolder");
                $cond = array(
                    'id' => $parent
                );
                $backStepId = $oF->field('parent')->where($cond)->find();
                if (!$backStepId){
                    $data['backStepId'] = 0;
                }
                else{
                    $data['backStepId'] = $backStepId['parent'];
                }
            }
        }

        $data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
        $this->ajaxReturn($data);
    }

    public function preview(){
        $uid = session('gidb_uid');
        $imgid = I('param.imgid');
        $ol = M("octlayers");
        $re = $ol->join("gidb_octtask ON gidb_octlayers.octtaskid = gidb_octtask.id")->join("gidb_oct ON gidb_octtask.imgid = gidb_oct.id")->field('name,layers,imgsite')->where("layers is not null AND layers<>'[]' AND uid='%s' AND gidb_oct.id='%s'", array($uid,$imgid))->find();
        $tmp = str_replace('\\', '"', $re['layers']);
        $re['layers'] = json_decode($tmp);
        $img = $_SERVER['DOCUMENT_ROOT'].$re['imgsite'];
        $img_info = getimagesize($img);
        $width = $img_info[0];
        $height = $img_info[1];

        $countly = count($re['layers']);
        $rs = imagecreatetruecolor($width + 1, ($height) * $countly);
        $sx = 1;
        $sy = 0;
        $cnt = 0;
        $layername = array('0' => 'ILM', '1' => 'RNFL-GCL', '2' => 'IPL-INL', '3' => 'BM', '4' => 'BMO');
        foreach ($re['layers'] as $k => $v) {//每个图层
            $wt = imagecolorallocate($rs, 255, 255, 255);
            $gblue = imagecolorallocate($rs,0,255,255); 
            //$sy += 5;
            imageline($rs,$sx,$sy,$sx + $width,$sy,$wt);
            imagestring($rs,5,$sx,$sy,$v->name,$gblue);
            foreach ($v->lines as $a => $b){//每条线段
                imageline($rs, $b->startX, $sy + $b->startY, $b->endX, $sy + $b->endY, $wt);
            }
            $sy += $height;
            $cnt += 1;
        }
        //imagerectangle($rs,$sx,$sy,$width-1,$height-1,$wt);
        header("Content-type: image/png");  
        imagepng($rs);
        imagedestroy($rs); 
    }

    public function countOct(){
        if(!IsAdmin())
        {
            $this->display('Admin:notadmin');
            return;
        }
        $WRONG_CODE = C('WRONG_CODE');
        $WRONG_MSG = C('WRONG_MSG');
        $data['wrongcode'] = $WRONG_CODE['totally_right'];
        //$uid = session('gidb_uid');
        $uid = I('param.uid');

        $this->godownmarked($uid);
    }

    private function godownmarked($uid){
        
        $ol = M("octlayers");
        $re = $ol->join("gidb_octtask ON gidb_octlayers.octtaskid = gidb_octtask.id")->join("gidb_oct ON gidb_octtask.imgid = gidb_oct.id")->field('name,layers,imgsite')->where("layers is not null AND layers<>'[]' AND length(layers)>=1000 AND uid='%s'", array($uid))->select();
        
        $overwrite = false;
        $zip = new \ZipArchive();
        $zipname = 'Public/tmp/'.strtolower(md5(uniqid(rand(), true))).'.zip';
        $zip->open($zipname,$overwrite ? \ZIPARCHIVE::OVERWRITE : \ZIPARCHIVE::CREATE);
        $newpngs = array();

        $flag = 0;
        foreach ($re as $key => $value) {//每张照片
            $tmp = str_replace('\\', '"', $value['layers']);
            $re[$key]['layers'] = json_decode($tmp);

            $img = $_SERVER['DOCUMENT_ROOT'].$value['imgsite'];
            $img_info = getimagesize($img);
            $width = $img_info[0];
            $height = $img_info[1];

            foreach ($re[$key]['layers'] as $k => $v) {//每个图层
                $rs = imagecreatetruecolor($width, $height);
                $wt = imagecolorallocate($rs, 255, 255, 255);
                foreach ($v->lines as $a => $b){//每条线段
                    imageline($rs, $b->startX, $b->startY, $b->endX, $b->endY, $wt);
                }
                $filename = 'Public/tmp/'.substr($re[$key]['name'], 0, -4).'-'.$v->name.'.png';
                $filename = iconv("UTF-8","gb2312", $filename);
                if(file_exists($filename)){//如果文件存在则认为图层重名了
                    var_dump ('Public/tmp/'.substr($re[$key]['name'], 0, -4).'-'.$v->name.' 重名');
                    $flag = 1;
                }
                if($flag == 1) break;
                imagepng($rs, $filename);

                $zip->addFile($filename);
                //unlink($filename);

                array_push($newpngs,$filename);
            }
            if($flag == 1) break;
        }        
        
        $zip->close();


        if(file_exists($zipname)){
            header("Content-Type: application/force-download");
            header("Content-Disposition: attachment; filename=".basename($zipname)); 
            readfile($zipname);
            unlink($zipname);
        }
        else{
            $this->error('获取失败，可能该用户没有标定');
        }

        foreach ($newpngs as $key => $value) {
            if(file_exists($value)){//如果临时文件存在
                unlink($value);
            }
        }
    }
}
