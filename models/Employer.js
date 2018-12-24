var mongoose = require('mongoose');

var bcrypt = require("bcrypt-nodejs");

var EmployerSchema = new mongoose.Schema({
    fullname: String,
    img: String,
    email: String,
    password: String,
}, {
    usePushEach: true // add this becasue $pushall is nolonger support in mongose 3.4>
});

EmployerSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

EmployerSchema.methods.comparePassword = function (password, hash) {
    return bcrypt.compareSync(password, hash)
}

mongoose.model('Employer', EmployerSchema);