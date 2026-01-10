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
        language: {
            type: String,
            default: 'tr'
        },
        streak: {
            current: { type: Number, default: 0 },
            lastActivityDate: { type: Date, default: null }
        },
        activityLog: [{
            date: { type: Date },
            wordsAdded: { type: Number, default: 0 },
            exercisesCompleted: { type: Number, default: 0 }
        }]
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

export const User = mongoose.model("User", userSchema);