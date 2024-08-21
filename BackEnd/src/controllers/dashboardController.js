const dashboardModel = require("../models/dashboardModel");
const accountsPayableModel = require("../models/accountsPayableModel");
const saleModel = require("../models/saleModel");

class DashboardController {

    saleYear(req, res) {
        const retorno = userModel.readList();
        return retorno
            .then((result) => result.length == 0
                ? res.status(404).send("Nenhum usuário encontrado!")
                : res.status(200).json(result)
            )
            .catch((error) => res.status(400).json(error.message));
    }


    saleGroup(req, res) {
        const { id } = req.params;
        const errors = [];

        const test = validator.integerValidator(id);
        if (test !== true) {
            errors.push(test);
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const retorno = userModel.read(id);

        return retorno
            .then((result) =>
                result.length == 0
                    ? res.status(404).send("Usuário não encontrado!")
                    : res.status(200).json(result)
            )
            .catch((error) => res.status(400).json(error.message));
    }

    saleSubGroup(req, res) {

        const { id } = req.params;

        const retorno = userModel.search(id);
        return retorno
            .then((result) =>
                result.length == 0
                    ? res.status(404).send("Nenhum usuário encontrado!")
                    : res.status(200).json(result)
            )
            .catch((error) => res.status(400).json(error.message));
    }

    accountsPayable(req, res) {
        const { id } = req.params;

        const retorno = userModel.search(id);
        return retorno
            .then((result) =>
                result.length == 0
                    ? res.status(404).send("Nenhum usuário encontrado!")
                    : res.status(200).json(result)
            )
            .catch((error) => res.status(400).json(error.message));
    }

}

module.exports = new DashboardController();
