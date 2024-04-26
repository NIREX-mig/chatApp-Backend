import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js"
import mongoose, { mongo } from "mongoose";


/*------------------------------ 
    CreateOneToOneChat : /api/v1/chat/createonetoonechat
------------------------------*/
const createOneToOnechat = asyncHandler(async (req, res) => {
    const { receiverId } = req.params;

    // Check if it's a valid receiver
    const receiver = await User.findById(receiverId).select("-password -refershToken -forgotPasswordToken -createdAt -updatedAt");

    if (!receiver) {
        return res.status(400).json(new ApiResponse(400, "User Dose Not Exits!"));
    }

    if (receiverId === req.user._id) {
        return res.status(400).json(new ApiResponse(400, "Not Allowed Chat With Yourself!"));
    }

    const chat = await Chat.aggregate([
        {
            $match : {
                admin : new mongoose.Types.ObjectId(req.user?._id),
                $and : [
                    {
                        participants : new mongoose.Types.ObjectId(req.user?._id)
                    },
                    {
                        participants : new mongoose.Types.ObjectId(receiverId)
                    }
                ]
            }
        }

    ]);

    if(chat.length) {
        return res.status(400).json(new ApiResponse(400, "Chat Already Added!"));
    }

    const newChat = await Chat.create({
        name: "onetoonechat",
        participants: [req.user._id, new mongoose.Types.ObjectId(receiverId)],
        admin: req.user._id
    })

    return res.status(200).json(new ApiResponse(200, "Chat Created Successfully.", { receiver }))
});

/*------------------------------ 
    SearchAvailableUsers : /api/v1/auth/signup
------------------------------*/
const searchAvailableUsers = asyncHandler(async (req, res) => {
    const users = await User.aggregate([
        {
            $match: {
                _id: {
                    $ne: req.user?._id
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

/*------------------------------ 
    fetchAllChats : /api/v1/auth/signup
------------------------------*/
const fetchAllChats = asyncHandler(async (req, res) => {
    const chats = await Chat.aggregate([
        {
            $match: {
                admin : req.user?._id,
            }
        },
        {
            $lookup : {
                from : "users",
                foreignField : "_id",
                localField : "participants",
                as : "participants",
                pipeline : [
                    {
                        $project : {
                            password : 0,
                            createdAt : 0,
                            updatedAt : 0,
                            refershToken : 0,
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                receiver : {
                    $arrayElemAt : ["$participants", 1]
                }
            }
        },
        {
            $project : {
                name : 0, 
                admin : 0,
                createdAt : 0,
                updatedAt : 0,
                participants : 0,
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, "Fetch All Chats", { chats }))
})

export {
    createOneToOnechat,
    searchAvailableUsers,
    fetchAllChats,
}