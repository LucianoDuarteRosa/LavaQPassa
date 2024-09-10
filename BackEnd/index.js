require('dotenv').config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Configuração e conexão ao banco de dados
const database = require("./db/index.js");
database();

// Middleware CORS para permitir requisições de qualquer origem
app.use(cors());
//app.use(cors({ origin: 'http://localhost:5173' })); --> para uma unica origem

app.use(bodyParser.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Importa e utiliza o roteador
const router = require("./src/routers/index.js");
router(app, express);

// Inicia o servidor na porta especificada
app.listen(port, function (error) {
  if (error) {
    console.log("Ocorreu um erro ao rodar o servidor!");
  } else {
    console.log("Servidor rodando com sucesso na porta", port);
  }
});

