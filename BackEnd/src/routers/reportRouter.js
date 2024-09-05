const Router = require("express").Router;
const router = Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.post("/report", authMiddleware.authMiddleware, reportController.readList);

module.exports = router;
