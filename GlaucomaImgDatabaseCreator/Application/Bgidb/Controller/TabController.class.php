<?php
namespace Bgidb\Controller;
use Think\Controller;
class TabController extends Controller {
	public function _initialize()
	{
		header("X-XHR-Current-Location: ".current_url());
	}
    public function Tab()
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
    	$Img = M('img');
    	$data['imginfo'] = $Img->order('id asc')->find();

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
    	$Img = M('img');
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
    //points//json格式的x、y坐标序列，其中黄斑为一个点
    //taskkind//任务类型（1视杯，2视盘，3黄斑）
    //imgid//图片id
    //要插入两个表，一个是gidb_task，把任务插进去，一个是tabpoints，把points序列插进去
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
    			'taskkind' => intval(I('param.taskkind')),
    			'imgid' => intval(I('param.imgid')),
    			'uid' => $uid
    		);
    		$Task = M('task');
    		$taskinfo = $Task->where($map)->find();
    		$Tabpoints = M('tabpoints');
    		if($taskinfo == null || $Tabpoints->where('taskid="%d"', $taskinfo['id'])->find() == null)
    		{
    			$tid = $Task->add($map);
    			$tabpoints_add = array(
    				'taskid' => $tid,
    				'points' => I('param.points'),
                    'time' => I('param.time'),
                    'time2' => I('param.time2')
    			);
    			$Tabpoints->add($tabpoints_add);
    		}
    		else 
    		{
    			$tabpoints_update = array(
    				'points' => I('param.points'),
                    'time' => I('param.time'),
                    'time2' => I('param.time2')
    			);
    			$Tabpoints->where('taskid="%d"', $taskinfo['id'])->save($tabpoints_update);
    		}
    	}
    	$data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
    	$this->ajaxReturn($data);
    //返回前端的json消息：
    //wrongcode，参考/gidb/GlaucomaImgDatabaseCreator/Application/Common/Conf/ConstVal.php
    //wrongmsg，对应wrongcode的错误提示消息
    }
    public function already_tab_ajax()
    {
    //返回已标定数据供前端显示
    //接收POST或GET皆可
    //uid//用户id
    //taskkind//标定类型
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
    				'taskkind' => intval(I('param.taskkind')),
    				'imgid' => intval(I('param.imgid')),
    				'uid' => $uid
    		);
    		$Task = M('task');
    		$taskinfo = $Task->where($map)->find();
    		if($taskinfo == null)
    		{
    			$data['wrongcode'] = $WRONG_CODE['not_exist'];
    		}
    		else
    		{
    			$data['taskinfo'] = $taskinfo;
    			$Tabpoints = M('tabpoints');
    			$map = array(
    				'taskid' => $taskinfo['id']
    			);
    			$data['tabpoints'] = $Tabpoints->where($map)->find();
    		}
    	}
    	$data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
    	$this->ajaxReturn($data);
    }
    //返回前端的json消息：
    //wrongcode，参考/gidb/GlaucomaImgDatabaseCreator/Application/Common/Conf/ConstVal.php
    //wrongmsg，对应wrongcode的错误提示消息
    //如果查询内容存在则有：
    //{
//    "tabpoints" : 
//    {
//       "id" : "1",
//       "points" : "{xxxxxxxxxxx}",//json格式的x、y点对序列，这个只要前端自己能识别就好，原样保存原样拿出
//       "taskid" : "1"
//    },
//    "taskinfo" : 
//    {
//       "id" : "1",
//       "imgid" : "1",
//       "taskkind" : "1",
//       "uid" : "csgrandeur"
//    },
//    "wrongcode" : 999,
//    "wrongmsg" : "没有错误"
//    
//    

    public function saveMask(){
        # we are a PNG image
        header('Content-type: image/png');
        
        # we are an attachment (eg download), and we have a name
        header('Content-Disposition: attachment; filename="' . $_POST['name'] .'"');
        
        #capture, replace any spaces w/ plusses, and decode
        $encoded = $_POST['imgdata'];
        $encoded = str_replace(' ', '+', $encoded);
        $decoded = base64_decode($encoded);
        
        #write decoded data
        echo $decoded;
    }


    public function diagnose_commit_ajax()
    {
    //保存医生的文本标注
    //接收POST或GET皆可
    //taskkind//任务类型（101左右眼）
    //imgid//图片id
    //要插入两个表，一个是gidb_task，把任务插进去，一个是tabdiagnose，把诊断选项插进去
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
                'taskkind' => intval(I('param.taskkind')),
                'imgid' => intval(I('param.imgid')),
                'uid' => $uid
            );
            $Task = M('task');
            $taskinfo = $Task->where($map)->find();
            $Tabdiagnose = M('tabdiagnose');
            if($taskinfo == null){
                $taskinfo['id'] = $Task->add($map);
            }
            if($Tabdiagnose->where('taskid="%d"', $taskinfo['id'])->find() == null){
                $tabdiagnose_add = array(
                    'taskid' => $taskinfo['id'],
                    'diagnose' => I('param.diagnose')
                );
                $Tabdiagnose->add($tabdiagnose_add);
            }else{
                $tabdiagnose_update = array(
                    'diagnose' => I('param.diagnose')
                );
                $Tabdiagnose->where('taskid="%d"', $taskinfo['id'])->save($tabdiagnose_update);
            }
            /*
            if($taskinfo == null || $Tabdiagnose->where('taskid="%d"', $taskinfo['id'])->find() == null)
            {
                $tid = $Task->add($map);
                $tabdiagnose_add = array(
                    'taskid' => $tid,
                    'diagnose' => I('param.diagnose')
                );
                $Tabdiagnose->add($tabdiagnose_add);
            }
            else 
            {
                $tabdiagnose_update = array(
                    'diagnose' => I('param.diagnose')
                );
                $Tabdiagnose->where('taskid="%d"', $taskinfo['id'])->save($tabdiagnose_update);
            }
            */
        }
        $data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
        $this->ajaxReturn($data);
    //返回前端的json消息：
    //wrongcode，参考/gidb/GlaucomaImgDatabaseCreator/Application/Common/Conf/ConstVal.php
    //wrongmsg，对应wrongcode的错误提示消息
    }


    public function already_diagnose_ajax()
    {
    //返回已标定数据供前端显示
    //接收POST或GET皆可
    //uid//用户id
    //taskkind//标定类型
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
                    'taskkind' => intval(I('param.taskkind')),
                    'imgid' => intval(I('param.imgid')),
                    'uid' => $uid
            );
            $Task = M('task');
            $taskinfo = $Task->where($map)->find();
            if($taskinfo == null)
            {
                $data['wrongcode'] = $WRONG_CODE['not_exist'];
            }
            else
            {
                $data['taskinfo'] = $taskinfo;
                $Tabdiagnose = M('tabdiagnose');
                $map = array(
                    'taskid' => $taskinfo['id']
                );
                $data['tabdiagnose'] = $Tabdiagnose->where($map)->find();
            }
        }
        $data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
        $this->ajaxReturn($data);
    }
}
