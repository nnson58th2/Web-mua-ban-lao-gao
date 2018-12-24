var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");

var Employer = mongoose.model("Employer");


module.exports = function (passport) {
    router.post('/signup', function (req, res) {
        var body = req.body,
            email = body.email,
            password = body.password;
        Employer.findOne({
            email: email
        }, function (err, doc) {
            if (err) {
                res.status(500).send('error occured')
            } else {
                if (doc) {
                    res.status(500).send('Username already exists')
                } else {
                    var record = new Employer()
                    record.email = email;
                    record.password = record.hashPassword(password)
                    record.save(function (err, employer) {
                        if (err) {
                            res.status(500).send('db error')
                        } else {
                            res.redirect('employer/login')
                        }
                    })
                }
            }
        })
    });


    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/employer/login',
        successRedirect: '/employer',
    }), function (req, res) {
        res.send('hey')
    })
    return router;
};