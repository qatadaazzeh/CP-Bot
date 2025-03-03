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
            data: { type: Object, required: true },
            timeUntil: {
                type: Number,
                default: () => Math.floor(Date.now() / 1000) + 300
            },
        },
        valid: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

UserSchema.methods.isSubmissionValid = function () {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime < this.problem.timeUntil;
};


export default model("User", UserSchema);