const accountsPayableModel = require("../models/accountsPayableModel");
const saleModel = require("../models/saleModel");
const saleDetailModel = require("../models/saleDetailModel")
const converter = require("../../utils/converter");

class DashboardController {

    async accountsPayable(req, res) {
        const date = converter.getMonthStartAndEndDates();

        try {
            const result = await accountsPayableModel.dashPayable(date);

            let dateReturn = { account: 0, paids: 0, billsDue: 0 }
            result.map(account => {
                dateReturn.account += parseFloat(account.Amount);
                if (account.Paid) {
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


    async saleGroup(req, res) {
        const date = converter.getMonthStartAndEndDates();

        try {
            const result = await saleDetailModel.saleGroup(date);

            let dateReturn = [];
            let currentId = 0;

            result.forEach(product => {
                let existingGroup = dateReturn.find(item => item.label === product.GroupName);

                if (existingGroup) {
                    existingGroup.value += product.SalePrice;
                } else {
                    dateReturn.push({ id: currentId++, value: product.SalePrice , label: product.GroupName});
                }
            });

            res.status(200).json(dateReturn);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async saleSubGroup(req, res) {
        const date = converter.getMonthStartAndEndDates();
        console.log(date);
        try {
            const result = await saleDetailModel.saleGroup(date);
            let dateReturn = [];

            result.map(product => {
                let existingGroup = dateReturn.find(item => item.group === product.ProductGroup);

                if (existingGroup) {
                    existingGroup.sale += product.SalePrice;
                } else {
                    dateReturn.push({ label: product.ProductGroup, value: product.SalePrice });
                }
            });

            res.status(200).json(dateReturn)
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new DashboardController();
