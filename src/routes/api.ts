import express from 'express';
import authController from '../controller/auth.controller';

const routerApi = express.Router();




routerApi.post("/auth/register", authController.register);

routerApi.post("/auth/activation", authController.activation);

export default routerApi;