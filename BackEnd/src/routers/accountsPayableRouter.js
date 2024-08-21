const Router = require("express").Router;
const router = Router();
const accountsPayableController = require("../controllers/accountsPayableController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/payable", authMiddleware.authMiddleware, accountsPayableController.readList);
router.get("/payable/:id", authMiddleware.authMiddleware, accountsPayableController.read);
router.get("/payablesearch/:id", authMiddleware.authMiddleware, accountsPayableController.search);
router.post("/payable", authMiddleware.authMiddleware, accountsPayableController.create);
router.put("/payable/:id", authMiddleware.authMiddleware, accountsPayableController.update);

module.exports = router;
