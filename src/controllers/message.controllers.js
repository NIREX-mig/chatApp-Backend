import asyncHandler from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.models.js"
import ApiResponse from "../utils/apiResponse.js"
import { Message } from "../models/message.models.js"
import mongoose from "mongoose";


const sendMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const { chatId } = req.params;

    const selectedChat = await Chat.findById(chatId);

    if (!selectedChat) {
        return res.status(400).json(new ApiResponse(400, "Chat Dose Not Exist"));
    };

    const newMessage = await Message.create({
        sender: req.user?._id,
        message: message,
        chat: chatId
    })

    return res.status(200).json(new ApiResponse(200, "Message saved successfully."));
});

const getAllMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    const selectedChat = await Chat.findById(chatId);

    if (!selectedChat) {
        return res.status(400).json(new ApiResponse(400, "Chat Dose Not Exist!"));
    }

    if (!selectedChat.participants?.includes(req.user?._id)) {
        return res.status(400).json(new ApiResponse(400, "User is not a part of this chat"));
    }

    const message = await Message.aggregate([
        {
            $match: {
                chat : new mongoose.Types.ObjectId(chatId),
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "sender",
                as: "sender",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            email: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                sender : {
                    $first : "$sender"
                },
            }
        },
        {
            $sort : {
                createdAt : 1
            }
        }

    ]);

    return res.status(200).json(new ApiResponse(200, "Message Fetch Successfully." , message))
});

export {
    sendMessage,
    getAllMessage,
}