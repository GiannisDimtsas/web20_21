const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegister(data){

    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";


    //validate email
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Please insert a valid email";
    }

    //validate password
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
        errors.password = "Password must be at least 8 characters";
    }

    if (Validator.isAlpha(data.password)){
        errors.password = "Password must contain at least one number";
    }

    if(Validator.isAlphanumeric(data.password)){
        errors.password = "Password must contain at least one symbol etc (#$*&@)";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}