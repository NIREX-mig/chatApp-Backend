import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"

const ChatSchema = new Schema({
    name : {
        type : String,
        required : true
    },

    // In paticipants add add logedin user and chat user
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

ChatSchema.plugin(aggregatePaginate);

export const Chat = mongoose.model("Chat", ChatSchema);