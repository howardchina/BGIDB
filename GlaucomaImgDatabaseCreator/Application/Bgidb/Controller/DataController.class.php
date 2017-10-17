<?php
namespace Bgidb\Controller;
use Think\Controller;
class DataController extends Controller {
	public function _initialize()
	{
		header("X-XHR-Current-Location: ".current_url());
	}

	public function uploadify()
	{
	// Define a destination
		$targetFolder = '/imgdatabase'; // Relative to the root
		$ret_param = 2;
		if (!empty($_FILES)) {
			// Validate the file type
			$fileTypes = array('jpg','jpeg','gif','png'); // File extensions
			$fileParts = pathinfo($_FILES['Filedata']['name']);
			$ext = strtolower($fileParts['extension']);//获得文件拓展名
			
			if (in_array($ext,$fileTypes)) {
				$filename = strtolower($_FILES["Filedata"]["name"]);
				$filename = strtolower(md5(uniqid(rand(), true))).'.'.$ext;

				//转移临时文件到目标目录
				if(move_uploaded_file($_FILES["Filedata"]["tmp_name"], $_SERVER['DOCUMENT_ROOT'].'/Public/imgdatabase/'.$filename)){
					//信息插入数据库
					$Img = M('img');
					$img_add = array(
						'imgsite' => '/Public/imgdatabase/'.$filename,
						'kind' => 1//暂定1为眼科图像
					);
					$Img->add($img_add);
					$ret_param = 999;//成功	
				}
			}			
		}
		$data = array(
			"state" => true,
			"name"  => $filename,
			"extra" => array(
				"info"  => "just a way to send some extra data",
				"param" => $ret_param,
			),
		);
		$this->ajaxReturn($data);
	}

	public function octuploadify()
	{
	// Define a destination
		$targetFolder = '/octdatabase'; // Relative to the root
		$ret_param = 2;
		if (!empty($_FILES)) {
			// Validate the file type
			$fileTypes = array('jpg','jpeg','gif','png'); // File extensions
			$fileParts = pathinfo($_FILES['Filedata']['name']);
			$ext = strtolower($fileParts['extension']);//获得文件拓展名
			
			if (in_array($ext,$fileTypes)) {
				$filename = strtolower($_FILES["Filedata"]["name"]);
				$savename = strtolower(md5(uniqid(rand(), true))).'.'.$ext;

				//转移临时文件到目标目录
				if(move_uploaded_file($_FILES["Filedata"]["tmp_name"], $_SERVER['DOCUMENT_ROOT'].'/Public/octdatabase/'.$savename)){
					//信息插入数据库
					$Img = M('oct');
					$img_add = array(
						'name' => $filename,
						'savename' => $savename,
						'imgsite' => '/Public/octdatabase/'.$savename,	
						'kind' => 2//暂定2为OCT图像
					);
					$Img->add($img_add);
					$ret_param = 999;//成功	
				}
			}			
		}
		$data = array(
			"state" => true,
			"name"  => $filename,
			"extra" => array(
				"info"  => "just a way to send some extra data",
				"param" => $ret_param,
			),
		);
		$this->ajaxReturn($data);
	}

	protected function insertFolderInfo(){
		//插入文件夹层级信息
		$reletivePath = explode(',',I('post.paths'));//把传到后台的paths变成数组

		$flag = true;

		foreach ($reletivePath as $key => $path) {
			$pathTree = explode('/',$path);
			$insertId = 0;
			$octFolder = M("octfolder");

			foreach ($pathTree as $key => $nodeName) {
				if ($key == 0){//舍去最高层目录
					continue;
				}

				$leaf = 0;
				if ($key == sizeof($pathTree) - 1){
					$leaf = 1;
				}
				$nodeAdd = array(
					'nodeName' 	=> $nodeName,
					'parent' 	=> $insertId,
					'leaf'		=> $leaf
				);
				$re = $octFolder->where($nodeAdd)->find();

				if (!$re){
					$insertId = $octFolder->add($nodeAdd);

					if (!$insertId){
						$flag = false;
						break;
					}
				}
				else{
					$insertId = $re['id'];
				}
			}
			if ($flag == false){
				break;
			}
		}
		return $flag;
	}

