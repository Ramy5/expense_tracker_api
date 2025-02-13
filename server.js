import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_CONNECTION) {
  console.error("Error: MONGO_CONNECTION environment variable is missing.");
  process.exit(1);
}

app.use(express.json());

mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const expenseSchema = new mongoose.Schema({
  amount: Number,
  name: String,
  category: String,
});

const Expense = mongoose.model("Expense", expenseSchema);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// GET ALL EXPENSES DATA
app.get("/api/expenses", async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

// CREATE A NEW EXPENSE
app.post("/api/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET ONE EXPENSE
app.get("/api/expenses/:id", async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.status(200).json(expense);
});

// UPDATE EXPENSE
app.put("/api/expenses/:id", async (req, res) => {
  const updatedExpense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedExpense) {
    return res.status(404).json({ error: "Expense not fount" });
  }

  res.status(200).json(updatedExpense);
});

// DELETE EXPENSE
app.delete("/api/expenses/:id", async (req, res) => {
  const targetExpense = await Expense.findByIdAndDelete(req.params.id);

  if (!targetExpense) {
    return res.status(404).json({ error: "Expense not found" });
  }

  if (targetExpense.length === 0) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.status(200).json({
    message: "The expense was deleted successfully!",
    deletedExpense: targetExpense,
  });
});

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("🚀 ~ mongoose.connect ~ err:", err);
  });
