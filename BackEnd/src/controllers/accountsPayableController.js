const accountsPayableModel = require("../models/accountsPayableModel");
const validator = require('../../utils/inputsValidator');
const converter = require("../../utils/converter");

class AccountsPayableController {

  readList(req, res) {
    const retorno = accountsPayableModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhuma contas a pagar encontrada!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }


  read(req, res) {
    const { id } = req.params;
    const errors = [];

    const testId = validator.integerValidator(id);

    if (testId !== true) {
      errors.push(testId);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const retorno = accountsPayableModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Conta a pagar não encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  search(req, res) {
    const { id } = req.params;

    const retorno = accountsPayableModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhuma contas a pagar encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  create(req, res) {
    const reqBody = req.body;
    const errors = [];

    const testAmount = validator.floatValidator(reqBody.amount);
    const testIdStore = validator.integerValidator(reqBody.idstore)
    let testIdSale = true;
    const idSaleValue = String(reqBody.idsale).trim();
    if (idSaleValue !== "") {
      testIdSale = validator.integerValidator(idSaleValue);
    } else {
      reqBody.idsale = null;
    }
    const testIdClientSupplier = validator.integerValidator(reqBody.idclient);
    const testDueDate = validator.dateValidator(reqBody.duedate);
    let registrationdate = converter.toMySQLDate();

    if (testAmount !== true) {
      errors.push(testAmount);
    }
    if (testIdStore !== true) {
      errors.push(testIdStore);
    }
    if (testIdSale !== true) {
      errors.push(testIdSale);
    }
    if (testIdClientSupplier !== true) {
      errors.push(testIdClientSupplier);
    }
    if (testDueDate !== true) {
      errors.push(testDueDate);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const payable = { Amount: reqBody.amount, IdSale: reqBody.idsale, IdClientSupplier: reqBody.idclient, IdStore: reqBody.idstore, RegistrationDate: registrationdate, DueDate: reqBody.duedate, Note: reqBody.note }

    const retorno = accountsPayableModel.create(payable);
    return retorno
      .then((result) =>
        res.status(201).send("Conta a pagar criado com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));
  }

  update(req, res) {
    const { id } = req.params;
    const reqBody = req.body;
    const errors = [];

    const testAmount = validator.floatValidator(reqBody.amount);
    const testIdStore = validator.integerValidator(reqBody.idstore)
    let testIdSale = true;
    const idSaleValue = String(reqBody.idsale).trim();
    if (idSaleValue !== "") {
      testIdSale = validator.integerValidator(idSaleValue);
    } else {
      reqBody.idsale = null;
    }
    const testIdClientSupplier = validator.integerValidator(reqBody.idclient);
    const testRegistrationDate = validator.dateValidator(reqBody.registrationdate);
    const testDueDate = validator.dateValidator(reqBody.duedate);
    let registrationdate = converter.toMySQLDate(reqBody.registrationdate);

    if (testAmount !== true) {
      errors.push(testAmount);
    }
    if (testIdStore !== true) {
      errors.push(testIdStore);
    }
    if (testIdSale !== true) {
      errors.push(testIdSale);
    }
    if (testIdClientSupplier !== true) {
      errors.push(testIdClientSupplier);
    }
    if (testRegistrationDate !== true) {
      errors.push(testRegistrationDate);
    }
    if (testDueDate !== true) {
      errors.push(testDueDate);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const payable = { Amount: reqBody.amount, IdSale: reqBody.idsale, IdClientSupplier: reqBody.idclient, IdStore: reqBody.idstore, RegistrationDate: registrationdate, DueDate: reqBody.duedate, Note: reqBody.note, Active: reqBody.active, Paid: reqBody.paid }

    const retorno = accountsPayableModel.update(payable, id);
    return retorno
      .then((result) =>
        res.status(200).send("Conta a pagar atualizada com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));

  }

}

module.exports = new AccountsPayableController();
