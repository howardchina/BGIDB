-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2014-08-27 16:38:46
-- 服务器版本： 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `gidb`
--

-- --------------------------------------------------------

--
-- 表的结构 `gidb_img`
--

CREATE TABLE IF NOT EXISTS `gidb_img` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imgsite` varchar(255) DEFAULT NULL COMMENT '图片地址',
  `kind` tinyint(1) DEFAULT NULL COMMENT '图片类型。',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `gidb_imginfo`
--

CREATE TABLE IF NOT EXISTS `gidb_imginfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imgid` int(11) NOT NULL,
  `width` int(11) DEFAULT NULL COMMENT '图片宽度（像素）',
  `height` int(11) DEFAULT NULL COMMENT '图片高度（像素）',
  `channel` tinyint(1) DEFAULT NULL COMMENT '通道数',
  `comment` varchar(255) DEFAULT NULL COMMENT '图片简短备注',
  `labels` varchar(255) DEFAULT NULL COMMENT '图片标签，可以分配多个标签',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `gidb_privilege`
--

CREATE TABLE IF NOT EXISTS `gidb_privilege` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(30) NOT NULL COMMENT '学号/编号/帐号',
  `privi` varchar(20) DEFAULT NULL COMMENT '权限',
  `kind` tinyint(1) DEFAULT '0' COMMENT '类型标记',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `gidb_signpoints`
--

CREATE TABLE IF NOT EXISTS `gidb_signpoints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskid` int(11) DEFAULT NULL COMMENT '标定任务的ID',
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `gidb_task`
--

CREATE TABLE IF NOT EXISTS `gidb_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskkind` int(11) DEFAULT NULL COMMENT '标定类型（视杯、视盘等）',
  `imgid` int(11) DEFAULT NULL COMMENT '图像ID',
  `uid` varchar(30) DEFAULT NULL COMMENT '用户名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `gidb_user`
--

CREATE TABLE IF NOT EXISTS `gidb_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(30) NOT NULL COMMENT '学号/编号/帐号',
  `passwd` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL COMMENT '姓名',
  `kind` tinyint(1) DEFAULT '41' COMMENT '用户身份。教授/主任/副主任/医师等，待商榷',
  `graduate` tinyint(1) DEFAULT '61' COMMENT '是否毕业离校。61在校，62离校',
  PRIMARY KEY (`id`,`uid`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

--
-- 转存表中的数据 `gidb_user`
--

INSERT INTO `gidb_user` (`id`, `uid`, `passwd`, `name`, `kind`, `graduate`) VALUES
(15, 'csgrandeur', '96e79218965eb72c92a549dd5a330112', '郭大侠', 41, 0);

-- --------------------------------------------------------

--
-- 表的结构 `gidb_userdetail`
--

CREATE TABLE IF NOT EXISTS `gidb_userdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(30) NOT NULL COMMENT '学号',
  `sex` tinyint(1) NOT NULL DEFAULT '81' COMMENT '性别，81男，82女',
  `phone` varchar(20) NOT NULL COMMENT '电话',
  `email` varchar(50) NOT NULL COMMENT '邮箱',
  `degree` tinyint(1) NOT NULL DEFAULT '10' COMMENT '学历，10本科，11硕士，12博士',
  `birthday` date NOT NULL COMMENT '生日',
  `idcard` varchar(30) NOT NULL COMMENT '身份证号',
  `nation` varchar(20) NOT NULL COMMENT '民族',
  `political` varchar(20) NOT NULL COMMENT '政治面貌',
  `institute` varchar(255) DEFAULT '#' COMMENT '部门',
  `selfintro` text,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `gidb_userdetail`
--

INSERT INTO `gidb_userdetail` (`id`, `uid`, `sex`, `phone`, `email`, `degree`, `birthday`, `idcard`, `nation`, `political`, `institute`, `selfintro`) VALUES
(1, 'csgrandeur', 81, '1212', 'fawef@faewf.fawef', 12, '2010-02-11', '131', '3131', '31', '啊啊啊', 'gregres45645684');

--
-- 限制导出的表
--

--
-- 限制表 `gidb_userdetail`
--
ALTER TABLE `gidb_userdetail`
  ADD CONSTRAINT `gidb_userdetail_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `gidb_user` (`uid`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