	public function multiuploadify()
	{


		$redirectTime = 200;

		$upload = new \Think\Upload();// 实例化上传类
	    $upload->maxSize   =     3145728 ;// 设置附件上传大小
	    $upload->exts      =     array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
	    $upload->rootPath  =     './Public/octdatabase/'; // 设置附件上传根目录
	    $upload->savePath  =     ''; // 设置附件上传（子）目录


		$targetFolder = '/Public/octdatabase/'; // Relative to the root

		$upload->saveName = array('myFun',array('__FILE__'));
	    $upload->autoSub = false;
	    // 上传文件 
	    $info = $upload->upload();
	   	// 更新数据库
	    M()->startTrans();
	    $flag = true;
	    $Img = M('oct');
	    foreach ($info as $key => $fileinfo) {
	    	// 插入图片地址
			$img_add = array(
				'name' => $fileinfo['name'],
				'savename' => $fileinfo['savename'],
				'imgsite' => $targetFolder.$fileinfo['savename'],	
				'kind' => 2//暂定2为OCT图像
			);
			$queryRe = $Img->where("name='%s' and savename='%s'", array($fileinfo['name'], $fileinfo['savename']))->find();
			if (!$queryRe){
				$Img->add($img_add);
				$ret_param = 999;//成功	
			}else{
				$flag = false;
				$ret_param = -11;//添加的条目已存在
				//break;
			}
	    }

	    if ($info && $flag){
			$flag = $this->insertFolderInfo();

			if ($flag == true){
				M()->commit();
	        	$this->success(sizeof($info).'张图片上传成功！<br>文件目录正确生成！','/Admin/multi_upload', $redirectTime);
			}
			else{
				$this->error(sizeof($info).'张图片已经上传！<br>但是数据库文件目录未能正确生成，请联系【管理员】。','/Admin/multi_upload', $redirectTime);
				M()->rollback();
			}
	    }
	    else{
	    	M()->rollback();
	    	if (!$info){
	        	$this->error($upload->getError()."<br>请删除重复图片后再尝试上传。<br>为了保证隐私，图片名已经加密处理，如有错误请联系【管理员】。",'/Admin/multi_upload', $redirectTime);	    
	    	}
	    	else{
	    		M()->startTrans();
	    		$flag = $this->insertFolderInfo();
	    		
				if ($flag == true){
					M()->commit();
		        	$this->success("数据库表单中存在残留的重复图片信息.<br>未重复的".sizeof($info)."张图片已经上传。<br>文件目录正确生成！",'/Admin/multi_upload', $redirectTime);
				}
				else{
					$this->error("数据库表单中存在残留的重复图片信息.<br>未重复的".sizeof($info)."张图片已经上传。<br>但是数据库故障，文件目录未能正确生成，请联系【管理员】。",'/Admin/multi_upload', $redirectTime);
					M()->rollback();
				}
	    	}
	    }
	}



