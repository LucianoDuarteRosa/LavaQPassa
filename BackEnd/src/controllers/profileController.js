const profileModel = require("../models/profileModel");


class ProfileController {

  readList(req, res) {
    /*
      #swagger.tags = ['Perfil']
      #swagger.summary = 'Busca os perfis'
      #swagger.description = 'Retorna uma lista perfis de usuários cadastrados'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Lista todos os perfis',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdProfile: { type: 'integer' },
                  UserProfile: { type: 'string' }
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
                message: { type: 'string', example: 'Nenhum perfil encontrado!' }
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

    const retorno = profileModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum perfil encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }
}

module.exports = new ProfileController();
