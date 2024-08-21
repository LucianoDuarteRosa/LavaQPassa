const storeModel = require("../models/storeModel");
const validator = require('../../utils/inputsValidator');


class StoreController {

  readList(req, res) {

    const retorno = storeModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhuma loja encontrada!")
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

    const retorno = storeModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Loja não encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  search(req, res) {
    const { id } = req.params;

    const retorno = storeModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhuma loja encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  create(req, res) {
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
      .catch((error) => res.status(400).json(error.message));
  }

  update(req, res) {
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
      .catch((error) => res.status(400).json(error.message));

  }

}

module.exports = new StoreController();
