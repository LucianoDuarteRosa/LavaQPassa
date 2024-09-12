const accountsPayableModel = require("../models/accountsPayableModel");
const saleModel = require("../models/saleModel");
const saleDetailModel = require("../models/saleDetailModel")
const converter = require("../../utils/converter");

class DashboardController {

    async accountsPayable(req, res) {
        /*
        #swagger.tags = ['Dashboards']
        #swagger.summary = 'Dashboards Contas a Pagar'
        #swagger.description = 'Retorna uma lista de contas a pagar cadastrados no mês atual'
    
        #swagger.parameters['Authorization'] = {
            in: 'header',
            description: 'Token JWT do usuário logado',
            required: true,
            type: 'string'
        }
    
        #swagger.responses[200] = {
            description: 'Consulta lista as contas a pagar ',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                additionalProperties: {
                    type: 'object',
                    properties: {
                    account: { type: 'double'},
                    paids: { type: 'double'},
                    billsDue: { type: 'double'}
                    }
                }
                }
            }
            }
        }
    
        #swagger.responses[404] = {
            description: 'Sem dados a retornar',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Nenhuma contas a pagar encontrada para este mês!' }
                }
                }
            }
            }
        }

            #swagger.responses[401] = {
            description: 'Token inválido, expirado ou sem o token',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Token inválido' }
                }
                }
            }
            }
        }
    
        #swagger.responses[500] = {
            description: 'Erro interno do servidor',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
                }
            }
            }
        }
     */
    
        const date = converter.getMonthStartAndEndDates();
        try {
            const result = await accountsPayableModel.dashPayable(date);

            let dateReturn = { account: 0, paids: 0, billsDue: 0 }
            result.map(account => {
                dateReturn.account += parseFloat(account.Amount);
                if (account.Paid) {
                    dateReturn.paids += parseFloat(account.Amount);
                }
            });

            dateReturn.billsDue = dateReturn.account - dateReturn.paids

            res.status(200).json(dateReturn)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    saleYear(req, res) {
         /*
        #swagger.tags = ['Dashboards']
        #swagger.summary = 'Dashboards vendas totais dos últimos 12 meses'
        #swagger.description = 'Retorna uma lista com as vendas totais dos últimos 12 meses'
    
        #swagger.parameters['Authorization'] = {
            in: 'header',
            description: 'Token JWT do usuário logado',
            required: true,
            type: 'string'
        }
    
        #swagger.responses[200] = {
            description: 'Consulta lista venda dos últimos 12 meses ',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                additionalProperties: {
                    type: 'object',
                    properties: {
                    saleMonth: { type: 'date', example:'2023-09'},
                    totalSales: { type: 'double'}
                    }
                }
                }
            }
            }
        }
    
        #swagger.responses[404] = {
            description: 'Sem dados a retornar',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Nenhuma venda encontrada!' }
                }
                }
            }
            }
        }

            #swagger.responses[401] = {
            description: 'Token inválido, expirado ou sem o token',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Token inválido' }
                }
                }
            }
            }
        }
    
        #swagger.responses[500] = {
            description: 'Erro interno do servidor',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
                }
            }
            }
        }
     */
        
        const result = saleModel.saleYear();
        return result
            .then((result) => result.length == 0
                ? res.status(404).send("Sem dados a exibir.")
                : res.status(200).json(result)
            )
            .catch((error) => res.status(500).json(error.message));
    }

    async saleGroup(req, res) {
          /*
        #swagger.tags = ['Dashboards']
        #swagger.summary = 'Dashboards venda total mensal por grupos'
        #swagger.description = 'Retorna uma lista venda total mensal por grupos'
    
        #swagger.parameters['Authorization'] = {
            in: 'header',
            description: 'Token JWT do usuário logado',
            required: true,
            type: 'string'
        }
    
        #swagger.responses[200] = {
            description: 'Consulta lista venda total mensal por grupos ',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                additionalProperties: {
                    type: 'object',
                    properties: {
                    id: { type: 'integer'},
                    value: { type: 'double'},
                    label: { type: 'string'}
                    }
                }
                }
            }
            }
        }
    
        #swagger.responses[404] = {
            description: 'Sem dados a retornar',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Nenhuma venda encontrada!' }
                }
                }
            }
            }
        }

            #swagger.responses[401] = {
            description: 'Token inválido, expirado ou sem o token',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Token inválido' }
                }
                }
            }
            }
        }
    
        #swagger.responses[500] = {
            description: 'Erro interno do servidor',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
                }
            }
            }
        }
     */
        
        const date = converter.getMonthStartAndEndDates();

        try {
            const result = await saleDetailModel.saleGroup(date);

            let dateReturn = [];
            let currentId = 0;

            result.forEach(product => {
                let existingGroup = dateReturn.find(item => item.label === product.GroupName);

                if (existingGroup) {
                    existingGroup.value += product.SalePrice;
                } else {
                    dateReturn.push({ id: currentId++, value: product.SalePrice , label: product.GroupName});
                }
            });

            res.status(200).json(dateReturn);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async saleSubGroup(req, res) {
          /*
        #swagger.tags = ['Dashboards']
        #swagger.summary = 'Dashboards venda total mensal por subgrupos'
        #swagger.description = 'Retorna uma lista venda total mensal por subgrupos'
    
        #swagger.parameters['Authorization'] = {
            in: 'header',
            description: 'Token JWT do usuário logado',
            required: true,
            type: 'string'
        }
    
        #swagger.responses[200] = {
            description: 'Consulta lista venda total mensal por subgrupos ',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                additionalProperties: {
                    type: 'object',
                    properties: {
                    value: { type: 'double'},
                    label: { type: 'string'}
                    }
                }
                }
            }
            }
        }
    
        #swagger.responses[404] = {
            description: 'Sem dados a retornar',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Nenhuma venda encontrada!' }
                }
                }
            }
            }
        }

            #swagger.responses[401] = {
            description: 'Token inválido, expirado ou sem o token',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Token inválido' }
                }
                }
            }
            }
        }
    
        #swagger.responses[500] = {
            description: 'Erro interno do servidor',
            content: {
            "application/json": {
                schema: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
                }
            }
            }
        }
     */
        
        const date = converter.getMonthStartAndEndDates();

        try {
            const result = await saleDetailModel.saleSubGroup(date);
            let dateReturn = [];

            result.forEach(product => {
                let existingGroup = dateReturn.find(item => item.label === product.SubGroupName);

                if (existingGroup) {
                    existingGroup.value += product.SalePrice;
                } else {
                    dateReturn.push({value: product.SalePrice , label: product.SubGroupName});
                }
            });

            res.status(200).json(dateReturn);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new DashboardController();
