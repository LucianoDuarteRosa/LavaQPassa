const storeModel = require("../models/storeModel");
const validator = require('../../utils/inputsValidator');


class StoreController {

  readList(req, res) {
      /*
      #swagger.tags = ['Loja']
      #swagger.summary = 'Busca por Lojas'
      #swagger.description = 'Retorna uma lista de lojas cadastrados'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Consulta lista as lojas',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdStore: { type: 'integer' },
                  StoreName: { type: 'string'},
                  ZipCode: { type: 'string'},
                  Address: { type: 'string'},
                  Number: { type: 'string'},
                  Complement: { type: 'string'},
                  Neighborhood: { type: 'string'},
                  City: { type: 'string'},
                  State: { type: 'string'},
                  Phone: { type: 'string'},
                  Email: { type: 'string'},
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
                message: { type: 'string', example: 'Nenhuma loja encontrada!' }
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
    
    const retorno = storeModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhuma loja encontrada!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  read(req, res) {
      /*
      #swagger.tags = ['Loja']
      #swagger.summary = 'Busca por loja [id]'
      #swagger.description = 'Retorna o loja com do id enviado como parametro'
  
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
  
      #swagger.responses[200] = {
        description: 'Retorna oa loja com o ID enviado como parâmetro',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                  IdStore: { type: 'integer' },
                  StoreName: { type: 'string'},
                  ZipCode: { type: 'string'},
                  Address: { type: 'string'},
                  Number: { type: 'string'},
                  Complement: { type: 'string'},
                  Neighborhood: { type: 'string'},
                  City: { type: 'string'},
                  State: { type: 'string'},
                  Phone: { type: 'string'},
                  Email: { type: 'string'},
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
                message: { type: 'string', example: 'Nenhuma loja encontrada!' }
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

    const retorno = storeModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Loja não encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  search(req, res) {
      /*
      #swagger.tags = ['Loja']
      #swagger.summary = 'Pesquisa de lojas [parametro]'
      #swagger.description = 'Retorna os lojas localizados com o parametro enviado'
    
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
    
      #swagger.responses[200] = {
        description: 'Retorna as lojas localizadas com o parametro enviado',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdStore: { type: 'integer' },
                  StoreName: { type: 'string'},
                  ZipCode: { type: 'string'},
                  Address: { type: 'string'},
                  Number: { type: 'string'},
                  Complement: { type: 'string'},
                  Neighborhood: { type: 'string'},
                  City: { type: 'string'},
                  State: { type: 'string'},
                  Phone: { type: 'string'},
                  Email: { type: 'string'},
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
                message: { type: 'string', example: 'Nenhuma loja encontrada!' }
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

    const retorno = storeModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhuma loja encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  create(req, res) {
      /*
        #swagger.tags = ['Loja']
        #swagger.summary = 'Criar loja'
        #swagger.description = 'Loja o grupo no banco de dados com o objeto que veio no body'
      
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
                  userId: { type: 'integer' },
                  name: { type: 'string'},
                  zipCode: { type: 'string'},
                  address: { type: 'string'},
                  number: { type: 'string'},
                  complement: { type: 'string'},
                  neighborhood: { type: 'string'},
                  city: { type: 'string'},
                  state: { type: 'string'},
                  phone: { type: 'string'},
                  email: { type: 'string'},
                  active: { type: 'boolean'}
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
                  message: { type: 'string', example: 'Loja criada com sucesso!' }
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

    const testName = validator.allValidator(reqBody.name, 2, 40);
    const testZipCode = validator.zipCodeValidator(reqBody.zipCode);
    const testAddress = validator.allValidator(reqBody.address, 5 , 255);
    const testNumber = validator.integerValidator(reqBody.number);
    const testComplement = validator.allValidator(reqBody.complement, 0, 100);
    const testNeighborhood = validator.allValidator(reqBody.neighborhood, 3, 60);
    const testCity = validator.allValidator(reqBody.city, 0, 100);
    const testState = validator.stringValidator(reqBody.state, 1, 40);
    const testPhone = validator.phoneValidator(reqBody.phone);
    const testEmail = validator.emailValidator(reqBody.email);
    const testActive = validator.booleanValidator(reqBody.active);

    if (testName !== true) {
      errors.push(testName);
    }
    if (testZipCode !== true) {
      errors.push(testZipCode);
    }
    if (testAddress !== true) {
      errors.push(testAddress);
    }
    if (testNumber !== true) {
      errors.push(testNumber);
    }
    if (testComplement !== true) {
      errors.push(testComplement);
    }
    if (testNeighborhood !== true) {
      errors.push(testNeighborhood);
    }
    if (testCity !== true) {
      errors.push(testCity);
    }
    if (testState !== true) {
      errors.push(testState);
    }
    if (testPhone !== true) {
      errors.push(testCity);
    }
    if (testEmail !== true) {
      errors.push(testPhone);
    }
    if (testActive !== true) {
      errors.push(testActive);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const retorno = storeModel.create(reqBody);
    return retorno
      .then((result) =>
        res.status(201).send("Loja criada com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));
  }

  update(req, res) {
    /*
      #swagger.tags = ['Loja']
      #swagger.summary = 'Atualizar loja'
      #swagger.description = 'Atualiza loja [id] no banco de dados com o objeto que veio no body'
    
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
                  userId: { type: 'integer' },
                  name: { type: 'string'},
                  zipCode: { type: 'string'},
                  address: { type: 'string'},
                  number: { type: 'string'},
                  complement: { type: 'string'},
                  neighborhood: { type: 'string'},
                  city: { type: 'string'},
                  state: { type: 'string'},
                  phone: { type: 'string'},
                  email: { type: 'string'},
                  active: { type: 'boolean'}
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
                message: { type: 'string', example: 'Loja atualizada com sucesso!' }
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

    const testId = validator.integerValidator(reqBody.id)
    const testName = validator.allValidator(reqBody.name, 2, 40);
    const testZipCode = validator.zipCodeValidator(reqBody.zipCode);
    const testAddress = validator.allValidator(reqBody.address, 5 , 255);
    const testNumber = validator.integerValidator(reqBody.number);
    const testComplement = validator.allValidator(reqBody.complement, 0, 100);
    const testNeighborhood = validator.allValidator(reqBody.neighborhood, 3, 60);
    const testCity = validator.allValidator(reqBody.city, 0, 100);
    const testState = validator.stringValidator(reqBody.state, 1, 40);
    const testPhone = validator.phoneValidator(reqBody.phone);
    const testEmail = validator.emailValidator(reqBody.email);
    const testActive = validator.booleanValidator(reqBody.active);

    if (testId !== true) {
      errors.push(testId);
    }
    if (testName !== true) {
      errors.push(testName);
    }
    if (testZipCode !== true) {
      errors.push(testZipCode);
    }
    if (testAddress !== true) {
      errors.push(testAddress);
    }
    if (testNumber !== true) {
      errors.push(testNumber);
    }
    if (testComplement !== true) {
      errors.push(testComplement);
    }
    if (testNeighborhood !== true) {
      errors.push(testNeighborhood);
    }
    if (testCity !== true) {
      errors.push(testCity);
    }
    if (testState !== true) {
      errors.push(testState);
    }
    if (testPhone !== true) {
      errors.push(testCity);
    }
    if (testEmail !== true) {
      errors.push(testPhone);
    }
    if (testActive !== true) {
      errors.push(testActive);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const retorno = storeModel.update(reqBody, id);
    return retorno
      .then((result) =>
        res.status(200).send("Loja atualizada com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));

  }

}

module.exports = new StoreController();
