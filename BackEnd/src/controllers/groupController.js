const groupModel = require("../models/groupModel");
const validator = require("../../utils/inputsValidator")


class GroupController {
 
  readList(req, res) {
   
    const retorno = groupModel.readList();
    return retorno
      .then((result) => result.length == 0
        ? res.status(404).send("Nenhum grupo encontrado!")
        : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

 
  read(req, res) {
    const { id } = req.params;
    
    const errors = [];

    const testId= validator.integerValidator(id);

    if (testId !== true) {
      errors.push(testId);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const retorno = groupModel.read(id);
    return retorno
      .then((result) =>
        result.length == 0 
        ? res.status(404).send("Grupo não encontrado!") 
        : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  search(req, res) {
    
    const { id } = req.params;
    
    const retorno = groupModel.search(id);
    return retorno
      .then((result) =>
        result.length == 0 
        ? res.status(404).send("Nenhum grupo encontrado!") 
        : res.status(200).json(result)
      )
      .catch((error) => res.status(400).json(error.message));
  }

  create(req, res) {
    const reqBody = req.body; 
    const group = {GroupName: reqBody.name}
    const retorno = groupModel.create(group);
    return retorno
      .then((result) =>
        res.status(201).send("Grupo criado com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));
  }

  update(req, res) {
    const { id } = req.params;
    const reqBody = req.body; 

    const errors = [];

    const testId= validator.integerValidator(id);

    if (testId !== true) {
      errors.push(testId);
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const group ={GroupName: reqBody.name, Active: reqBody.active};
      
    const retorno = groupModel.update(group, id);
    return retorno
      .then((result) =>
        res.status(200).send("Grupo atualizado com sucesso!")
      )
      .catch((error) => res.status(400).json(error.message));

  }
}

module.exports = new GroupController();
