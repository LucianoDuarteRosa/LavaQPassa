
const dbConnection = require("../../db/dbConnection");

class SaleModel {

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
        Sale.IdSale, 
        Sale.CostPrice, 
        Sale.SalePrice, 
        Sale.IdClientSupplier, 
        ClientSupplier.ClientSupplierName, 
        Sale.IdUser, 
        User.UserName,  
        Sale.SaleDate, 
        Sale.PaymentCondition, 
        Sale.SaleStatus,
        Store.StoreName
      FROM Sale
      JOIN ClientSupplier ON Sale.IdClientSupplier = ClientSupplier.IdClientSupplier 
      JOIN User ON Sale.IdUser = User.IdUser
      JOIN Store ON Sale.IdStore = Store.IdStore`;
    return this.executeSQL(sql);
  }


  read(id) {
    const sql = `SELECT 
        Sale.IdSale, 
        Sale.CostPrice, 
        Sale.SalePrice, 
        Sale.IdClientSupplier, 
        Sale.IdStore, 
        ClientSupplier.ClientSupplierName, 
        Sale.IdUser, 
        User.UserName,  
        Sale.SaleDate, 
        Sale.PaymentCondition, 
        Sale.SaleStatus,
        Store.StoreName
      FROM Sale
      JOIN ClientSupplier ON Sale.IdClientSupplier = ClientSupplier.IdClientSupplier 
      JOIN User ON Sale.IdUser = User.IdUser 
      JOIN Store ON Sale.IdStore = Store.IdStore
      WHERE Sale.IdSale = ?`;
    return this.executeSQL(sql, id);
  }

  search(parametro) {
    const sql = `
      SELECT 
        Sale.IdSale, 
        Sale.CostPrice, 
        Sale.SalePrice, 
        ClientSupplier.ClientSupplierName, 
        Sale.IdClientSupplier, 
        Sale.PaymentCondition, 
        Sale.SaleDate, 
        Sale.SaleStatus,
        User.UserName,
        Store.StoreName
      FROM Sale
      JOIN ClientSupplier ON Sale.IdClientSupplier = ClientSupplier.IdClientSupplier
      JOIN User ON Sale.IdUser = User.IdUser
      JOIN Store ON Sale.IdStore = Store.IdStore
      WHERE Sale.IdSale = ? 
        OR Sale.SalePrice LIKE ? 
        OR ClientSupplier.ClientSupplierName LIKE ? 
        OR Sale.SaleStatus LIKE ? 
        OR Sale.PaymentCondition LIKE ? 
        OR Store.StoreName LIKE ? 
        OR User.UserName LIKE ?`;

    const values = [
      parametro,
      `%${parametro}%`,
      `%${parametro}%`,
      `%${parametro}%`,
      `%${parametro}%`,
      `%${parametro}%`,
      `%${parametro}%`,
      `%${parametro}%`
    ];

    return this.executeSQL(sql, values);
  }

  create(newSale) {
    const sql = "INSERT INTO Sale SET ?";
    return this.executeSQL(sql, newSale);
  }

  update(updateSale, id) {
    const sql = "UPDATE Sale SET ? WHERE IdSale = ?";
    return this.executeSQL(sql, [updateSale, id]);
  }

  updateCancel(updateSale) {
    const sql = "UPDATE Sale SET SaleStatus = ? WHERE IdSale = ?";
    return this.executeSQL(sql, [updateSale.SaleStatus, updateSale.IdSale]);
  }

  saleYear() {
    const sql = `
        SELECT 
            DATE_FORMAT(SaleDate, '%Y-%m') as saleMonth,
            SUM(SalePrice) as totalSales  
        FROM Sale
        WHERE SaleDate >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY saleMonth
        ORDER BY saleMonth;
    `;
    return this.executeSQL(sql);
  }

}

module.exports = new SaleModel();
