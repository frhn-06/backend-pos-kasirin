import express from 'express';
import authController from '../controller/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import categoryController from '../controller/category.controller';

const routerApi = express.Router();




routerApi.post("/auth/register", authController.register);

routerApi.post("/auth/activation", authController.activation);

routerApi.post("/auth/login", authController.login);

routerApi.get("/auth/me", [authMiddleware], authController.getMeByToken);








routerApi.post("/category", [authMiddleware], categoryController.create);

routerApi.get("/category", [authMiddleware], categoryController.findAllByStoreId);

routerApi.get("/category/:categoryId", [authMiddleware], categoryController.findById);

routerApi.put("/category/:categoryId/update", [authMiddleware], categoryController.update);

routerApi.delete("/category/:categoryId/remove", [authMiddleware], categoryController.remove);




export default routerApi;