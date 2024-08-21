const Router = require("express").Router;
const router = Router();
const saleController = require("../controllers/saleController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/sale", authMiddleware.authMiddleware, saleController.readList);
router.get("/sale/:id", authMiddleware.authMiddleware, saleController.read);
router.get("/salesearch/:id", authMiddleware.authMiddleware, saleController.search);
router.post("/sale", authMiddleware.authMiddleware, saleController.create);
router.put("/sale/:id", authMiddleware.authMiddleware, saleController.update);

module.exports = router;
