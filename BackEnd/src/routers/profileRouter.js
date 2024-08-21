const Router = require("express").Router;
const router = Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/profile", authMiddleware.authMiddleware, profileController.readList);

module.exports = router;
