
const dbConnection = require("../../db/dbConnection");

class AccountsPayableModel {

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
        AccountsPayable.IdAccountPayable, 
        AccountsPayable.Amount, 
        AccountsPayable.IdClientSupplier,
        ClientSupplier.ClientSupplierName,
        AccountsPayable.RegistrationDate, 
        AccountsPayable.DueDate, 
        AccountsPayable.Note, 
        AccountsPayable.Paid,
        AccountsPayable.Active, 
        AccountsPayable.IdSale, 
        AccountsPayable.IdStore, 
        Sale.SalePrice,
        Sale.SaleDate,
        Sale.IdUser,
        User.UserName,
        Store.StoreName
      FROM AccountsPayable
      JOIN Sale ON AccountsPayable.IdSale = Sale.IdSale
      JOIN Store ON AccountsPayable.IdStore = Store.IdStore
      JOIN User ON Sale.IdUser = User.IdUser
      JOIN ClientSupplier ON AccountsPayable.IdClientSupplier = ClientSupplier.IdClientSupplier 
      ORDER BY AccountsPayable.DueDate`;
    return this.executeSQL(sql);
  }


  read(id) {
    const sql = `SELECT
        AccountsPayable.IdAccountPayable, 
        AccountsPayable.Amount, 
        AccountsPayable.IdClientSupplier,
        ClientSupplier.ClientSupplierName,
        AccountsPayable.RegistrationDate, 
        AccountsPayable.DueDate, 
        AccountsPayable.Note, 
        AccountsPayable.Paid, 
        AccountsPayable.Active, 
        AccountsPayable.IdSale, 
        AccountsPayable.IdStore,
        Sale.SalePrice,
        Sale.SaleDate,
        Sale.IdUser,
        User.UserName
      FROM AccountsPayable
      JOIN Sale ON AccountsPayable.IdSale = Sale.IdSale
      JOIN User ON Sale.IdUser = User.IdUser
      JOIN ClientSupplier ON AccountsPayable.IdClientSupplier = ClientSupplier.IdClientSupplier
      WHERE AccountsPayable.IdAccountPayable = ?`;
    return this.executeSQL(sql, id);
  }

  readSale(id) {
    const sql = `SELECT
        AccountsPayable.IdAccountPayable, 
        AccountsPayable.Amount, 
        AccountsPayable.IdClientSupplier,
        ClientSupplier.ClientSupplierName,
        AccountsPayable.RegistrationDate, 
        AccountsPayable.DueDate, 
        AccountsPayable.Note, 
        AccountsPayable.Paid, 
        AccountsPayable.Active, 
        AccountsPayable.IdSale, 
        AccountsPayable.IdStore,
        Sale.SalePrice,
        Sale.SaleDate,
        Sale.IdUser,
        User.UserName
      FROM AccountsPayable
      JOIN Sale ON AccountsPayable.IdSale = Sale.IdSale
      JOIN User ON Sale.IdUser = User.IdUser
      JOIN ClientSupplier ON AccountsPayable.IdClientSupplier = ClientSupplier.IdClientSupplier
      WHERE AccountsPayable.IdSale = ?`;
    return this.executeSQL(sql, id);
  }


  search(parametro) {
    const sql = `
      SELECT 
        AccountsPayable.IdAccountPayable, 
        AccountsPayable.Amount, 
        AccountsPayable.IdClientSupplier,
        ClientSupplier.ClientSupplierName,
        AccountsPayable.RegistrationDate, 
        AccountsPayable.DueDate, 
        AccountsPayable.Note, 
        AccountsPayable.Paid, 
        AccountsPayable.Active, 
        AccountsPayable.IdSale, 
        Sale.SalePrice,
        Sale.SaleDate,
        Sale.IdUser,
        User.UserName
      FROM AccountsPayable
      JOIN Sale ON AccountsPayable.IdSale = Sale.IdSale
      JOIN User ON Sale.IdUser = User.IdUser
      JOIN ClientSupplier ON AccountsPayable.IdClientSupplier = ClientSupplier.IdClientSupplier
      WHERE AccountsPayable.IdAccountPayable = ? 
        OR ClientSupplier.ClientSupplierName LIKE ? 
        OR User.UserName LIKE ? 
        OR AccountsPayable.Note LIKE ? 
        OR AccountsPayable.DueDate LIKE ? 
        OR AccountsPayable.Amount LIKE ?`;
    const values = [parametro, `%${parametro}%`, `%${parametro}%`, `%${parametro}%`, `%${parametro}%`, `%${parametro}%`];
    return this.executeSQL(sql, values);
  }

  create(newAccountsPayable) {
    const sql = "INSERT INTO AccountsPayable SET ?";
    return this.executeSQL(sql, newAccountsPayable);
  }

  update(updateAccountsPayable, id) {
    const sql = "UPDATE AccountsPayable SET ? WHERE IdAccountPayable = ?";
    return this.executeSQL(sql, [updateAccountsPayable, id]);
  }

  updateActive(updatePayable) {
    const sql = "UPDATE AccountsPayable SET Note = ?, Active = ? WHERE IdAccountPayable = ?";
    return this.executeSQL(sql, [updatePayable.Note, updatePayable.Active, updatePayable.IdAccountPayable]);
  }

  dashPayable(date) {
    const sql = `SELECT * FROM AccountsPayable WHERE DueDate BETWEEN ? AND ?;
      `;
    return this.executeSQL(sql, [date.firstDay, date.lastDay]);
  }

  dashPayableReport(date) {
    const sql = `
    SELECT
        AccountsPayable.IdAccountPayable, 
        AccountsPayable.Amount, 
        AccountsPayable.IdClientSupplier,
        ClientSupplier.ClientSupplierName,
        ClientSupplier.Address,
        ClientSupplier.Number,
        ClientSupplier.Neighborhood,
        ClientSupplier.City,
        ClientSupplier.State,
        ClientSupplier.Phone,
        ClientSupplier.City,
        ClientSupplier.TypeKey,
        ClientSupplier.PixKey,
        AccountsPayable.IdSale, 
        AccountsPayable.IdStore
    FROM 
        AccountsPayable
    JOIN 
        Sale ON AccountsPayable.IdSale = Sale.IdSale
    JOIN 
        ClientSupplier ON AccountsPayable.IdClientSupplier = ClientSupplier.IdClientSupplier
    WHERE 
        DATE(AccountsPayable.DueDate) = ?
        AND AccountsPayable.Active = 1 
        AND AccountsPayable.Paid = 0
        AND Sale.IdSale > 0 
        AND Sale.IdSale IS NOT NULL
    ORDER BY ClientSupplier.ClientSupplierName;
    `;

    // Aqui, 'date' será uma string no formato 'YYYY-MM-DD'
    return this.executeSQL(sql, [date]);
  }

}

module.exports = new AccountsPayableModel();
