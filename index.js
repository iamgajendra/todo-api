const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors')
const morgan = require('morgan')


//Routes
const authRoute = require("./routes/auth");
const listRoute = require('./routes/private-routes/list');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("connected to db")
);

//Middleware for logs
app.use(morgan('tiny'));

//Middlewares
app.use(express.json());
app.use(cors())

//Middlewares for Routes
app.use("/api/user", authRoute);
app.use("/api/list", listRoute);

app.listen(5000, () => console.log("Server started on port 5000"));
