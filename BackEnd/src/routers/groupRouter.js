const Router = require("express").Router;
const router = Router();
const groupController = require("../controllers/groupController");
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/group", authMiddleware.authMiddleware, groupController.readList);
router.get("/group/:id", authMiddleware.authMiddleware, groupController.read);
router.get("/groupsearch/:id", authMiddleware.authMiddleware, groupController.search);
router.post("/group", authMiddleware.authMiddleware, groupController.create);
router.put("/group/:id", authMiddleware.authMiddleware, groupController.update);

module.exports = router;
