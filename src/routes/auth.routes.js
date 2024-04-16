import express from "express";
import { signUpUser, logInUser, logOutUser } from "../controllers/user.controllers.js";
import { signupValidator, loginValidator } from "../validators/user.validators.js";
import {validate} from "../validators/validate.js"
import {verifyJwt} from "../middlewares/auth.middlewares.js"


const router = express.Router();


router.route('/signup').post(
    signupValidator(),
    validate,
    signUpUser
);

router.route('/login').post(
    loginValidator(),
    validate,
    logInUser
);

router.route("/logout").post(
    verifyJwt,
    logOutUser
)




export default router;