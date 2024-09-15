const profileRouters = require("./profileRouter.js");
const userRouters = require("./userRouter.js");
const groupRouters = require("./groupRouter.js");
const subGroupRouters = require("./subGroupRouter.js");
const storeRouters = require("./storeRouter.js");
const clientSupplierRouters = require("./clientSupplierRouter.js");
const productRouters = require("./productRouter.js");
const saleRouters = require("./saleRouter.js");
const saleDetailRouters = require("./saleDetailRouter.js");
const accountsPayableRouters = require("./accountsPayableRouter.js");
const accountsReceivableRouters = require("./accountsReceivableRouter.js");
const dashboardRouters = require("./dashboardRouter.js");
const reportRouters = require("./reportRouter.js");
const backupRouters = require("./backup.js")

module.exports = function (app, express) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(profileRouters);
  app.use(userRouters);
  app.use(groupRouters);
  app.use(subGroupRouters);
  app.use(storeRouters);
  app.use(clientSupplierRouters);
  app.use(productRouters);
  app.use(backupRouters);
  app.use(saleRouters);
  app.use(saleDetailRouters);
  app.use(accountsPayableRouters);
  app.use(accountsReceivableRouters);
  app.use(dashboardRouters);
  app.use(reportRouters);
};