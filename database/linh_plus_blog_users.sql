-- MySQL dump 10.13  Distrib 8.0.16, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: linh_plus_blog
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(128) NOT NULL,
  `gender` varchar(1) NOT NULL DEFAULT 'm',
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `biography` varchar(1000) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  FULLTEXT KEY `username_2` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hoanglinh','$2a$10$y82rRrR6yYl3L8Oa364AteTY9/iMGL.dirOXedsnpmu28.5OWrVeO','m','/images/avatars/hlp_342022T142950.jpg','linh072217@gmail.com','Hello my name is nguyen hoang linh, my major is information technology, nice to meet you','Giồng Riềng, Kiên Giang','2000-11-25','2022-04-04 07:29:51'),(2,'huynhdieu','$2a$10$AZzPfRbBgswVKss4UGdGD.ZZn1ikpG6neRHHO8ohqyzxgLXXEGgEG','f','/images/avatars/277149396_1332373123921961_6109822464603979499_n_342022T143135.jpg','dieuriverlake@gmail.com','Hello I am dieu riverlake, my major is biotechnology, I am glad to meet you. Love You <3','Tân Hưng, Long An','2000-04-25','2022-04-04 07:31:35'),(3,'minhman','$2a$10$gDqz6n03W9.Gme48.DBf/u9pU/Ls6VFqr/iRZRGqr5XhJCmeeOb8.','m','/images/avatars/78176963_1233305163520295_9138113740573507584_o_3272022T141658.jpg','manchoigay@gmail.com.vn','Hello I am man choi gay, my major is automation, it\'s my pleasure to meet you @','Long Hồ, Vĩnh Long,viet nam','2000-02-10','2022-04-04 07:33:25'),(4,'thanhbinh','$2a$10$5gW1wH0DBGLG5XEra7LQ7uncfS3X6IangIVAZAxTXtlFseBIaT3mK','m','/images/avatars/20635484_479547555738461_2214743583179669504_n_3272022T144213.jpg','thanhbinh@gmail.com','hello my nick name is binh gold','an giang','2000-12-25','2022-04-27 07:42:13'),(5,'nhatkhang','$2a$10$t37n7h1O4q3HeOUKqJsKjuZSDuAqnof1Sg2VylXUJMbX1kshgOb/.','m','/images/avatars/linux_3282022T19254.png','nhatkhang123@gmail.com','hello i am khang ','mỏ cày bắc, bến tre ','2000-07-06','2022-04-28 12:02:54');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-07 15:17:52
