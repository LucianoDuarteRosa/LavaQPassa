# 🎉 LavaQPassa Brechó 🎉


## 📚 Descrição

`LavaQPassa` é um projeto que tem como objetivo __tornar simples o processor de gestão__ de um Brechó. Esse projeto oferece soluções para __simples e iterativa__ de controles e de acesso a informações com apenas um clique.

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

- [Node.js](https://nodejs.org/)
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Axios](https://axios-http.com/)
- [MySQL](https://www.mysql.com/)
- [Swagger](https://swagger.io/)

## 🚀 Funcionalidades

- 📅 Gestão de estoque
- 🔍 Filtros avançados por categoria, cliente, nome de produto
- 🎨 Interface moderna utilizando Material-UI
- 📊 Integração com APIs para exibição de dados dinâmicos

## 🖥️ Como Executar o Projeto

Siga os passos abaixo para rodar o projeto localmente:

### 1. Clone o repositório:

```bash
git clone https://github.com/LucianoDuarteRosa/LavaQPassa.git
```

### 2. Criar a base de dados:
Entre no Mysql Workbeanch e execute o script que está na pasta do projeto "Modeling/bd.sql" ou no [link](https://github.com/LucianoDuarteRosa/LavaQPassa/blob/main/Modeling/bd.sql/).

Depois entre na pasta "BackEnd/db/dbConnection.js" e atualize os dados de acordo com seus dados

```bash
const sqlConnection = mysql.createConnection({
  host: "localhost",       
  port: 3306,              
  user: "root",  <--- seu usuário         
  password: "123", <--- sua senha      
  database: "lavaqpassabrecho",   <--- se mudou o nome da database, altere aqui...  
});
```

### 3. Configuração porta e chave-secreta:

Na pasta "BackEnd/" existe um arquivo chamado ".env.exemple". Dentro dele tem dois campos para ser alterados: 

```bash
PORT=3000  <--- porta que deseja usar
JWT_SECRET=your_key_ssl <--- coloque um chave única para geração e validação do token
```

### 4. Instalar dependências:

Abra um terminar integrado na pasta "BackEnd" e execute o comando: 

```bash
npm install
```

### 5. Executar a aplicação:

Abra um terminal integrado na pasta "FrontEnd" e execute o comando: 

```bash
npm start
```

Use o usuário padrão para navegar na aplicação:

```bash
Email: admin@admin.com
Senha: 123
```

****
🧑‍💻 Desenvolvedor - Luciano Duarte
Curso Desenvolvedor FullStack - Rio Pomba Valley     
****