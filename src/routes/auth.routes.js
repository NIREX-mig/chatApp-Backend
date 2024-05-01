import express from "express";
import { signUpUser, logInUser, logOutUser, forgotPassword, forgotPasswordRequest, fetchRefershToken } from "../controllers/user.controllers.js";
import { signupValidator, loginValidator } from "../validators/user.validators.js";
import {validate} from "../validators/validate.js"
import {jwtVerify} from "../middlewares/auth.middlewares.js"


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
    jwtVerify,
    logOutUser
)

router.route("/forgotpasswordrequest").post(
    forgotPasswordRequest
);

router.route("/forgotpassword").patch(
    forgotPassword
);

router.route("/refershtoken").post(
    fetchRefershToken
)




export default router;