	/*
	created by lihuibin
	date 2013-6-06
	desc server side upload.php provide for resumable.js
	*/
	private function getChunkFilename ($chunkNumber, $identifier,$filename){
	    $uploads_dir = "/Public/zipUpload";
	    $temp_dir = $_SERVER['DOCUMENT_ROOT'].$uploads_dir.'/'.$identifier;
	    return  $temp_dir.'/'.$filename.'.part'.$chunkNumber;
	}
	private function cleanIdentifier ($identifier){
	    return $identifier;
	    //return  preg_replace('/^0-9A-Za-z_-/', '', $identifier);
	}
	//$maxFileSize = 2*1024*1024*1024;
	private function validateRequest ($chunkNumber, $chunkSize, $totalSize, $identifier, $filename, $fileSize=''){
	    // Clean up the identifier
	    //$identifier = cleanIdentifier($identifier);
	    // Check if the request is sane
	    if ($chunkNumber==0 || $chunkSize==0 || $totalSize==0 || $identifier==0 || $filename=="") {
	        return 'non_resumable_request';
	    }
	    $numberOfChunks = max(floor($totalSize/($chunkSize*1.0)), 1);
	    if ($chunkNumber>$numberOfChunks) {
	        return 'invalid_resumable_request1';
	    }
	    // Is the file too big?
	//      if($maxFileSize && $totalSize>$maxFileSize) {
	//          return 'invalid_resumable_request2';
	//      }
	    if($fileSize!="") {
	        if($chunkNumber<$numberOfChunks && $fileSize!=$chunkSize) {
	            // The chunk in the POST request isn't the correct size
	            return 'invalid_resumable_request3';
	        }
	        if($numberOfChunks>1 && $chunkNumber==$numberOfChunks && $fileSize!=(($totalSize%$chunkSize)+$chunkSize)) {
	            // The chunks in the POST is the last one, and the fil is not the correct size
	            return 'invalid_resumable_request4';
	        }
	        if($numberOfChunks==1 && $fileSize!=$totalSize) {
	            // The file is only a single chunk, and the data size does not fit
	            return 'invalid_resumable_request5';
	        }
	    }
	    return 'valid';
	}

	/**
	 *
	 * Logging operation - to a file (upload_log.txt) and to the stdout
	 * @param string $str - the logging string
	 */
	private function _log($str) {
		\Think\Log::write($str);
	}
	/**
	 *
	 * Delete a directory RECURSIVELY
	 * @param string $dir - directory path
	 * @link http://php.net/manual/en/function.rmdir.php
	 */
	private function rrmdir($dir) {
	    if (is_dir($dir)) {
	        $objects = scandir($dir);
	        foreach ($objects as $object) {
	            if ($object != "." && $object != "..") {
	                if (filetype($dir . "/" . $object) == "dir") {
	                    $this->rrmdir($dir . "/" . $object);
	                } else {
	                    unlink($dir . "/" . $object);
	                }
	            }
	        }
	        reset($objects);
	        rmdir($dir);
	    }
	}

	/**
	*
	*unzip the .zip file into folders and
	*convert the marks into json strings and
	*write the json strings and origin image into db
	**/
	private function createFolderFromZip($fileName){
		//zip文件名
		$fileName = iconv( 'GB2312', 'UTF-8', $fileName);

		//zip文件相对服务器根目录的保存路径
		$uploads_dir = "/Public/zipUpload";
		//将目标路径名称赋值为fileName最后的'.zip'四个字符之外的全部字符构成的字符串
		$toDir = substr($fileName,0,strlen($fileName)-4);

		//转码
		$fileName = iconv('UTF-8', 'GB2312', $fileName);
		$toDir = iconv('UTF-8', 'GB2312', $toDir);

		//zip文件完整的保存路径
		$zipName = $_SERVER['DOCUMENT_ROOT'].$uploads_dir.'/'.$fileName;
		$toDir = $_SERVER['DOCUMENT_ROOT'].$uploads_dir.'/'.$toDir;

		$zip = new \ZipArchive;//新建一个ZipArchive的对象
		/*
		通过ZipArchive的对象处理zip文件
		$zip->open这个方法的参数表示处理的zip文件名。
		如果对zip文件对象操作成功，$zip->open这个方法会返回TRUE
		*/
		$res = $zip->open($zipName);
        if ($res === TRUE){
            if (!is_dir($toDir)) {
                mkdir($toDir, 0777, true);
            }
			//$zip->extractTo($toDir);
			$docnum = $zip->numFiles;
			for($i = 0; $i < $docnum; $i++) {
			    $statInfo = $zip->statIndex($i);
			    $desName = $statInfo['name'];
			    //转码
			    $desName = iconv('UTF-8', 'GB2312', $desName);
			    if($statInfo['crc'] == 0) {
			        //新建目录
			        if(mkdir( $toDir.'/'.$desName, 0777, true) != true){
			        	$this->_log('failed to mkdir during zip');
			        	return false;
			        }
			    } else {
			        //拷贝文件
			        if(copy('zip://'.$zipName.'#'.$statInfo['name'], $toDir.'/'.$desName) == false){
                        $this->_log('failed to copy');
			        	return false;
			        }
			    }
			}
			$zip->close();//关闭处理的zip文件
			return true;
		}
		else{
			$this->_log('failed, code:'.$res);
			return false;
		}
	}

