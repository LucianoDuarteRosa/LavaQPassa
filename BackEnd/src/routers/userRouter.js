const Router = require("express").Router;
const router = Router();
const userController = require("../controllers/userController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/user", authMiddleware.authMiddleware, userController.readList);
router.get("/user/:id", authMiddleware.authMiddleware, userController.read);
router.get("/usersearch/:id", authMiddleware.authMiddleware, userController.search);
router.post("/user", authMiddleware.authMiddleware, userController.create);
router.put("/user/:id", authMiddleware.authMiddleware, userController.update);
router.post('/login', userController.login);

module.exports = router;
