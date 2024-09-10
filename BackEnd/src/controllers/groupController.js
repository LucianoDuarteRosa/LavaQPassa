const groupModel = require("../models/groupModel");
const validator = require("../../utils/inputsValidator")

class GroupController {

  readList(req, res) {
    /*
      #swagger.tags = ['Grupo']
      #swagger.summary = 'Busca por Grupos'
      #swagger.description = 'Retorna uma lista de grupos cadastrados'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Consulta lista os grupos',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdGroup: { type: 'integer' },
                  GroupName: { type: 'string'},
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
    
    const retorno = groupModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum grupo encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  read(req, res) {
    /*
    #swagger.tags = ['Grupo']
    #swagger.summary = 'Busca por grupo [id]'
    #swagger.description = 'Retorna o grupo com do id enviado como parametro'
 
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Token JWT do usuário logado',
      required: true,
      type: 'string'
    }
 
    #swagger.responses[200] = {
      description: 'Retorna o grupo com o ID enviado como parâmetro',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
                IdGroup: { type: 'integer' },
                GroupName: { type: 'string'},
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
              message: { type: 'string', example: 'Nenhum grupo encontrado!' }
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

    const retorno = groupModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Grupo não encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  search(req, res) {
    /*
  #swagger.tags = ['Grupo']
  #swagger.summary = 'Pesquisa grupo [parametro]'
  #swagger.description = 'Retorna os grupos localizados com o parametro enviado'
 
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
               IdGroup: { type: 'integer' },
               GroupName: { type: 'string'},
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

    const { id } = req.params;

    const retorno = groupModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhum grupo encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  create(req, res) {
    /*
       #swagger.tags = ['Grupo']
       #swagger.summary = 'Criar grupo'
       #swagger.description = 'Cria o grupo no banco de dados com o objeto que veio no body'
    
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
                name: { type: 'string'}
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
                message: { type: 'string', example: 'Grupo criado com sucesso!' }
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
  */

    const reqBody = req.body;
    const group = { GroupName: reqBody.name }
    const retorno = groupModel.create(group);
    return retorno
      .then((result) =>
        res.status(201).send("Grupo criado com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));
  }

  update(req, res) {
    /*
       #swagger.tags = ['Grupo']
       #swagger.summary = 'Atualizar grupo'
       #swagger.description = 'Atualiza o grupo [id] no banco de dados com o objeto que veio no body'
    
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
                message: { type: 'string', example: 'Grupo atualizado com sucesso!' }
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
    const testGroupName = validator.allValidator(reqBody.name, 1, 30);
    const testActive = validator.booleanValidator(reqBody.active);

    if (testId !== true) {
      errors.push(testId);
    }
    if (testActive !== true) {
      errors.push(testActive);
    }
    if (testGroupName !== true) {
      errors.push(testGroupName);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const group = { GroupName: reqBody.name, Active: reqBody.active };

    const retorno = groupModel.update(group, id);
    return retorno
      .then((result) =>
        res.status(200).send("Grupo atualizado com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));

  }
}

module.exports = new GroupController();
