const imageModel = require("../models/imageModel");
const validator = require("../../utils/inputsValidator")


class ImageController {

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

    const retorno = imageModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Imagem não encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  create(req, res) {
    const reqBody = req.body;
    const errors = [];

    const testIdProduct = validator.integerValidator(reqBody.idProduct);

    if (testIdProduct !== true) {
      errors.push(testIdProduct);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const retorno = imageModel.create(reqBody);
    return retorno
      .then((result) =>
        res.status(201).send("Imagem criada com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));
  }

  update(req, res) {
    const { id } = req.params;
    const reqBody = req.body;
    const errors = [];

    const testIdImage = validator.integerValidator(reqBody.idImage);
    const testIdProduct = validator.integerValidator(reqBody.idProduct);

    if (testIdImage !== true) {
      errors.push(testIdImage);
    }
    if (testIdProduct !== true) {
      errors.push(testIdProduct);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const retorno = imageModel.update(reqBody, id);
    return retorno
      .then((result) =>
        res.status(200).send("Imagem atualizada com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));

  }

  delete(req, res) {
    const { id } = req.params;
    const retorno = imageModel.delete(id);
    return retorno
      .then((result) =>
        res.status(200).send("Imagem deletada com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));
  }

}

module.exports = new ImageController();
