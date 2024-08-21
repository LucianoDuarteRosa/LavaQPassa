const subGroupModel = require("../models/subGroupModel");
const validator = require("../../utils/inputsValidator")

class SubGroupController {

  readList(req, res) {

    const retorno = subGroupModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum Sub-Grupo encontrado!")
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

    const retorno = subGroupModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Sub-Grupo não encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  search(req, res) {
    const { id } = req.params;

    const retorno = subGroupModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhum Sub-Grupo encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  create(req, res) {
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
      .catch((error) => res.status(400).json(error.message));
  }

  update(req, res) {
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

    const subGroup ={SubGroupName: reqBody.name, Active: reqBody.active , IdGroup: reqBody.idgroup};

    const retorno = subGroupModel.update(subGroup, id);
    return retorno
      .then((result) =>
        res.status(200).send("Sub-Grupo atualizado com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));

  }

}

module.exports = new SubGroupController();
