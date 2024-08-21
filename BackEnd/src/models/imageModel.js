
const dbConnection = require("../../db/dbConnection");

class ImageModel {
  
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
    const sql = "SELECT IdImage, Path, IdProduct FROM Image WHERE IdImage = ?"; 
    return this.executeSQL(sql, id); 
  }

  create(newImage) {
    const sql = "INSERT INTO Image SET ?"; 
    return this.executeSQL(sql, newImage);
  }

  update(updateImage, id) {
    const sql = "UPDATE Image SET ? WHERE IdImage = ?";
    return this.executeSQL(sql, [updateImage, id]); 
  }

  delete(id) {
    const sql = "DELETE FROM Image WHERE IdImage = ?"
    return this.executeSQL(sql, id); 
  }

}

module.exports = new ImageModel();
