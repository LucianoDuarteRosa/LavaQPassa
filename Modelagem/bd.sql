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
	TypeKey ENUM('CPF/CNPJ', 'Email', 'Telefone', 'Chave Aleatória', 'Chave Pix'),
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

/* For product images */
CREATE TABLE Image (
    IdImage INT PRIMARY KEY AUTO_INCREMENT,
    Path TEXT NOT NULL,
    IdProduct INT,
    FOREIGN KEY (IdProduct) REFERENCES Product(IdProduct) ON DELETE CASCADE
);

CREATE INDEX idx_product_id_image ON Image (IdProduct);

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
    IdSale INT DEFAULT 1,
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

/* Insert initial data */
INSERT INTO Profile (UserProfile) VALUES ('ADMINISTRADOR'), ('COLABORADOR'), ('USUARIO');

INSERT INTO User (UserName, UserEmail, Password, IdProfile) VALUES 
('admin', 'admin@admin.com', '$2a$10$QY3ZjyOzp13cu6V.46ZoNeTQbADgPltHSPwGDJnfRSz/70k3tOWQe', 1),
('usuario', 'usuario@usuario.com', '$2a$10$QY3ZjyOzp13cu6V.46ZoNeTQbADgPltHSPwGDJnfRSz/70k3tOWQe', 2);

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
('Loja A', '12345-678', 'Rua A', '123', NULL, 'Bairro A', 'Cidade A', 'Estado A', '123456789', 'lojaa@example.com'),
('Loja B', '87654-321', 'Avenida B', '456', 'Apto 2', 'Bairro B', 'Cidade B', 'Estado B', '987654321', 'lojab@example.com');

INSERT INTO ClientSupplier (ClientSupplierName, Cpf, Cnpj, ZipCode, Address, Number, Complement, Neighborhood, City, State, Phone, Email, IsClient, IsSupplier) VALUES 
('Consumidor Final', '12345678900', NULL, '12345678', 'A', '1', NULL, 'A', 'A', 'A', '123456789', 'consumidor@consumidor.com', TRUE, TRUE),
('João da Silva', '12345678910', NULL, '12345678', 'Rua A', '123', NULL, 'Bairro A', 'Cidade A', 'AA', '123456789', 'joao@silva.com', TRUE, FALSE),
('Maria Oliveira', NULL, '12345678000190', '87654321', 'Avenida B', '456', 'Apto 2', 'Bairro B', 'Cidade B', 'BB', '987654321', 'maria@oliveira.com', FALSE, TRUE);

INSERT INTO Product (ProductName, CostPrice, SalePrice, IdClientSupplier, IdSubGroup, IdStore, IdUser, RegistrationDate) VALUES 
('Camiseta Azul', 20.0, 50.0, 1, 1, 1, 1, NOW()),
('Tênis Esportivo', 100.0, 200.0, 2, 3, 2, 2, NOW());

INSERT INTO Image (Path, IdProduct) VALUES
('path/to/image1.jpg', 1),
('path/to/image2.jpg', 1),
('path/to/image3.jpg', 2),
('path/to/image4.jpg', 2);


INSERT INTO Sale (CostPrice, SalePrice,IdStore, IdClientSupplier, IdUser, SaleDate, PaymentCondition, SaleStatus) VALUES 
(20.0, 50.0, 1, 1, 1, NOW(), 'Dinheiro', 'Finalizada'),
(100.0, 200.0, 2, 2, 2, NOW(), 'Cartão Crédito', 'Finalizada');

INSERT INTO SaleDetail (IdSale, IdProduct) VALUES 
(1, 1), 
(2, 2);

INSERT INTO AccountsPayable (Amount, IdSale, IdClientSupplier, IdStore, RegistrationDate, DueDate, Note, Paid) VALUES 
(20.0, 1, 1,1, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'Compra de Camiseta Azul', FALSE);

INSERT INTO AccountsReceivable (Amount, IdSale, IdClientSupplier, IdStore, RegistrationDate, DueDate, Note, Paid) VALUES 
(200.0, 2, 2,1, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'Venda de Tênis Esportivo', FALSE);
