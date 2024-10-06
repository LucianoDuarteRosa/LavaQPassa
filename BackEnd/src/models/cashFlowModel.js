
const dbConnection = require("../../db/dbConnection");

class CashFlowModel {

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

  readList(startDate, endDate) {
    const sql = `SELECT * 
                 FROM CashFlow 
                 WHERE RegistrationDate BETWEEN ? AND ? 
                 ORDER BY RegistrationDate ASC`;
    return this.executeSQL(sql, [startDate, endDate]);
  }

  readBalance() {
    const sql = `SELECT Accumulated 
                 FROM CashFlow 
                 ORDER BY IdCashFlow DESC 
                 LIMIT 1`;
    return this.executeSQL(sql);
  }

  create(newCashFlow) {
    const sql = "INSERT INTO CashFlow SET ?";
    return this.executeSQL(sql, newCashFlow);
  }

}

module.exports = new CashFlowModel();
