import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema
({
    id: String,
    score: Number,
    debt: Number
});

const User = model("User", userSchema);
export default User;