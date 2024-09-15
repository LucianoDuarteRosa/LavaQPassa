const backup = require("../../backup/backup")


class BackupController {

  async backup(req, res) {
    /*
      #swagger.tags = ['Backup']
      #swagger.summary = 'Backup'
      #swagger.description = 'Executa o backup no backend'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Backup finalizado com sucesso!'
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

    try {
      // Aguarda o backup ser criado
      await backup.backupDatabase();
      // Responde com sucesso
      res.status(200).send("Backup efetuado com sucesso!");
    } catch (error) {
      // Captura e responde com erro, se ocorrer
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new BackupController();
