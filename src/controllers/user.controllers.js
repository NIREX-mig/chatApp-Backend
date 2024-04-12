import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"

const genrateRefershToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const refershToken = user.genrateRefershToken();
        console.log("token");

        user.refershToken = refershToken;
        await user.save({ validateBeforeSave: false});
        return refershToken;

    } catch (error) {
        throw new ApiError(500, "Something went worng during create token!")
    }
};


const signUpUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(400, "Email already exist!",);
    }

    const createdUser = await User.create({
        username,
        email,
        password
    });

    const user = await User.findById(createdUser._id).select("-password -refershToke");

    if (!user) {
        throw new ApiError(400, "Error occured during Register");
    };


    return res
        .status(200)
        .json(
            new ApiResponse(200, "Successfully register", user)
        );
});

const logInUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Invalid User Credential! ");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid User Credentials!")
    }

    const refershToken = await genrateRefershToken(user._id);

    const logedInUser = await User.findById(user._id).select("-password -refershToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("refershToken", refershToken, options)
        .json(
            new ApiResponse(200,
                "Login Successfully",
                {
                    user: logedInUser,
                    refershToken
                }

            )
        )





})


export {
    signUpUser,
    logInUser,

}