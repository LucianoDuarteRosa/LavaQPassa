const Router = require("express").Router;
const router = Router();
const subGroupController = require("../controllers/subGroupController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/subgroup", authMiddleware.authMiddleware, subGroupController.readList);
router.get("/subgroup/:id", authMiddleware.authMiddleware, subGroupController.read);
router.get("/subgroupsearch/:id", authMiddleware.authMiddleware, subGroupController.search);
router.post("/subgroup", authMiddleware.authMiddleware, subGroupController.create);
router.put("/subgroup/:id", authMiddleware.authMiddleware, subGroupController.update);

module.exports = router;
