const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
    info: {
        version: "1.0.0",
        title: "API - LavaQPassa Brechó",
        description: "Documentação da API - Uso exclusivo pelo site LavaQPassa.com."
    },
    servers: [
        {
            url: 'http://localhost:3000'
        }
    ],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routers/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index');
});