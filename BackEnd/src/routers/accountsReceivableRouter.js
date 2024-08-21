const Router = require("express").Router;
const router = Router();
const accountsReceivableController = require("../controllers/accountsReceivableController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/receivable", authMiddleware.authMiddleware, accountsReceivableController.readList);
router.get("/receivable/:id", authMiddleware.authMiddleware, accountsReceivableController.read);
router.get("/receivablesearch/:id", authMiddleware.authMiddleware, accountsReceivableController.search);
router.post("/receivable", authMiddleware.authMiddleware, accountsReceivableController.create);
router.put("/receivable/:id", authMiddleware.authMiddleware, accountsReceivableController.update);

module.exports = router;
