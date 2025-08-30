import Expense from "../Models/ExpenseModel.js";
import Joi from "joi";

const expenseValidationSchema = Joi.object({
  description: Joi.string().required(),
  amount: Joi.number().positive().required(),
  category: Joi.string()
    .valid('Food', 'Transport', 'Shopping', 'Other')
    .required(),
  date: Joi.date().required(),
});


export const createExpense = async (req, res) => {
  try {
    const { error } = expenseValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const newExpense = new Expense({
      ...req.body,
      userId: req.user._id, 
    });

    await newExpense.save();

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense: newExpense,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error creating expense",
      error: err.message,
    });
  }
};

export const getallExpenses = async (req, res) => {
  try {
    const { keyword, category, startDate, endDate } = req.query;

    if (keyword) {
      query.description = { $regex: keyword, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find().sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: "Expenses retrieved successfully",
      expenses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching expenses",
      error: err.message,
    });
  }
};

export const getExpensesbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await Expense.find({ _id: id });

    if (expenses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No expenses found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expenses retrieved successfully",
      expenses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching expenses",
      error: err.message,
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id
    });

    if (!deletedExpense) {
      return res.status(404).json({ success: false, message: "Expense not found or not authorized" });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting expense",
      error: err.message,
    });
  }
};


export const getExpenseSummary = async (req, res) => {
  try {

    const expenses = await Expense.find();

    if (!expenses.length) {
      return res.status(200).json({
        success: true,
        message: "No expenses found",
        summary: {
          total: 0,
          byCategory: {},
        },
      });
    }

    const total = expenses.reduce((sum, expense) => {
      return sum + (Number(expense.amount) || 0);
    }, 0);

    const byCategory = expenses.reduce((acc, expense) => {
      const cat = expense.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + (Number(expense.amount) || 0);
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      message: "Summary retrieved successfully",
      summary: {
        total,
        byCategory,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching summary",
      error: err.message,
    });
  }
};


export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = expenseValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { ...req.body },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ success: false, message: "Expense not found or unauthorized" });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating expense",
      error: err.message,
    });
  }
};



export const importExpenses = async (req, res) => {
  try {
    const expenses = req.body.expenses;

    const newExpenses = await Expense.insertMany(expenses);

    return res.status(201).json({
      success: true,
      message: 'Expenses imported successfully',
      expenses: newExpenses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error importing expenses',
      error: err.message,
    });
  }
};
