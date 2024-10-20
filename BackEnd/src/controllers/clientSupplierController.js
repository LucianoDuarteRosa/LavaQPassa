const clientSupplierModel = require('../models/clientSupplierModel')
const validator = require('../../utils/inputsValidator')


class ClientSupplierController {

  readList(req, res) {
     /*
      #swagger.tags = ['Cliente/Fornecedor']
      #swagger.summary = 'Busca por Cliente/Fornecedor'
      #swagger.description = 'Retorna uma lista de Clientes/Fornecedores cadastrados'
   
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
   
      #swagger.responses[200] = {
        description: 'Consulta lista os Clientes/Fornecedores',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdClientSupplier: { type: 'integer' },
                  ClientSupplierName: { type: 'string'},
                  Cpf: { type: 'string'},
                  Cnpj: { type: 'string'},
                  ZipCode: { type: 'string'},
                  Address: { type: 'string'},
                  Number: { type: 'string'},
                  Complement: { type: 'string'},
                  Neighborhood: { type: 'string'},
                  City: { type: 'string'},
                  State: { type: 'string'},
                  Phone: { type: 'string'},
                  Email: { type: 'string'},
                  IsClient: { type: 'boolean'},
                  IsSupplier: { type: 'boolean'},
                  TypeKey: { type: 'string'},
                  PixKey: { type: 'string'},
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
                message: { type: 'string', example: 'Nenhum Cliente/Fornecedor encontrado!' }
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
    
    const retorno = clientSupplierModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhuma Cliente/Fornecedor encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  read(req, res) {

    /*
    #swagger.tags = ['Cliente/Fornecedor']
    #swagger.summary = 'Busca por Cliente/Fornecedor [id]'
    #swagger.description = 'Retorna o Cliente/Fornecedor com do id enviado como parametro'
 
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Token JWT do usuário logado',
      required: true,
      type: 'string'
    }
 
    #swagger.responses[200] = {
      description: 'Retorna o Cliente/Fornecedor com o ID enviado como parâmetro',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              IdClientSupplier:{ type: 'integer' },
              ClientSupplierName:{ type: 'string'},
              Cpf: { type: 'string'},
              Cnpj: { type: 'string'},
              ZipCode: { type: 'string'},
              Address: { type: 'string'},
              Number: { type: 'string'},
              Complement: { type: 'string'},
              Neighborhood: { type: 'string'},
              City: { type: 'string'},
              State: { type: 'string'},
              Phone: { type: 'string'},
              Email: { type: 'string'},
              IsClient: { type: 'boolean'},
              IsSupplier: { type: 'boolean'},
              TypeKey: { type: 'string'},
              PixKey: { type: 'string'},
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
              message: { type: 'string', example: 'Nenhum Cliente/Fornecedor encontrado!' }
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

    const testIdClientSupplier = validator.integerValidator(id);

    if (testIdClientSupplier !== true) {
      errors.push(testIdClientSupplier);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const retorno = clientSupplierModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Cliente/Fornecedor não encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  search(req, res) {
    /*
      #swagger.tags = ['Cliente/Fornecedor']
      #swagger.summary = 'Pesquisa Cliente/Fornecedor [parametro]'
      #swagger.description = 'Retorna os Cliente/Fornecedor localizados com o parametro enviado'
    
      #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT do usuário logado',
        required: true,
        type: 'string'
      }
    
      #swagger.responses[200] = {
        description: 'Retorna os Clientes/Fornecedores localizados com o parametro enviado',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  IdClientSupplier: { type: 'integer' },
                  ClientSupplierName: { type: 'string'},
                  Cpf: { type: 'string'},
                  Cnpj: { type: 'string'},
                  ZipCode: { type: 'string'},
                  Address: { type: 'string'},
                  Number: { type: 'string'},
                  Complement: { type: 'string'},
                  Neighborhood: { type: 'string'},
                  City: { type: 'string'},
                  State: { type: 'string'},
                  Phone: { type: 'string'},
                  Email: { type: 'string'},
                  IsClient: { type: 'boolean'},
                  IsSupplier: { type: 'boolean'},
                  TypeKey: { type: 'string'},
                  PixKey: { type: 'string'},
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
                message: { type: 'string', example: 'Nenhum Cliente/Fornecedor encontrado!' }
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

    const retorno = clientSupplierModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhum Cliente/Fornecedor encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(500).json(error.message));
  }

  async create(req, res) {
    /*
       #swagger.tags = ['Cliente/Fornecedor']
       #swagger.summary = 'Criar Cliente/Fornecedor'
       #swagger.description = 'Cria o Cliente/Fornecedor no banco de dados com o objeto que veio no body'
    
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
                zipcode: { type: 'string'},
                address: { type: 'string'},
                neighborhood: { type: 'string'},
                number: { type: 'string'},
                complement: { type: 'string'},
                city: { type: 'string'},
                state: { type: 'string'},
                phone: { type: 'string'},
                email:  { type: 'string'},
                cpf: { type: 'string'},
                cnpj: { type: 'string'},
                cpfcnpj:{ type: 'string'},
                isclient: { type: 'boolean'},
                issupplier: { type: 'boolean'},
                isclientsupplier: { type: 'boolean'},
                typekey: { type: 'string'},
                pixkey: { type: 'string'}
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
                message: { type: 'string', example: 'Cliente/Fornecedor criado com sucesso!' }
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

    const testName = validator.allValidator(reqBody.name, 2, 80);
    const testZipCode = validator.zipCodeValidator(reqBody.zipcode);
    const testAddress = validator.allValidator(reqBody.address, 2, 100);
    const testNeighborhood = validator.allValidator(reqBody.neighborhood, 2, 60);
    const testCity = validator.allValidator(reqBody.city, 2, 40);
    const testState = validator.allValidator(reqBody.state, 2, 2);
    const testPhone = validator.phoneValidator(reqBody.phone);
    const testEmail = validator.emailValidator(reqBody.email);

    if (reqBody.complement.length > 0) {
      const testComplement = validator.allValidator(reqBody.complement, 1, 100)
      if (testComplement !== true) {
        errors.push('Complemento permite o campo maxímo de 100 caracteres.');
      }
    }
    if (reqBody.isclient === true && reqBody.issupplier === false) {
      if (reqBody.cpf.length === 11) {
        const testCpf = validator.cpfValidator(reqBody.cpf)
        if (testCpf !== true) {
          errors.push('Formato do CPF inválido.');
        }
      } else {
        errors.push('Digite 11 números para o CPF.');
      }
    }
    if (reqBody.issupplier === true && reqBody.isclient === false) {
      if (reqBody.cnpj.length === 14) {
        const testCnpj = validator.cnpjValidator(reqBody.cnpj)
        if (testCnpj !== true) {
          errors.push(testCnpj);
        }
      } else {
        errors.push('Digite 14 números para o CNPJ.');
      }
    }
    if (reqBody.isclientsupplier === true) {
      if (reqBody.cpf.length === 11) {
        const testCpf = validator.cpfValidator(reqBody.cpf)
        if (testCpf !== true) {
          errors.push('Formato do CPF inválido.');
        }
      }
      if (reqBody.cnpj.length === 14) {
        const testCnpj = validator.cnpjValidator(reqBody.cnpj)
        if (testCnpj !== true) {
          errors.push(testCnpj);
        }
      }
      if (reqBody.cpfcnpj.length !== 14 && reqBody.cpfcnpj.length !== 11) {
        errors.push('Digite 14 números para o CNPJ e 11 números para CPF.');
      }
    }


    if (reqBody.typekey === 'Telefone') {
      const testTypeKey = validator.phoneValidator(reqBody.pixkey)
      if (testTypeKey !== true) {
        errors.push('Formato errado para o telefone da Chave PIX');
      }
    }
    if (reqBody.typekey === 'Email') {
      const testTypeKey = validator.emailValidator(reqBody.pixkey)
      if (testTypeKey !== true) {
        errors.push('Formato errado para o e-mail da Chave PIX');
      }
    }
    if (reqBody.typekey === 'CPF/CNPJ') {
      if (reqBody.typekey.length === 11) {
        const testTypeKey = validator.cpfValidator(reqBody.pixkey)
        if (testTypeKey !== true) {
          errors.push('Formato errado para o CPF da Chave PIX');
        }
      }
      if (reqBody.typekey.length === 14) {
        const testTypeKey = validator.cnpjValidator(reqBody.pixkey)
        if (testTypeKey !== true) {
          errors.push('Formato errado para o CNPJ da Chave PIX');
        }
      }
    }

    if (testName !== true) {
      errors.push('Digite no mínimo 2 caracteres para o nome.');
    }
    if (testZipCode !== true) {
      errors.push('Digite no mínimo 8 números para o CEP.');
    }
    if (testAddress !== true) {
      errors.push('Digite no mínimo 2 caracteres para o endereço.');
    }
    if (testNeighborhood !== true) {
      errors.push('Digite no mínimo 2 caracteres para o bairro.');
    }
    if (testCity !== true) {
      errors.push('Digite no mínimo 2 caracteres para o cidade.');
    }
    if (testState !== true) {
      errors.push('Digite 2 caracteres para o estado(Ex: MG, RJ...).');
    }
    if (testPhone !== true) {
      errors.push('Digite no mínimo 11 números para o telefone(Ex: 32 12345 1234');
    }
    if (testEmail !== true) {
      errors.push('Digite um formato válido para o e-mail(Ex: exemplo@exemplo.com).');
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    //valida se o cliente já existe
    const { cpfExists, cnpjExists } = await clientSupplierModel.checkUserExists(reqBody.cpf, reqBody.cnpj);

    if (cpfExists) {
      return res.status(400).json({ errors: 'CNPJ de usuário já cadastrado!' });
    }
    if (cnpjExists) {
      return res.status(400).json({ errors: 'Cpf já cadastrado!' });
    }

    //cria o objeto para inserir no banco
    let client = {
      ClientSupplierName: reqBody.name, ZipCode: reqBody.zipcode, Address: reqBody.address, Number: reqBody.number,
      Complement: reqBody.complement, Neighborhood: reqBody.neighborhood, City: reqBody.city, State: reqBody.state, Phone: reqBody.phone,
      Email: reqBody.email, TypeKey: reqBody.typekey, PixKey: reqBody.pixkey
    };

    if (reqBody.isclient === true && reqBody.issupplier === false) {
      client.IsClient = reqBody.isclient;
      client.Cpf = reqBody.cpf
    }

    if (reqBody.issupplier === true && reqBody.isclient === false) {
      client.IsSupplier = reqBody.issupplier;
      client.Cnpj = reqBody.cnpj
    }

    if (reqBody.issupplier === true && reqBody.isclient === true) {
      client.IsSupplier = reqBody.issupplier;
      client.IsClient = reqBody.isclient;
      if (reqBody.cnpj.length === 14) {
        client.Cnpj = reqBody.cnpj
      }
      if (reqBody.cpf.length === 11) {
        client.Cpf = reqBody.cpf
      }
    }

    const retorno = clientSupplierModel.create(client);
    return retorno
      .then((result) =>
        res.status(201).send("Cliente/Fornecedor criado com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));
  }

  async update(req, res) {
    /*
       #swagger.tags = ['Cliente/Fornecedor']
       #swagger.summary = 'Atualizar Cliente/Fornecedor'
       #swagger.description = 'Atualiza o Cliente/Fornecedor [id] no banco de dados com o objeto que veio no body'
    
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
                zipcode: { type: 'string'},
                address: { type: 'string'},
                neighborhood: { type: 'string'},
                number: { type: 'string'},
                complement: { type: 'string'},
                city: { type: 'string'},
                state: { type: 'string'},
                phone: { type: 'string'},
                email:  { type: 'string'},
                cpf: { type: 'string'},
                cnpj: { type: 'string'},
                cpfcnpj:{ type: 'string'},
                isclient: { type: 'boolean'},
                issupplier: { type: 'boolean'},
                isclientsupplier: { type: 'boolean'},
                typekey: { type: 'string'},
                pixkey: { type: 'string'},
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
                message: { type: 'string', example: 'Cliente/Fornecedor atualizado com sucesso!' }
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

    const testName = validator.allValidator(reqBody.name, 2, 80);
    const testZipCode = validator.zipCodeValidator(reqBody.zipcode);
    const testAddress = validator.allValidator(reqBody.address, 2, 100);
    const testNeighborhood = validator.allValidator(reqBody.neighborhood, 2, 60);
    const testCity = validator.allValidator(reqBody.city, 2, 40);
    const testState = validator.allValidator(reqBody.state, 2, 2);
    const testPhone = validator.phoneValidator(reqBody.phone);
    const testEmail = validator.emailValidator(reqBody.email);

    if (reqBody.complement !== null) {
      const testComplement = validator.allValidator(reqBody.complement, 1, 100)
      if (testComplement !== true) {
        errors.push('Complemento permite o campo maxímo de 100 caracteres.');
      }
    }
    if (reqBody.isclient === true && reqBody.issupplier === false) {
      if (reqBody.cpf.length === 11) {
        const testCpf = validator.cpfValidator(reqBody.cpf)
        if (testCpf !== true) {
          errors.push('Formato do CPF inválido.');
        }
      } else {
        errors.push('Digite 11 números para o CPF.');
      }
    }
    if (reqBody.issupplier === true && reqBody.isclient === false) {
      if (reqBody.cnpj.length === 14) {
        const testCnpj = validator.cnpjValidator(reqBody.cnpj)
        if (testCnpj !== true) {
          errors.push(testCnpj);
        }
      } else {
        errors.push('Digite 14 números para o CNPJ.');
      }
    }
    if (reqBody.isclientsupplier === true) {
      if (reqBody.cpf.length === 11) {
        const testCpf = validator.cpfValidator(reqBody.cpf)
        if (testCpf !== true) {
          errors.push('Formato do CPF inválido.');
        }
      }
      if (reqBody.cnpj.length === 14) {
        const testCnpj = validator.cnpjValidator(reqBody.cnpj)
        if (testCnpj !== true) {
          errors.push(testCnpj);
        }
      }
      if (reqBody.cpfcnpj.length !== 14 && reqBody.cpfcnpj.length !== 11) {
        errors.push('Digite 14 números para o CNPJ e 11 números para CPF.');
      }
    }


    if (reqBody.typekey === 'Telefone') {
      const testTypeKey = validator.phoneValidator(reqBody.pixkey)
      if (testTypeKey !== true) {
        errors.push('Formato errado para o telefone da Chave PIX');
      }
    }
    if (reqBody.typekey === 'Email') {
      const testTypeKey = validator.emailValidator(reqBody.pixkey)
      if (testTypeKey !== true) {
        errors.push('Formato errado para o e-mail da Chave PIX');
      }
    }
    if (reqBody.typekey === 'CPF/CNPJ') {
      if (reqBody.typekey.length === 11) {
        const testTypeKey = validator.cpfValidator(reqBody.pixkey)
        if (testTypeKey !== true) {
          errors.push('Formato errado para o CPF da Chave PIX');
        }
      }
      if (reqBody.typekey.length === 14) {
        const testTypeKey = validator.cnpjValidator(reqBody.pixkey)
        if (testTypeKey !== true) {
          errors.push('Formato errado para o CNPJ da Chave PIX');
        }
      }
    }

    if (testName !== true) {
      errors.push('Digite no mínimo 2 caracteres para o nome.');
    }
    if (testZipCode !== true) {
      errors.push('Digite no mínimo 8 números para o CEP.');
    }
    if (testAddress !== true) {
      errors.push('Digite no mínimo 2 caracteres para o endereço.');
    }
    if (testNeighborhood !== true) {
      errors.push('Digite no mínimo 2 caracteres para o bairro.');
    }
    if (testCity !== true) {
      errors.push('Digite no mínimo 2 caracteres para o cidade.');
    }
    if (testState !== true) {
      errors.push('Digite 2 caracteres para o estado(Ex: MG, RJ...).');
    }
    if (testPhone !== true) {
      errors.push('Digite no mínimo 11 números para o telefone(Ex: 32 12345 1234');
    }
    if (testEmail !== true) {
      errors.push('Digite um formato válido para o e-mail(Ex: exemplo@exemplo.com).');
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    //cria o objeto para inserir no banco
    let client = {
      ClientSupplierName: reqBody.name, ZipCode: reqBody.zipcode, Address: reqBody.address, Number: reqBody.number,
      Complement: reqBody.complement, Neighborhood: reqBody.neighborhood, City: reqBody.city, State: reqBody.state, Phone: reqBody.phone,
      Email: reqBody.email, TypeKey: reqBody.typekey, PixKey: reqBody.pixkey, Active: reqBody.active
    };

    if (reqBody.isclient === true && reqBody.issupplier === false) {
      client.IsClient = reqBody.isclient;
      client.Cpf = reqBody.cpf
    }

    if (reqBody.issupplier === true && reqBody.isclient === false) {
      client.IsSupplier = reqBody.issupplier;
      client.Cnpj = reqBody.cnpj
    }

    if (reqBody.issupplier === true && reqBody.isclient === true) {
      client.IsSupplier = reqBody.issupplier;
      client.IsClient = reqBody.isclient;
      if (reqBody.cnpj.length === 14) {
        client.Cnpj = reqBody.cnpj
      }
      if (reqBody.cpf.length === 11) {
        client.Cpf = reqBody.cpf
      }
    }

    const retorno = clientSupplierModel.update(client, id);
    return retorno
      .then((result) =>
        res.status(200).send("Cliente/Fornecedor atualizado com sucesso!")
      )
      .catch((error) => res.status(500).json(error.message));

  }

}

module.exports = new ClientSupplierController();
