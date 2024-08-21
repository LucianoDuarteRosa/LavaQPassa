
const dbConnection = require("../../db/dbConnection");
const usuarioModel = require("./userModel");
const perfilModel = require('./profileModel');
const XLSX = require('xlsx');

class ExportModel {
  
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

  async exportAll() {
    try {
      const wb = XLSX.utils.book_new();
  
      // Lista de modelos e nomes das planilhas
      const modelos = [
        { model: usuarioModel, sheetName: 'Usuarios' },
        { model: perfilModel, sheetName: 'Perfis' }
      ];
  
      // Função auxiliar para lidar com a resposta do readList
      const getRows = async (model) => {
        const result = await model.readList();
        return Array.isArray(result) ? result : [];
      };
  
      // Loop sobre os modelos e adicionar as planilhas
      for (const { model, sheetName } of modelos) {
        const rows = await getRows(model);
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      }
  
      const fileName = `Exportacao_Completa.xlsx`;
      XLSX.writeFile(wb, fileName);
      console.log(`Dados exportados para ${fileName}`);
    } catch (err) {
      console.error(`Erro ao executar consulta SQL:`, err);
    }
  }
  
}

module.exports = new ExportModel();
