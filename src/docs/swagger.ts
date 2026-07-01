import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',          
    title: 'POS SaaS Kasirin API',             
    description: 'REST API Documentation for POS SaaS Kasirin'     
  },
  servers: [
    {
      url: 'http://localhost:3001/api',      
      description: 'Development Local'    
    },
    {
      url: 'https://backend-pos-kasirin.vercel.app/api', 
      description: 'Deployment Server'     
    },
  ],
  components: {
    securitySchemes:{
      bearerAuth: {
          type: "http",
          scheme: "bearer"
      }
    },
    schemas: {
      RegisterRequest: {
        email: "@gmail.com",
        fullName: "namalengkap",
        userName: "username",
        password: "p",
        confirmPassword: "confirm p"
      },
      ActivationRequest: {
        code: "123"
      },
      LoginRequest: {
        identifier: "alwanbocil@gmail.com / username",
        password: "p"
      },
      UpdateUserRequest: {
        fullName: "namalengkap",
        userName: "username"
      },
      UpdatePasswordUserRequest: {
        oldPassword: "p lama",
        newPassword: "p baru",
        confirmNewPassword: "confirm p baru"
      },
      StoreRequest: {
        name: "nama toko",
        address: "Jl. sudirman",
        phone: 857,
        description: "",
        timeZone: ""
      },
      CategoryRequest: {
        name: "nama kategori",
        img: ".png"
      },
      ProductRequest: {
        name: "nama produk",
        img: ".png",
        price: 1000,
        categoryId: "[id]",
        description: ""
      },
      OrderRequest: {
        items: [
          {
            productId: "[id]",
            qty: 2,
          }
        ],
        paidAmount: 1000,
        paymentMethod: "cash"
      
      },
      RemoveMediaRequest: {
        url: "cloudinary.png"
      }
    }
  }            
};

const outputFile = './swagger-output.json';
const routes = ['../routes/api.ts'];



swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);
console.log("berhasil mendokumentasikan")