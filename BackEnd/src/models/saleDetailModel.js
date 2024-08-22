
const dbConnection = require("../../db/dbConnection");

class SaleDetailModel {

  executeSQL(sql, parametros = "") {

    return new Promise(function (resolve, reject) {


      dbConnection.query(sql, parametros, function (error, resposta) {

        if (error) {
          return reject(error);
        }

        return resolve(resposta);
      });

    }
    );
  }

  readList() {
    const sql = `SELECT 
        SaleDetail.IdSaleDetail, 
        SaleDetail.IdSale, 
        SaleDetail.IdProduct, 
        Product.ProductName,
        Product.CostPrice,
        Product.SalePrice,
        Sale.PaymentCondition,
        Sale.SaleStatus,
        Sale.IdUser,
        User.UserName,
        Sale.IdClientSupplier,
        ClientSupplier.ClientSupplierName
      FROM SaleDetail
      JOIN Product ON SaleDetail.IdProduct = Product.IdProduct 
      JOIN Sale ON SaleDetail.IdSale = Sale.IdSale 
      JOIN User ON Sale.IdUser = User.IdUser 
      JOIN ClientSupplier ON Sale.IdClientSupplier = ClientSupplier.IdClientSupplier`;

    return this.executeSQL(sql);
  }


  read(id) {
    const sql = `SELECT 
        SaleDetail.IdSaleDetail, 
        SaleDetail.IdSale, 
        SaleDetail.IdProduct, 
        Product.ProductName,
        Product.CostPrice,
        Product.SalePrice,
        Sale.PaymentCondition,
        Sale.SaleStatus,
        Sale.IdUser,
        User.UserName,
        Sale.IdClientSupplier,
        ClientSupplier.ClientSupplierName
      FROM SaleDetail
      JOIN Product ON SaleDetail.IdProduct = Product.IdProduct 
      JOIN Sale ON SaleDetail.IdSale = Sale.IdSale 
      JOIN User ON Sale.IdUser = User.IdUser 
      JOIN ClientSupplier ON Sale.IdClientSupplier = ClientSupplier.IdClientSupplier
      WHERE SaleDetail.IdSale = ?`;
    return this.executeSQL(sql, id);
  }

  create(newSaleDetail) {
    const sql = "INSERT INTO SaleDetail SET ?";
    return this.executeSQL(sql, newSaleDetail);
  }

  update(updateSaleDetail, id) {
    const sql = "UPDATE SaleDetail SET ? WHERE IdSaleDetail = ?";
    return this.executeSQL(sql, [updateSaleDetail, id]);
  }

  saleGroup(date) {
    const sql = `SELECT 
          SaleDetail.IdSaleDetail, 
          SaleDetail.IdSale, 
          SaleDetail.IdProduct, 
          Product.ProductName,
          Product.IdSubGroup,
          SubGroup.IdGroup,
          ProductGroup.GroupName,
          Product.SalePrice
      FROM SaleDetail
      JOIN Product ON SaleDetail.IdProduct = Product.IdProduct 
      JOIN SubGroup ON Product.IdSubGroup = SubGroup.IdSubGroup
      JOIN ProductGroup ON SubGroup.IdGroup = ProductGroup.IdGroup
      JOIN Sale ON SaleDetail.IdSale = Sale.IdSale
      WHERE Sale.SaleDate BETWEEN ? AND ?
      ORDER BY ProductGroup.GroupName`;
    return this.executeSQL(sql, [date.firstDay, date.lastDay]);
  }

}

module.exports = new SaleDetailModel();
