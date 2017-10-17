<?php
return array(
	//'配置项'=>'配置值'

	'APP_DEBUG' => true,
	'LOG_RECORD'			=>	true,  // 日志记录
    'LOG_EXCEPTION_RECORD'  => 	true,    // 记录异常信息日志
    'DB_SQL_LOG'			=>	true, // 记录SQL信息

	'URL_MODEL'	=> 2,

	'TMPL_TEMPLATE_SUFFIX'	=>	'.php',
		
	'MODULE_ALLOW_LIST' => array('Bgidb'),    
	'DEFAULT_MODULE'     => 'Bgidb',//默认模块
	'DEFAULT_ACTION' => 'Index',

	'CHARSET' 	=> 'utf8',
		
    'SESSION_AUTO_START' =>true,

	'URL_CASE_INSENSITIVE'=>true,

	'LOAD_EXT_CONFIG' => array(
						'ConstVal',
						),

		
	'WEB_BASE_URL' => 'http://127.0.0.1/'
);