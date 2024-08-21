const Router = require("express").Router;
const router = Router();
const imageController = require("../controllers/imageController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/image/:id", authMiddleware.authMiddleware, imageController.read);
router.post("/image", authMiddleware.authMiddleware, imageController.create);
router.put("/image/:id", authMiddleware.authMiddleware, imageController.update);
router.delete("/image/:id", authMiddleware.authMiddleware, imageController.delete);

module.exports = router;
