import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({

    name : {
        type : String,
        required : true,
    },

    email : {
        type : String,
        required : true,
        unique : true,
        index : true
    },

    avatar : {
        type : String,
    },

    password : {
        type : String,
        required : true
    }

}, {timestamps : true});

export const User = mongoose.model("User", UserSchema);
