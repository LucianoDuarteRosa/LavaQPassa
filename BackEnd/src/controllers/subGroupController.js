const subGroupModel = require("../models/subGroupModel");
const validator = require("../../utils/inputsValidator")

class SubGroupController {

  readList(req, res) {
    /*
         #swagger.tags = ['Subgrupo']
         #swagger.summary = 'Busca por Subgrupos'
         #swagger.description = 'Retorna uma lista de subgrupos cadastrados'
      
         #swagger.parameters['Authorization'] = {
           in: 'header',
           description: 'Token JWT do usuário logado',
           required: true,
           type: 'string'
         }
      
         #swagger.responses[200] = {
           description: 'Consulta lista os subgrupos',
           content: {
             "application/json": {
               schema: {
                 type: 'object',
                 additionalProperties: {
                   type: 'object',
                   properties: {
                     IdSubGroup: { type: 'integer' },
                     SubGroupName: { type: 'string'},
                     Active: { type: 'boolean'},
                     IdGroup: { type: 'integer' },
                     GroupName: { type: 'string'}
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
                   message: { type: 'string', example: 'Nenhum subgrupo encontrado!' }
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

    const retorno = subGroupModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum Sub-Grupo encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  read(req, res) {
    /*
    #swagger.tags = ['Subgrupo']
    #swagger.summary = 'Busca por subgrupo [id]'
    #swagger.description = 'Retorna o subgrupo com do id enviado como parametro'
   
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Token JWT do usuário logado',
      required: true,
      type: 'string'
    }
   
    #swagger.responses[200] = {
      description: 'Retorna o subgrupo com o ID enviado como parâmetro',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              IdSubGroup: { type: 'integer' },
              SubGroupName: { type: 'string'},
              Active: { type: 'boolean'},
              IdGroup: { type: 'integer' },
              GroupName: { type: 'string'}
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
              message: { type: 'string', example: 'Nenhum subgrupo encontrado!' }
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

    const retorno = subGroupModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Sub-Grupo não encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  search(req, res) {
      /*
      #swagger.tags = ['Subgrupo']
      #swagger.summary = 'Pesquisa subgrupos [parametro]'
      #swagger.description = 'Retorna os subgrupos localizados com o parametro enviado'
      
      #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Token JWT do usuário logado',
      required: true,
      type: 'string'
      }
      
      #swagger.responses[200] = {
      description: 'Retorna os subgrupos localizados com o parametro enviado',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                IdSubGroup: { type: 'integer' },
                SubGroupName: { type: 'string'},
                Active: { type: 'boolean'},
                IdGroup: { type: 'integer' },
                GroupName: { type: 'string'}
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
              message: { type: 'string', example: 'Nenhum subgrupo encontrado!' }
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

    const retorno = subGroupModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhum Sub-Grupo encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  create(req, res) {
        /*
        #swagger.tags = ['Subgrupo']
        #swagger.summary = 'Criar subgrupo'
        #swagger.description = 'Cria o subgrupo no banco de dados com o objeto que veio no body'
      
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
                  name: { type: 'string'},
                  idgroup: { type: 'integer'}
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
                  message: { type: 'string', example: 'Subgrupo criado com sucesso!' }
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


    const { name, idgroup } = req.body;
    const errors = [];

    const testName = validator.allValidator(name, 2, 15);
    const testIdGroup = validator.integerValidator(idgroup);

    if (testName !== true) {
      errors.push(testName);
    }
    if (testIdGroup !== true) {
      errors.push(testIdGroup);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const subGroup = { SubGroupName: name, IdGroup: idgroup };

    const retorno = subGroupModel.create(subGroup);
    return retorno
      .then((result) =>
        res.status(201).send("Sub-Grupo criado com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));
  }

  update(req, res) {
       /*
        #swagger.tags = ['Subgrupo']
        #swagger.summary = 'Atualizar subgrupo'
        #swagger.description = 'Atualiza o subgrupo [id] no banco de dados com o objeto que veio no body'
      
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
                  name: { type: 'string'},
                  active: { type: 'boolean'},
                  idgroup: { type: 'integer'}
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
                  message: { type: 'string', example: 'Subgrupo atualizado com sucesso!' }
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

    const testId = validator.integerValidator(id);
    const testName = validator.allValidator(reqBody.name, 2, 15);
    const testIdGroup = validator.integerValidator(reqBody.idgroup);
    const testActive = validator.booleanValidator(reqBody.active);

    if (testId !== true) {
      errors.push(testId);
    }
    if (testName !== true) {
      errors.push(testName);
    }
    if (testIdGroup !== true) {
      errors.push(testIdGroup);
    }
    if (testActive !== true) {
      errors.push(testActive);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const subGroup = { SubGroupName: reqBody.name, Active: reqBody.active, IdGroup: reqBody.idgroup };

    const retorno = subGroupModel.update(subGroup, id);
    return retorno
      .then((result) =>
        res.status(200).send("Subgrupo atualizado com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));

  }

}

module.exports = new SubGroupController();
