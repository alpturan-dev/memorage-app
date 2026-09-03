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
            required: [
                function () {
                    return !this.googleId;
                },
                "Your password is required"
            ],
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
            default: undefined
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local'
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
    if (!this.isModified("password") || !this.password) return;
    this.password = await bcrypt.hash(this.password, 12);
});

export const User = mongoose.model("User", userSchema);