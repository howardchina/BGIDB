/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50624
Source Host           : localhost:3306
Source Database       : gidb

Target Server Type    : MYSQL
Target Server Version : 50624
File Encoding         : 65001

Date: 2015-09-08 22:04:16
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `gidb_img`
-- ----------------------------
DROP TABLE IF EXISTS `gidb_img`;
CREATE TABLE `gidb_img` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imgsite` varchar(255) DEFAULT NULL COMMENT '图片地址',
  `kind` tinyint(1) DEFAULT NULL COMMENT '图片类型。',
  `available` tinyint(1) DEFAULT '1' COMMENT '是否有效',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gidb_img
-- ----------------------------
INSERT INTO `gidb_img` VALUES ('1', '/Public/imgdatabase/a5a232506a4b2a2818711b1c2c5d8f24.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('2', '/Public/imgdatabase/057b92e5be6d753a01128e0e2c279890.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('3', '/Public/imgdatabase/905bee2516db0f434804b4bd5d433c5e.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('4', '/Public/imgdatabase/c0417c6892ef62c0dcfdcababc020b1d.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('5', '/Public/imgdatabase/dade2c278cde2d04b8ca1a8bfce147ce.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('6', '/Public/imgdatabase/c3865f91c8b98a29fbe0a2b8929d4481.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('7', '/Public/imgdatabase/24bcdf4730f746fc43c66152511ebedd.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('8', '/Public/imgdatabase/ab28a9acfd6acc08edf253a7f29ac5d8.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('9', '/Public/imgdatabase/dac0b688548a1c03c5f535e787138f0c.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('10', '/Public/imgdatabase/33aa8c9f6fbbef89abccf660185f1ff9.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('11', '/Public/imgdatabase/db997a362f77fb52d901fda086587119.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('12', '/Public/imgdatabase/0bef146d234098036a6e1818a9f827b4.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('13', '/Public/imgdatabase/a35bf122cf0917c76cbcc493781b9883.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('14', '/Public/imgdatabase/80bf8bd9e0ca83c5b10fdafbdb393941.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('15', '/Public/imgdatabase/1d3defc182ab661c52fb75f9a7ee911b.jpg', '1', '1');
INSERT INTO `gidb_img` VALUES ('16', '/Public/imgdatabase/2f781d4c78d8d8db727ac7dbdec1c566.jpg', '1', '1');

-- ----------------------------
-- Table structure for `gidb_imginfo`
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
-- Records of gidb_imginfo
-- ----------------------------

-- ----------------------------
-- Table structure for `gidb_privilege`
-- ----------------------------
DROP TABLE IF EXISTS `gidb_privilege`;
CREATE TABLE `gidb_privilege` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(30) NOT NULL COMMENT '学号/编号/帐号',
  `privi` varchar(20) DEFAULT NULL COMMENT '权限',
  `kind` tinyint(1) DEFAULT '0' COMMENT '类型标记',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gidb_privilege
-- ----------------------------
INSERT INTO `gidb_privilege` VALUES ('1', 'csgrandeur', 'gidb_admin', '0');
INSERT INTO `gidb_privilege` VALUES ('2', 'howard', 'gidb_admin', '0');

-- ----------------------------
-- Table structure for `gidb_tabpoints`
-- ----------------------------
DROP TABLE IF EXISTS `gidb_tabpoints`;
CREATE TABLE `gidb_tabpoints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskid` int(11) DEFAULT NULL COMMENT '标定任务的ID',
  `points` text COMMENT 'json格式的坐标序列',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gidb_tabpoints
-- ----------------------------
INSERT INTO `gidb_tabpoints` VALUES ('1', '1', '[{\\x\\:1468,\\y\\:688,\\type\\:\\h\\},{\\x\\:1519,\\y\\:769,\\type\\:\\h\\},{\\x\\:1504,\\y\\:872,\\type\\:\\h\\},{\\x\\:1358,\\y\\:882},{\\x\\:1317,\\y\\:731,\\type\\:\\h\\}]');
INSERT INTO `gidb_tabpoints` VALUES ('2', '2', '[{\\x\\:1424,\\y\\:681,\\type\\:\\h\\},{\\x\\:1467,\\y\\:704},{\\x\\:1475,\\y\\:750,\\type\\:\\h\\},{\\x\\:1405,\\y\\:772,\\type\\:\\h\\},{\\x\\:1368,\\y\\:741,\\type\\:\\h\\},{\\x\\:1363,\\y\\:704,\\type\\:\\h\\}]');

-- ----------------------------
-- Table structure for `gidb_task`
-- ----------------------------
DROP TABLE IF EXISTS `gidb_task`;
CREATE TABLE `gidb_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskkind` int(11) DEFAULT NULL COMMENT '标定类型，1视杯，2视盘，3黄斑',
  `imgid` int(11) DEFAULT NULL COMMENT '图像ID',
  `uid` varchar(30) DEFAULT NULL COMMENT '用户名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gidb_task
-- ----------------------------
INSERT INTO `gidb_task` VALUES ('1', '2', '1', 'howard');
INSERT INTO `gidb_task` VALUES ('2', '1', '2', 'howard');

-- ----------------------------
-- Table structure for `gidb_user`
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gidb_user
-- ----------------------------
INSERT INTO `gidb_user` VALUES ('15', 'csgrandeur', '96e79218965eb72c92a549dd5a330112', '郭大侠', '41', '0');
INSERT INTO `gidb_user` VALUES ('16', 'howard', 'dc5ab2b32d9d78045215922409541ed7', '何骐', '41', '0');

-- ----------------------------
-- Table structure for `gidb_userdetail`
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
  KEY `uid` (`uid`),
  CONSTRAINT `gidb_userdetail_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `gidb_user` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gidb_userdetail
-- ----------------------------
INSERT INTO `gidb_userdetail` VALUES ('1', 'csgrandeur', '81', '1212', 'fawef@faewf.fawef', '12', '2010-02-11', '131', '3131', '31', '啊啊啊', 'gregres45645684');
INSERT INTO `gidb_userdetail` VALUES ('2', 'howard', '81', '312', '97@da.com', '10', '0000-00-00', '21', '312', '312', 'ads', 'dasd');
