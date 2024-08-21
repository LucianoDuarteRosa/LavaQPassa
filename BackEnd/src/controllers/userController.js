
const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const tokenModel = require('../models/tokenModel');
const validator = require('../../utils/inputsValidator');


class UserController {

  readList(req, res) {
    const retorno = userModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum usuário encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }


  read(req, res) {
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
      .catch((error) => res.status(400).json(error.message));
  }

  search(req, res) {

    const { id } = req.params;

    const retorno = userModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhum usuário encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  async create(req, res) {
    const { name, email, password, profile } = req.body;
    const errors = [];

    // Validações
    const testName = validator.allValidator(name, 2, 15);
    const testEmail = validator.emailValidator(email);

    if (testName !== true) {
      errors.push(testName);
    }
    if (testEmail !== true) {
      errors.push(testEmail); // Corrigido para adicionar erro ao array
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
      console.error('Error creating user:', error); // Adicionado para melhor depuração
      res.status(500).json({ error: error.message });
    }
  }

  update(req, res) {
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
        const tokenCreate = { IdUser: user[0].IdUser, Token: token, ExpiresToken: expiresAt }
        tokenModel.create(tokenCreate);

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
