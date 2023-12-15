const Balance = require('../model/balanceModel');
const User = require('../model/userModel');

const EXPENSE = 'EXPENSE';
const INCOME = 'INCOME';

const addExpense = async (req, res) => {
  try {
    const { title, amount, date, category, _uid } = req.body;

    if (!title || !amount || !date || !category || !_uid) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    const user = await User.findById(_uid);

    if (!user) {
      return res.status(404).json({
        message: 'User not found!',
      });
    }
    const balance = await Balance.create({
      title,
      amount: Number(amount).toFixed(2),
      date,
      category,
      type: EXPENSE,
      _uid: user._id,
    });

    if (balance) {
      res.status(201).json(balance);
    } else {
      res.status(400).json({
        message: 'Invalid balance data',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const addIncome = async (req, res) => {
  try {
    const { title, amount, date, category, _uid } = req.body;

    if (!title || !amount || !date || !category || !_uid) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    const user = await User.findById(_uid);

    if (!user) {
      return res.status(404).json({
        message: 'User not found!',
      });
    }
    const balance = await Balance.create({
      title,
      amount: Number(amount).toFixed(2),
      date,
      category,
      type: INCOME,
      _uid: user._id,
    });

    if (balance) {
      res.status(201).json(balance);
    } else {
      res.status(400).json({
        message: 'Invalid balance data',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getBalanceList = async (req, res) => {
  try {
    const { _uid } = req.body;

    if (!_uid) {
      return res.status(400).json({
        message: 'Please provide user id',
      });
    }

    const balanceArray = await Balance.find({ _uid });

    if (balanceArray.length !== 0) {
      res.status(200).json(balanceArray);
    } else {
      res.status(404).json({
        message: 'No Balance Data Found!',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getExpenseList = async (req, res) => {
  try {
    const { _uid } = req.body;

    if (!_uid) {
      return res.status(400).json({
        message: 'Please provide user id',
      });
    }

    const balanceArray = await Balance.find({ _uid, type: EXPENSE });

    if (balanceArray.length !== 0) {
      res.status(200).json(balanceArray);
    } else {
      res.status(404).json({
        message: 'No Balance Data Found!',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getIncomeList = async (req, res) => {
  try {
    const { _uid } = req.body;

    if (!_uid) {
      return res.status(400).json({
        message: 'Please provide user id',
      });
    }

    const balanceArray = await Balance.find({ _uid, type: INCOME });

    if (balanceArray.length !== 0) {
      res.status(200).json(balanceArray);
    } else {
      res.status(404).json({
        message: 'No Balance Data Found!',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const deleteBalance = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: 'Please provide balance id',
      });
    }

    const balance = await Balance.findByIdAndDelete(_id);

    if (balance) {
      res.status(200).json({
        message: 'Balance deleted successfully',
      });
    } else {
      res.status(404).json({
        message: 'Balance not found!',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getSummaryOfIncomeAndExpense = async (req, res) => {
  try {
    const { _uid } = req.body;

    if (!_uid) {
      return res.status(400).json({
        message: 'Please provide user id',
      });
    }

    const incomeArray = await Balance.find({ _uid, type: INCOME });
    const expenseArray = await Balance.find({ _uid, type: EXPENSE });

    const income = incomeArray.reduce((acc, cur) => acc + cur.amount, 0);
    const expense = expenseArray.reduce((acc, cur) => acc + cur.amount, 0);

    const summary = {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
    };

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getSummaryOfIncomeAndExpenseByMonth = async (req, res) => {
  try {
    const { _uid, month } = req.body;

    if (!_uid || !month) {
      return res.status(400).json({
        message: 'Please provide user id and month',
      });
    }

    const incomeArray = await Balance.find({
      _uid,
      type: INCOME,
      date: { $regex: month },
    });
    const expenseArray = await Balance.find({
      _uid,
      type: EXPENSE,
      date: { $regex: month },
    });

    const income = incomeArray.reduce((acc, cur) => acc + cur.amount, 0);
    const expense = expenseArray.reduce((acc, cur) => acc + cur.amount, 0);

    const summary = {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
    };

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

module.exports = {
  addExpense,
  addIncome,
  getBalanceList,
  getExpenseList,
  getIncomeList,
  deleteBalance,
  getSummaryOfIncomeAndExpense,
  getSummaryOfIncomeAndExpenseByMonth,
};
