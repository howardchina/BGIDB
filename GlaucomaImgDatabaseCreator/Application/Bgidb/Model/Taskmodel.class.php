<?php
namespace Home\Model;
use Think\Model\RelationModel;
class TaskModel extends RelationModel{    
	protected $_link = array(        
		'Tabpoints'=>array(            
			'mapping_type'      => self::HAS_ONE,            
			'class_name'        => 'Tabpoints',
			'foreign_key'   	=> 'taskid',    
			'mapping_name'  	=> 'tabpts',
			'mapping_fields'    =>'points',
			'as_fields'         =>'points',        
		 ),        
	 );
}