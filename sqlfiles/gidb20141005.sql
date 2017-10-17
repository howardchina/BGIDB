-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2014-10-05 16:24:12
-- 服务器版本: 5.5.38-0ubuntu0.14.04.1
-- PHP 版本: 5.5.9-1ubuntu4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `gidb`
--

-- --------------------------------------------------------

--
-- 表的结构 `gidb_img`
--

CREATE TABLE IF NOT EXISTS `gidb_img` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imgsite` varchar(255) DEFAULT NULL COMMENT '图片地址',
  `kind` tinyint(1) DEFAULT NULL COMMENT '图片类型。',
  `available` tinyint(1) DEFAULT '1' COMMENT '是否有效',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=24 ;

--
-- 转存表中的数据 `gidb_img`
--

INSERT INTO `gidb_img` (`id`, `imgsite`, `kind`, `available`) VALUES
(1, '/Public/imgdatabase/09a3e5649ffb4fc7df5bb5cbbabc1b83.jpg', 1, 1),
(2, '/Public/imgdatabase/648235f12c5c43a3d1cf648068926f39.jpg', 1, 1),
(3, '/Public/imgdatabase/d9acfa5d1a03f895c93081e1bccbc7f2.jpg', 1, 1),
(4, '/Public/imgdatabase/c439745d2f5acb745d635d5a370d654e.jpg', 1, 1),
(5, '/Public/imgdatabase/62a4c1f6086e5d16eef705ef8a341494.jpg', 1, 1),
(6, '/Public/imgdatabase/8bb4840e78499df26456eb7fa345f5ef.jpg', 1, 1),
(7, '/Public/imgdatabase/f0b88d075ced86dfbe2410f3a28f4b04.jpg', 1, 1),
(8, '/Public/imgdatabase/7c816d45fc735f6d10aa143d865f9af6.jpg', 1, 1),
(9, '/Public/imgdatabase/c945dfc73baee9d3c33d187ed659b5fa.jpg', 1, 1),
(10, '/Public/imgdatabase/0f0d973a2e391c8b855f4eb5a80e26a5.jpg', 1, 1),
(11, '/Public/imgdatabase/4f9142abbcd28ae14592e5c8bc4b9cdb.jpg', 1, 1),
(12, '/Public/imgdatabase/eaa61426ef28e3c9e3f70c64e1782079.jpg', 1, 1),
(13, '/Public/imgdatabase/7abe3018c3300b07c6f9e2dc6401b6bd.jpg', 1, 1),
(14, '/Public/imgdatabase/7cce118e7161dfa6b378babd990fd125.jpg', 1, 1),
(15, '/Public/imgdatabase/26d871d8d84f4e7bf4a4ff254320c46f.jpg', 1, 1),
(16, '/Public/imgdatabase/62c54da22315fade17e706a102951254.jpg', 1, 1),
(17, '/Public/imgdatabase/095405596c50b2d3fda56cb49e040d90.jpg', 1, 1),
(18, '/Public/imgdatabase/7c9065b0b7537b65fd4073e1a3ee41e3.jpg', 1, 1),
(19, '/Public/imgdatabase/53b0275fdb256f308ac02338eb670a4b.jpg', 1, 1),
(20, '/Public/imgdatabase/82dbddb7c50bad811b4ac9abb8795869.jpg', 1, 1),
(21, '/Public/imgdatabase/83b427623f2f0678a6635515ec794ef2.jpg', 1, 1),
(22, '/Public/imgdatabase/18ac45c6d69643764c98720dcab40902.jpg', 1, 1),
(23, '/Public/imgdatabase/a93881ac8977fcfda0fe6ec6391208ee.jpg', 1, 1);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `gidb_privilege`
--

INSERT INTO `gidb_privilege` (`id`, `uid`, `privi`, `kind`) VALUES
(1, 'csgrandeur', 'gidb_admin', 0);

-- --------------------------------------------------------

--
-- 表的结构 `gidb_tabpoints`
--

CREATE TABLE IF NOT EXISTS `gidb_tabpoints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskid` int(11) DEFAULT NULL COMMENT '标定任务的ID',
  `points` text COMMENT 'json格式的坐标序列',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `gidb_task`
--

CREATE TABLE IF NOT EXISTS `gidb_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskkind` int(11) DEFAULT NULL COMMENT '标定类型，1视杯，2视盘，3黄斑',
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
