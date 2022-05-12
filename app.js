const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const dotenv = require('dotenv')

dotenv.config()

const db = require("./config/connection"); //mongodb connection calling from file config
db.connect(); //calling method 'connect' from config file

const indexRouter = require("./routes/index");

const app = express();

//session management
app.use(session({ secret: "key", cookie: { maxAge: 600000 } }));
app.use((req, res, next) => {
    res.set("Cache-Control", "no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0");
    next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));



app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
