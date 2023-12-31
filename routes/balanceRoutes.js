const express = require('express');
const router = express.Router();

const {
  addExpense,
  addIncome,
  getBalanceList,
  getExpenseList,
  getIncomeList,
  deleteBalance,
  getSummaryOfIncomeAndExpense,
  getSummaryOfIncomeAndExpenseByDate,
} = require('../controller/balanceController');

/* Balance Routes */

router.route('/add-expense').post(addExpense);
router.route('/add-income').post(addIncome);
router.route('/get-balance-list').post(getBalanceList);
router.route('/get-expense-list').post(getExpenseList);
router.route('/get-income-list').post(getIncomeList);
router.route('/delete-balance').post(deleteBalance);
router.route('/get-summary').post(getSummaryOfIncomeAndExpense);
router.route('/get-summary-by-month').post(getSummaryOfIncomeAndExpenseByDate);


module.exports = router;
