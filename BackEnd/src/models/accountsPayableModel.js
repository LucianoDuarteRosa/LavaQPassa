
const dbConnection = require("../../db/dbConnection");

class AccountsPayableModel {
  
  executeSQL(sql, parametros = "") {
    
    return new Promise( function (resolve, reject) {
        
       
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
    const sql =  `SELECT
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
    const sql =  `SELECT
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

}

module.exports = new AccountsPayableModel();
