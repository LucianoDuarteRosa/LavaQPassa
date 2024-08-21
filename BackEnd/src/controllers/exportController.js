
const exportModel = require("../models/exportModel");


class ExportController {
  
  alltables(req, res) {
      exportModel.exportAll()
        .then(() => res.status(200).send("Dados exportados com sucesso!"))
        .catch((error) => res.status(400).json(error.message));
  }
  
}

module.exports = new ExportController();
