import { Schema, model } from "mongoose";
const UserSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        handle: {
            type: String,
            required: true,
            unique: true,
        },
        problem: {
            type: Object,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export default model("User", UserSchema);
