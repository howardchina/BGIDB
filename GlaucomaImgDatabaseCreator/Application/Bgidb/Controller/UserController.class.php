<?php
namespace Bgidb\Controller;
use Think\Controller;
class UserController extends Controller {
	public function _initialize()
	{
		header("X-XHR-Current-Location: ".current_url());
	}
    public function userinfo()
    {
    	$WRONG_CODE = C('WRONG_CODE');
    	$WRONG_MSG = C('WRONG_MSG');
    	$data['wrongcode'] = $WRONG_CODE['totally_right'];
    	layout('Layout/layout');
    	$uid = "";
    	if(I('param.uid', $WRONG_CODE['not_exist']) != $WRONG_CODE['not_exist'])
    	{
    		$uid = trim(I('param.uid'));
    	}
    	else if(session('?gidb_uid'))
    	{
    		$uid = session('gidb_uid');
    	}
    	else
    		$data['wrongcode'] = $WRONG_CODE['query_data_invalid'];
    	if($data['wrongcode'] == $WRONG_CODE['totally_right'])
    	{
    		$data['userinfo'] = GetUserinfo($uid);
    		if($data['userinfo'] == null)
    		{
    			$data['wrongcode'] = $WRONG_CODE['userid_notexist'];
    		}
    		$data['strlist'] = C('STR_LIST');
    	}
    	$data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
        $this->assign($data);
        if($data['wrongcode'] != $WRONG_CODE['totally_right'])
        	$this->display('Public:alert');
        else
        	$this->display();
    }
    public function login()
    {
    	$WRONG_CODE = C('WRONG_CODE');
    	$WRONG_MSG = C('WRONG_MSG');
    	$data['wrongcode'] = $WRONG_CODE['totally_right'];
    	if(IsLoggedin())
    		$data['wrongcode'] = $WRONG_CODE['user_alreadyloggin'];
    	layout('Layout/layout');
        
    	$data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
        $this->assign($data);
        if($data['wrongcode'] != $WRONG_CODE['totally_right'])
        	$this->display('Public:alert');
        else
        	$this->display();
    }
    public function login_function()
    {
    	$WRONG_CODE = C('WRONG_CODE');
    	$WRONG_MSG = C('WRONG_MSG');
    	$data['wrongcode'] = $WRONG_CODE['totally_right'];
        
    	if(I('post.uid', $WRONG_CODE['not_exist']) != $WRONG_CODE['not_exist'])
    	{
    		$uid = trim(I('post.uid'));
    		$passwd = MkPasswd(trim(I('post.passwd')));
    		$User = M('user');
    		$map = array(
    			'uid' => $uid
    		);
    		$userinfo = $User->where($map)->find();
    		if($userinfo == null)
    			$data['wrongcode'] = $WRONG_CODE['userid_notexist'];
    		else
    		{
    			if($passwd == $userinfo['passwd'])
    			{
    				session('gidb_uid', $uid);
    				session('gidb_uname', $userinfo['name']);
    				$Privilege = M('privilege');
    				$privilegelist = $Privilege->where('uid="%s"', $uid)->field('privi')->select();
    				foreach($privilegelist as $privilege)
    					session($privilege['privi'], true);
    				if(session('?gidb_super_admin') && session('gidb_super_admin') == true)
    					session('gidb_admin', true);
    				$data['uid'] = $userinfo['uid'];
    				$data['uname'] = $userinfo['name'];
    				$data['privilege'] = $privilegelist;
    			}
    			else 
    				$data['wrongcode'] = $WRONG_CODE['passwd_error'];
    		}
    	}
    	else
    		$data['wrongcode'] = $WRONG_CODE['query_data_invalid'];
    	$data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
    	$this->ajaxReturn($data);

        
    }
    public function logout_function()
    {
    	$WRONG_CODE = C('WRONG_CODE');
    	$WRONG_MSG = C('WRONG_MSG');
    	$data['wrongcode'] = $WRONG_CODE['totally_right'];
    	if(session('?gidb_uid'))
    	{
    		session(null);
    		$data['msg'] = $WRONG_CODE['成功登出'];
    	}
    	else 
    	{
    		$data['wrongcode'] = $WRONG_CODE['user_notloggin'];
    		$data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
    	}
    	$this->ajaxReturn($data);
    }
    private function modify_data()
	{
		$WRONG_CODE = C('WRONG_CODE');
		$WRONG_MSG = C('WRONG_MSG');
		$data['wrongcode'] = $WRONG_CODE['totally_right'];
		if(!session('?gidb_uid'))
		{
			$data['wrongcode'] = $WRONG_CODE['user_notloggin'];
		}
		else
		{
			if(session('?gidb_admin') && I('param.uid', $WRONG_CODE['not_exist']) != $WRONG_CODE['not_exist'])
				$uid = I('param.uid', session('gidb_uid'));
			else
				$uid = session('gidb_uid');
			$userinfo = GetUserinfo($uid);
			if($userinfo == null)
			{
				$data['wrongcode'] = $WRONG_CODE['userid_notexist'];
			}
			else
			{
				$data['userinfo'] = $userinfo;
			}
			$data['strlist'] = C('STR_LIST');
		}
		$data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
		return $data;
	}
	public function modify()
	{
    	layout('Layout/layout');
		$WRONG_CODE = C('WRONG_CODE');
		$WRONG_MSG = C('WRONG_MSG');
		$data = $this->modify_data();
		$this->assign($data);
		if($data['wrongcode'] != $WRONG_CODE['totally_right'])
			$this->display('Public:alert');
		else 
			$this->display();
	}
	public function modify_ajax()
	{
		$WRONG_CODE = C('WRONG_CODE');
		$WRONG_MSG = C('WRONG_MSG');
		$data['wrongcode'] = $WRONG_CODE['totally_right'];
		$userinfo = array();
		$userdetail = array();
		$res = true;
		if(I('param.uid', $WRONG_CODE['not_exist']) == $WRONG_CODE['not_exist'])
			$data['wrongcode'] = $WRONG_CODE['query_data_invalid'];
		//如果不是管理员，又(没有登录或者登陆者不是要修改的人)，则不能修改
		else if(!session('?gidb_admin') && (session('?gidb_uid') == null || session('gidb_uid') != I('param.uid')))
			$data['wrongcode'] = $WRONG_CODE['admin_not'];
		else
		{
			$User = M('user');
			$param = I('param.');
			$userinfo = $User->where('uid="%s"', $param['uid'])->find();
			if($userinfo == null)
				$data['wrongcode'] = $WRONG_CODE['userid_notexist'];
			else
			{
				$userinfo['name'] = trim($param['name']);
				$userinfo['kind'] = intval(trim($param['kind']));
				$userinfo['graduate'] = intval(trim($param['graduate']));
				$passwd = trim($param['passwd']);
				$passwd_confirm = trim($param['passwd_confirm']);
				if($passwd != $passwd_confirm)
					$data['wrongcode'] = $WRONG_CODE['passwd_confirmfail'];
				//新密码不为空，且为超级管理员或用户自己
				else if($passwd != null && (session('gidb_super_admin') || session('?gidb_uid') && session('gidb_uid') == I('param.uid')))
					$userinfo['passwd'] = MkPasswd($passwd);
				$Userdetail = M('userdetail');
				$userdetail = $Userdetail->where("uid='%s'", trim($param['uid']))->find();
				$flag = true;
				if($userdetail == null)
				{
					$flag = false;
					$userdetail = array();
					$userdetail['uid'] = trim($param['uid']);
				}
				$userdetail['sex'] = intval(trim($param['sex']));
				$userdetail['degree'] = intval(trim($param['degree']));
			file_put_contents("D:/loog.txt", print_r($userdetail['degree'], true)."\n", FILE_APPEND);
				$userdetail['institute'] = trim($param['institute']);
				$userdetail['birthday'] = $param['birthday'];
				$userdetail['phone'] = trim($param['phone']);
				$userdetail['email'] = trim($param['email']);
				$userdetail['nation'] = trim($param['nation']);
				$userdetail['political'] = trim($param['political']);
				$userdetail['idcard'] = trim($param['idcard']);
				$userdetail['selfintro'] = trim($param['selfintro']);
			}	
		}

		if($data['wrongcode'] == $WRONG_CODE['totally_right'])
		{
			$res = $User->save($userinfo);
			if($flag) $res = $res || $Userdetail->save($userdetail);
			else $res = $res || $Userdetail->add($userdetail);
			if($res == false) $data['wrongcode'] = $WRONG_CODE['sql_notupdate'];
		}
		$data['wrongmsg'] = $WRONG_MSG[$data['wrongcode']];
		$this->ajaxReturn($data);
	}
    public function whether_loggedin_ajax()
    {
    	$WRONG_CODE = C('WRONG_CODE');
    	$data['wrongcode'] = $WRONG_CODE['totally_right'];
    	$data['loggedin'] = false;
    	if(session('?gidb_uid'))
    	{
    		$data['loggedin'] = true;
    		$data['uid'] = session('gidb_uid');
    		$data['uname'] = session('gidb_uname');
    	}
    	$this->ajaxReturn($data);
    }
}