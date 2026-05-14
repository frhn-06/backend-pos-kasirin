import express from 'express';
import authController from '../controller/auth.controller';
import authMiddleware from '../middleware/auth.middleware';

const routerApi = express.Router();




routerApi.post("/auth/register", authController.register);

routerApi.post("/auth/activation", authController.activation);

routerApi.post("/auth/login", authController.login);

routerApi.get("/auth/me", [authMiddleware], authController.getMeByToken);

export default routerApi;