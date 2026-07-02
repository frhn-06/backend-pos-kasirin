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


// /////////////////////////////////////////////////////////////////////////////////////////////////
routerApi.post("/auth/register", authController.register
/**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/RegisterRequest'
          }
        }
      }
    }
 */
);

routerApi.post("/auth/activation", authController.activation
/**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/ActivationRequest'
          }
        }
      }
    }
 */
);

routerApi.post("/auth/login", authController.login
/**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/LoginRequest'
          }
        }
      }
    }
 */
);

routerApi.get("/auth/me", [authMiddleware], authController.getMeByToken
/**
    #swagger.tags = ["Auth"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

routerApi.post("/auth/create-cashier", [authMiddleware, aclMiddleware(["owner"])], authController.createUserCashier
/**
    #swagger.tags = ["Auth"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/RegisterRequest'
          }
        }
      }
    }
 */
);

routerApi.put("/auth/update-user", [authMiddleware, aclMiddleware(["owner", "cashier"])], authController.update
/**
    #swagger.tags = ["Auth"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/UpdateUserRequest'
          }
        }
      }
    }
 */
);

routerApi.put("/auth/update-password", [authMiddleware, aclMiddleware(["owner", "cashier"])], authController.updatePassword
/**
    #swagger.tags = ["Auth"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/UpdatePasswordUserRequest'
          }
        }
      }
    }
 */
);

routerApi.get("/user/cashier/find", [authMiddleware, aclMiddleware(["owner"])], authController.findUserCashier
/**
    #swagger.tags = ["Auth"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

routerApi.get("/user/my-profile", [authMiddleware, aclMiddleware(["owner", "cashier"])], authController.findMyUser
/**
    #swagger.tags = ["Auth"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);
// /////////////////////////////////////////////////////////////////////////////////////////////////












// /////////////////////////////////////////////////////////////////////////////////////////////////
routerApi.post("/category", [authMiddleware, aclMiddleware(["owner"])], categoryController.create
/**
    #swagger.tags = ["Category"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/CategoryRequest'
          }
        }
      }
    }
 */
)

routerApi.get("/category", [authMiddleware], categoryController.findAllByStoreId
/**
    #swagger.tags = ["Category"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
)

routerApi.get("/category/:categoryId", [authMiddleware], categoryController.findById
/**
    #swagger.tags = ["Category"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
)

routerApi.put("/category/:categoryId/update", [authMiddleware, aclMiddleware(["owner"])], categoryController.update
/**
    #swagger.tags = ["Category"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/CategoryRequest'
          }
        }
      }
    }
 */
)

routerApi.delete("/category/:categoryId/remove", [authMiddleware, aclMiddleware(["owner"])], categoryController.remove
/**
    #swagger.tags = ["Category"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);
// /////////////////////////////////////////////////////////////////////////////////////////////////







// /////////////////////////////////////////////////////////////////////////////////////////////////
routerApi.post("/store", [authMiddleware, aclMiddleware(["owner"])], storeController.create
/**
    #swagger.tags = ["Store"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/StoreRequest'
          }
        }
      }
    }
 */
);

routerApi.get("/store", [authMiddleware], storeController.findStoreByUser
/**
    #swagger.tags = ["Store"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

routerApi.put("/store/:storeId", [authMiddleware, aclMiddleware(["owner"])], storeController.update
/**
    #swagger.tags = ["Store"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/StoreRequest'
          }
        }
      }
    }
 */
);
// /////////////////////////////////////////////////////////////////////////////////////////////////








// /////////////////////////////////////////////////////////////////////////////////////////////////
routerApi.post("/product", [authMiddleware, aclMiddleware(["owner"])], productController.create
/**
    #swagger.tags = ["Product"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/ProductRequest'
          }
        }
      }
    }
 */
);

routerApi.get("/product", [authMiddleware], productController.findAll
/**
    #swagger.tags = ["Product"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['page'] = {
      in: 'query',
      type: 'integer',
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      type: 'integer',
    }
    #swagger.parameters['search'] = {
      in: 'query',
      type: 'string',
    }
    #swagger.parameters['category'] = {
      in: 'query',
      type: 'string',
    }
 */
);

routerApi.get("/product/:productId", [authMiddleware], productController.findOne
/**
    #swagger.tags = ["Product"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

routerApi.put("/product/:productId", [authMiddleware, aclMiddleware(["owner"])], productController.update
/**
    #swagger.tags = ["Product"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/ProductRequest'
          }
        }
      }
    }
 */
);

routerApi.delete("/product/:productId", [authMiddleware, aclMiddleware(["owner"])], productController.remove
/**
    #swagger.tags = ["Product"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);
// /////////////////////////////////////////////////////////////////////////////////////////////////




// /////////////////////////////////////////////////////////////////////////////////////////////////
routerApi.post("/media/upload-single", [authMiddleware, aclMiddleware(["owner", "cashier"]), mediaMiddleware.single("file")], mediaController.uploadSingle
/**
    #swagger.tags = ["Media"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      requied: true,
      content: {
        "multipart/form-data" : {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary"
              }
            }
          }
        }
      }
    }
 */
);

