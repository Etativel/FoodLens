const express = require("express");
const app = express();
const passport = require("passport");
require("./services/passportConfig");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://foodlens.up.railway.app",
    ],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
    methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
// app.use(passport.session());

// PROXY: /model to Flask service
app.use(
  "/model",
  createProxyMiddleware({
    target: "https://foodlens-model-production.up.railway.app",
    changeOrigin: true,
    pathRewrite: { "^/model": "" },
    onProxyReq(proxyReq, req) {
      // forward cookies so Flask sees the JWT
      if (req.headers.cookie) {
        proxyReq.setHeader("Cookie", req.headers.cookie);
      }
    },
  })
);

const openaiRouter = require("./router/OpenAiRouter");
const foodRouter = require("./router/FoodRouter");
const userRouter = require("./router/UserRouter");
const userAuth = require("./router/Auth");
const recipeRouter = require("./router/RecipeRouter");

app.use("/openai", openaiRouter);
app.use("/food-api", foodRouter);
app.use("/recipe", recipeRouter);
app.use("/user", userRouter);
app.use("/auth", userAuth.router);

app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});

const PORT = 3000;

app.listen(PORT, () => console.log("app running on port ", PORT));