	// private function digFolder($base, $dir, $parentId){
	// 	//echo 'folder: '.iconv( 'GB2312', 'UTF-8', $base.'/'.$dir).'<br>';
	// 	//open db
	// 	$octFolder = M("octfolder");
	// 	//set condition
	// 	$nodeAdd = array(
	// 		'nodeName' 	=> iconv( 'GB2312', 'UTF-8', $dir),
	// 		'parent' 	=> $parentId,
	// 		'leaf'		=> 0
	// 	);
	// 	//check if folder exist
	// 	$re = $octFolder->where($nodeAdd)->find();
	// 	//add, aquire ID
	// 	if (!$re){//add new folder
	// 		$insertId = $octFolder->add($nodeAdd);//return id
	// 		if (!$insertId){
	// 			$this->_log('failed to insert '.$nodeAdd['nodeName'].' into db');
	// 			return false;
	// 		}
	// 	}else{//already exist
	// 		$insertId = $re['id'];
	// 	}
	// 	$parentId = $insertId;
	// 	//deep first search
	// 	foreach (scandir($base.'/'.$dir) as $file) {
	// 		if ($file != "." && $file != "..") {
	// 			if(is_dir($base.'/'.$dir.'/'.$file) == true){//folder
	// 				if($this->digFolder($base.'/'.$dir, $file, $parentId) !== true){
	// 					return false;
	// 				}
	// 			}else if(is_file($base.'/'.$dir.'/'.$file) == true){//file
	// 				//echo 'file: '.iconv( 'GB2312', 'UTF-8', $base.'/'.$dir.'/'.$file).'<br>';
	// 				$ufile = iconv( 'GB2312', 'UTF-8', $file);
	// 				$suffix = strrchr(substr($ufile, 0, -4), '_');
	// 				if($suffix == "_ILM" || $suffix == '_RNFL-GCL' || $suffix == '_IPL-INL' || $suffix == '_BM' || $suffix == '_BMO'){
	// 					continue;
	// 				}else if($suffix !== ''){//origin
	// 					$targetFolder = '/Public/octdatabase/'; // Relative to the root
	// 					//echo $saveName.'<br>';
	// 					$Img = M('oct');
	// 					$saveName = myFun($ufile).substr($ufile, -4, 4);
	// 					// 插入图片地址
	// 					$img_add = array(
	// 						'name' => $ufile,
	// 						'savename' => $saveName,
	// 						'imgsite' => $targetFolder.$saveName,	
	// 						'kind' => 2//暂定2为OCT图像
	// 					);
	// 					$queryRe = $Img->where("name='%s' and savename='%s'", array($ufile, $saveName))->find();
	// 					//add image into db
	// 					if (!$queryRe){
	// 						if(!$Img->add($img_add)){
	// 							$this->_log('insert error: failed to add oct: ').$ufile;
	// 							return false;
	// 						}
	// 					}else{
	// 						$this->_log('oct already exist: failed to add oct: ').$ufile;
	// 					}
	// 					//add image into file system
	// 					if(is_file($_SERVER['DOCUMENT_ROOT'].$targetFolder.$saveName) !== true){
	// 						//zip文件相对服务器根目录的保存路径
	// 						$uploads_dir = "/Public/zipUpload";
	// 						if(copy($base.'/'.$dir.'/'.$file, $_SERVER['DOCUMENT_ROOT'].$targetFolder.$saveName)  !== true){
	// 	                        $this->_log('failed to copy: '.$_SERVER['DOCUMENT_ROOT'].$targetFolder.$saveName);
	// 				        	return false;
	// 				        }
	// 					}
	// 				}else{//should not step into this code
	// 					$this->_log('');
	// 					return false;
	// 				}
	// 				//set condition
	// 				$nodeAdd = array(
	// 					'nodeName' 	=> iconv( 'GB2312', 'UTF-8', $file),
	// 					'parent' 	=> $parentId,
	// 					'leaf'		=> 1
	// 				);
	// 				//check if file exist
	// 				$re = $octFolder->where($nodeAdd)->find();
	// 				//add, aquire ID
	// 				if (!$re){//add new file
	// 					$insertId = $octFolder->add($nodeAdd);//return id
	// 					if (!$insertId){
	// 						$this->_log('failed to insert '.$nodeAdd['nodeName'].' into db');
	// 						return false;
	// 					}
	// 				}else{//already exist
	// 					$insertId = $re['id'];
	// 				}
	// 			}else{//should not step into this code
	// 				$this->_log($base.'/'.$dir.'/'.$file);
	// 				return false;
	// 			}
	// 		}
	// 	}
	// 	return true;
	// }
	// 计时函数 
	private function runtime($mode = 0) { 
		static $t; 
	    if(!$mode) { 
			$t = microtime(); 
			return; 
	    } 
	    $t1 = microtime(); 
	    list($m0,$s0) = split(" ",$t);
	    list($m1,$s1) = split(" ",$t1);
	    return sprintf("%.3f ms",($s1+$m1-$s0-$m0)*1000); 
	} 

