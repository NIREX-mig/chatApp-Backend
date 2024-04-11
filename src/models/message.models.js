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

    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
}, {timestamps : true});

export const Message = mongoose.model("Message" , MessageSchema);