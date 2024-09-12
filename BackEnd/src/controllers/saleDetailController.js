const saleDetailModel = require("../models/saleDetailModel");
const validator = require("../../utils/inputsValidator")

class SaleDetailController {
 
  readList(req, res) {
     /*
      #swagger.tags = ['Venda Detalhada']
      #swagger.summary = 'Busca por Venda Detalhada'
      #swagger.description = 'Retorna uma lista de vendas detalhadas cadastrados'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Consulta lista os vendas detalhadas ',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdSaleDetail: { type: 'integer' },
                  IdSale: { type: 'integer' },
                  IdProduct: { type: 'integer' },
                  ProductName: { type: 'string' },
                  CostPrice: { type: 'double' },
                  SalePrice: { type: 'double' },
                  PaymentCondition: { type: 'string' },
                  SaleStatus: { type: 'string'},
                  IdUser: { type: 'integer'},
                  UserName: { type: 'string'},
                  IdClientSupplier: { type: 'integer'},
                  ClientSupplierName: { type: 'string'}
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
                message: { type: 'string', example: 'Nenhuma venda detalhada encontrado!' }
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
    
    const retorno = saleDetailModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhuma venda detalhada encontrada!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  read(req, res) {
      /*
        #swagger.tags = ['Venda Detalhada']
        #swagger.summary = 'Busca por Venda Detalhada [id]'
        #swagger.description = 'Retorna o venda detalhada com do id enviado como parametro'
    
        #swagger.parameters['Authorization'] = {
          in: 'header',
          description: 'Token JWT do usuário logado',
          required: true,
          type: 'string'
        }
    
        #swagger.responses[200] = {
          description: 'Retorna o venda detalhada com o ID enviado como parâmetro',
          content: {
            "application/json": {
              schema: {
                type: 'object',
                properties: {
                    IdSaleDetail: { type: 'integer' },
                    IdSale: { type: 'integer' },
                    IdProduct: { type: 'integer' },
                    ProductName: { type: 'string' },
                    CostPrice: { type: 'double' },
                    SalePrice: { type: 'double' },
                    PaymentCondition: { type: 'string' },
                    SaleStatus: { type: 'string'},
                    IdUser: { type: 'integer'},
                    UserName: { type: 'string'},
                    IdClientSupplier: { type: 'integer'},
                    ClientSupplierName: { type: 'string'}
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
                  message: { type: 'string', example: 'Nenhum venda detalhada encontrado!' }
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

    const test = validator.integerValidator(id);
    if (test !== true) {
      errors.push(test);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const retorno = saleDetailModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0 
        ? res.status(404).send("Venda detalhada não encontrada!") 
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  create(req, res) {
    /*
    #swagger.tags = ['Venda Detalhada']
    #swagger.summary = 'Criar Venda Detalhada'
    #swagger.description = 'Cria o venda detalhada no banco de dados com o objeto que veio no body'
  
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
              idSale: { type: 'integer'},
              idProduct: { type: 'integer'},
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
              message: { type: 'string', example: 'Venda detalhada criado com sucesso!' }
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

    const testIdSale = validator.integerValidator(reqBody.idSale);
    const testIdProduct = validator.integerValidator(reqBody.idProduct);

    if (testIdSale !== true) {
      errors.push(testIdSale);
    }
    if (testIdProduct !== true) {
      errors.push(testIdProduct);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const retorno = saleDetailModel.create(reqBody);
    return retorno
      .then((result) =>
        res.status(201).send("Venda detalhada criada com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));
  }

  update(req, res) {
     /*
       #swagger.tags = ['Venda Detalhada']
       #swagger.summary = 'Atualizar Venda Detalhada'
       #swagger.description = 'Atualiza o venda detalhada [id] no banco de dados com o objeto que veio no body'
    
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
                idSale: { type: 'integer'},
                idProduct: { type: 'integer'}
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
                message: { type: 'string', example: 'Venda detalhada atualizada com sucesso!' }
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

    const testIdSaleDetail = validator.integerValidator(reqBody.idSaleDetail);
    const testIdSale = validator.integerValidator(reqBody.idSale);
    const testIdProduct = validator.integerValidator(reqBody.idProduct);

    if (testIdSaleDetail !== true) {
      errors.push(testIdSaleDetail);
    }
    if (testIdSale !== true) {
      errors.push(testIdSale);
    }
    if (testIdProduct !== true) {
      errors.push(testIdProduct);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
      
    const retorno = saleDetailModel.update(reqBody, id);
    return retorno
      .then((result) =>
        res.status(200).send("Venda detalhada atualizada com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));

  }

}

module.exports = new SaleDetailController();
