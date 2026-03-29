import { required } from "joi";
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        date: {
            type: Date,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "credit_card", "debit_card", "transfer"],
            default: "cash"
        },
        receiptImageUrl: {
            type: String,
            trim: true
        },
        aiSuggestedCategory: {
            type: String,
            trim: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
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

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ title: 1 });

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;