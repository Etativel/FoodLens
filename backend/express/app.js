const express = require("express");
const app = express();
const passport = require("passport");
require("./services/passportConfig");

const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://192.168.56.1:5173",
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

const openaiRouter = require("../express/router/OpenAiRouter");
const foodRouter = require("../express/router/FoodRouter");
const userRouter = require("../express/router/UserRouter");
const userAuth = require("../express/router/Auth");

app.use("/openai", openaiRouter);
app.use("/food-api", foodRouter);
app.use("/user", userRouter);
app.use("/auth", userAuth.router);

app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});

const PORT = 3000;

app.listen(PORT, () => console.log("app running on port ", PORT));
