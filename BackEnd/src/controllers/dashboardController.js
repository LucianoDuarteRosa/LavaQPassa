const accountsPayableModel = require("../models/accountsPayableModel");
const saleModel = require("../models/saleModel");
const converter = require("../../utils/converter");

class DashboardController {

    async accountsPayable(req, res) {
        const date = converter.getMonthStartAndEndDates();

        try {
            const result = await accountsPayableModel.dashPayable(date);

            let dateReturn = {account: 0, paids: 0, billsDue: 0}
            result.map(account => {
                dateReturn.account += parseFloat(account.Amount);
                if(account.Paid){
                    dateReturn.paids += parseFloat(account.Amount);
                }             
            });

            dateReturn.billsDue = dateReturn.account - dateReturn.paids

            res.status(200).json(dateReturn)
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    saleYear(req, res) {
        const result = saleModel.saleYear();
        return result
            .then((result) => result.length == 0
                ? res.status(404).send("Sem dados a exibir.")
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
}

module.exports = new DashboardController();
