const clientSupplierModel = require('../models/clientSupplierModel')
const validator = require('../../utils/inputsValidator')


class ClientSupplierController {

  readList(req, res) {

    const retorno = clientSupplierModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhuma Cliente/Fornecedor encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }


  read(req, res) {
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
      .catch((error) => res.status(400).json(error.message));
  }

  search(req, res) {
    const { id } = req.params;

    const retorno = clientSupplierModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhum Cliente/Fornecedor encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  async create(req, res) {
    const reqBody = req.body;

    //valições de campos de entrada
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
      .catch((error) => res.status(400).json(error.message));
  }

  async update(req, res) {
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
      .catch((error) => res.status(400).json(error.message));

  }

}

module.exports = new ClientSupplierController();
