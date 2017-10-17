<?php

return array(
		'DISPLAY_ITEM_NUM' => 20,
		'PAGE_ITEM_NUM' => 25,
		'PAPER_LIMIT' => 3,					//打印纸默认规定月使用量
		'WRONG_CODE' => array(
			'not_exist' => -10,				//某变量不存在(具体情况具体分析)
			'yes_exist' => -11,				//某变量存在(具体情况具体分析)
	
			'passwd_error' => 1,			//密码错误
			'passwd_toolong' => 2,			//密码太长。暂定<=20
			'passwd_tooshort' => 3,			//密码太短。暂定>=6
			'passwd_confirmfail' => 4,		//密码两次输入不同
	
			'userid_notexist' => 10,		//用户不存在
			'userid_yesexist' => 11,		//用户存在
			'userid_toolong' => 12,			//用户名太长。暂定<=20
			'userid_tooshort' => 13,		//用户名太短。暂定>=3
			'userid_invalid' => 14,			//用户名不合法。要求只包含数字字母下划线
	
			'email_toolong' => 21,			//email太长，暂定<=50
			'email_invalid' => 22,			//email不合法
	
			'query_data_invalid' => 31,		//POST或者GET的数据不正确
			'query_data_typeerror' => 32,	//应该是POST而发送了GET，或应该是GET而发送了POST
	
			'user_notloggin' => 41,			//用户未登录而产生的权限或其他错误
			'user_alreadyloggin' => 42,		//用户已登录而产生的权限或其他错误（比如已登录则不能重复login）
			
			'ic_invalid' => 51,				//身份证号格式错误
			
			'admin_not' => 61,				//非管理员，越权操作禁止
			'admin_wrongdel' => 62,			//不能删除自己
			'admin_powerless' => 63,		//管理员，越权操作禁止
			'user_powerless' => 64,			//用户，越权操作禁止
			
			'sql_error' => 71,				//数据库操作出错
			'sql_notupdate' => 72,			//传给数据库的更新内容和原内容相同数据库操作出错
			'sql_notadd' => 73,				//数据库添加操作出错
			
			'content_wrongmatch' => 81,		//内容对应错误，比如老师名字和id不对应
			
			'num_toosmall' => 91,			//数值太小
			
			'too_frequently' => 101,		//操作太频繁
			
			'too_early' => 111,				//尚未开始
			'too_late' => 112,				//已经结束

			'content_toolong' => 121,		//提交的内容太长
			'content_tooshort' => 122,		//提交的内容太短

			'add_successful' => 991,		//添加成功
			'update_successful' => 992,		//更新成功
			'del_successful' => 993,		//删除成功
			'totally_right' => 999,			//完全正确
		),
		'WRONG_MSG' => array(
			-10 => '查询的内容不存在',
			-11 => '条目已存在',
				
			1 => '密码错误',
			2 => '密码长度不能多于20',
			3 => '密码长度不能少于6',
			4 => '两次输入的密码不同',
				
			10 => '用户不存在',
			11 => '用户已存在',
			12 => '用户名长度不能多于20',
			13 => '用户名长度不能少于3',
			14 => '用户名只能包含数字字母下划线',
				
			21 => 'E-Mail长度不能多于50',
			22 => 'E-Mail不合法',
				
			31 => '提交的查询数据格式或内容错误',
			32 => 'POST与GET弄反了',
				
			41 => '用户未登录，不能进行该操作',
			42 => '用户已登录',

			51 => '身份证号格式错误',
				
			61 => '没有操作权限',
			62 => '不可以删除自己的权限',
			63 => '没有操作权限',
			64 => '没有操作权限',
				
			71 => '数据库操作出错',
			72 => '内容已最新',					//update的时候内容没变化会返回false	
			73 => '数据库插入失败',					

			81 => '内容对应错误',				//update的时候内容没变化会返回false
			91 => '提交数值大小不满足要求',	
			
			101=> '操作太频繁，请10秒后再试',
			
			111=> '尚未开始',
			112=> '已经结束',
				
			121 => '提交的内容太长',
			122 => '提交的内容太短',

			991 => '添加成功',
			992 => '更新成功',
			993 => '删除成功',
				
			999 => '没有错误',
		),
		'ADDUSER_ITEM' => array(
			'uid',
			'name',
			'passwd'
		),
		'STR_LIST' => array(
			0 => '未知',
				
			1 => '超级管理员',
			2 => '管理员',
				
			10 => '本科',
			11 => '硕士',
			12 => '博士',

			41 => '学生',
			42 => 'a',
			43 => 'b',
			44 => 'c',
			45 => 'd',
			46 => 'e',
			47 => 'f',
			48 => 'g',
			
			81 => '男',
			82 => '女',
				
			201 => '信息科学与工程学院',
			202 => '软件学院',
// 			203 => '本科生院',
// 			204 => '地球科学与信息物理学院',
// 			205 => '资源与安全工程学院',
// 			206 => '资源加工与生物工程学院',
// 			207 => '医药信息系',
// 			208 => '冶金与环境学院',
// 			209 => '材料科学与工程学院',
// 			210 => '粉末冶金研究院',
// 			211 => '机电工程学院',
// 			212 => '能源科学与工程学院',
// 			213 => '交通运输工程学院',
// 			214 => '土木工程学院',
// 			215 => '数学与统计学院',
// 			216 => '物理与电子学院',
// 			217 => '化学化工学院',
// 			218 => '商学院',
// 			219 => '文学院',
// 			220 => '外国语学院',
// 			221 => '建筑与艺术学院',
// 			222 => '法学院',
// 			223 => '马克思主义学院',
// 			224 => '湘雅医学院',
// 			225 => '药学院',
// 			226 => '护理学院',
// 			227 => '公共卫生学院',
// 			228 => '口腔医学院',
// 			229 => '医学检验系',
// 			230 => '基础医学院',
// 			231 => '湘雅二医院',
// 			232 => '图书馆',
// 			233 => '学工部',
// 			234 => '校团委',
// 			235 => '高教所',
// 			236 => '湘雅医院',
// 			237 => '精神卫生系',
// 			238 => '湘雅三医院',
// 			239 => '生命科学学院',
// 			240 => '生命科学基地',
// 			241 => '研究生院',
// 			242 => '荣誉学院',
// 			243 => '湘雅二医院教务部',
// 			244 => '公共管理学院',
// 			245 => '校工会',
// 			246 => '校领导',
// 			247 => '校长办公室',
// 			248 => '人事处',
// 			249 => '计划财务处',
// 			250 => '科技处',
// 			251 => '人文社科处',
// 			252 => '国际合作与交流处',
// 			253 => '审计处',
// 			254 => '保卫处',
// 			255 => '后勤管理处',
// 			256 => '基建处',
// 			257 => '医院管理处',
// 			258 => '资产管理处',
// 			259 => '房产管理处',
// 			260 => '离退休工作处',
// 			261 => '医学遗传学国家重点实验室',
// 			262 => '生殖工程研究室',
// 			263 => '肿瘤研究所',
// 			264 => '临床药理研究所',
// 			265 => '肝胆肠外科中心',
// 			266 => '体育教研部',
// 			267 => '基础教育学院',
// 			268 => '纪律检查委员会(监察处)',
// 			269 => '党委办公室',
// 			270 => '党委组织部',
// 			271 => '党委宣传部',
// 			272 => '党委统战部',
// 			273 => '机关及直附属单位党委',
// 			274 => '党委规划与发展部',
// 			275 => '研究生院招生办公室',
// 			276 => '研究生院培养管理办、研工部',
// 			277 => '研究生院学位管理办公室',
// 			278 => '研究生院学科建设办公室',
// 			279 => '出版社',
// 			280 => '档案馆',
// 			281 => '现代分析测试中心',
// 			282 => '现代教育技术中心',
// 			283 => '普教管理服务中心',
// 			284 => '资金结算中心',
// 			285 => '高等教育研究所',
// 			286 => '成人教育学院',
// 			287 => '网络教育学院',
// 			288 => '图书馆医学图书分馆',
// 			289 => '铁道校区管理工作委员会',
// 			290 => '接待中心',
// 			291 => '职工医院',
// 			292 => '本科生院',
// 			293 => '航空航天学院',
// 			294 => '国际合作与交流处',
				
		),
);
