import express from 'express';
import {
  createExpense,
  deleteExpense,
  updateExpense,
  getallExpenses,
  getExpensesbyid,
  getExpenseSummary,
  importExpenses
} from '../Controllers/ExpenseController.js';
import { requireSignIn } from '../Middleware/AuthMiddleware.js';


const router = express.Router();

router.post('/import', requireSignIn, importExpenses);
router.get('/summary', requireSignIn, getExpenseSummary);
router.post('/', requireSignIn, createExpense);
router.get('/', requireSignIn, getallExpenses);
router.get('/:id', requireSignIn, getExpensesbyid);
router.delete('/:id', requireSignIn, deleteExpense);
router.put('/:id', requireSignIn, updateExpense); 

export default router;
