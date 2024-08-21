
const dbConnection = require("../../db/dbConnection");

class GroupModel {
  
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
      const sql = `SELECT IdGroup, GroupName, Active FROM ProductGroup`;
    return this.executeSQL(sql); 
  }

  read(id) {
    const sql = "SELECT IdGroup, GroupName, Active FROM ProductGroup WHERE IdGroup = ?"; 
    return this.executeSQL(sql, id); 
  }

  search(parametro) {
    const sql = `
      SELECT IdGroup, GroupName, Active FROM ProductGroup 
      WHERE IdGroup = ? OR GroupName LIKE ? OR IdGroup LIKE ?`;
    const values = [parametro, `%${parametro}%`, `%${parametro}%`];
    return this.executeSQL(sql, values);
  }

  create(newGroup) {
    const sql = "INSERT INTO ProductGroup SET ?"; 
    return this.executeSQL(sql, newGroup);
  }

  update(updateGroup, id) {
    const sql = "UPDATE ProductGroup SET ? WHERE IdGroup = ?";
    return this.executeSQL(sql, [updateGroup, id]); 
  }

}

module.exports = new GroupModel();
