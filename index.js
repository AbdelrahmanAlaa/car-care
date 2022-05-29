const cors = require("cors");
const config = require("config");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const { limiter } = require("./middleware/limiter");
const carSharingPost = require("./routes/carSharingRoutesPost");
const carSharingInfo = require("./routes/carSharingRoutesInfo");
const carWash = require("./routes/carWashRoutes");
const users = require("./routes/userRoutes");
const workers = require("./routes/workerRoutes");

dotenv.config({
  path: `${__dirname}/config/config.env`,
});

const express = require("express");
const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(express.static("img"));

app.use("/api", limiter);
app.use("/api/users", users);
app.use("/api/worker", workers);
app.use("/api/carWash", carWash);
app.use("/api/carSharingPost", carSharingPost);
app.use("/api/carSharingInfo", carSharingInfo);

mongoose
  .connect("mongodb://localhost/graduation-project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected is done ");
    const port = process.env.PORT || 3030;
    app.listen(port, () =>
      console.log(`Listening on port http://localhost:${port} ...`)
    );
  })
  .catch((err) => {
    console.log("something is wrong .. ", err);
  });

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR : jwtPrivateKey is not defined ");
  exit(0);
}
