import { Express } from "express";
import swaggerUi from "swagger-ui-express";
// import swaggerSpec from "./swagger";
import swaggerOutputJson from './swagger-output.json';


const docs = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutputJson, {
            explorer: true,
        })
    );
    console.log("generate swagger")
};

export default docs;