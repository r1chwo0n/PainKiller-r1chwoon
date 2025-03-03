import express, { ErrorRequestHandler } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import drugRoutes from "./routes/drugRoutes";
import stockRoutes from "./routes/stockRoutes";

const app = express();
const swaggerDocument = YAML.load("./swagger.yaml");

// Middleware
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// API Routes
app.use("/drugs", drugRoutes);
app.use("/stocks", stockRoutes);

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// JSON Error Middleware
const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let serializedError = JSON.stringify(err, Object.getOwnPropertyNames(err));
  serializedError = serializedError.replace(/\/+/g, "/");
  serializedError = serializedError.replace(/\\+/g, "/");
  res.status(500).send({ error: serializedError });
};
app.use(jsonErrorHandler);

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});