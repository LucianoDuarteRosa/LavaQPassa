const Router = require("express").Router;
const router = Router();
const productController = require("../controllers/productController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/product", authMiddleware.authMiddleware, productController.readList);
router.get("/productsale", authMiddleware.authMiddleware, productController.readListSale);
router.get("/product/:id", authMiddleware.authMiddleware, productController.read);
router.get("/productsearch/:id", authMiddleware.authMiddleware, productController.search);
router.post("/product", authMiddleware.authMiddleware, productController.create);
router.put("/product/:id", authMiddleware.authMiddleware, productController.update);

module.exports = router;
