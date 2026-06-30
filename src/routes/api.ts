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
import exportController from '../controller/export.controller';

const routerApi = express.Router();



/**
 * @openapi
 * /auth/register:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Register new user
 *   description: create a new owner or cashier account
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/RegisterRequest' 
 *   responses:
 *    200:
 *     description: Register success
 *    400:
 *     description: Validation failed
 *    409:
 *     description: Email or username already exists
 *    500:
 *     description: Internal server error
 */

/**
 * @openapi 
 * /auth/ActivationRequest:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Activation user
 *   description: Activation for user owner or cashier
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ActivationRequest'
 *   responses:
 *    200:
 *     description: Activation success
 *    400:
 *     description: Invalid activation code
 *    404:
 *     description: User not found
 *    500:
 *     description: Internal server error
 */

/**
 * @openapi 
 * /auth/login:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Login user
 *   description: login for user owner or cashier
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/LoginRequest'
 *   responses:
 *    200:
 *     description: Login success
 *    400:
 *     description: Validation failed
 *    409:
 *     description: Email or username already exists
 *    500:
 *     description: Internal server error
 */

/**
 * @openapi
 * /auth/me:
 *  get:
 *   tags:
 *    - Auth
 *   summary: Find user by token
 *   description: Find user must be a token
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Find me success
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Internal server error
 */

/**
 * @openapi 
 * /auth/create-cashier:
 *  post:
 *   tags:
 *    - Auth
 *   summary: Create cashier
 *   description: Create a cashier to be a staff 
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/RegisterRequest'
 *   responses:
 *    200:
 *     description: Create cashier success
 *    400:
 *     description: Validation failed
 *    403:
 *     description: Forbidden
 *    409:
 *     description: Username or email already exicts
 *    500:
 *     description: Internal server error
 */

/**
 * @openapi 
 * /auth/update-user:
 *  put:
 *   tags:
 *    - Auth
 *   summary: Update user
 *   description: Update info user from full name and user name
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UpdateUserRequest'
 *   responses:
 *    200:
 *     description: Update user success
 *    400:
 *     description: Validation failed
 *    409:
 *     description: Username or email already exicts
 *    404:
 *     description: User not found
 *    500:
 *     description: Internal server error
 */

/**
 * @openapi 
 * /auth/update-password:
 *  put:
 *   tags:
 *    - Auth
 *   summary: Update password
 *   description: Update password user
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UpdatePasswordUserRequest'
 *   responses:
 *    200:
 *     description: Update password success
 *    400:
 *     description: Validation failed
 *    403:
 *     description: Forbidden
 *    409:
 *     description: Username or email already exicts
 *    500:
 *     description: Internal server error
 */

/**
 * @openapi 
 * /user/cashier/find:
 *  get:
 *   tags:
 *    - Auth
 *   summary: Find cashier
 *   description: Find a cashier user 
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Find cashier success
 *    403:
 *     description: Forbidden
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: User not found
 *    500:
 *     description: Internal server error
 */

/**
 * @openapi 
 * /user/my-profile:
 *  get:
 *   tags:
 *    - Auth
 *   summary: Find user
 *   description: Find user without token
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Find my profile success
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Internal server error
 */
routerApi.post("/auth/register", authController.register);

routerApi.post("/auth/activation", authController.activation);

routerApi.post("/auth/login", authController.login);

routerApi.get("/auth/me", [authMiddleware], authController.getMeByToken);

routerApi.post("/auth/create-cashier", [authMiddleware, aclMiddleware(["owner"])], authController.createUserCashier);

routerApi.put("/auth/update-user", [authMiddleware, aclMiddleware(["owner", "cashier"])], authController.update);

routerApi.put("/auth/update-password", [authMiddleware, aclMiddleware(["owner", "cashier"])], authController.updatePassword);

routerApi.get("/user/cashier/find", [authMiddleware, aclMiddleware(["owner"])], authController.findUserCashier);

routerApi.get("/user/my-profile", [authMiddleware, aclMiddleware(["owner", "cashier"])], authController.findMyUser);






/**
 * @openapi
 * /category:
 *  post:
 *   tags:
 *    - Category
 *   summary: Create category
 *   description: Create a category for product field 
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CategoryRequest'
 *   responses: 
 *    200:
 *     description: success request
 */
 
/**
 * @openapi
 * /category:
 *  get:
 *   tags:
 *    - Category
 *   summary: Find categories
 *   description: Find all categories
 *   security:
 *    - bearerAuth: []
 *   responses: 
 *    200:
 *     description: success request
 */
 
/**
 * @openapi
 * /category/{id}:
 *  get:
 *   tags:
 *    - Category
 *   summary: Find category
 *   description: Find a category by id
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */

/**
 * @openapi
 * /category/{id}/update:
 *  put:
 *   tags:
 *    - Category
 *   summary: Update category
 *   description: Update a category for product field 
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CategoryRequest'
 *   responses: 
 *    200:
 *     description: success request
 */
 
