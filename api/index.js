const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./routes/auth");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB conection successfull"))
.catch((error) => console.error(error));

app.use("/api/auth", authRoute);

app.listen(8800, () => {
  console.log('API Server is running');
});

