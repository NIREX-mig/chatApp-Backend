import { body } from "express-validator";

const signupValidator = () => {
    return [
        body("username", "username atleast 3 char").notEmpty().isLength({min : 3}),
        body("email", "Enter a valid Email").isEmail(),
        body("password", "password contain atleast 8 char").isLength({ min: 8 })
    ];
}

const loginValidator = () => {
    return [
        body("email", "Enter a valid Email").isEmail(),
        body("password", "password contain atleast 3 char").isLength({ min: 8 })
    ];
}

export {
    signupValidator,
    loginValidator
}