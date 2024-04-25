import express from "express";
import { updateprofilepic} from "../controllers/user.controllers.js";
import {jwtVerify} from "../middlewares/auth.middlewares.js";
import {upload} from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.route("/updateprofilepic").post(
    jwtVerify,
    upload.single("avatar"),
    updateprofilepic
)


export default router;