	public function test(){
		$fileName = iconv('UTF-8', 'GB2312','2112.zip');
		if($this->createMarkFromFolder($fileName) !== true){
			echo 'failed to create mark from folder.<br>';
		}else{
			echo 'succ<br>';
		}
	}
	private function S4(){
		return substr(base_convert(rand(0x10000, 0x20000), 10, 16), 1);
	}
	private function guid(){
		return $this->S4().$this->S4().'-'.$this->S4().'-'.$this->S4().'-'.$this->S4().'-'.$this->S4().$this->S4().$this->S4();
	}
	private function imageToOct($base, $dir, $parentId){

		//open db
		$octFolder = M("octfolder");
		//set condition
		$nodeAdd = array(
			'nodeName' 	=> iconv( 'GB2312', 'UTF-8', $dir),
			'parent' 	=> $parentId,
			'leaf'		=> 0
		);
		//check if folder exist
		$re = $octFolder->where($nodeAdd)->find();
		//add, aquire ID
		if (!$re){//add new folder
			$insertId = $octFolder->add($nodeAdd);//return id
			if (!$insertId){
				$this->_log('failed to insert '.$nodeAdd['nodeName'].' into db');
				return false;
			}
		}else{//already exist
			$insertId = $re['id'];
		}
		$parentId = $insertId;

		//user name
		$uid = 'admin_zhao';

		foreach (scandir($base.'/'.$dir) as $file) {
			if ($file != "." && $file != "..") {
				if(is_dir($base.'/'.$dir.'/'.$file) == true){//folder
					if($this->imageToOct($base.'/'.$dir, $file, $parentId) !== true){
						return false;
					}
				}else if(is_file($base.'/'.$dir.'/'.$file) == true){//file
					$ufile = iconv( 'GB2312', 'UTF-8', $file);
					$suffix = strrchr(substr($ufile, 0, -4), '_');
					if($suffix == "_ILM" || $suffix == '_RNFL-GCL' || $suffix == '_IPL-INL' || $suffix == '_BM' || $suffix == '_BMO'){
						//relative original image name
						$octName = substr($ufile, 0, -4-strlen($suffix)).'.jpg';
						//open db
						$oct = M('oct');
						//set condition
						$nodeAdd = array(
							'name' 	=> $octName
						);
						//check if oct exist
						$re = $oct->where($nodeAdd)->find();
						$octId = $re['id'];
						if (!$octId){
							$this->_log('cannot find original image in db');
							return false;
						}
						$task = M('octtask');
						//set condition
						$nodeAdd = array(
							'imgid' => $octId,
							'uid' => $uid
						);
						$re = $task->where($nodeAdd)->find();
						$taskId = 0;
						if (!$re){
							//create a new oct task to save mark
							$taskId = $task->add($nodeAdd);
						}else{
							$taskId = $re['id'];
						}
						if($taskId){
							//echo $taskId.'<br>';
							//update layer
							$octLayers = M('octlayers');
							$octlayers_add = array(
			    				'octtaskid' => $taskId
			    			);
							$re = $octLayers->where($octlayers_add)->find();

	    					//echo $this->runtime(1).'[ ';
							$lines = $this->generateLines($base.'/'.$dir.'/'.$file);
							//var_dump($newLayer);echo '<br>';
				    		if($re == null){
								$newLayer = (object) array(
									'ID' => $this->guid(), 
									'lines' => $lines,
									'name' => substr($suffix, 1),
									'display' => 1
								);
								$newLayerList = [$newLayer];
            					$tmp = json_encode($newLayerList);
				    			$tmp = str_replace('"', '\\', $tmp);
				    			$octlayers_add = array(
				    				'octtaskid' => $taskId,
				    				'layers' => $tmp
				    			);
				    			$octLayers->add($octlayers_add);
				    		}else{
				    			$tmp = str_replace('\\', '"', $re['layers']);
            					$tmp = json_decode($tmp);
            					$flag = false;
            					foreach ($tmp as $k => $layerData) {
            						if($layerData->name == substr($suffix, 1)){
            							$tmp[$k]->lines = $lines;
            							$flag = true;
            						}
            					}
            					if(!$flag){
									$newLayer = (object) array(
										'ID' => $this->guid(), 
										'lines' => $lines,
										'name' => substr($suffix, 1),
										'display' => 1
									);
            						$tmp[] = $newLayer;
            					}
            					$tmp = json_encode($tmp);
				    			$tmp = str_replace('"', '\\', $tmp);
				    			//var_dump($tmp);
				    			$octlayers_update = array(
				    				'layers' => $tmp
				    			);
				    			$octLayers->where('octtaskid="%d"', $taskId)->save($octlayers_update);
				    		}
						}else{
							//return false;
						}
						continue;
					}else if($suffix !== ''){//origin
						$targetFolder = '/Public/octdatabase/'; // Relative to the root
						//echo $saveName.'<br>';
						$Img = M('oct');
						$saveName = myFun($ufile).substr($ufile, -4, 4);
						// 插入图片地址
						$img_add = array(
							'name' => $ufile,
							'savename' => $saveName,
							'imgsite' => $targetFolder.$saveName,	
							'kind' => 2//暂定2为OCT图像
						);
						$queryRe = $Img->where("name='%s' and savename='%s'", array($ufile, $saveName))->find();
						//add image into db
						if (!$queryRe){
							if(!$Img->add($img_add)){
								$this->_log('insert error: failed to add oct: ').$ufile;
								return false;
							}
						}else{
							$this->_log('oct already exist: failed to add oct: ').$ufile;
						}
						//add image into file system
						if(is_file($_SERVER['DOCUMENT_ROOT'].$targetFolder.$saveName) !== true){
							//zip文件相对服务器根目录的保存路径
							$uploads_dir = "/Public/zipUpload";
							if(copy($base.'/'.$dir.'/'.$file, $_SERVER['DOCUMENT_ROOT'].$targetFolder.$saveName)  !== true){
		                        $this->_log('failed to copy: '.$_SERVER['DOCUMENT_ROOT'].$targetFolder.$saveName);
					        	return false;
					        }
						}
					}else{//should not step into this code
						$this->_log('');
						return false;
					}
					//set condition
					$nodeAdd = array(
						'nodeName' 	=> iconv( 'GB2312', 'UTF-8', $file),
						'parent' 	=> $parentId,
						'leaf'		=> 1
					);
					//check if file exist
					$re = $octFolder->where($nodeAdd)->find();
					//add, aquire ID
					if (!$re){//add new file
						$insertId = $octFolder->add($nodeAdd);//return id
						if (!$insertId){
							$this->_log('failed to insert '.$nodeAdd['nodeName'].' into db');
							return false;
						}
					}else{//already exist
						$insertId = $re['id'];
					}
				}else{//should not step into this code
					$this->_log($base.'/'.$dir.'/'.$file);
					return false;
				}
			}
		}
		return true;
	}

