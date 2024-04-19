import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.models.js";


const addToChat = asyncHandler(async (req, res) => {
    // login required 
    // find enterd username 
    // check username is Exist or not 
    // check Username != logedin user
    // find user by username or id
    // add user in chat model



    return res.status(200).json(new ApiResponse(200, ""))
});

const searchAvailableUsers = asyncHandler(async (req, res) => {
    const users = await User.aggregate([
        {
            $match: {
                _id: {
                    $ne: req.user._id
                }
            }
        },
        {
            $project: {
                avatar: 1,
                username: 1,
                email: 1
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "User Fetch Successfully.",
                users
            )
        );
})

export {
    addToChat,
    searchAvailableUsers,
}