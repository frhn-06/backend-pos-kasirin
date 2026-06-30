import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import fs from "fs";


const docs = (app: Express) => {
    console.log(fs.existsSync("./src/routes/api.ts"));
    console.log(swaggerSpec);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            explorer: true,
        })
    );
};

export default docs;