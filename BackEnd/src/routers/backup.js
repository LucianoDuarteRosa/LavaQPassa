const Router = require("express").Router;
const router = Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const backupController = require("../controllers/backupController");

router.get("/backup", authMiddleware.authMiddleware, backupController.backup);

module.exports = router;
