import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";

const options: swaggerJSDoc.Options = {
    definition: {
      openapi: "3.0.0",

      info: {
        title: "POS SaaS Kasirin API",
        version: "1.0.0",
        description: "REST API Documentation for POS SaaS Kasirin",
      },

      servers: [
      {
          url: "http://localhost:3001/api",
          description: "Development Local",
      },
      {
          url: "https://backend-pos-kasirin.vercel.app/api",
          description: "Development Server",
      },
      ],

      components: {
        securitySchemes: {
            bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            },
        },

        schemas: {
          RegisterRequest: {
            type: "object",
            properties: {
              email: {
                type: "string",
                example: "example@gmail.com" 
              },
              fullName: {
                type: "string",
                example: "full name" 
              },
              userName: {
                type: "string",
                example: "user name" 
              },
              password: {
                type: "string",
                example: "***",
              },
              confirmPassword: {
                type: "string",
                example: "***"
              }
            }
          },
          ActivationRequest: {
            type: "object",
            properties: {
              code: {
                type: "string",
                example: "123"
              }
            }
          },
          LoginRequest: {
            type: "object",
            properties: {
              identifier: {
                type: "string",
                example: "example@gmail.com / user name" 
              },
              password: {
                type: "string",
                example: "***",
              },
            }
          },
          UpdateUserRequest: {
            type: "object",
            properties: {
              fullName: {
                type: "string",
                example: "full name" 
              },
              userName: {
                type: "string",
                example: "user name",
              },
            }
          },
          UpdatePasswordUserRequest: {
            type: "object",
            properties: {
              password: {
                type: "string",
                example: "***" 
              },
            }
          },
          StoreRequest: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "store name" 
              },
              adderss: {
                type: "string",
                example: "Jl. sudirman",
              },
              phone: {
                type: "number",
                example: 857,
              },
              description: {
                type: "string",
                example: "description",
              },
              timeZone: {
                type: "string",
                example: "time zone",
              },
            },
          },
          CategoryRequest: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "category name" 
              },
              img: {
                type: "string",
                example: "foto.png",
              },
            },
          },
          ProductRequest: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "category name" 
              },
              img: {
                type: "string",
                example: "foto.png",
              },
              price: {
                type: "number",
                example: 1000 
              },
              categoryId: {
                type: "string",
                example: "[id]",
              },
              description: {
                type: "string",
                example: "description",
              },
            },
          },
          OrderRequest: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    productId: {
                      type: "string",
                      example: "[id]"
                    },
                    qty: {
                      type: "number",
                      example: 1
                    }
                  }
                }
              },
              paidAmount: {
                type: "number",
                example: 50000
              },
              paymentMethod: {
                type: "string",
                enum: ["cash", "qris", "transfer"],
                example: "cash"
              }
            }
          },
          RemoveMediaRequest: {
            type: "object",
            properties: {
              url: {
                type: "string",
                example: "cloudinary.png"
              }
            }
          }
        },
      },
    },

    apis: ["./src/routes/**/*.ts"],
};
const swaggerSpec = swaggerJSDoc(options);

fs.writeFileSync(
  path.join(__dirname, "swagger-output.json"),
  JSON.stringify(swaggerSpec, null, 2)
);

export default swaggerSpec;