<?php
namespace Bgidb\Controller;
use Think\Controller;
class AdminController extends Controller {
	public function _initialize()
	{
		header("X-XHR-Current-Location: ".current_url());
	}
	public function index()
	{
		layout('Layout/adminlayout');
		if(!IsAdmin())
		{
			$this->display('Admin:notadmin');
			return;
		}
		$WRONG_CODE = C('WRONG_CODE');
		$WRONG_MSG = C('WRONG_MSG');
		$data['wrongcode'] = $WRONG_CODE['totally_right'];
		
		$this->display();
	}
	//批量导入眼底图片
	public function img_upload()
	{
		//上传页面，但是处理逻辑不需要在这个函数进行。
		//前端页面/View/Admin/img_upload.php布局上传、选择图片等
		//前端页面用ajax与 img_upload_ajax()交互，以批量上传、显示进度
		if(!IsAdmin())
		{
			$this->display('Admin:notadmin');
			return;
		}
		layout('Layout/adminlayout');
		$WRONG_CODE = C('WRONG_CODE');
		$WRONG_MSG = C('WRONG_MSG');
		$data['wrongcode'] = $WRONG_CODE['totally_right'];
		$this->assign($data);
		$this->display();//注意这里是assign+display，给前端的是php数据
	}
	//批量导入OCT图片
	public function oct_upload()
	{
		//上传页面，但是处理逻辑不需要在这个函数进行。
		//前端页面/View/Admin/oct_upload.php布局上传、选择图片等
		//前端页面用ajax与 oct_upload_ajax()交互，以批量上传、显示进度
		if(!IsAdmin())
		{
			$this->display('Admin:notadmin');
			return;
		}
		layout('Layout/adminlayout');
		$WRONG_CODE = C('WRONG_CODE');
		$WRONG_MSG = C('WRONG_MSG');
		$data['wrongcode'] = $WRONG_CODE['totally_right'];
		$this->assign($data);
		$this->display();//注意这里是assign+display，给前端的是php数据
	}

	//文件夹批量导入OCT图片
	public function multi_upload()
	{
		//上传页面，但是处理逻辑不需要在这个函数进行。
		//前端页面/View/Admin/oct_upload.php布局上传、选择图片等
		if(!IsAdmin())
		{
			$this->display('Admin:notadmin');
			return;
		}
		layout('Layout/adminlayout');
		$WRONG_CODE = C('WRONG_CODE');
		$WRONG_MSG = C('WRONG_MSG');
		$data['wrongcode'] = $WRONG_CODE['totally_right'];
		$this->assign($data);
		$this->display();//注意这里是assign+display，给前端的是php数据
	}

	//文件夹批量导入OCT标定
	public function oct_mark_upload()
	{
		//上传页面，但是处理逻辑不需要在这个函数进行。
		//前端页面/View/Admin/oct_mark_upload.php布局上传、选择图片等
		if(!IsAdmin())
		{
			$this->display('Admin:notadmin');
			return;
		}
		layout('Layout/adminlayout');
		//$WRONG_CODE = C('WRONG_CODE');
		//$WRONG_MSG = C('WRONG_MSG');
		//$data['wrongcode'] = $WRONG_CODE['totally_right'];
		//$this->assign($data);
		$this->display();//注意这里是assign+display，给前端的是php数据
	}

	//导出OCT图片
	public function export_oct()
	{
		//上传页面，但是处理逻辑不需要在这个函数进行。
		if(!IsAdmin())
		{
			$this->display('Admin:notadmin');
			return;
		}
		layout('Layout/adminlayout');
		$WRONG_CODE = C('WRONG_CODE');
		$WRONG_MSG = C('WRONG_MSG');
		$data['wrongcode'] = $WRONG_CODE['totally_right'];
		$this->assign($data);
		$this->display();//注意这里是assign+display，给前端的是php数据
	}

	//添加用户
	public function adduser()
	{
		layout('Layout/adminlayout');
		if(!IsAdmin())
		{
			$this->display('Admin:notadmin');
			return;
		}
		$WRONG_CODE = C('WRONG_CODE');
		$WRONG_MSG = C('WRONG_MSG');
		$data['wrongcode'] = $WRONG_CODE['totally_right'];
		
		$this->display();
	}
	//添加用户逻辑处理
	public function adduser_ajax()
	{
		$WRONG_CODE = C('WRONG_CODE');
		$WRONG_MSG = C('WRONG_MSG');
		$data['wrongcode'] = $WRONG_CODE['totally_right'];
		if(session('?gidb_admin') == null)
			$data['wrongcode'] = $WRONG_CODE['admin_not'];
		else if(I('param.adduser', $WRONG_CODE['not_exist']) == $WRONG_CODE['not_exist'])
			$data['wrongcode'] = $WRONG_CODE['query_data_invalid'];
		else
		{
			$ADDUSER_ITEM = C('ADDUSER_ITEM');
			$addusertext = I('param.adduser');
			$adduserlist = preg_split("/[\\r\\n]{1,2}/", $addusertext);
			$add_cnt = 0;
			$update_cnt = 0;
			$fail_cnt = 0;
			$useradd_i = 0;
			foreach($adduserlist as $singleusertext)
			{
				if(strlen(trim($singleusertext)) == 0) continue;
				$singleuserinfo = preg_split("/[$\\t]/i", $singleusertext);
				$userinfo[$useradd_i] = array();
				for($i = 0; $i < count($singleuserinfo) && $i < count($ADDUSER_ITEM); $i ++)
					$userinfo[$useradd_i][$ADDUSER_ITEM[$i]] = trim($singleuserinfo[$i]);
				if(count($singleuserinfo) < 2 || 
					TestUserID($userinfo[$useradd_i]['uid']) != $WRONG_CODE['totally_right'] ||
					strlen($userinfo[$useradd_i]['name']) > 25 ||
					$userinfo[$useradd_i]['passwd'] != null && $userinfo[$useradd_i]['passwd'] != "" && 
					TestPasswd($userinfo[$useradd_i]['uid']) != $WRONG_CODE['totally_right'])
					$fail_cnt ++;	
				else 
				{
					if($userinfo[$useradd_i]['passwd'] == null)
						$userinfo[$useradd_i]['passwd'] = $userinfo[$useradd_i]['uid'];
					$userinfo[$useradd_i]['passwd'] = MkPasswd($userinfo[$useradd_i]['passwd']);
					$useradd_i ++;
				}
			}
			if($useradd_i > 0)
			{
				$User = M('user');
				for($i = 0; $i < $useradd_i; $i ++)
				{
					$existuser = $User->where("uid='%s'", $userinfo[$i]['uid'])->find();
					$ret = true;
					if($existuser == null)
					{
						$ret = $User->add($userinfo[$i]);
						$add_cnt ++;
					}
					else
					{
						$User->where("uid='%s'", $userinfo[$i]['uid'])->save($userinfo[$i]);
						$update_cnt ++;
					}
					if($ret == false)
						$fail_cnt ++;
				}
			}
			$data['add_cnt'] = $add_cnt;
			$data['update_cnt'] = $update_cnt;
			$data['fail_cnt'] = $fail_cnt;
		}
		$data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
		$this->ajaxReturn($data);
	}
}