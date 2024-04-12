import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { User } from "../models/user.models";


export const verifyJwt = asyncHandler(async (req, res, next ) =>{
    const token = req.cookies.refershToken;
    
    if(!token) {
        throw new ApiError(400, "Unautherized Request!");
    };

    const decordedToken = jwt.verify(token,process.env.REFERSH_TOKEN_SECRET);

    const user = await User.findById(decordedToken.id).select("-password -refershToken");

    if(!user) {
        throw new ApiError(400, "Invalid Refersh Token");
    }

    req.user = user;
    next();
})