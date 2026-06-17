import express from 'express';
import authController from '../controller/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import categoryController from '../controller/category.controller';
import aclMiddleware from '../middleware/acl.middleware';
import storeController from '../controller/store.controller';
import productController from '../controller/product.controller';
import mediaMiddleware from '../middleware/media.middleware';
import mediaController from '../controller/media.controler';
import orderController from '../controller/order.controller';
import dashboardController from '../controller/dashboard.controller';
import reportController from '../controller/report.controller';

const routerApi = express.Router();




routerApi.post("/auth/register", authController.register);

routerApi.post("/auth/activation", authController.activation);

routerApi.post("/auth/login", authController.login);

routerApi.get("/auth/me", [authMiddleware], authController.getMeByToken);

routerApi.post("/auth/create-user", [authMiddleware, aclMiddleware(["owner"])], authController.createUserCashier);

routerApi.get("/user/:storeId/cashier", [authMiddleware, aclMiddleware(["owner"])], authController.findUserCashier);







routerApi.post("/category", [authMiddleware, aclMiddleware(["owner"])], categoryController.create);

routerApi.get("/category", [authMiddleware], categoryController.findAllByStoreId);

routerApi.get("/category/:categoryId", [authMiddleware], categoryController.findById);

routerApi.put("/category/:categoryId/update", [authMiddleware, aclMiddleware(["owner"])], categoryController.update);

routerApi.delete("/category/:categoryId/remove", [authMiddleware, aclMiddleware(["owner"])], categoryController.remove);








routerApi.post("/store", [authMiddleware, aclMiddleware(["owner"])], storeController.create);

routerApi.get("/store", [authMiddleware], storeController.findStoreByUser);

routerApi.put("/store/:storeId", [authMiddleware, aclMiddleware(["owner"])], storeController.update);








routerApi.post("/product", [authMiddleware, aclMiddleware(["owner"])], productController.create);

routerApi.get("/product", [authMiddleware], productController.findAll);

routerApi.get("/product/:productId", [authMiddleware], productController.findOne);

routerApi.put("/product/:productId", [authMiddleware, aclMiddleware(["owner"])], productController.update);

routerApi.delete("/product/:productId", [authMiddleware, aclMiddleware(["owner"])], productController.remove);




routerApi.post("/media/upload-single", [authMiddleware, aclMiddleware(["owner"]), mediaMiddleware.single("file")], mediaController.uploadSingle);

routerApi.delete("/media/remove-single", [authMiddleware, aclMiddleware(["owner"])], mediaController.removeSingle);





routerApi.post("/order", [authMiddleware, aclMiddleware(["cashier"])], orderController.create);

routerApi.get("/order", [authMiddleware, aclMiddleware(["owner", "cashier"])], orderController.findAllOrders);

routerApi.get("/order/:orderId", [authMiddleware], orderController.findOneById);

routerApi.patch("/order/:orderId/cancel", [authMiddleware], orderController.cancelled);

routerApi.patch("/order/:orderId/uncancel", [authMiddleware, aclMiddleware(["owner"])], orderController.uncancel);





routerApi.get("/dashboard/owner-summary", [authMiddleware, aclMiddleware(["owner"])], dashboardController.OwnerSummary);

routerApi.get("/dashboard/sales-trend", [authMiddleware, aclMiddleware(["owner"])], dashboardController.salesTrend);

routerApi.get("/dashboard/owner-top-products", [authMiddleware, aclMiddleware(["owner"])], dashboardController.OwnertopProducts);

routerApi.get("/dashboard/owner-last-orders", [authMiddleware, aclMiddleware(["owner"])], dashboardController.OwnerlastOrders);



routerApi.get("/dashboard/cashier-summary", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierSummary);

routerApi.get("/dashboard/cashier-last-orders", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierLastOrder);

routerApi.get("/dashboard/payment-summary", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierPaymentSummary);

routerApi.get("/dashboard/cashier-top-products", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierTopProducts);







routerApi.get("/report/sales", [authMiddleware, aclMiddleware(["owner"])], reportController.sales);




export default routerApi;