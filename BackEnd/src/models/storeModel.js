
const dbConnection = require("../../db/dbConnection");


class StoreModel {

  
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
    const sql = "SELECT IdStore, StoreName, ZipCode, Address, Number, Complement, Neighborhood, City, State, Phone, Email, Active FROM Store";
    return this.executeSQL(sql); 
  }

  read(id) {
    const sql = "SELECT IdStore, StoreName, ZipCode, Address, Number, Complement, Neighborhood, City, State, Phone, Email, Active FROM Store WHERE IdStore = ?"; 
    return this.executeSQL(sql, id); 
  }

  search(parametro) {
    const sql = `
      SELECT IdStore, StoreName, ZipCode, Address, Number, Complement, Neighborhood, City, State, Phone, Email, Active FROM Store
      WHERE IdStore = ? OR IdStore LIKE ? OR StoreName LIKE ? OR Address LIKE ? 
      OR Neighborhood LIKE ? OR City LIKE ? OR State LIKE ? OR Phone LIKE ? OR Email LIKE ?`;
    const values = [parametro, `%${parametro}%`, `%${parametro}%`, `%${parametro}%`, `%${parametro}%`, `%${parametro}%`, `%${parametro}%`, `%${parametro}%`, `%${parametro}%`];
    return this.executeSQL(sql, values);
  }

  create(newEspaco) {
    const sql = "INSERT INTO Store SET ?"; 
    return this.executeSQL(sql, newEspaco);
  }

  update(updateEspaco, id) {
    const sql = "UPDATE Store SET ? WHERE IdStore = ?";
    return this.executeSQL(sql, [updateEspaco, id]); 
  }

}

module.exports = new StoreModel();
