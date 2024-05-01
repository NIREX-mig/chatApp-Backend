import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    message :{
        type : String,
        required : true
    },

    chat : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chat"
    }
}, {timestamps : true});

export const Message = mongoose.model("Message" , MessageSchema);