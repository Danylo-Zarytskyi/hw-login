import { Schema, model } from "mongoose";

const tokenSchema = new Schema({
    accessT: {
        type: String,
        required: true,
    },
    refreshT: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
})

const TokenSchema = model('Tokens', TokenSchema);
export default Example;