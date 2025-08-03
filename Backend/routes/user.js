const express = require('express');
const router = express.Router();
const zod = require("zod");
const { User, Account, Transaction } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config");
const { authMiddleware } = require("./middleware");

// Validation schemas
const signupSchema = zod.object({
  username: zod.string().email({ message: "Invalid email format" }),
  firstName: zod.string().min(1, { message: "First name is required" }),
  lastName: zod.string().min(1, { message: "Last name is required" }),
  password: zod.string().min(6, { message: "Password must be at least 6 characters" })
});

const signinSchema = zod.object({
  username: zod.string().email({ message: "Invalid email format" }),
  password: zod.string().min(1, { message: "Password is required" })
});

const updateSchema = zod.object({
  password: zod.string().min(6).optional(),
  firstName: zod.string().min(1).optional(),
  lastName: zod.string().min(1).optional(),
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Signup route
router.post("/signup", async (req, res) => {
  try {
    // Validate input
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors
      });
    }

    const { username, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Create user
    const user = await User.create({
      username,
      password,
      firstName,
      lastName
    });

    // Create account with initial balance
    const initialBalance = 1000 + Math.floor(Math.random() * 9000);
    await Account.create({
      userId: user._id,
      balance: initialBalance
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      userId: user._id,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user"
    });
  }
});

// Signin route
router.post("/signin", async (req, res) => {
  try {
    // Validate input
    const validationResult = signinSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors
      });
    }

    const { username, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Signin successful",
      token,
      userId: user._id,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      success: false,
      message: "Error signing in"
    });
  }
});

// Update user route
router.put("/", authMiddleware, async (req, res) => {
  try {
    const validationResult = updateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors
      });
    }

    const updateData = {};
    if (req.body.firstName) updateData.firstName = req.body.firstName;
    if (req.body.lastName) updateData.lastName = req.body.lastName;
    if (req.body.password) updateData.password = req.body.password;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile"
    });
  }
});

// Get users for search
router.get("/bulk", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      _id: { $ne: req.userId }, // Exclude current user
      isActive: true,
      $or: [
        { firstName: { $regex: filter, $options: 'i' } },
        { lastName: { $regex: filter, $options: 'i' } },
        { username: { $regex: filter, $options: 'i' } }
      ]
    };

    const users = await User.find(query)
      .select('firstName lastName username _id')
      .limit(limit)
      .skip(skip)
      .sort({ firstName: 1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error("Bulk fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users"
    });
  }
});

// Get current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const account = await Account.findOne({ userId: req.userId });
    
    res.json({
      success: true,
      user,
      balance: account ? account.balance : 0
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile"
    });
  }
});

// Logout route (optional - for token blacklisting in future)
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token here
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging out"
    });
  }
});

module.exports = router;