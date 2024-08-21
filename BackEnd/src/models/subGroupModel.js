
const dbConnection = require("../../db/dbConnection");

class SubGroupModel {
  
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
      const sql = `SELECT SubGroup.IdSubGroup, SubGroup.SubGroupName, SubGroup.Active, ProductGroup.IdGroup, ProductGroup.GroupName FROM SubGroup
    JOIN ProductGroup ON SubGroup.IdGroup = ProductGroup.IdGroup ORDER BY ProductGroup.GroupName`;
    return this.executeSQL(sql); 
  }

  read(id) {
    const sql =  `
    SELECT SubGroup.IdSubGroup, SubGroup.SubGroupName, SubGroup.Active, ProductGroup.IdGroup, ProductGroup.GroupName FROM SubGroup
    JOIN ProductGroup ON SubGroup.IdGroup = ProductGroup.IdGroup WHERE SubGroup.IdSubGroup = ?`; 
    return this.executeSQL(sql, id); 
  }

  search(parametro) {
    const sql = `
    SELECT SubGroup.IdSubGroup, SubGroup.SubGroupName, SubGroup.Active, ProductGroup.IdGroup, ProductGroup.GroupName FROM SubGroup
    JOIN ProductGroup ON SubGroup.IdGroup = ProductGroup.IdGroup WHERE SubGroup.IdSubGroup = ? OR SubGroup.SubGroupName LIKE ? OR ProductGroup.GroupName LIKE ?`;
    const values = [parametro, `%${parametro}%`, `%${parametro}%`];
    return this.executeSQL(sql, values);
  }

  create(newSubGroup) {
    const sql = "INSERT INTO SubGroup SET ?"; 
    return this.executeSQL(sql, newSubGroup);
  }

  update(updateSubGroup, id) {
    const sql = "UPDATE SubGroup SET ? WHERE IdSubGroup = ?";
    return this.executeSQL(sql, [updateSubGroup, id]); 
  }

}

module.exports = new SubGroupModel();
