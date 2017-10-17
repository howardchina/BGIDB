<?php
	function myFun($filename)
	{
		return strtolower(md5($filename));
	}