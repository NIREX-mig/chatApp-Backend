import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/apiResponse.js"
import { upploadOnCloudinary } from "../utils/FileUpload.js"
import { sendEmail, sendForgotPasswordEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const genrateRefershToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const refershToken = user.genrateRefershToken();

        user.refershToken = refershToken;
        await user.save({ validateBeforeSave: false });
        return refershToken;

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Something went worng during create token!"))
    }
};


/*------------------------------ 
    Signup : /api/v1/auth/signup
------------------------------*/
const signUpUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        return res.status(400).json(new ApiResponse(400, "Email already exist!"));
    }

    const createdUser = await User.create({
        username,
        email,
        password
    });

    const user = await User.findById(createdUser._id).select("-password -refershToke");

    if (!user) {
        return res.status(400).json(new ApiResponse(400, "Error occured during Register"));
    };


    return res
        .status(200)
        .json(
            new ApiResponse(200, "Successfully register", user)
        );
});


/*------------------------------ 
    login : /api/v1/auth/login
------------------------------*/
const logInUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json(new ApiResponse(400, "Invalid User Credential! "));
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        return res.status(401).json(new ApiResponse(401, "Invalid User Credential! "));
    }

    const refershToken = await genrateRefershToken(user._id);

    const logedInUser = await User.findById(user._id).select("-password -refershToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    await sendEmail(user.email, user.username);

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


/*------------------------------ 
    Logout : /api/v1/auth/logout
------------------------------*/
const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refershToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("refershToken", options)
        .json(
            new ApiResponse(200, "Logout Successfully", {})
        );
})

/*------------------------------ 
    UpdateProfilePic : /api/v1/user/updateprofilepic
------------------------------*/
const updateprofilepic = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        return res.status(400).json(new ApiResponse(400, "Avatar file is required"));
    }

    // upload them to cloudinary
    const avatar = await upploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        return res.status(400).json(new ApiResponse(400, "Avatar file is required"));
    }

    // find loged in user
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(400).json(new ApiResponse(400, "Login Required!"));
    }

    // save avatar in database
    user.avatar = avatar.url;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Profile pic Update successfully."));
});

/*------------------------------ 
    ForgotPassword : /api/v1/auth/forgotpassword
------------------------------*/
const forgotPassword = asyncHandler(async (req, res) => {
    const { newpassword } = req.body;
    const token = req.query?.token;

    if (!token) {
        return res.status(400).json(new ApiResponse(400, "Not Allowed!"));
    }

    const decordedToken = jwt.verify(token, process.env.TEMP_TOKEN_SECRET);

    const user = await User.findById(decordedToken.id);

    if (!user) {
        return res.status(400).json(new ApiResponse(400, "Not Allowed!"));
    }

    user.password = newpassword;

    await user.save();

    return res.status(200).json(new ApiResponse(200, "Forgot password successfully"));
});

/*------------------------------ 
    ForgotPasswordRequest : /api/v1/auth/forgotpasswordRequest
------------------------------*/
const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json(new ApiResponse(400, "Invalid Email!"))
    }

    const payload = {
        id: user._id,
    }

    const tempToken = jwt.sign(payload, process.env.TEMP_TOKEN_SECRET, {
        expiresIn: "10m"
    });

    sendForgotPasswordEmail(user.email, user.username, tempToken);

    user.forgotPasswordToken = tempToken;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, "Sent Forgot password Email.", { tempToken }))
})

/*------------------------------ 
    RefershToken : /api/v1/auth/refershtoken;
------------------------------*/
const fetchRefershToken = asyncHandler(async (req, res) => {
    const incommingRefershToken = req.cookies.refershToken || req.body.refershToken;

    if (!incommingRefershToken) {
        return res.status(401).json(new ApiResponse(401, "Unautherized Access!"));
    }

    try {
        const decorededToken = jwt.verify(incommingRefershToken, process.env.REFERSH_TOKEN_SECRET);

        const user = await User.findById(decorededToken.id);

        if (!user) {
            return res.status(401).json(new ApiResponse(401, "Invalid Refersh Token"));
        }

        if (incommingRefershToken !== user?.refershToken) {
            return res.status(401).json(new ApiResponse(401, "Refersh Token Is Exprired Or Used!"));
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const newRefershToken = await genrateRefershToken(user._id);

        return res
            .status(200)
            .cookie("refershToken", newRefershToken, options)
            .json(new ApiResponse(200, "Token Resfershed.",newRefershToken))

    } catch (error) {
        const Error = error.message;
        return res.status(401).json(new ApiResponse(401, "Invalid Refersh Token", { Error }));
    }
});

export {
    signUpUser,
    logInUser,
    logOutUser,
    updateprofilepic,
    forgotPassword,
    forgotPasswordRequest,
    fetchRefershToken,

}