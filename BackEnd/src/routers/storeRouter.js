const Router = require("express").Router;
const router = Router();
const storeController = require("../controllers/storeController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/store", authMiddleware.authMiddleware, storeController.readList);
router.get("/store/:id", authMiddleware.authMiddleware, storeController.read);
router.get("/storesearch/:id", authMiddleware.authMiddleware, storeController.search);
router.post("/store", authMiddleware.authMiddleware, storeController.create);
router.put("/store/:id", authMiddleware.authMiddleware, storeController.update);

module.exports = router;