/**
 * @openapi
 * /category/{id}/remove:
 *  delete:
 *   tags:
 *    - Category
 *   summary: Delete category
 *   description: Delete a category from categories
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */
routerApi.post("/category", [authMiddleware, aclMiddleware(["owner"])], categoryController.create);

routerApi.get("/category", [authMiddleware], categoryController.findAllByStoreId);

routerApi.get("/category/:categoryId", [authMiddleware], categoryController.findById);

routerApi.put("/category/:categoryId/update", [authMiddleware, aclMiddleware(["owner"])], categoryController.update);

routerApi.delete("/category/:categoryId/remove", [authMiddleware, aclMiddleware(["owner"])], categoryController.remove);







/**
 * @openapi
 * /store:
 *  post:
 *   tags:
 *    - Store
 *   summary: Create store
 *   description: Create store as application core
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/StoreRequest'
 *   responses: 
 *    200:
 *     description: success request
 */

/**
 * @openapi
 * /store:
 *  get:
 *   tags:
 *    - Store
 *   summary: Find store
 *   description: Find store by owner
 *   security:
 *    - bearerAuth: []
 *   responses: 
 *    200:
 *     description: success request
 */

/**
 * @openapi
 * /store/{id}:
 *  put:
 *   tags:
 *    - Store
 *   summary: Update store
 *   description: Update store of owner
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/StoreRequest'
 *   responses: 
 *    200:
 *     description: success request
 */
routerApi.post("/store", [authMiddleware, aclMiddleware(["owner"])], storeController.create);

routerApi.get("/store", [authMiddleware], storeController.findStoreByUser);

routerApi.put("/store/:storeId", [authMiddleware, aclMiddleware(["owner"])], storeController.update);







/**
 * @openapi
 * /product:
 *  post:
 *   tags:
 *    - Product
 *   summary: Create Product
 *   description: Create Product or menu
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ProductRequest'
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /product:
 *  get:
 *   tags:
 *    - Product
 *   summary: Find Products
 *   description: Find all Products or menus
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: query
 *      name: page
 *      schema:
 *       type: integer
 *    - in: query
 *      name: limit
 *      schema:
 *       type: integer
 *    - in: query
 *      name: search
 *      schema:
 *       type: string
 *    - in: query
 *      name: category
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /product/{id}:
 *  get:
 *   tags:
 *    - Product
 *   summary: Find Products
 *   description: Find all Products or menus
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /product/{id}:
 *  put:
 *   tags:
 *    - Product
 *   summary: Find Products
 *   description: Find all Products or menus
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ProductRequest'
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /product/{id}:
 *  delete:
 *   tags:
 *    - Product
 *   summary: Find Products
 *   description: Find all Products or menus
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */

routerApi.post("/product", [authMiddleware, aclMiddleware(["owner"])], productController.create);

routerApi.get("/product", [authMiddleware], productController.findAll);

routerApi.get("/product/:productId", [authMiddleware], productController.findOne);

routerApi.put("/product/:productId", [authMiddleware, aclMiddleware(["owner"])], productController.update);

routerApi.delete("/product/:productId", [authMiddleware, aclMiddleware(["owner"])], productController.remove);



/**
 * @openapi
 * /media/upload-single:
 *  post:
 *   tags:
 *    - Media
 *   summary: Upload single
 *   description: Upload a media
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         example: file
 *        file:
 *         type: string
 *         format: binary
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /media/remove-single:
 *  delete:
 *   tags:
 *    - Media
 *   summary: Remove single
 *   description: Remove a media
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/RemoveMediaRequest'
 *   responses: 
 *    200:
 *     description: success request
 * 
 */
routerApi.post("/media/upload-single", [authMiddleware, aclMiddleware(["owner", "cashier"]), mediaMiddleware.single("file")], mediaController.uploadSingle);

routerApi.delete("/media/remove-single", [authMiddleware, aclMiddleware(["owner", "cashier"])], mediaController.removeSingle);




/**
 * @openapi
 * /order:
 *  post:
 *   tags:
 *    - Order
 *   summary: Create Order
 *   description: Create order for sales
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true,
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/OrderRequest'
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /order:
 *  get:
 *   tags:
 *    - Order
 *   summary: Find Orders
 *   description: Find all orders
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: query
 *      name: page
 *      schema:
 *       type: string
 *    - in: query
 *      name: limit
 *      schema:
 *       type: string
 *    - in: query
 *      name: search
 *      schema:
 *       type: string
 *    - in: query
 *      name: status
 *      schema:
 *       type: string
 *    - in: query
 *      name: paymentMethod
 *      schema:
 *       type: string
 *    - in: query
 *      name: cashierId
 *      schema:
 *       type: string
 *    - in: query
 *      name: start
 *      schema:
 *       type: string
 *    - in: query
 *      name: end
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /order/{id}:
 *  get:
 *   tags:
 *    - Order
 *   summary: Find Order
 *   description: Find one order
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /order/{id}/cancel:
 *  patch:
 *   tags:
 *    - Order
 *   summary: Cancel Order
 *   description: Cancel one order
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /order/{id}/uncancel:
 *  patch:
 *   tags:
 *    - Order
 *   summary: Uncancel Order
 *   description: Uncancel one order
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */
routerApi.post("/order", [authMiddleware, aclMiddleware(["cashier"])], orderController.create);

