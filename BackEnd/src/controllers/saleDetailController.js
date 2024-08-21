const saleDetailModel = require("../models/saleDetailModel");
const validator = require("../../utils/inputsValidator")

class SaleDetailController {
 
  readList(req, res) {
   
    const retorno = saleDetailModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhuma venda detalhada encontrada!")
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
    
    const retorno = saleDetailModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0 
        ? res.status(404).send("Venda detalhada não encontrada!") 
        : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  create(req, res) {
    const reqBody = req.body; 
    const errors = [];

    const testIdSale = validator.integerValidator(reqBody.idSale);
    const testIdProduct = validator.integerValidator(reqBody.idProduct);

    if (testIdSale !== true) {
      errors.push(testIdSale);
    }
    if (testIdProduct !== true) {
      errors.push(testIdProduct);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const retorno = saleDetailModel.create(reqBody);
    return retorno
      .then((result) =>
        res.status(201).send("Venda detalhada criada com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));
  }

  update(req, res) {
    const { id } = req.params;
    const reqBody = req.body;
    const errors = [];

    const testIdSaleDetail = validator.integerValidator(reqBody.idSaleDetail);
    const testIdSale = validator.integerValidator(reqBody.idSale);
    const testIdProduct = validator.integerValidator(reqBody.idProduct);

    if (testIdSaleDetail !== true) {
      errors.push(testIdSaleDetail);
    }
    if (testIdSale !== true) {
      errors.push(testIdSale);
    }
    if (testIdProduct !== true) {
      errors.push(testIdProduct);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
      
    const retorno = saleDetailModel.update(reqBody, id);
    return retorno
      .then((result) =>
        res.status(200).send("Venda detalhada atualizada com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));

  }

}

module.exports = new SaleDetailController();