	private function generateLines($fileName){
		$photoSize = GetImageSize($fileName);
		$iw = $photoSize[0];
		$ih = $photoSize[1];
		$img = ImageCreateFromPNG($fileName);
		$checkImg = array();
		$count = 0;
		$x = 0;
		$re = array();
		for($y = 0; $y < $ih; $y++){
			if(imagecolorat($img, $x, $y)){
				for(;$x+1 < $iw; $x++){
					$d = [-2, -1, 0, 1, 2];
					$i = 0;
					for(; $i < 5; $i++){
						if(imagecolorat($img, $x+1, $y+$d[$i])){
							break;
						}
					}
					$newLine = (object) array(
						'startX' => $x,
						'startY' => $y,
						'endX' => $x+1,
						'endY' => $y+$d[$i]
					);
					$y = $y+$d[$i];
					$re[] = $newLine;
				}
				break;
			}
		}
		//echo $this->runtime(1).'] <br>';
		return $re;
	}

	private function createMarkFromFolder($fileName){
		//zip文件名
		$fileName = iconv( 'GB2312', 'UTF-8', $fileName);

		//zip文件相对服务器根目录的保存路径
		$folderName = substr($fileName,0,strlen($fileName)-4);
		$folderName = iconv( 'UTF-8', 'GB2312', $folderName);
		$uploads_dir = "/Public/zipUpload";
		//将目标路径名称赋值为fileName最后的'.zip'四个字符之外的全部字符构成的字符串
		$folderDir = $_SERVER['DOCUMENT_ROOT'].$uploads_dir.'/'.$folderName;
		if(is_dir($folderDir) !== true){
			return false;
		}

	   	//分析图片，同时更新数据库
	    M()->startTrans();
	    $subFolderName = scandir($folderDir)[2];

	    if($subFolderName == '' || is_dir($folderDir.'/'.$subFolderName) !== true){
	    	M()->rollback();
	    	return false;
	    }
	    // $this->runtime();
		// if((false && ($this->digFolder($folderDir, $subFolderName, 0) !== true)) || $this->imageToOct($folderDir, $subFolderName) !== true){
	    if($this->imageToOct($folderDir, $subFolderName, 0) !== true){
			M()->rollback();
			return false;
		}
		M()->commit();
	    // echo '<br>'.$this->runtime(1).'<br>';
		return true;
	}

