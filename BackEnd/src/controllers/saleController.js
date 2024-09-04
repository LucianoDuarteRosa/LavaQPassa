
const validator = require("../../utils/inputsValidator");
const converter = require("../../utils/converter");
const saleModel = require("../models/saleModel");
const saleDetailModel = require("../models/saleDetailModel");
const productModel = require("../models/productModel");
const receivableModel = require("../models/accountsReceivableModel");
const payableModel = require("../models/accountsPayableModel");



class SaleController {

  readList(req, res) {
    const retorno = saleModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhuma venda encontrada!")
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

    const retorno = saleModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Venda não encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  search(req, res) {
    const { id } = req.params;

    const retorno = saleModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0
          ? res.status(404).send("Nenhuma venda encontrada!")
          : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  async create(req, res) {
    const reqBody = req.body;
    const errors = [];

    let testIdClientSupplier = true;
    const idClientValue = String(reqBody.idclient).trim();
    if (idClientValue !== "") {
      testIdClientSupplier = validator.integerValidator(reqBody.idclient);
    } else {
      reqBody.idclient = 1;
    }
    const testIdUser = validator.integerValidator(reqBody.userId);
    const testSaleDate = validator.dateValidator(reqBody.saledate);

    if (!reqBody.paymentcondition === 'Dinheiro' && !reqBody.paymentcondition === 'Cartão Crédito' && !reqBody.paymentcondition === 'Cartão Débito' && !reqBody.paymentcondition === 'Cheque' && !reqBody.paymentcondition === 'Crediário') {
      errors.push("Condição de pagamento inexistente.");
    }

    if (testIdClientSupplier !== true) {
      errors.push(testIdClientSupplier);
    }
    if (testIdUser !== true) {
      errors.push(testIdUser);
    }
    if (testSaleDate !== true) {
      errors.push(testSaleDate);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    let costPrice = 0;
    let salePrice = 0;

    for (let i = 0; i < reqBody.products.length; i++) {
      costPrice += reqBody.products[i].CostPrice;
      salePrice += reqBody.products[i].SalePrice;
    }

    const sale = {
      CostPrice: costPrice,
      SalePrice: salePrice,
      IdClientSupplier: reqBody.idclient,
      IdUser: reqBody.userId,
      IdStore: reqBody.idstore,
      SaleDate: reqBody.saledate,
      PaymentCondition: reqBody.paymentcondition
    };

    try {
      const result = await saleModel.create(sale);
      const idSale = result.insertId;

      const saleDetailsPromises = reqBody.products.map(product => {
        const testProduct = validator.integerValidator(product.IdProduct);
        if (testProduct !== true) {
          errors.push("Erro ao adicionar produtos à venda.");
        }

        if (errors.length > 0) {
          return Promise.reject({ errors });
        }

        const saleDetail = { IdSale: idSale, IdProduct: product.IdProduct };
        return saleDetailModel.create(saleDetail);
      });

      const updateProductPromises = reqBody.products.map(product => {
        const productSold = { IdProduct: product.IdProduct, Sold: true };
        return productModel.updateSold(productSold);
      });


      const createReceivablePromises = sale => {
        if (sale.PaymentCondition === 'Cheque' || sale.PaymentCondition === 'Crediário') {
          let receivable = {
            Amount: sale.SalePrice, IdSale: idSale, IdClientSupplier: sale.IdClientSupplier, IdStore: sale.IdStore, RegistrationDate: sale.SaleDate
          };
          receivable.DueDate = converter.addDaysToMySQLDate(sale.SaleDate, 30);
          return receivableModel.create(receivable);
        } else {
          return Promise.resolve();
        }
      };

      const createPayablePromises = reqBody.products.map(product => {
        let payable = {
          Amount: product.CostPrice, IdSale: idSale, IdClientSupplier: product.IdClientSupplier, IdStore: sale.IdStore, RegistrationDate: sale.SaleDate, DueDate: converter.nextMonthTenth(sale.SaleDate)
        };
        return payableModel.create(payable);
      });

      await Promise.all([...saleDetailsPromises, ...updateProductPromises, ...createPayablePromises, createReceivablePromises(sale)]);

      res.status(201).send("Venda criada com sucesso!");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  
  async update(req, res) {
    const { id } = req.params;
    const reqBody = req.body;
    const errors = [];

    const testId = validator.integerValidator(reqBody.IdSale);
    let testStatus = true;
    if (reqBody.salestatus !== null) {
      if (!reqBody.salestatus === 'Dinheiro' && !reqBody.salestatus === 'Cartão Crédito' && !reqBody.salestatus === 'Cartão Débito' && !reqBody.salestatus === 'Cheque' && !reqBody.salestatus === 'Crediário') {
        testStatus = false;
        errors.push("Condição de pagamento inexistente.");
      }
    } else {
      errors.push("Selecione um status para a venda.")
    }

    if (testId !== true) {
      errors.push(testId);
    }
    if (testStatus !== true) {
      errors.push(testStatus);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updateSale = { IdSale: reqBody.IdSale, SaleStatus: reqBody.SaleStatus, PaymentCondition: reqBody.PaymentCondition };

    if (updateSale.SaleStatus == 'Cancelada') {
      try {

        const retorno = await saleModel.updateCancel(updateSale);

        const saleDetail = await saleDetailModel.read(updateSale.IdSale);

        const updateProductPromises = saleDetail.map(product => {
          const productSold = { IdProduct: product.IdProduct, Sold: false };
          return productModel.updateSold(productSold);
        });

        const updateReceivablePromises = updateSale => {
          if (updateSale.PaymentCondition === 'Cheque' || updateSale.PaymentCondition === 'Crediário') {  
            const receivable ={IdSale: updateSale.IdSale, Active: false, Note: `Inativado pelo cancelamento da venda n°${updateSale.IdSale}.`}
            return receivableModel.updateActive(receivable);
          } else {
            return Promise.resolve();
          }
        };

        const payables = await payableModel.readSale(updateSale.IdSale);

        const updatePayablePromises = payables.map(payable => {
          const updatePayable ={IdAccountPayable: payable.IdAccountPayable, Active: false, Note: `Inativado pelo cancelamento da venda n°${updateSale.IdSale}.`}
          return payableModel.updateActive(updatePayable);
        });

        await Promise.all([...updateProductPromises, ...updatePayablePromises, updateReceivablePromises(updateSale)]);

        res.status(201).send("Venda atualizada com sucesso!");
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }

    if (updateSale.SaleStatus == 'Finalizada') {
      try {

        const retorno = await saleModel.updateCancel(updateSale);

        const saleDetail = await saleDetailModel.read(updateSale.IdSale);

        const updateProductPromises = saleDetail.map(product => {
          const productSold = { IdProduct: product.IdProduct, Sold: true };
          return productModel.updateSold(productSold);
        });

        const updateReceivablePromises = updateSale => {
          if (updateSale.PaymentCondition === 'Cheque' || updateSale.PaymentCondition === 'Crediário') {  
            const receivable ={IdSale: updateSale.IdSale, Active: true, Note: ``}
            return receivableModel.updateActive(receivable);
          } else {
            return Promise.resolve();
          }
        };

        const payables = await payableModel.readSale(updateSale.IdSale);

        const updatePayablePromises = payables.map(payable => {
          const updatePayable ={IdAccountPayable: payable.IdAccountPayable, Active: true, Note: ``}
          return payableModel.updateActive(updatePayable);
        });

        await Promise.all([...updateProductPromises, ...updatePayablePromises, updateReceivablePromises(updateSale)]);

        res.status(201).send("Venda atualizada com sucesso!");
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  }

}

module.exports = new SaleController();
