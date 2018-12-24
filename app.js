var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('Express4');
var session = require("express-session");
var passport = require("passport");
var MongoStore = require("connect-mongo")(session);

var mongoose = require("mongoose");


require('./models/db');
require("./config/passport")(passport);


// routes define
var home = require("./routes/home");
var employer = require("./routes/employer");
var auth = require("./routes/auth")(passport);


// setup server
var app = express();
app.set('port', process.env.PORT || 3000);


var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'thesecret',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: { maxAge: 180 * 60 * 1000 }
}))

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(passport.initialize())
app.use(passport.session())

app.use("/", home);
app.use("/employer", employer);
app.use("/auth", auth);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});