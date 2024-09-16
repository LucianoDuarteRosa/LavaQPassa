-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: lavaQPassaBrecho
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accountspayable`
--

DROP TABLE IF EXISTS `accountspayable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accountspayable` (
  `IdAccountPayable` int NOT NULL AUTO_INCREMENT,
  `Amount` double NOT NULL,
  `IdSale` int DEFAULT NULL,
  `IdClientSupplier` int NOT NULL,
  `IdStore` int NOT NULL,
  `RegistrationDate` datetime NOT NULL,
  `DueDate` datetime NOT NULL,
  `Note` varchar(255) DEFAULT NULL,
  `Paid` tinyint(1) DEFAULT '0',
  `Active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`IdAccountPayable`),
  KEY `IdStore` (`IdStore`),
  KEY `idx_sale_id_accounts_payable` (`IdSale`),
  KEY `idx_client_supplier_id_accounts_payable` (`IdClientSupplier`),
  CONSTRAINT `accountspayable_ibfk_1` FOREIGN KEY (`IdSale`) REFERENCES `sale` (`IdSale`) ON DELETE CASCADE,
  CONSTRAINT `accountspayable_ibfk_2` FOREIGN KEY (`IdStore`) REFERENCES `store` (`IdStore`) ON DELETE CASCADE,
  CONSTRAINT `accountspayable_ibfk_3` FOREIGN KEY (`IdClientSupplier`) REFERENCES `clientsupplier` (`IdClientSupplier`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accountspayable`
--

LOCK TABLES `accountspayable` WRITE;
/*!40000 ALTER TABLE `accountspayable` DISABLE KEYS */;
INSERT INTO `accountspayable` VALUES (1,24,41,3,1,'2024-09-15 17:36:00','2024-10-10 17:36:00',NULL,0,1),(2,120,41,3,1,'2024-09-15 17:36:00','2024-10-10 17:36:00',NULL,0,1),(3,60,41,3,1,'2024-09-15 17:36:00','2024-10-10 17:36:00',NULL,0,1);
/*!40000 ALTER TABLE `accountspayable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accountsreceivable`
--

DROP TABLE IF EXISTS `accountsreceivable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accountsreceivable` (
  `IdAccountReceivable` int NOT NULL AUTO_INCREMENT,
  `Amount` double NOT NULL,
  `IdSale` int DEFAULT NULL,
  `IdClientSupplier` int NOT NULL,
  `IdStore` int NOT NULL,
  `RegistrationDate` datetime NOT NULL,
  `DueDate` datetime NOT NULL,
  `Note` varchar(255) DEFAULT NULL,
  `Paid` tinyint(1) DEFAULT '0',
  `Active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`IdAccountReceivable`),
  KEY `IdStore` (`IdStore`),
  KEY `idx_sale_id_accounts_receivable` (`IdSale`),
  KEY `idx_client_supplier_id_accounts_receivable` (`IdClientSupplier`),
  CONSTRAINT `accountsreceivable_ibfk_1` FOREIGN KEY (`IdSale`) REFERENCES `sale` (`IdSale`) ON DELETE CASCADE,
  CONSTRAINT `accountsreceivable_ibfk_2` FOREIGN KEY (`IdStore`) REFERENCES `store` (`IdStore`) ON DELETE CASCADE,
  CONSTRAINT `accountsreceivable_ibfk_3` FOREIGN KEY (`IdClientSupplier`) REFERENCES `clientsupplier` (`IdClientSupplier`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accountsreceivable`
--

LOCK TABLES `accountsreceivable` WRITE;
/*!40000 ALTER TABLE `accountsreceivable` DISABLE KEYS */;
/*!40000 ALTER TABLE `accountsreceivable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientsupplier`
--

DROP TABLE IF EXISTS `clientsupplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientsupplier` (
  `IdClientSupplier` int NOT NULL AUTO_INCREMENT,
  `ClientSupplierName` varchar(80) NOT NULL,
  `Cpf` varchar(14) DEFAULT NULL,
  `Cnpj` varchar(18) DEFAULT NULL,
  `ZipCode` varchar(9) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Number` varchar(20) NOT NULL,
  `Complement` varchar(100) DEFAULT NULL,
  `Neighborhood` varchar(60) NOT NULL,
  `City` varchar(40) NOT NULL,
  `State` varchar(2) NOT NULL,
  `Phone` varchar(35) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `IsClient` tinyint(1) DEFAULT NULL,
  `IsSupplier` tinyint(1) DEFAULT NULL,
  `TypeKey` enum('CPF/CNPJ','Email','Telefone','Chave Aleatória') DEFAULT NULL,
  `PixKey` varchar(255) DEFAULT NULL,
  `Active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`IdClientSupplier`),
  UNIQUE KEY `Cpf` (`Cpf`),
  UNIQUE KEY `Cnpj` (`Cnpj`),
  KEY `idx_client_supplier_name` (`ClientSupplierName`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientsupplier`
--

LOCK TABLES `clientsupplier` WRITE;
/*!40000 ALTER TABLE `clientsupplier` DISABLE KEYS */;
INSERT INTO `clientsupplier` VALUES (1,'João da Silva','12345678910',NULL,'12345678','Rua A','123',NULL,'Bairro A','Cidade A','AA','123456789','joao@silva.com',1,0,'Email','lucianoduarterosa@hotmail.com',1),(2,'Maria Oliveira',NULL,'12345678000190','87654321','Avenida B','456','Apto 2','Bairro B','Cidade B','BB','987654321','maria@oliveira.com',0,1,'CPF/CNPJ','10461955652',1),(3,'Carlos Pereira','22345678900',NULL,'23456789','Rua C','321',NULL,'Bairro C','Cidade C','CC','234567890','carlos@pereira.com',1,0,'Telefone','32988996771',1),(4,'Ana Souza',NULL,'22345678000190','98765432','Avenida D','654','Casa 3','Bairro D','Cidade D','DD','876543210','ana@souza.com',0,1,'CPF/CNPJ','10461955652',1);
/*!40000 ALTER TABLE `clientsupplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `IdProduct` int NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(50) NOT NULL,
  `CostPrice` double NOT NULL,
  `SalePrice` double NOT NULL,
  `IdClientSupplier` int NOT NULL,
  `IdSubGroup` int NOT NULL,
  `IdStore` int NOT NULL,
  `IdUser` int NOT NULL,
  `RegistrationDate` datetime NOT NULL,
  `Sold` tinyint(1) DEFAULT '0',
  `Active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`IdProduct`),
  KEY `IdStore` (`IdStore`),
  KEY `IdUser` (`IdUser`),
  KEY `idx_product_name` (`ProductName`),
  KEY `idx_client_supplier_id` (`IdClientSupplier`),
  KEY `idx_subgroup_id` (`IdSubGroup`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`IdStore`) REFERENCES `store` (`IdStore`) ON DELETE CASCADE,
  CONSTRAINT `product_ibfk_2` FOREIGN KEY (`IdClientSupplier`) REFERENCES `clientsupplier` (`IdClientSupplier`) ON DELETE CASCADE,
  CONSTRAINT `product_ibfk_3` FOREIGN KEY (`IdSubGroup`) REFERENCES `subgroup` (`IdSubGroup`) ON DELETE CASCADE,
  CONSTRAINT `product_ibfk_4` FOREIGN KEY (`IdUser`) REFERENCES `user` (`IdUser`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Camiseta Verde',24,60,3,1,1,1,'2024-09-15 17:35:37',1,1),(2,'Calça Jeans',40,100,2,2,1,1,'2024-09-15 17:35:37',0,1),(3,'Jaqueta de Couro',120,300,3,3,1,1,'2024-09-15 17:35:37',1,1),(4,'Vestido Floral',48,120,4,1,1,1,'2024-09-15 17:35:37',0,1),(5,'Chapéu de Palha',8,20,3,2,1,1,'2024-09-15 17:35:37',0,1),(6,'Blusa de Moletom',32,80,4,3,1,1,'2024-09-15 17:35:37',0,1),(7,'Shorts de Praia',12,30,2,1,1,1,'2024-09-15 17:35:37',0,1),(8,'Sapato Social',60,150,3,2,1,1,'2024-09-15 17:35:37',1,1),(9,'Sandália Feminina',20,50,4,3,1,1,'2024-09-15 17:35:37',0,1),(10,'Cinto de Couro',16,40,3,1,1,1,'2024-09-15 17:35:37',0,1),(11,'Óculos de Sol',40,100,2,2,1,1,'2024-09-15 17:35:37',0,1),(12,'Relógio Esportivo',80,200,3,3,1,1,'2024-09-15 17:35:37',0,1),(13,'Boné Trucker',12,30,4,1,1,1,'2024-09-15 17:35:37',0,1),(14,'Sunga de Natação',8,20,2,2,1,1,'2024-09-15 17:35:37',0,1),(15,'Bolsa de Couro',100,250,3,3,1,1,'2024-09-15 17:35:37',0,1),(16,'Carteira de Couro',24,60,4,1,1,1,'2024-09-15 17:35:37',0,1),(17,'Meia Esportiva',4,10,2,2,1,1,'2024-09-15 17:35:37',0,1),(18,'Gravata Slim',16,40,3,3,1,1,'2024-09-15 17:35:37',0,1),(19,'Camisa Social',32,80,4,1,1,1,'2024-09-15 17:35:37',0,1),(20,'Blazer Masculino',120,300,2,2,1,1,'2024-09-15 17:35:37',0,1),(21,'Camiseta Verde/Amarela',24,60,3,1,1,1,'2024-09-15 17:35:37',0,1),(22,'Calça Jeans Escura',40,100,2,2,1,1,'2024-09-15 17:35:37',0,1),(23,'Jaqueta de Couro de Javali',120,300,3,3,1,1,'2024-09-15 17:35:37',0,1),(24,'Vestido Floral Verão',48,120,4,1,1,1,'2024-09-15 17:35:37',0,1),(25,'Chapéu de Veludo',8,20,3,2,1,1,'2024-09-15 17:35:37',0,1),(26,'Blusa de Moletom Rasgada',32,80,4,3,1,1,'2024-09-15 17:35:37',0,1),(27,'Shorts de Praia Vermlho',12,30,2,1,1,1,'2024-09-15 17:35:37',0,1),(28,'Sapato Social Marrom',60,150,3,2,1,1,'2024-09-15 17:35:37',0,1),(29,'Sandália Feminina Azaleia',20,50,4,3,1,1,'2024-09-15 17:35:37',0,1),(30,'Cinto de Couro de Jacaré',16,40,3,1,1,1,'2024-09-15 17:35:37',0,1),(31,'Óculos de Sol Raybam',40,100,2,2,1,1,'2024-09-15 17:35:37',0,1),(32,'Relógio Esportivo Messi',80,200,3,3,1,1,'2024-09-15 17:35:37',0,1),(33,'Boné Nike',12,30,4,1,1,1,'2024-09-15 17:35:37',0,1),(34,'Sunga de Natação Infantil',8,20,2,2,1,1,'2024-09-15 17:35:37',0,1),(35,'Bolsa de Couro Laranja',100,250,3,3,1,1,'2024-09-15 17:35:37',0,1),(36,'Carteira Preta Básica',24,60,4,1,1,1,'2024-09-15 17:35:37',0,1),(37,'Meia Curta Esportiva',4,10,2,2,1,1,'2024-09-15 17:35:37',0,1),(38,'Gravata Slim Verde',16,40,3,3,1,1,'2024-09-15 17:35:37',0,1),(39,'Camisa Social Rosa',32,80,4,1,1,1,'2024-09-15 17:35:37',0,1),(40,'Blazer Feminino',120,300,2,2,1,1,'2024-09-15 17:35:37',0,1);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productgroup`
--

DROP TABLE IF EXISTS `productgroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productgroup` (
  `IdGroup` int NOT NULL AUTO_INCREMENT,
  `GroupName` varchar(30) NOT NULL,
  `Active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`IdGroup`),
  KEY `idx_group_name` (`GroupName`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productgroup`
--

LOCK TABLES `productgroup` WRITE;
/*!40000 ALTER TABLE `productgroup` DISABLE KEYS */;
INSERT INTO `productgroup` VALUES (1,'Roupas',1),(2,'Calçados',1),(3,'Acessórios',1);
/*!40000 ALTER TABLE `productgroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile` (
  `IdProfile` int NOT NULL AUTO_INCREMENT,
  `UserProfile` enum('Administrador','Colaborador','Usuário') DEFAULT NULL,
  PRIMARY KEY (`IdProfile`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` VALUES (1,'Administrador'),(2,'Colaborador'),(3,'Usuário');
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale`
--

DROP TABLE IF EXISTS `sale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale` (
  `IdSale` int NOT NULL AUTO_INCREMENT,
  `CostPrice` double NOT NULL,
  `SalePrice` double NOT NULL,
  `IdClientSupplier` int NOT NULL,
  `IdUser` int NOT NULL,
  `IdStore` int NOT NULL,
  `SaleDate` datetime NOT NULL,
  `PaymentCondition` enum('Dinheiro','Cartão Crédito','Cartão Débito','Cheque','Crediário') DEFAULT 'Dinheiro',
  `SaleStatus` enum('Finalizada','Cancelada') DEFAULT 'Finalizada',
  PRIMARY KEY (`IdSale`),
  KEY `IdStore` (`IdStore`),
  KEY `IdUser` (`IdUser`),
  KEY `idx_client_supplier_id_sale` (`IdClientSupplier`),
  KEY `idx_sale_date` (`SaleDate`),
  CONSTRAINT `sale_ibfk_1` FOREIGN KEY (`IdClientSupplier`) REFERENCES `clientsupplier` (`IdClientSupplier`) ON DELETE CASCADE,
  CONSTRAINT `sale_ibfk_2` FOREIGN KEY (`IdStore`) REFERENCES `store` (`IdStore`) ON DELETE CASCADE,
  CONSTRAINT `sale_ibfk_3` FOREIGN KEY (`IdUser`) REFERENCES `user` (`IdUser`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale`
--

LOCK TABLES `sale` WRITE;
/*!40000 ALTER TABLE `sale` DISABLE KEYS */;
INSERT INTO `sale` VALUES (1,100,120,1,1,1,'2023-01-15 10:00:00','Dinheiro','Finalizada'),(2,80,95,2,1,1,'2023-01-20 15:00:00','Cartão Crédito','Finalizada'),(3,90,110,3,1,1,'2023-02-05 09:00:00','Cheque','Finalizada'),(4,70,85,4,1,1,'2023-02-18 14:00:00','Cartão Débito','Finalizada'),(5,120,150,2,1,1,'2023-03-10 11:00:00','Crediário','Finalizada'),(6,110,140,1,1,1,'2023-03-22 16:00:00','Dinheiro','Finalizada'),(7,130,160,2,1,1,'2023-04-08 10:00:00','Cartão Crédito','Finalizada'),(8,85,105,3,1,1,'2023-04-25 15:00:00','Cheque','Finalizada'),(9,95,125,4,1,1,'2023-05-12 09:00:00','Cartão Débito','Finalizada'),(10,105,135,2,1,1,'2023-05-28 14:00:00','Dinheiro','Finalizada'),(11,110,140,1,1,1,'2023-06-05 12:00:00','Crediário','Finalizada'),(12,80,100,2,1,1,'2023-06-20 13:00:00','Cartão Crédito','Finalizada'),(13,90,115,3,1,1,'2023-07-10 11:00:00','Cheque','Finalizada'),(14,70,90,4,1,1,'2023-07-22 16:00:00','Cartão Débito','Finalizada'),(15,100,1030,2,1,1,'2023-08-06 10:00:00','Dinheiro','Finalizada'),(16,85,6100,1,1,1,'2023-08-18 15:00:00','Cartão Crédito','Finalizada'),(17,95,5025,2,1,1,'2023-09-12 09:00:00','Cheque','Finalizada'),(18,110,1040,3,1,1,'2023-09-25 14:00:00','Cartão Débito','Finalizada'),(19,120,6050,4,1,1,'2023-10-08 10:00:00','Crediário','Finalizada'),(20,100,1030,1,1,1,'2023-10-20 15:00:00','Dinheiro','Finalizada'),(21,110,9400,1,1,1,'2023-11-10 12:00:00','Cartão Crédito','Finalizada'),(22,95,1200,2,1,1,'2023-11-22 13:00:00','Cheque','Finalizada'),(23,130,1600,3,1,1,'2023-12-05 11:00:00','Cartão Débito','Finalizada'),(24,80,6050,4,1,1,'2023-12-18 14:00:00','Dinheiro','Finalizada'),(25,120,4500,1,1,1,'2024-01-10 10:00:00','Dinheiro','Finalizada'),(26,110,1400,2,1,1,'2024-01-20 14:00:00','Cartão Crédito','Finalizada'),(27,100,6300,3,1,1,'2024-02-08 09:00:00','Cheque','Finalizada'),(28,90,1105,4,1,1,'2024-02-22 16:00:00','Cartão Débito','Finalizada'),(29,130,5600,3,1,1,'2024-03-05 12:00:00','Crediário','Finalizada'),(30,120,1500,1,1,1,'2024-03-18 11:00:00','Dinheiro','Finalizada'),(31,110,1400,2,1,1,'2024-04-10 10:00:00','Cartão Crédito','Finalizada'),(32,95,4250,3,1,1,'2024-04-22 15:00:00','Cheque','Finalizada'),(33,105,6305,4,1,1,'2024-05-08 10:00:00','Cartão Débito','Finalizada'),(34,85,1100,2,1,1,'2024-05-20 14:00:00','Dinheiro','Finalizada'),(35,115,7450.5,1,1,1,'2024-06-10 11:00:00','Crediário','Finalizada'),(36,90,1200.6,2,1,1,'2024-06-22 13:00:00','Cartão Crédito','Finalizada'),(37,130,6600.3,3,1,1,'2024-07-05 12:00:00','Cheque','Finalizada'),(38,100,1300.5,4,1,1,'2024-07-18 15:00:00','Cartão Débito','Finalizada'),(39,130,3600.3,3,1,1,'2024-08-05 12:00:00','Cheque','Finalizada'),(40,100,2300.5,4,1,1,'2024-08-18 15:00:00','Cartão Débito','Finalizada'),(41,204,510,1,1,1,'2024-09-15 17:36:00','Dinheiro','Finalizada');
/*!40000 ALTER TABLE `sale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saledetail`
--

DROP TABLE IF EXISTS `saledetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saledetail` (
  `IdSaleDetail` int NOT NULL AUTO_INCREMENT,
  `IdSale` int NOT NULL,
  `IdProduct` int NOT NULL,
  PRIMARY KEY (`IdSaleDetail`),
  KEY `idx_sale_id` (`IdSale`),
  KEY `idx_product_id_sale_detail` (`IdProduct`),
  CONSTRAINT `saledetail_ibfk_1` FOREIGN KEY (`IdSale`) REFERENCES `sale` (`IdSale`) ON DELETE CASCADE,
  CONSTRAINT `saledetail_ibfk_2` FOREIGN KEY (`IdProduct`) REFERENCES `product` (`IdProduct`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saledetail`
--

LOCK TABLES `saledetail` WRITE;
/*!40000 ALTER TABLE `saledetail` DISABLE KEYS */;
INSERT INTO `saledetail` VALUES (1,41,1),(2,41,3),(3,41,8);
/*!40000 ALTER TABLE `saledetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store`
--

DROP TABLE IF EXISTS `store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store` (
  `IdStore` int NOT NULL AUTO_INCREMENT,
  `StoreName` varchar(40) NOT NULL,
  `ZipCode` varchar(9) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Number` varchar(20) NOT NULL,
  `Complement` varchar(100) DEFAULT NULL,
  `Neighborhood` varchar(60) DEFAULT NULL,
  `City` varchar(40) NOT NULL,
  `State` varchar(40) NOT NULL,
  `Phone` varchar(35) NOT NULL,
  `Email` varchar(60) NOT NULL,
  `Active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`IdStore`),
  KEY `idx_store_name` (`StoreName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store`
--

LOCK TABLES `store` WRITE;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` VALUES (1,'Matriz-Cataguases','12345-678','Rua A','123',NULL,'Bairro A','Cidade A','Estado A','123456789','lojaa@example.com',1);
/*!40000 ALTER TABLE `store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subgroup`
--

DROP TABLE IF EXISTS `subgroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subgroup` (
  `IdSubGroup` int NOT NULL AUTO_INCREMENT,
  `SubGroupName` varchar(30) NOT NULL,
  `IdGroup` int NOT NULL,
  `Active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`IdSubGroup`),
  KEY `idx_subgroup_name` (`SubGroupName`),
  KEY `idx_group_id` (`IdGroup`),
  CONSTRAINT `subgroup_ibfk_1` FOREIGN KEY (`IdGroup`) REFERENCES `productgroup` (`IdGroup`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subgroup`
--

LOCK TABLES `subgroup` WRITE;
/*!40000 ALTER TABLE `subgroup` DISABLE KEYS */;
INSERT INTO `subgroup` VALUES (1,'Camisetas',1,1),(2,'Calças',1,1),(3,'Tênis',2,1),(4,'Chinelos',2,1),(5,'Relógios',3,1),(6,'Pulseiras',3,1);
/*!40000 ALTER TABLE `subgroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `IdToken` int NOT NULL AUTO_INCREMENT,
  `IdUser` int NOT NULL,
  `Token` varchar(255) NOT NULL,
  `CreateToken` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ExpiresToken` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`IdToken`),
  KEY `IdUser` (`IdUser`),
  CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`IdUser`) REFERENCES `user` (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjY0MzI1NzcsImV4cCI6MTcyNjQ2MTM3N30.otpNfIFHcbPKoshXpjaSlUcHCsAsHsbf43JUatBu350','2024-09-15 20:36:17','2024-09-16 04:36:17');
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `IdUser` int NOT NULL AUTO_INCREMENT,
  `UserName` varchar(20) NOT NULL,
  `UserEmail` varchar(60) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `IdProfile` int NOT NULL,
  `Active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`IdUser`),
  UNIQUE KEY `UserName` (`UserName`),
  UNIQUE KEY `UserEmail` (`UserEmail`),
  KEY `IdProfile` (`IdProfile`),
  KEY `idx_user_email` (`UserEmail`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`IdProfile`) REFERENCES `profile` (`IdProfile`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','admin@admin.com','$2a$10$QY3ZjyOzp13cu6V.46ZoNeTQbADgPltHSPwGDJnfRSz/70k3tOWQe',1,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-15 17:41:51