	/**
	 *
	 * Check if all the parts exist, and
	 * gather all the parts of the file together
	 * @param string $dir - the temporary directory holding all the parts of the file
	 * @param string $fileName - the original file name
	 * @param string $chunkSize - each chunk size (in bytes)
	 * @param string $totalSize - original file size (in bytes)
	 */
	private function createFileFromChunks($temp_dir, $fileName, $chunkSize, $totalSize) {
	    // count all the parts of this file
	    $total_files = 0;
	    foreach(scandir($temp_dir) as $file) {
	        if (stripos($file, $fileName) !== false) {
	            $total_files++;
	        }
	    }
	    // check that all the parts are present
	    // the size of the last part is between chunkSize and 2*$chunkSize
	    if ($total_files * $chunkSize >=  ($totalSize - $chunkSize + 1)) {
	        $uploads_dir = "/Public/zipUpload";
	        // create the final destination file
	        if (($fp = fopen($_SERVER['DOCUMENT_ROOT'].$uploads_dir.'/'.$fileName, 'w')) !== false) {
	            for ($i=1; $i<=$total_files; $i++) {
	                fwrite($fp, file_get_contents($temp_dir.'/'.$fileName.'.part'.$i));
	                //_log('writing chunk '.$i);
	            }
	            fclose($fp);
	        } else {
	            $this->_log('cannot create the destination file');
	            return false;
	        }
	        // rename the temporary directory (to avoid access from other
	        // concurrent chunks uploads) and than delete it
	        if (rename($temp_dir, $temp_dir.'_UNUSED')) {
	            $this->rrmdir($temp_dir.'_UNUSED');
	        } else {
	            $this->rrmdir($temp_dir);
	        }
			//convert zip into image
	        if($this->createFolderFromZip($fileName) !== true){
	        	$this->_log('cannot create folder from zip');
	        	return false;
	        }
	        //convert images in folders into marks
	        if($this->createMarkFromFolder($fileName) !== true){
	        	$this->_log('cannot create mark from folder');
	        	return false;
	        }
	    }
	}

