import express from 'express';
import authController from '../controller/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import categoryController from '../controller/category.controller';
import aclMiddleware from '../middleware/acl.middleware';
import storeController from '../controller/store.controller';
import productController from '../controller/product.controller';

const routerApi = express.Router();




routerApi.post("/auth/register", authController.register);

routerApi.post("/auth/activation", authController.activation);

routerApi.post("/auth/login", authController.login);

routerApi.get("/auth/me", [authMiddleware], authController.getMeByToken);

routerApi.post("/auth/create-user", [authMiddleware, aclMiddleware(["owner"])], authController.createUserCashier);








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




export default routerApi;