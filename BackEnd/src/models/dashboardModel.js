const dbConnection = require("../../db/dbConnection");

class DashboardModel {

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

  saleYear() {
    const sql = `SELECT User.IdUser, User.UserName, User.UserEmail, User.Active, User.IdProfile, Profile.UserProfile FROM  User 
      JOIN Profile ON User.IdProfile = Profile.IdProfile
    `;
    return this.executeSQL(sql);
  }

  saleGroup() {
    const sql = "SELECT User.IdUser, User.UserName, User.UserEmail, User.Active, User.IdProfile, Profile.UserProfile FROM  User JOIN Profile ON User.IdProfile = Profile.IdProfile WHERE User.IdUser = ?";
    return this.executeSQL(sql, id);
  }

  saleSubGroup() {
    const sql = "SELECT IdUser, UserName, UserEmail, Active, IdProfile, Password FROM  User  WHERE UserEmail = ?";
    return this.executeSQL(sql, email);
  }

  accountsPayable() {
    const sql = "SELECT IdUser, UserName, UserEmail, Active, IdProfile, Password FROM  User  WHERE UserEmail = ?";
    return this.executeSQL(sql, email);
  }
}

module.exports = new DashboardModel();
