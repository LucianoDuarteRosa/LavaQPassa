const cashFlowModel = require("../models/cashFlowModel");
const validator = require("../../utils/inputsValidator");
const converter = require('../../utils/converter');


class CashFlowController {

  readList(req, res) {
    /*
      #swagger.tags = ['Fluxo de Caixa']
      #swagger.summary = 'Retorna informções referente ao mês'
      #swagger.description = 'Retorna uma lista de movimentações do mês'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Lista todos os lançamentos',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  Month: { type: 'integer' },
                  Year: { type: 'integer' }
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
                message: { type: 'string', example: 'Nenhum lançamento encontrado!' }
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
    const retorno = cashFlowModel.readList(date.firstDay, date.lastDay);
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum lançamento encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  readListSearch(req, res) {
    /*
      #swagger.tags = ['Fluxo de Caixa']
      #swagger.summary = 'Retorna informções referente ao mês'
      #swagger.description = 'Retorna uma lista de movimentações do mês'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Lista todos os lançamentos',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  Month: { type: 'integer' },
                  Year: { type: 'integer' }
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
                message: { type: 'string', example: 'Nenhum lançamento encontrado!' }
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

    const { month, year } = req.body;
    let errors = [];

    const testMonth = validator.integerValidator(parseInt(month));
    const testYear = validator.integerValidator(parseInt(year));

    if (testMonth !== true) {
      errors.push(testMonth);
    }
    if (testYear !== true) {
      errors.push(testYear);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    if (!month || !year) {
      return res.status(400).send('Digite mês e ano válido.');
    }

    const date = converter.getMonthStartAndEndDatesCashFlow(month, year);
    const retorno = cashFlowModel.readList(date.firstDay, date.lastDay);
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum lançamento encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }
}

module.exports = new CashFlowController();
