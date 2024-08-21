const Router = require("express").Router;
const router = Router();
const clientSupplierController = require("../controllers/clientSupplierController");
const authMiddleware = require("../../middlewares/authMiddleware")

router.get("/client", authMiddleware.authMiddleware, clientSupplierController.readList);
router.get("/client/:id", authMiddleware.authMiddleware, clientSupplierController.read);
router.get("/clientsearch/:id", authMiddleware.authMiddleware, clientSupplierController.search);
router.post("/client", authMiddleware.authMiddleware, clientSupplierController.create);
router.put("/client/:id", authMiddleware.authMiddleware, clientSupplierController.update);

module.exports = router;
