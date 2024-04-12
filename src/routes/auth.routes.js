import express from "express";
import { signUpUser, logInUser } from "../controllers/user.controllers.js";
import { signupValidator, loginValidator } from "../validators/user.validators.js";
import {validate} from "../validators/validate.js"


const router = express.Router();


router.route('/sign-up').post(
    signupValidator(),
    validate,
    signUpUser
);

router.route('/log-in').post(
    loginValidator(),
    validate,
    logInUser
);


export default router;