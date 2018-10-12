/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : gidb

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-10-12 20:40:50
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for gidb_img
-- ----------------------------
DROP TABLE IF EXISTS `gidb_img`;
CREATE TABLE `gidb_img` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imgsite` varchar(255) DEFAULT NULL COMMENT '图片地址',
  `kind` tinyint(1) DEFAULT NULL COMMENT '图片类型。',
  `available` tinyint(1) DEFAULT '1' COMMENT '是否有效',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1677 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gidb_imginfo
-- ----------------------------
DROP TABLE IF EXISTS `gidb_imginfo`;
CREATE TABLE `gidb_imginfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imgid` int(11) NOT NULL,
  `width` int(11) DEFAULT NULL COMMENT '图片宽度（像素）',
  `height` int(11) DEFAULT NULL COMMENT '图片高度（像素）',
  `channel` tinyint(1) DEFAULT NULL COMMENT '通道数',
  `comment` varchar(255) DEFAULT NULL COMMENT '图片简短备注',
  `labels` varchar(255) DEFAULT NULL COMMENT '图片标签，可以分配多个标签',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gidb_oct
-- ----------------------------
DROP TABLE IF EXISTS `gidb_oct`;
CREATE TABLE `gidb_oct` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '原名',
  `savename` varchar(255) DEFAULT NULL COMMENT '保存命名',
  `imgsite` varchar(255) DEFAULT NULL COMMENT '图片地址',
  `kind` tinyint(1) DEFAULT NULL COMMENT '图片类型',
  `available` tinyint(1) DEFAULT '1' COMMENT '是否有效',
  PRIMARY KEY (`id`),
  UNIQUE KEY `u_name` (`name`) COMMENT 'OCT图像命名唯一',
  KEY `name` (`name`,`savename`)
) ENGINE=InnoDB AUTO_INCREMENT=11752 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gidb_octfolder
-- ----------------------------
DROP TABLE IF EXISTS `gidb_octfolder`;
CREATE TABLE `gidb_octfolder` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `nodeName` varchar(255) DEFAULT NULL COMMENT '名称',
  `parent` int(11) DEFAULT '0' COMMENT '父节点',
  `leaf` tinyint(3) unsigned DEFAULT '0' COMMENT '是否为叶子结点',
  PRIMARY KEY (`id`),
  KEY `nodeName` (`nodeName`,`parent`,`leaf`)
) ENGINE=InnoDB AUTO_INCREMENT=22063 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gidb_octlayers
-- ----------------------------
DROP TABLE IF EXISTS `gidb_octlayers`;
CREATE TABLE `gidb_octlayers` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `octtaskid` int(11) NOT NULL COMMENT '任务id',
  `layers` mediumtext COMMENT '图层数组信息',
  PRIMARY KEY (`id`),
  UNIQUE KEY `octtaskid` (`octtaskid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1493 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gidb_octtask
-- ----------------------------
DROP TABLE IF EXISTS `gidb_octtask`;
CREATE TABLE `gidb_octtask` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `imgid` int(11) DEFAULT NULL COMMENT '图片id',
  `uid` varchar(30) DEFAULT NULL COMMENT '用户id',
  PRIMARY KEY (`id`),
  KEY `imgid` (`imgid`,`uid`),
  KEY `imgid_2` (`imgid`)
) ENGINE=InnoDB AUTO_INCREMENT=1186 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gidb_privilege
-- ----------------------------
DROP TABLE IF EXISTS `gidb_privilege`;
CREATE TABLE `gidb_privilege` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(30) NOT NULL COMMENT '学号/编号/帐号',
  `privi` varchar(20) DEFAULT NULL COMMENT '权限',
  `kind` tinyint(1) DEFAULT '0' COMMENT '类型标记',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gidb_tabdiagnose
-- ----------------------------
DROP TABLE IF EXISTS `gidb_tabdiagnose`;
CREATE TABLE `gidb_tabdiagnose` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskid` int(11) DEFAULT NULL,
  `diagnose` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7191 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gidb_tabpoints
-- ----------------------------
DROP TABLE IF EXISTS `gidb_tabpoints`;
CREATE TABLE `gidb_tabpoints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskid` int(11) DEFAULT NULL COMMENT '标定任务的ID',
  `points` text COMMENT 'json格式的坐标序列',
  `time` int(11) DEFAULT NULL,
  `time2` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2473 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gidb_task
-- ----------------------------
DROP TABLE IF EXISTS `gidb_task`;
CREATE TABLE `gidb_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskkind` int(11) DEFAULT NULL COMMENT '标定类型，1视杯，2视盘，3黄斑',
  `imgid` int(11) DEFAULT NULL COMMENT '图像ID',
  `uid` varchar(30) DEFAULT NULL COMMENT '用户名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9665 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gidb_user
-- ----------------------------
DROP TABLE IF EXISTS `gidb_user`;
CREATE TABLE `gidb_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(30) NOT NULL COMMENT '学号/编号/帐号',
  `passwd` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL COMMENT '姓名',
  `kind` tinyint(1) DEFAULT '41' COMMENT '用户身份。教授/主任/副主任/医师等，待商榷',
  `graduate` tinyint(1) DEFAULT '61' COMMENT '是否毕业离校。61在校，62离校',
  PRIMARY KEY (`id`,`uid`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gidb_userdetail
-- ----------------------------
DROP TABLE IF EXISTS `gidb_userdetail`;
CREATE TABLE `gidb_userdetail` (
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
