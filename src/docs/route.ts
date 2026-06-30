import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

const docs = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            explorer: true,
        })
    );
};

export default docs;