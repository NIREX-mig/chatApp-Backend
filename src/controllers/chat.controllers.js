import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js"
import mongoose from "mongoose";


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

    // find duplicate chat 
    // const chat = await Chat.aggregate([
        // {
        //     $match: {
        //         admin: new mongoose.Types.ObjectId(req.user?._id),
        //         $and: [
        //             {
        //                 participants: { $elemMatch : { $eq : req.user._id}}
        //             },
        //             {
        //                 participants: { $elemMatch : { $eq : new mongoose.Types.ObjectId(receiverId)}}
        //             }
        //         ]
        //     }
        // },
        // {
        //     $lookup : {
        //         from : "users",
        //         foreignField : "_id",
        //         localField : "participants",
        //         as : "participants",
        //         pipeline : [
        //             {
        //                 $project : {
        //                     password : 0,
        //                     refershToken : 0,
        //                     forgetPasswordToken : 0,
        //                     createdAt : 0,
        //                     updatedAt : 0,
        //                 }
        //             }
        //         ]
        //     }
        // }

    const chat = await Chat.aggregate([
        {
            $match: {
                admin: new mongoose.Types.ObjectId(req.user?._id),
                $and: [
                    {
                        participants: new mongoose.Types.ObjectId(req.user?._id)
                    },
                    {
                        participants: new mongoose.Types.ObjectId(receiverId)
                    }
                ]
            }
        },
    ]);

    if (chat.length) {
        return res.status(400).json(new ApiResponse(400, "Chat Allready Exist."));
    }

    const newChatInstance = await Chat.create({
        name: "onetoonechat",
        participants: [req.user._id, new mongoose.Types.ObjectId(receiverId)],
        admin: req.user._id
    })

    const createdChat = await Chat.aggregate([
        {
            $match : {
                _id : newChatInstance._id,
            },
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
                            refershToken : 0,
                            forgetPasswordToken : 0,
                            createdAt : 0,
                            updatedAt : 0,
                        }
                    }
                ]
            }
        },
        {
            $project : {
                participants : {
                    $filter : {
                        input : "$participants",
                        as : "participants",
                        cond : { $ne : ["$$participants._id", req.user._id]}
                    }
                },
            }
        },
        {
            $addFields : {
                participants : {
                    $arrayElemAt : ["$participants", 0]
                }
            }
        }
    ])
    const payload = createdChat[0];
    
    if(!payload) {
        return res.status(500).json(new ApiResponse(500,"Internal server error"));
    }

    return res.status(200).json(new ApiResponse(200, "Chat Created Successfully.", payload))
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
                participants : { $elemMatch : { $eq : req.user._id}}
            }
        },
        {
            $sort : {
                updatedAt : -1,
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "participants",
                as: "participants",
                pipeline: [
                    {
                        $project: {
                            password: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            refershToken: 0,
                        }
                    }
                ]
            }
        },
        {
            $project : {
                participants : {
                    $filter : {
                        input : "$participants",
                        as : "participants",
                        cond : { $ne : ["$$participants._id", req.user._id] }
                    }
                }
            }
        },
        {
            $addFields : {
                participants : {
                    $arrayElemAt : ["$participants", 0]
                }
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, "Fetch All Chats", chats))
})



export {
    createOneToOnechat,
    searchAvailableUsers,
    fetchAllChats,
}