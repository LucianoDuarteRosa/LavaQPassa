const accountsReceivableModel = require("../models/accountsReceivableModel");
const validator = require('../../utils/inputsValidator');
const converter = require("../../utils/converter");


class AccountsReceivableController {

  readList(req, res) {
     /*
      #swagger.tags = ['Contas a Receber']
      #swagger.summary = 'Busca por Contas a Receber'
      #swagger.description = 'Retorna uma lista de contas a receber cadastrados'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Consulta lista as contas a receber ',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdAccountReceivable: { type: 'integer' },
                  Amount: { type: 'double'},
                  IdClientSupplier: { type: 'integer'},
                  ClientSupplierName: { type: 'string'},
                  RegistrationDate: { type: 'date-time'},
                  DueDate: { type: 'date'},
                  Note: { type: 'string'},
                  IdStore: { type: 'integer' },
                  IdSale: { type: 'integer' },
                  Active: { type: 'boolean'},
                  Paid: { type: 'boolean'}
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
                message: { type: 'string', example: 'Nenhuma cantas a receber encontrada!' }
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
    
    const retorno = accountsReceivableModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhuma contas a receber encontrada!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  read(req, res) {
     /*
    #swagger.tags = ['Contas a Receber']
    #swagger.summary = 'Busca por Contas a Receber [id]'
    #swagger.description = 'Retorna o contas a receber com do id enviado como parametro'
 
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Token JWT do usuário logado',
      required: true,
      type: 'string'
    }
 
    #swagger.responses[200] = {
      description: 'Retorna o contas a receber com o ID enviado como parâmetro',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              IdAccountReceivable: { type: 'integer' },
              Amount: { type: 'double'},
              IdClientSupplier: { type: 'integer'},
              ClientSupplierName: { type: 'string'},
              RegistrationDate: { type: 'date-time'},
              DueDate: { type: 'date'},
              Note: { type: 'string'},
              IdStore: { type: 'integer' },
              IdSale: { type: 'integer' },
              Active: { type: 'boolean'},
              Paid: { type: 'boolean'}
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
              message: { type: 'string', example: 'Nenhuma contas a receber encontrada!' }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Erro de validação dos campos de entrada',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string'}
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

    const { id } = req.params;
    const errors = [];

    const testId = validator.integerValidator(id);

    if (testId !== true) {
      errors.push(testId);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const retorno = accountsReceivableModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Conta a receber não encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  search(req, res) {
       /*
          #swagger.tags = ['Contas a Receber']
          #swagger.summary = 'Pesquisa Contas a Receber [parametro]'
          #swagger.description = 'Retorna os contas a receber localizados com o parametro enviado'
        
          #swagger.parameters['Authorization'] = {
            in: 'header',
            description: 'Token JWT do usuário logado',
            required: true,
            type: 'string'
          }
        
          #swagger.responses[200] = {
            description: 'Retorna os contas a receber localizadas com o parametro enviado',
            content: {
              "application/json": {
                schema: {
                  type: 'object',
                  additionalProperties: {
                    type: 'object',
                    properties: {
                      IdAccountReceivable: { type: 'integer' },
                      Amount: { type: 'double'},
                      IdClientSupplier: { type: 'integer'},
                      ClientSupplierName: { type: 'string'},
                      RegistrationDate: { type: 'date-time'},
                      DueDate: { type: 'date'},
                      Note: { type: 'string'},
                      IdStore: { type: 'integer' },
                      IdSale: { type: 'integer' },
                      Active: { type: 'boolean'},
                      Paid: { type: 'boolean'}
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
                    message: { type: 'string', example: 'Nenhuma contas a receber encontrada!' }
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

    const { id } = req.params;

    const retorno = accountsReceivableModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhuma contas a receber encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  create(req, res) {
     /*
       #swagger.tags = ['Contas a Receber']
       #swagger.summary = 'Criar Contas a Receber'
       #swagger.description = 'Cria o contas a receber no banco de dados com o objeto que veio no body'
    
       #swagger.parameters['Authorization'] = {
         in: 'header',
         description: 'Token JWT do usuário logado',
         required: true,
         type: 'string'
       }

      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                userId: { type: 'integer'},
                amount: { type: 'double'},
                idstore : { type: 'integer'},
                idsale : { type: 'integer'},
                idclient : { type: 'integer'},
                duedate : { type: 'date'},
                note: { type: 'string'}
              }
            }
          }
        }
      }
        
      #swagger.responses[201] = {
        description: 'Cadastro efetuado com sucesso',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Conta a receber criada com sucesso!' }
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
                error: { type: 'string', example: 'Erro ao acessar o banco de dados.' }
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
        #swagger.responses[400] = {
        description: 'Erro ao validar campos de entrada',
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

    const reqBody = req.body;
    const errors = [];

    const testAmount = validator.floatValidator(reqBody.amount);
    const testIdStore = validator.integerValidator(reqBody.idstore)
    let testIdSale = true;
    const idSaleValue = String(reqBody.idsale).trim();
    if (idSaleValue !== "") {
      testIdSale = validator.integerValidator(idSaleValue);
    } else {
      reqBody.idsale = null;
    }
    const testIdClientSupplier = validator.integerValidator(reqBody.idclient);
    const testDueDate = validator.dateValidator(reqBody.duedate);
    let registrationdate = converter.toMySQLDate();

    if (testAmount !== true) {
      errors.push(testAmount);
    }
    if (testIdStore !== true) {
      errors.push(testIdStore);
    }
    if (testIdSale !== true) {
      errors.push(testIdSale);
    }
    if (testIdClientSupplier !== true) {
      errors.push(testIdClientSupplier);
    }
    if (testDueDate !== true) {
      errors.push(testDueDate);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const receivable = { Amount: reqBody.amount, IdSale: reqBody.idsale, IdClientSupplier: reqBody.idclient, IdStore: reqBody.idstore, RegistrationDate: registrationdate, DueDate: reqBody.duedate, Note: reqBody.note }
  
    const retorno = accountsReceivableModel.create(receivable);
    return retorno
      .then((result) =>
        res.status(201).send("Conta a receber criado com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));
  }

  update(req, res) {
     /*
       #swagger.tags = ['Contas a Receber']
       #swagger.summary = 'Atualizar Contas a Receber'
       #swagger.description = 'Atualiza o contas a receber [id] no banco de dados com o objeto que veio no body'
    
       #swagger.parameters['Authorization'] = {
         in: 'header',
         description: 'Token JWT do usuário logado',
         required: true,
         type: 'string'
       }

      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
	              userId: { type: 'integer'},
                amount: { type: 'double'},
                idstore : { type: 'integer'},
                idsale : { type: 'integer'},
                idclient : { type: 'integer'},
                duedate : { type: 'date'},
                note: { type: 'string'}
              }
            }
          }
        }
      }
        
      #swagger.responses[200] = {
        description: 'Atualizar efetuado com sucesso',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Contas a receber atualizado com sucesso!' }
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
                error: { type: 'string', example: 'Erro ao acessar o banco de dados.' }
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
    
      #swagger.responses[400] = {
        description: 'Erro ao validar campos de entrada',
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

    const { id } = req.params;
    const reqBody = req.body;
    const errors = [];

    const testAmount = validator.floatValidator(reqBody.amount);
    const testIdStore = validator.integerValidator(reqBody.idstore)
    let testIdSale = true;
    const idSaleValue = String(reqBody.idsale).trim();
    if (idSaleValue !== "") {
      testIdSale = validator.integerValidator(idSaleValue);
    } else {
      reqBody.idsale = null;
    }
    const testIdClientSupplier = validator.integerValidator(reqBody.idclient);
    const testRegistrationDate = validator.dateValidator(reqBody.registrationdate);
    const testDueDate = validator.dateValidator(reqBody.duedate);
    let registrationdate = converter.toMySQLDate(reqBody.duedate);

    if (testAmount !== true) {
      errors.push(testAmount);
    }
    if (testIdStore !== true) {
      errors.push(testIdStore);
    }
    if (testIdSale !== true) {
      errors.push(testIdSale);
    }
    if (testIdClientSupplier !== true) {
      errors.push(testIdClientSupplier);
    }
    if (testRegistrationDate !== true) {
      errors.push(testRegistrationDate);
    }
    if (testDueDate !== true) {
      errors.push(testDueDate);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const receivable = { Amount: reqBody.amount, IdSale: reqBody.idsale, IdClientSupplier: reqBody.idclient, IdStore: reqBody.idstore, RegistrationDate: registrationdate, DueDate: reqBody.duedate, Note: reqBody.note, Active: reqBody.active, Paid: reqBody.paid}

    const retorno = accountsReceivableModel.update(receivable, id);
    return retorno
      .then((result) =>
        res.status(200).send("Conta a pagar atualizada com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));

  }
}

module.exports = new AccountsReceivableController();