routerApi.get("/order", [authMiddleware, aclMiddleware(["owner", "cashier"])], orderController.findAllOrders);

routerApi.get("/order/:orderId", [authMiddleware], orderController.findOneById);

routerApi.patch("/order/:orderId/cancel", [authMiddleware], orderController.cancelled);

routerApi.patch("/order/:orderId/uncancel", [authMiddleware], orderController.uncancel);




/**
 * @openapi
 * /dashboard/owner-summary:
 *  get:
 *   tags:
 *    - Dashboard owner
 *   summary: Dashboard summary
 *   description: Info Summary of sales, averege, product
 *   security:
 *    - bearerAuth: []
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /dashboard/sales-trend:
 *  get:
 *   tags:
 *    - Dashboard owner
 *   summary: Sales trend
 *   description: Info sales trend in 1 week
 *   security:
 *    - bearerAuth: []
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /dashboard/owner-top-products:
 *  get:
 *   tags:
 *    - Dashboard owner
 *   summary: Top products
 *   description: Info top much products ordered
 *   security:
 *    - bearerAuth: []
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /dashboard/owner-top-products:
 *  get:
 *   tags:
 *    - Dashboard owner
 *   summary: Last orders
 *   description: Info last orders
 *   security:
 *    - bearerAuth: []
 *   responses: 
 *    200:
 *     description: success request
 */
routerApi.get("/dashboard/owner-summary", [authMiddleware, aclMiddleware(["owner"])], dashboardController.OwnerSummary);

routerApi.get("/dashboard/sales-trend", [authMiddleware, aclMiddleware(["owner"])], dashboardController.salesTrend);

routerApi.get("/dashboard/owner-top-products", [authMiddleware, aclMiddleware(["owner"])], dashboardController.OwnertopProducts);

routerApi.get("/dashboard/owner-last-orders", [authMiddleware, aclMiddleware(["owner"])], dashboardController.OwnerlastOrders);



/**
 * @openapi
 * /dashboard/cashier-summary:
 *  get:
 *   tags:
 *    - Dashboard cashier
 *   summary: Dashboard summary
 *   description: Info Summary of sales, averege, product
 *   security:
 *    - bearerAuth: []
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /dashboard/cashier-last-orders:
 *  get:
 *   tags:
 *    - Dashboard cashier
 *   summary: Last orders
 *   description: Info last orders
 *   security:
 *    - bearerAuth: []
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /dashboard/payment-summary:
 *  get:
 *   tags:
 *    - Dashboard cashier
 *   summary: Payment summary
 *   description: Info top much products ordered
 *   security:
 *    - bearerAuth: []
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /dashboard/cashier-top-products:
 *  get:
 *   tags:
 *    - Dashboard cashier
 *   summary: Top products
 *   description: Info top products ordered
 *   security:
 *    - bearerAuth: []
 *   responses: 
 *    200:
 *     description: success request
 */
routerApi.get("/dashboard/cashier-summary", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierSummary);

routerApi.get("/dashboard/cashier-last-orders", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierLastOrder);

routerApi.get("/dashboard/payment-summary", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierPaymentSummary);

routerApi.get("/dashboard/cashier-top-products", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierTopProducts);






/**
 * @openapi
 * /report/sales:
 *  get:
 *   tags:
 *    - Report
 *   summary: Report sales
 *   description: Report of sales
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: query
 *      name: start
 *      schema:
 *       type: string
 *    - in: query
 *      name: end
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /report/product:
 *  get:
 *   tags:
 *    - Report
 *   summary: Report products
 *   description: Report of products
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: query
 *      name: start
 *      schema:
 *       type: string
 *    - in: query
 *      name: end
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */
routerApi.get("/report/sales", [authMiddleware, aclMiddleware(["owner"])], reportController.sales);

routerApi.get("/report/product", [authMiddleware, aclMiddleware(["owner"])], reportController.product);



/**
 * @openapi
 * /export/excel-sales:
 *  get:
 *   tags:
 *    - Export excel
 *   summary: Export excel sales
 *   description: Export excel for sales
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: query
 *      name: start
 *      schema:
 *       type: string
 *    - in: query
 *      name: end
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */
/**
 * @openapi
 * /export/excel-product:
 *  get:
 *   tags:
 *    - Export excel
 *   summary: Export excel product
 *   description: Export excel for product
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: query
 *      name: start
 *      schema:
 *       type: string
 *    - in: query
 *      name: end
 *      schema:
 *       type: string
 *   responses: 
 *    200:
 *     description: success request
 */
routerApi.get("/export/excel-sales", [authMiddleware, aclMiddleware(["owner"])], exportController.excelSales);

routerApi.get("/export/excel-product", [authMiddleware, aclMiddleware(["owner"])], exportController.excelProduct);


export default routerApi;