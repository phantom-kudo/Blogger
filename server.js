const express = require("express");
const app = express();
const PORT = 8080 || process.env.PORT;
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("morgan");
const userRouter = require("./router/user");
const blogRouter = require("./router/blog");
require("dotenv/config");

app.use(logger("tiny"));
app.use(express.json());
app.use(cors());

//db
const db = process.env.MONGO_URI;

mongoose
  .set("strictQuery", true)
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

//routers
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
