import { Schema, model } from "mongoose";

const userSchema = new Schema({
    login: {
        type: String,
        unique: true,
    },
    password: {
        type: String
    }
})

const User = model('Users', userSchema);
export default User;