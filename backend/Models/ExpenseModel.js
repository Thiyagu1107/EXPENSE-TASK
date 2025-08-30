import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String, 
      required: true,
      enum: ['Food', 'Transport', 'Shopping', 'Other'], 
    },
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: String, 
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Expense", expenseSchema);
