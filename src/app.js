import dotenv from "dotenv";
import express, { json } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import authRoutes from "./routes/user.js";
import merchantRoutes from "./routes/merchant.js";
import taxRoutes from "./routes/tax.js";
import shippingRoutes from "./routes/shipping.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import discountRoutes from "./routes/discount.js";
import orderRoutes from "./routes/order.js";
import customerRoutes from "./routes/customer.js";
import env from "./utils/validateEnv.js";

dotenv.config();
const app = express();

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_APIKEY,
  api_secret: env.CLOUDINARY_SECRETKEY,
  secure: true,
});
const corsOptions = {
  origin: "*", // Allows requests from all domains. Specify actual domain in production for security.
  optionsSuccessStatus: 200, // Ensure compatibility by setting OPTIONS success status to 200 OK.
};
app.use(cors(corsOptions)); //allow cross origin request connecting two different apps
app.use(morgan("dev")); //log http requests in dev mode
app.use(json({ limit: "25mb" })); //parse request as json object

app.disable("x-powered-by"); //disable header information sent to frontend

app.get("/", (req, res) => {
  res.send("Hello express");
});

//api routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/merchant", merchantRoutes);
app.use("/api/v1/tax", taxRoutes);
app.use("/api/v1/shipping", shippingRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/discount", discountRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/customer", customerRoutes);

//error handling for wrong endpoints
app.use((req, res, next) => {
  return next(createHttpError(404, "Endpoint not found"));
});

//handle api errors
app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = "An unknown error has occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
