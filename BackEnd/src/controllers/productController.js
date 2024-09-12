
const productModel = require("../models/productModel");
const validator = require("../../utils/inputsValidator");
const converter = require("../../utils/converter");

class ProductController {

  readList(req, res) {
      /*
      #swagger.tags = ['Produto']
      #swagger.summary = 'Busca por produtos'
      #swagger.description = 'Retorna uma lista de produtos cadastrados'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Consulta lista os produtos',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdProduct: { type: 'integer' },
                  ProductName: { type: 'string'},
                  CostPrice: { type: 'number', format: 'double'  },
                  SalePrice: { type: 'number' ,format: 'double' },
                  IdClientSupplier: { type: 'integer'},
                  ClientSupplierName: { type: 'string'},
                  IdGroup: { type: 'integer'},
                  GroupName: { type: 'string'},
                  IdSubGroup: { type: 'integer'},
                  SubGroupName: { type: 'string'},
                  IdStore: { type: 'integer'},
                  StoreName: { type: 'string'},
                  IdUser: { type: 'integer'},
                  UserName: { type: 'string'},
                  RegistrationDate: { type: 'date-time',format: 'date-time'},
                  Sold: { type: 'boolean'},
                  Active: { type: 'boolean'}
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
                message: { type: 'string', example: 'Nenhum grupo encontrado!' }
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
    
    const retorno = productModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum produto encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }
  
  readListSale(req, res) {
    /*
      #swagger.tags = ['Produto']
      #swagger.summary = 'Busca por produtos'
      #swagger.description = 'Retorna uma lista de produtos cadastrados'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Consulta lista os produtos',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdProduct: { type: 'integer' },
                  ProductName: { type: 'string'},
                  CostPrice: { type: 'number', format: 'double'  },
                  SalePrice: { type: 'number' ,format: 'double' },
                  IdClientSupplier: { type: 'integer'},
                  ClientSupplierName: { type: 'string'},
                  IdGroup: { type: 'integer'},
                  GroupName: { type: 'string'},
                  IdSubGroup: { type: 'integer'},
                  SubGroupName: { type: 'string'},
                  IdStore: { type: 'integer'},
                  StoreName: { type: 'string'},
                  IdUser: { type: 'integer'},
                  UserName: { type: 'string'},
                  RegistrationDate: { type: 'date-time',format: 'date-time'},
                  Sold: { type: 'boolean'},
                  Active: { type: 'boolean'}
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
                message: { type: 'string', example: 'Nenhum grupo encontrado!' }
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
    
    const retorno = productModel.readListSale();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum produto encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  read(req, res) {
       /*
      #swagger.tags = ['Produto']
      #swagger.summary = 'Busca por produto [id]'
      #swagger.description = 'Retorna o produto com do id enviado como parametro'
  
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
  
      #swagger.responses[200] = {
        description: 'Retorna o produto com o ID enviado como parâmetro',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                  IdProduct: { type: 'integer' },
                  ProductName: { type: 'string'},
                  CostPrice: { type: 'number', format: 'double' },
                  SalePrice: { type: 'number', format: 'double'},
                  IdClientSupplier: { type: 'integer'},
                  ClientSupplierName: { type: 'string'},
                  IdGroup: { type: 'integer'},
                  GroupName: { type: 'string'},
                  IdSubGroup: { type: 'integer'},
                  SubGroupName: { type: 'string'},
                  IdStore: { type: 'integer'},
                  StoreName: { type: 'string'},
                  IdUser: { type: 'integer'},
                  UserName: { type: 'string'},
                  RegistrationDate: { type: 'date-time', format: 'date-time'},
                  Sold: { type: 'boolean'},
                  Active: { type: 'boolean'}
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
                message: { type: 'string', example: 'Nenhum produto encontrado!' }
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

    const retorno = productModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Produto não encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  search(req, res) {
    /*
      #swagger.tags = ['Produto']
      #swagger.summary = 'Pesquisa produto [parametro]'
      #swagger.description = 'Retorna os produtos localizados com o parametro enviado'
    
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
    
      #swagger.responses[200] = {
        description: 'Retorna os grupos localizados com o parametro enviado',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdProduct: { type: 'integer' },
                  ProductName: { type: 'string'},
                  CostPrice: { type: 'number', format: 'double'  },
                  SalePrice: { type: 'number' ,format: 'double' },
                  IdClientSupplier: { type: 'integer'},
                  ClientSupplierName: { type: 'string'},
                  IdGroup: { type: 'integer'},
                  GroupName: { type: 'string'},
                  IdSubGroup: { type: 'integer'},
                  SubGroupName: { type: 'string'},
                  IdStore: { type: 'integer'},
                  StoreName: { type: 'string'},
                  IdUser: { type: 'integer'},
                  UserName: { type: 'string'},
                  RegistrationDate: { type: 'date-time',format: 'date-time'},
                  Sold: { type: 'boolean'},
                  Active: { type: 'boolean'}
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
                message: { type: 'string', example: 'Nenhum produto encontrado!' }
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

    const retorno = productModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhum produto encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  create(req, res) {
       /*
        #swagger.tags = ['Produto']
        #swagger.summary = 'Criar produto'
        #swagger.description = 'Cria o produto no banco de dados com o objeto que veio no body'
      
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
                  name: { type: 'string'},
                  costprice : { type: 'integer'},
                  saleprice : { type: 'integer'},
                  idclient : { type: 'integer'},
                  idstore : { type: 'integer'},
                  idsubgroup  : { type: 'integer'}
                }
              }
            }
          }
        }
          
        #swagger.responses[201] = {
          description: 'Produto efetuado com sucesso',
          content: {
            "application/json": {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Produto criado com sucesso!' }
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

    const testUserId = validator.integerValidator(reqBody.userId);
    const testProductName = validator.allValidator(reqBody.name, 2, 50);
    const testCostPrice = validator.floatValidator(reqBody.costprice);
    const testSalePrice = validator.floatValidator(reqBody.saleprice);
    const testIdClientSupplier = validator.integerValidator(reqBody.idclient);
    const testIdStore = validator.integerValidator(reqBody.idstore);
    const testIdSubGroup = validator.integerValidator(reqBody.idsubgroup);

    let registrationdate = converter.toMySQLDate();

    if (testUserId !== true) {
      errors.push(testUserId);
    }
    if (testProductName !== true) {
      errors.push(testProductName);
    }
    if (testCostPrice !== true) {
      errors.push(testCostPrice);
    }
    if (testSalePrice !== true) {
      errors.push(testSalePrice);
    }
    if (testIdClientSupplier !== true) {
      errors.push(testIdClientSupplier);
    }
    if (testIdStore !== true) {
      errors.push(testIdStore);
    }
    if (testIdSubGroup !== true) {
      errors.push(testIdSubGroup);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const product = {ProductName: reqBody.name, CostPrice: reqBody.costprice, SalePrice: reqBody.saleprice, IdClientSupplier: reqBody.idclient,
      IdSubGroup: reqBody.idsubgroup, IdStore: reqBody.idstore, IdUser: reqBody.userId, RegistrationDate: registrationdate}

    const retorno = productModel.create(product);
    return retorno
      .then((result) =>
        res.status(201).send("Produto criado com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));
  }

  update(req, res) {
      /*
        #swagger.tags = ['Produto']
        #swagger.summary = 'Atualizar produto'
        #swagger.description = 'Atualiza o produto [id] no banco de dados com o objeto que veio no body'
      
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
                  name: { type: 'string'},
                  costprice : { type: 'integer'},
                  saleprice : { type: 'integer'},
                  idclient : { type: 'integer'},
                  idstore : { type: 'integer'},
                  idsubgroup  : { type: 'integer'}
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
                  message: { type: 'string', example: 'Produto atualizado com sucesso!' }
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

    const testUserId = validator.integerValidator(reqBody.userId);
    const testProductName = validator.allValidator(reqBody.name, 2, 50);
    const testCostPrice = validator.floatValidator(reqBody.costprice);
    const testSalePrice = validator.floatValidator(reqBody.saleprice);
    const testIdClientSupplier = validator.integerValidator(reqBody.idclient);
    const testIdStore = validator.integerValidator(reqBody.idstore);
    const testIdSubGroup = validator.integerValidator(reqBody.idsubgroup);
    const testIdUser = validator.integerValidator(reqBody.iduser);
    const testActive = validator.booleanValidator(reqBody.active);
    const registrationDate = converter.convertToMySQLDateTimeFormat(reqBody.registrationdate);

    if (testUserId !== true) {
      errors.push(testUserId);
    }
    if (testProductName !== true) {
      errors.push(testProductName);
    }
    if (testCostPrice !== true) {
      errors.push(testCostPrice);
    }
    if (testSalePrice !== true) {
      errors.push(testSalePrice);
    }
    if (testIdClientSupplier !== true) {
      errors.push(testIdClientSupplier);
    }
    if (testIdStore !== true) {
      errors.push(testIdStore);
    }
    if (testIdSubGroup !== true) {
      errors.push(testIdSubGroup);
    }
    if (testIdUser !== true) {
      errors.push(testIdUser);
    }
    if (testActive !== true) {
      errors.push(testActive);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const product = {ProductName: reqBody.name, CostPrice: reqBody.costprice, SalePrice: reqBody.saleprice, IdClientSupplier: reqBody.idclient,
      IdSubGroup: reqBody.idsubgroup, IdStore: reqBody.idstore, IdUser: reqBody.iduser, RegistrationDate: registrationDate, Active: reqBody.active}

    const retorno = productModel.update(product, id);
    return retorno
      .then((result) =>
        res.status(200).send("Produto atualizado com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));

  }

}

module.exports = new ProductController();
