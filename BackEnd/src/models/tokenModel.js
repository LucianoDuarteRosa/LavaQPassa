
const dbConnection = require("../../db/dbConnection");


class TokenModel {

  
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

  read(id) {
    const sql = "SELECT IdToken, IdUser, Token, CreateToken, ExpiresToken FROM Tokens WHERE Token = ?"; 
    return this.executeSQL(sql, id); 
  }

  create(newToken) {
    const sql = "INSERT INTO Tokens SET ?"; 
    return this.executeSQL(sql, newToken);
  }
}

module.exports = new TokenModel();
