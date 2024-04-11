import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema({
    name : {
        type : String,
        required : true
    },

    participants : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        }
    ],

    admin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }


}, {timestamps : true});

export const Chat = mongoose.model("Chat", ChatSchema);