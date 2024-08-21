const Router = require("express").Router;
const router = Router();
const saleDetailController = require("../controllers/saleDetailController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/saledetail", authMiddleware.authMiddleware, saleDetailController.readList);
router.get("/saledetail/:id", authMiddleware.authMiddleware, saleDetailController.read);
router.post("/saledetail", authMiddleware.authMiddleware, saleDetailController.create);
router.put("/saledetail/:id", authMiddleware.authMiddleware, saleDetailController.update);

module.exports = router;
