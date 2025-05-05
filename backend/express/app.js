const express = require("express");
const app = express();
const passport = require("passport");
// require("./services/passportAdmin");
// require("./services/passport");

// require("./services/passportConfig");

const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
    methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  })
);

app.use(passport.initialize());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
// app.use(passport.initialize());
// app.use(passport.session());

const openaiRouter = require("../express/router/OpenAiRouter");
const foodRouter = require("../express/router/FoodRouter");

app.use("/openai", openaiRouter);
app.use("/food-api", foodRouter);

app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});

const PORT = 3000;

app.listen(PORT, () => console.log("app running on port ", PORT));
