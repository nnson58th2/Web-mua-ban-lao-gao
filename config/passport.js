var localStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose");
var Admin = mongoose.model("Employer");

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user)
    })
    passport.deserializeUser(function (user, done) {
        done(null, user)
    })

    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, function (username, password, done) {
            Admin.findOne({email: username}, function (err, doc) {
                if (err) {
                    done(err)
                } else {
                    if (doc) {
                        var valid = doc.comparePassword(password, doc.password)
                        if (valid) {
                            // do not add password hash to session
                            done(null, {
                                email: doc.email,
                                id: doc._id
                            })
                        } else {
                            done(null, false)
                        }
                    } else {
                        done(null, false)
                    }
                }
            })
    }))
}