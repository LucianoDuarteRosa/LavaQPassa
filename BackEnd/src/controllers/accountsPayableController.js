const accountsPayableModel = require("../models/accountsPayableModel");
const cashFlowModel = require("../models/cashFlowModel");
const validator = require('../../utils/inputsValidator');
const converter = require("../../utils/converter");

class AccountsPayableController {

  readList(req, res) {
    /*
      #swagger.tags = ['Contas a Pagar']
      #swagger.summary = 'Busca por Contas a Pagar'
      #swagger.description = 'Retorna uma lista de contas a pagar cadastrados'
   
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
                  IdAccountPayable: { type: 'integer' },
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
                message: { type: 'string', example: 'Nenhuma contas a pagar encontrada!' }
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
    
    const retorno = accountsPayableModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhuma contas a pagar encontrada!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  read(req, res) {
    /*
    #swagger.tags = ['Contas a Pagar']
    #swagger.summary = 'Busca por Contas a Pagar [id]'
    #swagger.description = 'Retorna o contas a pagar com do id enviado como parametro'
 
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Token JWT do usuário logado',
      required: true,
      type: 'string'
    }
 
    #swagger.responses[200] = {
      description: 'Retorna o contas a pagar com o ID enviado como parâmetro',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              IdAccountPayable: { type: 'integer' },
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
              message: { type: 'string', example: 'Nenhuma contas a pagar encontrada!' }
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

    const retorno = accountsPayableModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Conta a pagar não encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  search(req, res) {
        /*
          #swagger.tags = ['Contas a Pagar']
          #swagger.summary = 'Pesquisa Contas a Pagar [parametro]'
          #swagger.description = 'Retorna os contas a pagar localizados com o parametro enviado'
        
          #swagger.parameters['Authorization'] = {
            in: 'header',
            description: 'Token JWT do usuário logado',
            required: true,
            type: 'string'
          }
        
          #swagger.responses[200] = {
            description: 'Retorna os contas a pagar localizadas com o parametro enviado',
            content: {
              "application/json": {
                schema: {
                  type: 'object',
                  additionalProperties: {
                    type: 'object',
                    properties: {
                      IdAccountPayable: { type: 'integer' },
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
                    message: { type: 'string', example: 'Nenhuma contas a pagar encontrada!' }
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

    const retorno = accountsPayableModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhuma contas a pagar encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  create(req, res) {
     /*
       #swagger.tags = ['Contas a Pagar']
       #swagger.summary = 'Criar Contas a Pagar'
       #swagger.description = 'Cria o contas a pagar no banco de dados com o objeto que veio no body'
    
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
                message: { type: 'string', example: 'Conta a pagar criada com sucesso!' }
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

    const payable = { Amount: reqBody.amount, IdSale: reqBody.idsale, IdClientSupplier: reqBody.idclient, IdStore: reqBody.idstore, RegistrationDate: registrationdate, DueDate: reqBody.duedate, Note: reqBody.note }

    const retorno = accountsPayableModel.create(payable);
    return retorno
      .then((result) =>
        res.status(201).send("Conta a pagar criado com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));
  }

  async update(req, res) {
     /*
       #swagger.tags = ['Contas a Pagar']
       #swagger.summary = 'Atualizar Contas a Pagar'
       #swagger.description = 'Atualiza o contas a pagar [id] no banco de dados com o objeto que veio no body'
    
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
                message: { type: 'string', example: 'Contas a pagar atualizado com sucesso!' }
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
    /*let testIdSale = true;
    const idSaleValue = String(reqBody.idsale).trim();
    console.log(idSaleValue);
    if (idSaleValue !== "" || idSaleValue !== null) {
      testIdSale = validator.integerValidator(idSaleValue);
    } else {
      reqBody.idsale = null;
    }*/
    const testIdClientSupplier = validator.integerValidator(reqBody.idclient);
    const testRegistrationDate = validator.dateValidator(reqBody.registrationdate);
    const testDueDate = validator.dateValidator(reqBody.duedate);
    let registrationdate = converter.toMySQLDate(reqBody.registrationdate);

    if (testAmount !== true) {
      errors.push(testAmount);
    }
    if (testIdStore !== true) {
      errors.push(testIdStore);
    }
    /*if (testIdSale !== true) {
      errors.push(testIdSale);
    }*/
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

    const paid = await accountsPayableModel.readPaid(id);

    const payable = { Amount: reqBody.amount, IdSale: reqBody.idsale, IdClientSupplier: reqBody.idclient, IdStore: reqBody.idstore, RegistrationDate: registrationdate, DueDate: reqBody.duedate, Note: reqBody.note, Active: reqBody.active, Paid: reqBody.paid }
    const retorno = accountsPayableModel.update(payable, id);


    if(paid[0].Paid != reqBody.paid){
      if(reqBody.paid === true){
        let accumulated = await cashFlowModel.readBalance();
        let sun = accumulated[0].Accumulated - reqBody.amount;
        const cashFlow = {Origin: 'Contas a Pagar', Description: `Id: ${id}. Selecionado como pago.`, Amount : reqBody.amount, Accumulated: sun}
        const result = await cashFlowModel.create(cashFlow);
      }
  
      if(reqBody.paid === false){
        let accumulated = await cashFlowModel.readBalance();
        let sun = accumulated[0].Accumulated + reqBody.amount;
        const cashFlow = {Origin: 'Contas a Pagar', Description: `Id: ${id}. Desmarcado como pago.`, Amount : reqBody.amount, Accumulated: sun}
        const result = await cashFlowModel.create(cashFlow);
      }
    };

    return retorno
      .then((result) =>
        res.status(200).send("Conta a pagar atualizada com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));

  }
}

module.exports = new AccountsPayableController();
