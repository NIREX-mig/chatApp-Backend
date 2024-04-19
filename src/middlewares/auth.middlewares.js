import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import ApiResponse from "../utils/apiResponse.js"

export const verifyJwt = asyncHandler(async (req, res, next ) =>{
    const token = req.cookies?.refershToken || req.header("Authorization") 
    // ?.replace("Bearer", "");
    
    if(!token) {
        return res.status(400).json(new ApiResponse(400, "Unautherized Request!"));
    };

    const decordedToken = jwt.verify(token,process.env.REFERSH_TOKEN_SECRET);

    const user = await User.findById(decordedToken.id).select("-password -refershToken");

    if(!user) {
        return res.status(400).json(new ApiResponse(400, "Invalid Refersh Token"));
    }

    req.user = user;
    next();
})