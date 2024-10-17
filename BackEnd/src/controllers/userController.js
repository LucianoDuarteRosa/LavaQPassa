
const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const tokenModel = require('../models/tokenModel');
const validator = require('../../utils/inputsValidator');


class UserController {

  readList(req, res) {
    /*
      #swagger.tags = ['Usuário']
      #swagger.summary = 'Busca por usuários'
      #swagger.description = 'Retorna uma lista de usuários cadastrados'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Consulta lista os usuários',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdUser: { type: 'integer' },
                  UserName: { type: 'string'},
                  UserEmail: { type: 'string'},
                  Active: { type: 'bollean'},
                  IdProfile: { type: 'integer'},
                  UserProfile: { type: 'string'}
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
                message: { type: 'string', example: 'Nenhum usuário encontrado!' }
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
    const retorno = userModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum usuário encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  read(req, res) {
    /*
      #swagger.tags = ['Usuário']
      #swagger.summary = 'Busca por usuários [id]'
      #swagger.description = 'Retorna o usuário com do id enviado como parametro'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Retorna o usuário com o ID enviado como parâmetro',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                IdUser: { type: 'integer' },
                UserName: { type: 'string' },
                UserEmail: { type: 'string' },
                Active: { type: 'boolean' },
                IdProfile: { type: 'integer' },
                UserProfile: { type: 'string' }
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
                message: { type: 'string', example: 'Nenhum usuário encontrado!' }
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

    const retorno = userModel.read(id);

    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Usuário não encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  search(req, res) {
    /*
     #swagger.tags = ['Usuário']
     #swagger.summary = 'Pesquisa usuários [parametro]'
     #swagger.description = 'Retorna o usuário com do parametro for localizado no IdUser, UserName ou UserEmail'
  
     #swagger.parameters['Authorization'] = {
       in: 'header',
       description: 'Token JWT do usuário logado',
       required: true,
       type: 'string'
     }
  
     #swagger.responses[200] = {
       description: 'Retorna os usuários localizados com o parametro enviado',
       content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdUser: { type: 'integer' },
                  UserName: { type: 'string'},
                  UserEmail: { type: 'string'},
                  Active: { type: 'bollean'},
                  IdProfile: { type: 'integer'},
                  UserProfile: { type: 'string'}
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
               message: { type: 'string', example: 'Nenhum usuário encontrado!' }
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

    const retorno = userModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhum usuário encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  async create(req, res) {
    /*
       #swagger.tags = ['Usuário']
       #swagger.summary = 'Criar usuário'
       #swagger.description = 'Cria o usuário no banco de dados com o objeto que veio no body'
    
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
                email: { type: 'string'},
                password: { type: 'string'},
                profile: { type: 'integer'}
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
                message: { type: 'string', example: 'Usuário criado com sucesso!' }
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
        description: 'Erro ao tentar cadastrar o nome de usuário ou e-mail',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Nome de usuário ou e-mail já cadastrado' }
              }
            }
          }
        }
      }
  */

    const { name, email, password, profile } = req.body;
    const errors = [];

    // Validações
    const testName = validator.allValidator(name, 2, 15);
    const testEmail = validator.emailValidator(email);
    const testProfile = validator.integerValidator(profile);

    if (testName !== true) {
      errors.push(testName);
    }
    if (testEmail !== true) {
      errors.push(testEmail);
    }

    if (testProfile !== true) {
      errors.push(testProfile);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      // Verifica se o nome de usuário ou e-mail já existem
      const { userNameExists, userEmailExists } = await userModel.checkUserExists(name, email);

      if (userNameExists) {
        return res.status(400).json({ errors: 'Nome de usuário já cadastrado!' });
      }
      if (userEmailExists) {
        return res.status(400).json({ errors: 'E-mail já cadastrado!' });
      }

      // Cria o usuário se não houver erros
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const user = { UserName: name, UserEmail: email, Password: hashedPassword, IdProfile: profile };

      await userModel.create(user);
      res.status(201).send('Usuário criado com sucesso!');
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: error.message });
    }
  }

  update(req, res) {
     /*
       #swagger.tags = ['Usuário']
       #swagger.summary = 'Atualizar usuário'
       #swagger.description = 'Atualiza o usuário [id] no banco de dados com o objeto que veio no body'
    
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
                email: { type: 'string'},
                password: { type: 'string'},
                profile: { type: 'integer'}
              }
            }
          }
        }
      }
        
      #swagger.responses[200] = {
        description: 'Atualizar usuário efetuado com sucesso',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Usuário atualizado com sucesso!' }
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
    const testName = validator.allValidator(reqBody.name, 3, 15);
    const testEmail = validator.emailValidator(reqBody.email);
    const testIdProfile = validator.integerValidator(reqBody.profile);
    const testActive = validator.booleanValidator(reqBody.active);

    if (testId !== true) {
      errors.push(testId);
    }
    if (testName !== true) {
      errors.push(testName);
    }
    if (testEmail !== true) {
      errors.push(testEmail);
    }
    if (testIdProfile !== true) {
      errors.push(testIdProfile);
    }
    if (testActive !== true) {
      errors.push(testActive);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    let user = {
      UserName: reqBody.name,
      UserEmail: reqBody.email,
      Active: reqBody.active,
      IdProfile: reqBody.profile
    }

    userModel.update(user, id)
      .then((result) => res.status(200).send("Usuário atualizado com sucesso!"))
      .catch((error) => res.status(500).json({ error: error.message }));
  }

  async login(req, res) {
    /*
    #swagger.tags = ['Usuário']
       #swagger.summary = 'Login de usuário'
       #swagger.description = 'Inicia a seção do usuário na aplicação'
    
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
                email: { type: 'string'},
                password: { type: 'string'}
              }
            }
          }
        }
      }
        
      #swagger.responses[200] = {
        description: 'Atualizar usuário efetuado com sucesso',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                name: { type: 'string' },
                profile: { type: 'integer' }
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
   
      #swagger.responses[400] = {
        description: 'Credenciais inválidas',
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

       #swagger.responses[404] = {
        description: 'E-mail não cadastrado',
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

    let email = req.body.email;
    let password = req.body.password;

    let testEmail = validator.emailValidator(email);

    if (testEmail !== true) {
      return res.status(400).json(testEmail);
    }

    try {
      const user = await userModel.findByEmail(email);
      if (!user[0]) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      if (!password) {
        return res.status(400).json({ message: 'Senha não fornecida' });
      }

      const isPasswordValid = await bcrypt.compare(password, user[0].Password);

      if (isPasswordValid) {
        const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '8h' });
        const expiresAt = moment().add(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
        const tokenCreate = { IdUser: user[0].IdUser, Token: token, CreateToken: moment().format('YYYY-MM-DD HH:mm:ss'), ExpiresToken: expiresAt }
        const searchIdUser = await tokenModel.readIdUser(tokenCreate.IdUser);
        if(searchIdUser.length > 0){
          await tokenModel.update(tokenCreate, tokenCreate.IdUser);
        }else{
          await tokenModel.create(tokenCreate);
        }

        return res.status(200).json({
          token: token,
          name: user[0].UserName,
          profile: user[0].IdProfile
        });
      } else {
        return res.status(400).json({ message: 'Credenciais Inválidas' });
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }

}

module.exports = new UserController();
