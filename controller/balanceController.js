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
    const { _uid, date } = req.body;

    if (!_uid) {
      return res.status(400).json({
        message: 'Please provide user id',
      });
    }

    // From Date extract month and year
    const dateArray = date.split('-');
    const year = dateArray[0];

    const balanceArray = await Balance.find({
      _uid,
      date: { $regex: year },
    });

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
    const { _uid, date } = req.body;

    if (!_uid || !date) {
      return res.status(400).json({
        message: 'Please provide user id',
      });
    }

    // From Date extract month and year
    const dateArray = date.split('-');
    const year = dateArray[0];
    const month = dateArray[1];

    const balanceArray = await Balance.find({
      _uid,
      type: EXPENSE,
      date: { $regex: month, $regex: year },
    });

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
    const { _uid, date } = req.body;

    if (!_uid || !date) {
      return res.status(400).json({
        message: 'Please provide user id',
      });
    }

    // From Date extract month and year
    const dateArray = date.split('-');
    const year = dateArray[0];
    const month = dateArray[1];

    const balanceArray = await Balance.find({
      _uid,
      type: INCOME,
      date: { $regex: month, $regex: year },
    });

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

    // Extract current month from date
    const date = new Date();
    const currentMonth = date.getMonth() + 1;

    const currentMonthIncomeArray = await Balance.find({
      _uid,
      type: INCOME,
      date: { $regex: currentMonth },
    });
    const currentMonthExpenseArray = await Balance.find({
      _uid,
      type: EXPENSE,
      date: { $regex: currentMonth },
    });

    const currentMonthIncome = currentMonthIncomeArray.reduce(
      (acc, cur) => acc + cur.amount,
      0
    );
    const currentMonthExpense = currentMonthExpenseArray.reduce(
      (acc, cur) => acc + cur.amount,
      0
    );

    const summary = {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
      currentMonthIncome: currentMonthIncome.toFixed(2),
      currentMonthExpense: currentMonthExpense.toFixed(2),
      incomeArray,
      expenseArray,
    };

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getSummaryOfIncomeAndExpenseByDate = async (req, res) => {
  try {
    const { _uid, date } = req.body;

    if (!_uid || !date) {
      return res.status(400).json({
        message: 'Please provide user id and month',
      });
    }

    // Current date to next month data extract from database
    // 2022-12-13 18:40:07 to 2023-01-13 18:40:07
    const dateArray = date.split('-');
    const year = dateArray[0];
    const month = dateArray[1];
    const dateN = dateArray[2].split('T')[0];
    const nextMonth = Number(month) + 1;

    const currentDate = `${year}-${month}-${dateN}`;

    // if month is december then next month is january of next year
    const nextMonthDate =
      nextMonth === 0
        ? `${Number(year) - 1}-12-${dateN}`
        : `${year}-${nextMonth}-${dateN}`;

    const incomeArray = await Balance.find({
      _uid,
      type: INCOME,
      date: { $gte: currentDate, $lt: nextMonthDate },
    });

    const expenseArray = await Balance.find({
      _uid,
      type: EXPENSE,
      date: { $gte: currentDate, $lt: nextMonthDate },
    });

    const income = incomeArray.reduce((acc, cur) => acc + cur.amount, 0);
    const expense = expenseArray.reduce((acc, cur) => acc + cur.amount, 0);

    const summary = {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
      incomeArray,
      expenseArray,
    };

    // const incomeArray = await Balance.find({
    //   _uid,
    //   type: INCOME,
    //   date: { $regex: month, $regex: year },
    // });
    // const expenseArray = await Balance.find({
    //   _uid,
    //   type: EXPENSE,
    //   date: { $regex: month, $regex: year },
    // });

    // const income = incomeArray.reduce((acc, cur) => acc + cur.amount, 0);
    // const expense = expenseArray.reduce((acc, cur) => acc + cur.amount, 0);

    // const summary = {
    //   income: income.toFixed(2),
    //   expense: expense.toFixed(2),
    //   incomeArray,
    // };

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
  getSummaryOfIncomeAndExpenseByDate,
};
