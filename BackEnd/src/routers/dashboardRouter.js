const Router = require("express").Router;
const router = Router();
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/saleyear", authMiddleware.authMiddleware, dashboardController.saleYear);
router.get("/salegroup", authMiddleware.authMiddleware, dashboardController.saleGroup);
router.get("/salesubgroup", authMiddleware.authMiddleware, dashboardController.saleSubGroup);
router.get("/accountspayable", authMiddleware.authMiddleware, dashboardController.accountsPayable);


module.exports = router;
