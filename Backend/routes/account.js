const express = require("express");
const { authMiddleware } = require("./middleware");
const { Account, Transaction, User } = require("../db");
const mongoose = require("mongoose");
const zod = require("zod");

const router = express.Router();

// Validation schema for transfer
const transferSchema = zod.object({
  to: zod.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid recipient ID"),
  amount: zod.number().positive().min(0.01, "Amount must be at least 0.01"),
  description: zod.string().optional()
});

// Get balance
router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    res.json({
      success: true,
      balance: account.balance,
      accountId: account._id
    });
  } catch (error) {
    console.error("Balance fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching balance"
    });
  }
});

// Transfer money
router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    // Validate input
    const validationResult = transferSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors
      });
    }

    const { amount, to, description } = req.body;

    // Check if trying to send to self
    if (to === req.userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot transfer money to yourself"
      });
    }

    session.startTransaction();

    // Fetch sender account
    const senderAccount = await Account.findOne({ userId: req.userId }).session(session);
    if (!senderAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Sender account not found"
      });
    }

    // Check sufficient balance
    if (senderAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
        currentBalance: senderAccount.balance
      });
    }

    // Fetch recipient account
    const recipientAccount = await Account.findOne({ userId: to }).session(session);
    if (!recipientAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Recipient account not found"
      });
    }

    // Perform transfer
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    // Create transaction record
    const transaction = await Transaction.create([{
      from: req.userId,
      to: to,
      amount: amount,
      status: 'completed',
      description: description || `Transfer to user`
    }], { session });

    // Add transaction to both accounts
    await Account.updateOne(
      { userId: req.userId },
      { $push: { transactions: transaction[0]._id } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $push: { transactions: transaction[0]._id } }
    ).session(session);

    await session.commitTransaction();

    // Fetch recipient details for response
    const recipient = await User.findById(to).select('firstName lastName');

    res.json({
      success: true,
      message: "Transfer successful",
      transaction: {
        id: transaction[0]._id,
        amount,
        to: recipient,
        timestamp: transaction[0].createdAt
      },
      newBalance: senderAccount.balance - amount
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Transfer error:", error);
    res.status(500).json({
      success: false,
      message: "Transfer failed. Please try again."
    });
  } finally {
    session.endSession();
  }
});

// Get transaction history
router.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({
      $or: [{ from: req.userId }, { to: req.userId }]
    })
    .populate('from', 'firstName lastName')
    .populate('to', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

    const total = await Transaction.countDocuments({
      $or: [{ from: req.userId }, { to: req.userId }]
    });

    res.json({
      success: true,
      transactions: transactions.map(t => ({
        id: t._id,
        type: t.from._id.toString() === req.userId ? 'debit' : 'credit',
        amount: t.amount,
        user: t.from._id.toString() === req.userId ? t.to : t.from,
        description: t.description,
        status: t.status,
        date: t.createdAt
      })),
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transactions"
    });
  }
});

module.exports = router;