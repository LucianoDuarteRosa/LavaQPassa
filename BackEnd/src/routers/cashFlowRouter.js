const Router = require("express").Router;
const router = Router();
const cashFlowController = require("../controllers/cashFlowController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.post("/cashflow", authMiddleware.authMiddleware, cashFlowController.readList);
router.put("/cashflowsearch", authMiddleware.authMiddleware, cashFlowController.readListSearch);

module.exports = router;
