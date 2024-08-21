
const productModel = require("../models/productModel");
const validator = require("../../utils/inputsValidator");
const converter = require("../../utils/converter");

class ProductController {

  readList(req, res) {

    const retorno = productModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum produto encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  
  readListSale(req, res) {

    const retorno = productModel.readListSale();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum produto encontrado!")
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

    const retorno = productModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Produto não encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  search(req, res) {
    const { id } = req.params;

    const retorno = productModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhum produto encontrado!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  create(req, res) {
    const reqBody = req.body;

    const errors = [];

    const testUserId = validator.integerValidator(reqBody.userId);
    const testProductName = validator.allValidator(reqBody.name, 2, 50);
    const testCostPrice = validator.floatValidator(reqBody.costprice);
    const testSalePrice = validator.floatValidator(reqBody.saleprice);
    const testIdClientSupplier = validator.integerValidator(reqBody.idclient);
    const testIdStore = validator.integerValidator(reqBody.idstore);
    const testIdSubGroup = validator.integerValidator(reqBody.idsubgroup);

    let registrationdate = converter.toMySQLDate();

    if (testUserId !== true) {
      errors.push(testUserId);
    }
    if (testProductName !== true) {
      errors.push(testProductName);
    }
    if (testCostPrice !== true) {
      errors.push(testCostPrice);
    }
    if (testSalePrice !== true) {
      errors.push(testSalePrice);
    }
    if (testIdClientSupplier !== true) {
      errors.push(testIdClientSupplier);
    }
    if (testIdStore !== true) {
      errors.push(testIdStore);
    }
    if (testIdSubGroup !== true) {
      errors.push(testIdSubGroup);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const product = {ProductName: reqBody.name, CostPrice: reqBody.costprice, SalePrice: reqBody.saleprice, IdClientSupplier: reqBody.idclient,
      IdSubGroup: reqBody.idsubgroup, IdStore: reqBody.idstore, IdUser: reqBody.userId, RegistrationDate: registrationdate}

    const retorno = productModel.create(product);
    return retorno
      .then((result) =>
        res.status(201).send("Produto criado com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));
  }

  update(req, res) {
    const { id } = req.params;
    const reqBody = req.body;

    const errors = [];

    const testUserId = validator.integerValidator(reqBody.userId);
    const testProductName = validator.allValidator(reqBody.name, 2, 50);
    const testCostPrice = validator.floatValidator(reqBody.costprice);
    const testSalePrice = validator.floatValidator(reqBody.saleprice);
    const testIdClientSupplier = validator.integerValidator(reqBody.idclient);
    const testIdStore = validator.integerValidator(reqBody.idstore);
    const testIdSubGroup = validator.integerValidator(reqBody.idsubgroup);
    const testIdUser = validator.integerValidator(reqBody.iduser);
    const testActive = validator.booleanValidator(reqBody.active);
    const registrationDate = converter.convertToMySQLDateTimeFormat(reqBody.registrationdate);

    if (testUserId !== true) {
      errors.push(testUserId);
    }
    if (testProductName !== true) {
      errors.push(testProductName);
    }
    if (testCostPrice !== true) {
      errors.push(testCostPrice);
    }
    if (testSalePrice !== true) {
      errors.push(testSalePrice);
    }
    if (testIdClientSupplier !== true) {
      errors.push(testIdClientSupplier);
    }
    if (testIdStore !== true) {
      errors.push(testIdStore);
    }
    if (testIdSubGroup !== true) {
      errors.push(testIdSubGroup);
    }
    if (testIdUser !== true) {
      errors.push(testIdUser);
    }
    if (testActive !== true) {
      errors.push(testActive);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const product = {ProductName: reqBody.name, CostPrice: reqBody.costprice, SalePrice: reqBody.saleprice, IdClientSupplier: reqBody.idclient,
      IdSubGroup: reqBody.idsubgroup, IdStore: reqBody.idstore, IdUser: reqBody.iduser, RegistrationDate: registrationDate, Active: reqBody.active}

    const retorno = productModel.update(product, id);
    return retorno
      .then((result) =>
        res.status(200).send("Produto atualizado com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));

  }

}

module.exports = new ProductController();