routerApi.delete("/media/remove-single", [authMiddleware, aclMiddleware(["owner", "cashier"])], mediaController.removeSingle
/**
    #swagger.tags = ["Media"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      content: {
        "application/json": {
          $ref: '#/components/schema/RemoveMediaRequest'
        }
      }
    }
 */
);
// /////////////////////////////////////////////////////////////////////////////////////////////////




// /////////////////////////////////////////////////////////////////////////////////////////////////
routerApi.post("/order", [authMiddleware, aclMiddleware(["cashier"])], orderController.create
/**
    #swagger.tags = ["Order"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/OrderRequest'
          }
        }
      }
    }
 */
);

routerApi.get("/order", [authMiddleware, aclMiddleware(["owner", "cashier"])], orderController.findAllOrders
/**
    #swagger.tags = ["Order"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['page'] = {
      in: 'query',
      type: 'integer',
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      type: 'integer',
    }
    #swagger.parameters['search'] = {
      in: 'query',
      type: 'string',
    }
    #swagger.parameters['status'] = {
      in: 'query',
      type: 'string',
    }
    #swagger.parameters['paymentMethod'] = {
      in: 'query',
      type: 'string',
    }
    #swagger.parameters['cashierId'] = {
      in: 'query',
      type: 'string',
    }
    #swagger.parameters['start'] = {
      in: 'query',
      type: 'string',
    }
    #swagger.parameters['end'] = {
      in: 'query',
      type: 'string',
    }
 */
);

routerApi.get("/order/:orderId", [authMiddleware], orderController.findOneById
/**
    #swagger.tags = ["Order"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

routerApi.patch("/order/:orderId/cancel", [authMiddleware], orderController.cancelled
/**
    #swagger.tags = ["Order"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/OrderRequest'
          }
        }
      }
    }
 */
);

routerApi.patch("/order/:orderId/uncancel", [authMiddleware], orderController.uncancel
/**
    #swagger.tags = ["Order"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/OrderRequest'
          }
        }
      }
    }
 */
);
// /////////////////////////////////////////////////////////////////////////////////////////////////




// /////////////////////////////////////////////////////////////////////////////////////////////////
routerApi.get("/dashboard/owner-summary", [authMiddleware, aclMiddleware(["owner"])], dashboardController.OwnerSummary
/**
    #swagger.tags = ["Dashboard Owner"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

routerApi.get("/dashboard/sales-trend", [authMiddleware, aclMiddleware(["owner"])], dashboardController.salesTrend
/**
    #swagger.tags = ["Dashboard Owner"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

routerApi.get("/dashboard/owner-top-products", [authMiddleware, aclMiddleware(["owner"])], dashboardController.OwnertopProducts
/**
    #swagger.tags = ["Dashboard Owner"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

routerApi.get("/dashboard/owner-last-orders", [authMiddleware, aclMiddleware(["owner"])], dashboardController.OwnerlastOrders
/**
    #swagger.tags = ["Dashboard Owner"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);
// /////////////////////////////////////////////////////////////////////////////////////////////////




// /////////////////////////////////////////////////////////////////////////////////////////////////
routerApi.get("/dashboard/cashier-summary", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierSummary
/**
    #swagger.tags = ["Dashboard Cashier"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

routerApi.get("/dashboard/cashier-last-orders", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierLastOrder
/**
    #swagger.tags = ["Dashboard Cashier"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

routerApi.get("/dashboard/payment-summary", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierPaymentSummary
/**
    #swagger.tags = ["Dashboard Cashier"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

routerApi.get("/dashboard/cashier-top-products", [authMiddleware, aclMiddleware(["cashier", "owner"])], dashboardController.CashierTopProducts
/**
    #swagger.tags = ["Dashboard Cashier"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);
// /////////////////////////////////////////////////////////////////////////////////////////////////






// /////////////////////////////////////////////////////////////////////////////////////////////////
routerApi.get("/report/sales", [authMiddleware, aclMiddleware(["owner"])], reportController.sales
/**
    #swagger.tags = ["Report"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['start'] = {
      in: 'query',
      type: 'string',
    }
    #swagger.parameters['end'] = {
      in: 'query',
      type: 'string',
    }
 */
);

routerApi.get("/report/product", [authMiddleware, aclMiddleware(["owner"])], reportController.product
/**
    #swagger.tags = ["Report"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['start'] = {
      in: 'query',
      type: 'string',
    }
    #swagger.parameters['end'] = {
      in: 'query',
      type: 'string',
    }
 */
);
// /////////////////////////////////////////////////////////////////////////////////////////////////



// /////////////////////////////////////////////////////////////////////////////////////////////////
routerApi.get("/export/excel-sales", [authMiddleware, aclMiddleware(["owner"])], exportController.excelSales
/**
    #swagger.tags = ["Export"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['start'] = {
      in: 'query',
      type: 'string',
    }
    #swagger.parameters['end'] = {
      in: 'query',
      type: 'string',
    }
 */
);

routerApi.get("/export/excel-product", [authMiddleware, aclMiddleware(["owner"])], exportController.excelProduct
/**
    #swagger.tags = ["Export"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['start'] = {
      in: 'query',
      type: 'string',
    }
    #swagger.parameters['end'] = {
      in: 'query',
      type: 'string',
    }
 */
);
// /////////////////////////////////////////////////////////////////////////////////////////////////


export default routerApi;