	/**
	*
	*endpoint of upload
	*/
	public function oct_mark_upload(){
		$REQUEST_METHOD=$_SERVER['REQUEST_METHOD'];

		//$targetFolder = '/Public/octdatabase/'; // Relative to the root
		//$uploads_dir="uploads";
		if($REQUEST_METHOD == "GET")
		{
		    if(count($_GET)>0)
		    {
		        $chunkNumber = $_GET['resumableChunkNumber'];
		        $chunkSize = $_GET['resumableChunkSize'];
		        $totalSize = $_GET['resumableTotalSize'];
		        $identifier = $_GET['resumableIdentifier'];
		        $filename = iconv ( 'UTF-8', 'GB2312', $_GET ['resumableFilename'] );

		        if($this->validateRequest($chunkNumber, $chunkSize, $totalSize, $identifier, $filename)=='valid')
		        {
		            $chunkFilename = $this->getChunkFilename($chunkNumber, $identifier,$filename);
		            {
		                if(file_exists($chunkFilename)){
		                    echo "found";
		                } else {
		                    header("HTTP/1.0 404 Not Found");
		                    echo "not_found";
		                }
		            }
		        }
		        else
		        {
		            header("HTTP/1.0 404 Not Found");
		            echo "not_found";
		        }
		    }
		}

		// loop through files and move the chunks to a temporarily created directory
		if($REQUEST_METHOD == "POST"){
		    if(count($_POST)>0)
		    {
		        $resumableFilename = iconv ( 'UTF-8', 'GB2312', $_POST ['resumableFilename'] );
		        $resumableIdentifier=$_POST['resumableIdentifier'];
		        $resumableChunkNumber=$_POST['resumableChunkNumber'];
		        $resumableTotalSize=$_POST['resumableTotalSize'];
		        $resumableChunkSize=$_POST['resumableChunkSize'];
		        if (!empty($_FILES)) foreach ($_FILES as $file) {
		            // check the error status
		            if ($file['error'] != 0) {
		                $this->_log('error '.$file['error'].' in file '.$resumableFilename);
		                continue;
		            }
		            // init the destination file (format <filename.ext>.part<#chunk>
		            // the file is stored in a temporary directory
		                                                                                                                                                                                                                                                              
		            $uploads_dir = "/Public/zipUpload";
		                                                                                                                                                                                                                                                              
		            $temp_dir = $_SERVER['DOCUMENT_ROOT'].$uploads_dir.'/'.$resumableIdentifier;
		            $dest_file = $temp_dir.'/'.$resumableFilename.'.part'.$resumableChunkNumber;

		            // create the temporary directory
		            if (!is_dir($temp_dir)) {
		                mkdir($temp_dir, 0777, true);
		            }
		            // move the temporary file
		            if (!move_uploaded_file($file['tmp_name'], $dest_file)) {
		                $this->_log('Error saving (move_uploaded_file) chunk '.$resumableChunkNumber.' for file '.$resumableFilename);
		            } else {
		                // check if all the parts present, and create the final destination file
		                $this->createFileFromChunks($temp_dir, $resumableFilename,$resumableChunkSize, $resumableTotalSize);
		            }
		        }
		    }
		}
	}
}