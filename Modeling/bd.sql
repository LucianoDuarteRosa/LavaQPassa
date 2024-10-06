CREATE DATABASE lavaQPassaBrecho;
USE lavaQPassaBrecho;

/* Profile type for administrators */
CREATE TABLE Profile (
    IdProfile INT PRIMARY KEY AUTO_INCREMENT,
    UserProfile ENUM('Administrador', 'Colaborador', 'Usuário')
);

/* User for login associated with a profile type */
CREATE TABLE User (
    IdUser INT PRIMARY KEY AUTO_INCREMENT,
    UserName VARCHAR(20) NOT NULL UNIQUE,
    UserEmail VARCHAR(60) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    IdProfile INT NOT NULL,
    Active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (IdProfile) REFERENCES Profile(IdProfile) ON DELETE CASCADE
);

CREATE INDEX idx_user_email ON User (UserEmail);

/* For product group */
CREATE TABLE ProductGroup (
    IdGroup INT PRIMARY KEY AUTO_INCREMENT,
    GroupName VARCHAR(30) NOT NULL,
    Active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_group_name ON ProductGroup (GroupName);

CREATE TABLE SubGroup (
    IdSubGroup INT PRIMARY KEY AUTO_INCREMENT,
    SubGroupName VARCHAR(30) NOT NULL,
    IdGroup INT NOT NULL,
    Active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (IdGroup) REFERENCES ProductGroup(IdGroup) ON DELETE CASCADE
);

CREATE INDEX idx_subgroup_name ON SubGroup (SubGroupName);
CREATE INDEX idx_group_id ON SubGroup (IdGroup);

/* Store information */
CREATE TABLE Store (
    IdStore INT PRIMARY KEY AUTO_INCREMENT,
    StoreName VARCHAR(40) NOT NULL,
    ZipCode VARCHAR(9) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Number VARCHAR(20) NOT NULL,
    Complement VARCHAR(100),
    Neighborhood VARCHAR(60),
    City VARCHAR(40) NOT NULL,
    State VARCHAR(40) NOT NULL,
    Phone VARCHAR(35) NOT NULL,
    Email VARCHAR(60) NOT NULL,
    Active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_store_name ON Store (StoreName);

/* For clients and suppliers - a single table with CPF and CNPJ fields for each type of profile */
CREATE TABLE ClientSupplier (
    IdClientSupplier INT PRIMARY KEY AUTO_INCREMENT,
    ClientSupplierName VARCHAR(80) NOT NULL,
    Cpf VARCHAR(14) UNIQUE,
    Cnpj VARCHAR(18) UNIQUE,
    ZipCode VARCHAR(9) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Number VARCHAR(20) NOT NULL,
    Complement VARCHAR(100),
    Neighborhood VARCHAR(60) NOT NULL,
    City VARCHAR(40) NOT NULL,
    State VARCHAR(2) NOT NULL,
    Phone VARCHAR(35) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    IsClient BOOLEAN,
    IsSupplier BOOLEAN,
	TypeKey ENUM('CPF/CNPJ', 'Email', 'Telefone', 'Chave Aleatória'),
    PixKey VARCHAR(255),
    Active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_client_supplier_name ON ClientSupplier (ClientSupplierName);

/* Store products */
CREATE TABLE Product (
    IdProduct INT PRIMARY KEY AUTO_INCREMENT,
    ProductName VARCHAR(50) NOT NULL,
    CostPrice DOUBLE NOT NULL,
    SalePrice DOUBLE NOT NULL,
    IdClientSupplier INT NOT NULL,
    IdSubGroup INT NOT NULL,
    IdStore INT NOT NULL,
    IdUser INT NOT NULL,
    RegistrationDate DATETIME NOT NULL,
    Sold BOOLEAN DEFAULT FALSE,
    Active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (IdStore) REFERENCES Store(IdStore) ON DELETE CASCADE,
    FOREIGN KEY (IdClientSupplier) REFERENCES ClientSupplier(IdClientSupplier) ON DELETE CASCADE,
    FOREIGN KEY (IdSubGroup) REFERENCES SubGroup(IdSubGroup) ON DELETE CASCADE,
    FOREIGN KEY (IdUser) REFERENCES User(IdUser) ON DELETE CASCADE
);

CREATE INDEX idx_product_name ON Product (ProductName);
CREATE INDEX idx_client_supplier_id ON Product (IdClientSupplier);
CREATE INDEX idx_subgroup_id ON Product (IdSubGroup);

/* Record sales */
CREATE TABLE Sale (
    IdSale INT PRIMARY KEY AUTO_INCREMENT,
    CostPrice DOUBLE NOT NULL,
    SalePrice DOUBLE NOT NULL,
    IdClientSupplier INT NOT NULL,
    IdUser INT NOT NULL,
    IdStore INT NOT NULL,
    SaleDate DATETIME NOT NULL,
    PaymentCondition ENUM('Dinheiro', 'Cartão Crédito', 'Cartão Débito', 'Cheque', 'Crediário') DEFAULT 'Dinheiro',
    SaleStatus ENUM('Finalizada', 'Cancelada') DEFAULT 'Finalizada',
    FOREIGN KEY (IdClientSupplier) REFERENCES ClientSupplier(IdClientSupplier) ON DELETE CASCADE,
    FOREIGN KEY (IdStore) REFERENCES Store(IdStore) ON DELETE CASCADE,
    FOREIGN KEY (IdUser) REFERENCES User(IdUser) ON DELETE CASCADE
);

CREATE INDEX idx_client_supplier_id_sale ON Sale (IdClientSupplier);
CREATE INDEX idx_sale_date ON Sale (SaleDate);

/* Sale details */
CREATE TABLE SaleDetail (
    IdSaleDetail INT PRIMARY KEY AUTO_INCREMENT,
    IdSale INT NOT NULL,
    IdProduct INT NOT NULL,
    FOREIGN KEY (IdSale) REFERENCES Sale(IdSale) ON DELETE CASCADE,
    FOREIGN KEY (IdProduct) REFERENCES Product(IdProduct) ON DELETE CASCADE
);

CREATE INDEX idx_sale_id ON SaleDetail (IdSale);
CREATE INDEX idx_product_id_sale_detail ON SaleDetail (IdProduct);

/* Record accounts payable */
CREATE TABLE AccountsPayable (
    IdAccountPayable INT PRIMARY KEY AUTO_INCREMENT,
    Amount DOUBLE NOT NULL,
    IdSale INT,
    IdClientSupplier INT NOT NULL,
    IdStore INT NOT NULL,
    RegistrationDate DATETIME NOT NULL,
    DueDate DATETIME NOT NULL,
    Note VARCHAR(255),
    Paid BOOLEAN DEFAULT FALSE,
    Active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (IdSale) REFERENCES Sale(IdSale) ON DELETE CASCADE,
    FOREIGN KEY (IdStore) REFERENCES Store(IdStore) ON DELETE CASCADE,
    FOREIGN KEY (IdClientSupplier) REFERENCES ClientSupplier(IdClientSupplier) ON DELETE CASCADE
);

CREATE INDEX idx_sale_id_accounts_payable ON AccountsPayable (IdSale);
CREATE INDEX idx_client_supplier_id_accounts_payable ON AccountsPayable (IdClientSupplier);

/* Record accounts receivable */
CREATE TABLE AccountsReceivable (
    IdAccountReceivable INT PRIMARY KEY AUTO_INCREMENT,
    Amount DOUBLE NOT NULL,
    IdSale INT,
    IdClientSupplier INT NOT NULL,
    IdStore INT NOT NULL,
    RegistrationDate DATETIME NOT NULL,
    DueDate DATETIME NOT NULL,
    Note VARCHAR(255),
    Paid BOOLEAN DEFAULT FALSE,
	Active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (IdSale) REFERENCES Sale(IdSale) ON DELETE CASCADE,
    FOREIGN KEY (IdStore) REFERENCES Store(IdStore) ON DELETE CASCADE,
    FOREIGN KEY (IdClientSupplier) REFERENCES ClientSupplier(IdClientSupplier) ON DELETE CASCADE
);

CREATE INDEX idx_sale_id_accounts_receivable ON AccountsReceivable (IdSale);
CREATE INDEX idx_client_supplier_id_accounts_receivable ON AccountsReceivable (IdClientSupplier);

CREATE TABLE Tokens (
    IdToken INT AUTO_INCREMENT PRIMARY KEY,
    IdUser INT NOT NULL,
    Token VARCHAR(255) NOT NULL,
    CreateToken TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ExpiresToken TIMESTAMP,
    FOREIGN KEY (IdUser) REFERENCES User(IdUser)
);

CREATE TABLE CashFlow (
    IdCashFlow INT AUTO_INCREMENT PRIMARY KEY,
    Origin VARCHAR(20) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Amount DOUBLE NOT NULL,
    Accumulated DOUBLE NOT NULL,
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* Insert initial data */
INSERT INTO Profile (UserProfile) VALUES ('ADMINISTRADOR'), ('COLABORADOR'), ('USUARIO');

INSERT INTO User (UserName, UserEmail, Password, IdProfile) VALUES 
('admin', 'admin@admin.com', '$2a$10$QY3ZjyOzp13cu6V.46ZoNeTQbADgPltHSPwGDJnfRSz/70k3tOWQe', 1);

INSERT INTO ProductGroup (GroupName) VALUES 
('Roupas'), 
('Calçados'), 
('Acessórios');

INSERT INTO SubGroup (SubGroupName, IdGroup) VALUES 
('Camisetas', 1), 
('Calças', 1), 
('Tênis', 2), 
('Chinelos', 2), 
('Relógios', 3), 
('Pulseiras', 3);

INSERT INTO Store (StoreName, ZipCode, Address, Number, Complement, Neighborhood, City, State, Phone, Email) VALUES 
('Matriz-Cataguases', '12345-678', 'Rua A', '123', NULL, 'Bairro A', 'Cidade A', 'Estado A', '123456789', 'lojaa@example.com');

INSERT INTO ClientSupplier (ClientSupplierName, Cpf, Cnpj, ZipCode, Address, Number, Complement, Neighborhood, City, State, Phone, Email, IsClient, IsSupplier, TypeKey, PixKey) VALUES 
('João da Silva', '12345678910', NULL, '12345678', 'Rua A', '123', NULL, 'Bairro A', 'Cidade A', 'AA', '123456789', 'joao@silva.com', TRUE, FALSE, 'Email', 'lucianoduarterosa@hotmail.com'),
('Maria Oliveira', NULL, '12345678000190', '87654321', 'Avenida B', '456', 'Apto 2', 'Bairro B', 'Cidade B', 'BB', '987654321', 'maria@oliveira.com', FALSE, TRUE, 'CPF/CNPJ', '10461955652'),
('Carlos Pereira', '22345678900', NULL, '23456789', 'Rua C', '321', NULL, 'Bairro C', 'Cidade C', 'CC', '234567890', 'carlos@pereira.com', TRUE, FALSE, 'Telefone', '32988996771'),
('Ana Souza', NULL, '22345678000190', '98765432', 'Avenida D', '654', 'Casa 3', 'Bairro D', 'Cidade D', 'DD', '876543210', 'ana@souza.com', FALSE, TRUE, 'CPF/CNPJ', '10461955652');

-- Inserir mais 20 produtos, sem adicionar produtos no consumidor final (IdClientSupplier = 1)
INSERT INTO Product (ProductName, CostPrice, SalePrice, IdClientSupplier, IdSubGroup, IdStore, IdUser, RegistrationDate) VALUES 
('Camiseta Verde', 24.0, 60.0, 3, 1, 1, 1, NOW()),
('Calça Jeans', 40.0, 100.0, 2, 2, 1, 1, NOW()),
('Jaqueta de Couro', 120.0, 300.0, 3, 3, 1, 1, NOW()),
('Vestido Floral', 48.0, 120.0, 4, 1, 1, 1, NOW()),
('Chapéu de Palha', 8.0, 20.0, 3, 2, 1, 1, NOW()),
('Blusa de Moletom', 32.0, 80.0, 4, 3, 1, 1, NOW()),
('Shorts de Praia', 12.0, 30.0, 2, 1, 1, 1, NOW()),
('Sapato Social', 60.0, 150.0, 3, 2, 1, 1, NOW()),
('Sandália Feminina', 20.0, 50.0, 4, 3, 1, 1, NOW()),
('Cinto de Couro', 16.0, 40.0, 3, 1, 1, 1, NOW()),
('Óculos de Sol', 40.0, 100.0, 2, 2, 1, 1, NOW()),
('Relógio Esportivo', 80.0, 200.0, 3, 3, 1, 1, NOW()),
('Boné Trucker', 12.0, 30.0, 4, 1, 1, 1, NOW()),
('Sunga de Natação', 8.0, 20.0, 2, 2, 1, 1, NOW()),
('Bolsa de Couro', 100.0, 250.0, 3, 3, 1, 1, NOW()),
('Carteira de Couro', 24.0, 60.0, 4, 1, 1, 1, NOW()),
('Meia Esportiva', 4.0, 10.0, 2, 2, 1, 1, NOW()),
('Gravata Slim', 16.0, 40.0, 3, 3, 1, 1, NOW()),
('Camisa Social', 32.0, 80.0, 4, 1, 1, 1, NOW()),
('Blazer Masculino', 120.0, 300.0, 2, 2, 1, 1, NOW()),
('Camiseta Verde/Amarela', 24.0, 60.0, 3, 1, 1, 1, NOW()),
('Calça Jeans Escura', 40.0, 100.0, 2, 2, 1, 1, NOW()),
('Jaqueta de Couro de Javali', 120.0, 300.0, 3, 3, 1, 1, NOW()),
('Vestido Floral Verão', 48.0, 120.0, 4, 1, 1, 1, NOW()),
('Chapéu de Veludo', 8.0, 20.0, 3, 2, 1, 1, NOW()),
('Blusa de Moletom Rasgada', 32.0, 80.0, 4, 3, 1, 1, NOW()),
('Shorts de Praia Vermlho', 12.0, 30.0, 2, 1, 1, 1, NOW()),
('Sapato Social Marrom', 60.0, 150.0, 3, 2, 1, 1, NOW()),
('Sandália Feminina Azaleia', 20.0, 50.0, 4, 3, 1, 1, NOW()),
('Cinto de Couro de Jacaré', 16.0, 40.0, 3, 1, 1, 1, NOW()),
('Óculos de Sol Raybam', 40.0, 100.0, 2, 2, 1, 1, NOW()),
('Relógio Esportivo Messi', 80.0, 200.0, 3, 3, 1, 1, NOW()),
('Boné Nike', 12.0, 30.0, 4, 1, 1, 1, NOW()),
('Sunga de Natação Infantil', 8.0, 20.0, 2, 2, 1, 1, NOW()),
('Bolsa de Couro Laranja', 100.0, 250.0, 3, 3, 1, 1, NOW()),
('Carteira Preta Básica', 24.0, 60.0, 4, 1, 1, 1, NOW()),
('Meia Curta Esportiva', 4.0, 10.0, 2, 2, 1, 1, NOW()),
('Gravata Slim Verde', 16.0, 40.0, 3, 3, 1, 1, NOW()),
('Camisa Social Rosa', 32.0, 80.0, 4, 1, 1, 1, NOW()),
('Blazer Feminino', 120.0, 300.0, 2, 2, 1, 1, NOW());

-- Mês de Janeiro
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(100.00, 120.00, 1, 1, 1, '2023-01-15 10:00:00', 'Dinheiro', 'Finalizada'),
(80.00, 95.00, 2, 1, 1, '2023-01-20 15:00:00', 'Cartão Crédito', 'Finalizada');

-- Mês de Fevereiro
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(90.00, 110.00, 3, 1, 1, '2023-02-05 09:00:00', 'Cheque', 'Finalizada'),
(70.00, 85.00, 4, 1, 1, '2023-02-18 14:00:00', 'Cartão Débito', 'Finalizada');

-- Mês de Março
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(120.00, 150.00, 2, 1, 1, '2023-03-10 11:00:00', 'Crediário', 'Finalizada'),
(110.00, 140.00, 1, 1, 1, '2023-03-22 16:00:00', 'Dinheiro', 'Finalizada');

-- Mês de Abril
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(130.00, 160.00, 2, 1, 1, '2023-04-08 10:00:00', 'Cartão Crédito', 'Finalizada'),
(85.00, 105.00, 3, 1, 1, '2023-04-25 15:00:00', 'Cheque', 'Finalizada');

-- Mês de Maio
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(95.00, 125.00, 4, 1, 1, '2023-05-12 09:00:00', 'Cartão Débito', 'Finalizada'),
(105.00, 135.00, 2, 1, 1, '2023-05-28 14:00:00', 'Dinheiro', 'Finalizada');

-- Mês de Junho
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(110.00, 140.00, 1, 1, 1, '2023-06-05 12:00:00', 'Crediário', 'Finalizada'),
(80.00, 100.00, 2, 1, 1, '2023-06-20 13:00:00', 'Cartão Crédito', 'Finalizada');

-- Mês de Julho
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(90.00, 115.00, 3, 1, 1, '2023-07-10 11:00:00', 'Cheque', 'Finalizada'),
(70.00, 90.00, 4, 1, 1, '2023-07-22 16:00:00', 'Cartão Débito', 'Finalizada');

-- Mês de Agosto
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(100.00, 1030.00, 2, 1, 1, '2023-08-06 10:00:00', 'Dinheiro', 'Finalizada'),
(85.00, 6100.00, 1, 1, 1, '2023-08-18 15:00:00', 'Cartão Crédito', 'Finalizada');

-- Mês de Setembro
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(95.00, 5025.00, 2, 1, 1, '2023-09-12 09:00:00', 'Cheque', 'Finalizada'),
(110.00, 1040.00, 3, 1, 1, '2023-09-25 14:00:00', 'Cartão Débito', 'Finalizada');

-- Mês de Outubro
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(120.00, 6050.00, 4, 1, 1, '2023-10-08 10:00:00', 'Crediário', 'Finalizada'),
(100.00, 1030.00, 1, 1, 1, '2023-10-20 15:00:00', 'Dinheiro', 'Finalizada');

-- Mês de Novembro
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(110.00, 9400.00, 1, 1, 1, '2023-11-10 12:00:00', 'Cartão Crédito', 'Finalizada'),
(95.00, 1200.00, 2, 1, 1, '2023-11-22 13:00:00', 'Cheque', 'Finalizada');

-- Mês de Dezembro
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(130.00, 1600.00, 3, 1, 1, '2023-12-05 11:00:00', 'Cartão Débito', 'Finalizada'),
(80.00, 6050.00, 4, 1, 1, '2023-12-18 14:00:00', 'Dinheiro', 'Finalizada');

-- Mês de Janeiro 2024
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(120.00, 4500.00, 1, 1, 1, '2024-01-10 10:00:00', 'Dinheiro', 'Finalizada'),
(110.00, 1400.00, 2, 1, 1, '2024-01-20 14:00:00', 'Cartão Crédito', 'Finalizada');

-- Mês de Fevereiro 2024
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(100.00, 6300.00, 3, 1, 1, '2024-02-08 09:00:00', 'Cheque', 'Finalizada'),
(90.00, 1105.00, 4, 1, 1, '2024-02-22 16:00:00', 'Cartão Débito', 'Finalizada');

-- Mês de Março 2024
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(130.00, 5600.00, 3, 1, 1, '2024-03-05 12:00:00', 'Crediário', 'Finalizada'),
(120.00, 1500.00, 1, 1, 1, '2024-03-18 11:00:00', 'Dinheiro', 'Finalizada');

-- Mês de Abril 2024
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(110.00, 1400.00, 2, 1, 1, '2024-04-10 10:00:00', 'Cartão Crédito', 'Finalizada'),
(95.00, 4250.00, 3, 1, 1, '2024-04-22 15:00:00', 'Cheque', 'Finalizada');

-- Mês de Maio 2024
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(105.00, 6305.00, 4, 1, 1, '2024-05-08 10:00:00', 'Cartão Débito', 'Finalizada'),
(85.00, 1100.00, 2, 1, 1, '2024-05-20 14:00:00', 'Dinheiro', 'Finalizada');

-- Mês de Junho 2024
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(115.00, 7450.50, 1, 1, 1, '2024-06-10 11:00:00', 'Crediário', 'Finalizada'),
(90.00, 1200.60, 2, 1, 1, '2024-06-22 13:00:00', 'Cartão Crédito', 'Finalizada');

-- Mês de Julho 2024
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(130.00, 6600.30, 3, 1, 1, '2024-07-05 12:00:00', 'Cheque', 'Finalizada'),
(100.00, 1300.50, 4, 1, 1, '2024-07-18 15:00:00', 'Cartão Débito', 'Finalizada');

-- Mês de Agosto 2024
INSERT INTO Sale (CostPrice, SalePrice, IdClientSupplier, IdUser, IdStore, SaleDate, PaymentCondition, SaleStatus) VALUES
(130.00, 3600.30, 3, 1, 1, '2024-08-05 12:00:00', 'Cheque', 'Finalizada'),
(100.00, 2300.50, 4, 1, 1, '2024-08-18 15:00:00', 'Cartão Débito', 'Finalizada');

INSERT INTO CashFlow (Origin, Description, Amount, Accumulated) VALUES
('Saldo Inicial','Inicializando o caixa', 0.00, 0.00);

