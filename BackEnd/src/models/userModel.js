
const dbConnection = require("../../db/dbConnection");

class UserModel {

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
    const sql = `SELECT User.IdUser, User.UserName, User.UserEmail, User.Active, User.IdProfile, Profile.UserProfile FROM  User 
      JOIN Profile ON User.IdProfile = Profile.IdProfile
    `;
    return this.executeSQL(sql);
  }

  read(id) {
    const sql = "SELECT User.IdUser, User.UserName, User.UserEmail, User.Active, User.IdProfile, Profile.UserProfile FROM  User JOIN Profile ON User.IdProfile = Profile.IdProfile WHERE User.IdUser = ?";
    return this.executeSQL(sql, id);
  }

  findByEmail(email) {
    const sql = "SELECT IdUser, UserName, UserEmail, Active, IdProfile, Password FROM  User  WHERE UserEmail = ?";
    return this.executeSQL(sql, email);
  }

  async checkUserExists(name, email) {
    const sql = `SELECT UserName, UserEmail FROM User WHERE UserName = ? OR UserEmail = ?`;
    const [rows] = await this.executeSQL(sql, [name, email]);
  
    // Verifica se rows é um array, se não for, transforma em array
    const results = Array.isArray(rows) ? rows : [rows];
  
    let userNameExists = false;
    let userEmailExists = false;
  
    // Somente itera se results não estiver vazio
    if (results.length > 0) {
      results.forEach(row => {
        // Verifica se a propriedade row.UserName e row.UserEmail existe antes de comparar
        if (row && row.UserName === name) {
          userNameExists = true;
        }
        if (row && row.UserEmail === email) {
          userEmailExists = true;
        }
      });
    }
    return { userNameExists, userEmailExists };
  }

  search(parametro) {
    const sql = `
      SELECT User.IdUser, User.UserName, User.UserEmail, User.Active, User.IdProfile, Profile.UserProfile 
      FROM User 
      JOIN Profile ON User.IdProfile = Profile.IdProfile 
      WHERE User.IdUser = ? OR User.UserName LIKE ? OR User.UserEmail LIKE ?`;
    const values = [parametro, `%${parametro}%`, `%${parametro}%`];
    return this.executeSQL(sql, values);
  }

  create(newUser) {
    const sql = "INSERT INTO User SET ?";
    return this.executeSQL(sql, newUser);
  }

  update(updateUser, id) {
    const sql = "UPDATE User SET ? WHERE IdUser = ?";
    return this.executeSQL(sql, [updateUser, id]);
  }

}

module.exports = new UserModel();
