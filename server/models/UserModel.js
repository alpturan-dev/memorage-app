import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Your email address is required"],
            unique: [true, "This email already registered"],
            trim: true,
            lowercase: true
        },
        username: {
            type: String,
            unique: false,
            required: [true, "Your username is required"],
        },
        password: {
            type: String,
            required: [true, "Your password is required"],
        },
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

export const User = mongoose.model("User", userSchema);