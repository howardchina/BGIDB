<?php
namespace Bgidb\Controller;
use Think\Controller;
class IndexController extends Controller {
	public function _initialize()
	{
		header("X-XHR-Current-Location: ".current_url());
	}
    public function index(){
    	layout('Layout/layout');
        $this->display();
    }
}