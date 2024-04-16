import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({

    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    avatar: {
        type: String,
    },

    password: {
        type: String,
        required: true
    },

    refershToken: {
        type: String,
    }

}, { timestamps: true });

UserSchema.pre("save", async function (next) {

    // check the modification in password is true or not
    if (!this.isModified("password")) return next();
    // Encrypt the password 
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();

});

UserSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password);

};

UserSchema.methods.genrateRefershToken = function () {

    const payload = {
        id : this._id,
    }

    return jwt.sign(
        payload,

        process.env.REFERSH_TOKEN_SECRET,
        
        { 
            expiresIn: process.env.REFERSH_TOKEN_EXPERY 
        }
    );
}

export const User = mongoose.model("User", UserSchema);
