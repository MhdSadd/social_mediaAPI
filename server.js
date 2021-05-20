const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();
//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//::::::::::::::::::::: DB connect::::::::::::::::::::
const { MongoURI } = require("./config/configurations");
mongoose
  .connect(MongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("err");
  });

// :::::passport middleware config::::
passport.use(passport.initialize());

//:::::passport config::::::::::::
require("./config/passport")(passport);


//::::::ROUTES GROUPING::::::::::::::::::::::
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/post", posts);

const port = process.env.PORT || 5500;
app.listen(port, (req, res) => {
  console.log(`server started at port ${port}`);
});
