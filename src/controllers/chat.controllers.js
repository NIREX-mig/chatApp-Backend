import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js"
import mongoose from "mongoose";



const createOneToOnechat = asyncHandler(async (req, res) => {
    const { receiverId } = req.params;

    // Check if it's a valid receiver
    const receiver = await User.findById(receiverId).select("-password -refershToken -forgotPasswordToken");

    if (!receiver) {
        return res.status(400).json(new ApiResponse(400, "User Dose Not Exits!"));
    }

    if (receiverId === req.user._id) {
        return res.status(400).json(new ApiResponse(400, "Not Allowed Chat With Yourself!"));
    }

    // const chat = await Chat.aggregate([
    //     {
    //         $match : {
    //             $and : [
    //                 {
    //                     participants : { $elemMatch : req.user._id}
    //                 },
    //                 {
    //                     participants : { $elemMatch : new mongoose.Types.ObjectId(receiverId)}
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         $lookup : {
    //             from : "user",
    //             foreignField : "_id",
    //             localField : "participants",
    //             as : "participants",
    //             pipeline : {
    //                 $project : {
    //                     password : 0,
    //                     refershToken : 0,
    //                     forgotPasswordToken : 0
    //                 }
    //             }
    //         }
    //     }
    // ]);

    // if(chat.length) {
    //     return res.status(200).json(new ApiResponse(200, "chat reterived successfully"));
    // }

    const newChat = await Chat.create({
        name: "onetoonechat",
        participants: [req.user._id, new mongoose.Types.ObjectId(receiverId)],
        admin: req.user._id
    });

    // const createdChat = await Chat.aggregate([
    //     {
    //         $match : {
    //             _id : newChat._id,
    //         }
    //     },
    //     {
    //         $lookup : {
    //             from : "user",
    //             foreignField : "_id",
    //             localField : "participants",
    //             as : "participants",
    //             pipeline : {
    //                 $project : {
    //                     password : 0,
    //                     refershToken : 0,
    //                     forgotPasswordToken : 0,
    //                 }
    //             }
    //         }
    //     }
    // ]);

    // const payload = createdChat[0];

    // if(!payload) {
    //     return res.status(200).json(new ApiResponse(200, "Internal Server Error!"))
    // }
    

    return res.status(200).json(new ApiResponse(200, "Chat Created Successfully.",{receiver}))
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

const fetchAllChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ admin: req.user._id });

    return res.status(200).json(new ApiResponse(200, "Fetch All Chats", { chats }))
})

export {
    createOneToOnechat,
    searchAvailableUsers,
    fetchAllChats,
}