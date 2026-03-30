import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "is invalid"]
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        plan: {
            type: String,
            enum: ["plus", "premium"],
            default: "plus"
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

//Indices para busquedas frecuentes y unicidad

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;